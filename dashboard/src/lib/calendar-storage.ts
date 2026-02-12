import { CALENDAR_DATA } from '@/lib/instagram-content'

// ── Data model ──

export interface SavedCalendarItem {
  id: string
  dateKey: string          // ISO: "2026-02-12"
  thumbnail: string        // small JPEG data URL (~200px, ~10KB)
  label: string            // e.g. "Editorial — Portrait (4:5)"
  contentType: 'post' | 'story' | 'reel'
  mode: 'cover' | 'card'
  caption?: string
  createdAt: string
}

const STORAGE_KEY = 'eva-calendar-saved'
const IDB_NAME = 'eva-calendar-images'
const IDB_STORE = 'images'
const IDB_VERSION = 1

// ── ID generation ──

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

// ── localStorage CRUD (metadata + thumbnails) ──

export function loadSavedCalendarItems(): SavedCalendarItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveCalendarItem(item: SavedCalendarItem): void {
  const items = loadSavedCalendarItems()
  items.push(item)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function updateCalendarItem(id: string, changes: Partial<SavedCalendarItem>): void {
  const items = loadSavedCalendarItems()
  const idx = items.findIndex(i => i.id === id)
  if (idx === -1) return
  items[idx] = { ...items[idx], ...changes }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function deleteCalendarItem(id: string): void {
  const items = loadSavedCalendarItems().filter(i => i.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

// ── IndexedDB (full-res PNG blobs) ──

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, IDB_VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE)
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export async function saveFullImage(id: string, blob: Blob): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, 'readwrite')
    tx.objectStore(IDB_STORE).put(blob, id)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function getFullImage(id: string): Promise<Blob | null> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, 'readonly')
    const req = tx.objectStore(IDB_STORE).get(id)
    req.onsuccess = () => resolve(req.result ?? null)
    req.onerror = () => reject(req.error)
  })
}

export async function deleteFullImage(id: string): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, 'readwrite')
    tx.objectStore(IDB_STORE).delete(id)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

// ── Date utilities ──

const MONTH_MAP: Record<string, number> = {
  Gen: 0, Feb: 1, Mar: 2, Apr: 3, Mag: 4, Giu: 5,
  Lug: 6, Ago: 7, Set: 8, Ott: 9, Nov: 10, Dic: 11,
}

/** Convert display date "12 Feb" → ISO "2026-02-12" */
export function calendarDateToKey(displayDate: string): string {
  const parts = displayDate.trim().split(' ')
  const day = parseInt(parts[0])
  const monthStr = parts[1]
  const month = MONTH_MAP[monthStr]
  if (month === undefined) return ''
  const m = String(month + 1).padStart(2, '0')
  const d = String(day).padStart(2, '0')
  return `2026-${m}-${d}`
}

/** Convert ISO "2026-02-12" → display "12 Feb" */
export function keyToDisplayDate(key: string): string {
  const [, m, d] = key.split('-')
  const monthNames = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic']
  return `${parseInt(d)} ${monthNames[parseInt(m) - 1]}`
}

export interface CalendarDateOption {
  dateKey: string
  display: string // "Mar 11 Feb"
  weekTitle: string
}

/** Get all calendar dates flattened, grouped by week for <optgroup> */
export function getAllCalendarDates(): { week: number; title: string; dates: CalendarDateOption[] }[] {
  return CALENDAR_DATA.map(week => ({
    week: week.week,
    title: `Sett. ${week.week} — ${week.title}`,
    dates: week.days
      .filter(d => d.date)
      .map(d => ({
        dateKey: calendarDateToKey(d.date),
        display: `${d.day} ${d.date}`,
        weekTitle: week.title,
      })),
  }))
}
