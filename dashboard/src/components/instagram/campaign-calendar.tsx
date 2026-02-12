'use client'

import { useCallback, useEffect, useState } from 'react'
import { ChevronDown, ChevronRight, Download, Clipboard, Trash2, ArrowRight, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToast } from '@/components/ui/toast'
import { CALENDAR_DATA, type CalendarDay, type CalendarDayItem } from '@/lib/instagram-content'
import {
  loadSavedCalendarItems,
  deleteCalendarItem,
  updateCalendarItem,
  deleteFullImage,
  getFullImage,
  calendarDateToKey,
  getAllCalendarDates,
  keyToDisplayDate,
  type SavedCalendarItem,
} from '@/lib/calendar-storage'

const typeStyles: Record<CalendarDayItem['type'], string> = {
  feed: 'bg-terracotta/10 text-terracotta border-l-2 border-terracotta',
  stories: 'bg-sage/10 text-sage border-l-2 border-sage',
  action: 'bg-muted-gold/10 text-muted-gold border-l-2 border-muted-gold',
  reel: 'bg-burgundy/10 text-burgundy border-l-2 border-burgundy',
}

const typeDot: Record<CalendarDayItem['type'], string> = {
  feed: 'bg-terracotta',
  stories: 'bg-sage',
  action: 'bg-muted-gold',
  reel: 'bg-burgundy',
}

const contentTypeBadge: Record<SavedCalendarItem['contentType'], { label: string; className: string }> = {
  post: { label: 'Post', className: 'bg-terracotta/15 text-terracotta' },
  story: { label: 'Story', className: 'bg-sage/15 text-sage' },
  reel: { label: 'Reel', className: 'bg-burgundy/15 text-burgundy' },
}

function getWeekBadge(week: number): { className: string; label: string } {
  const now = new Date()
  const weekStarts = [
    new Date('2026-02-11'),
    new Date('2026-02-18'),
    new Date('2026-02-25'),
    new Date('2026-03-04'),
    new Date('2026-03-11'),
  ]
  const weekEnds = [
    new Date('2026-02-17'),
    new Date('2026-02-24'),
    new Date('2026-03-03'),
    new Date('2026-03-10'),
    new Date('2026-03-16'),
  ]

  const idx = week - 1
  if (now >= weekStarts[idx] && now <= new Date(weekEnds[idx].getTime() + 86400000)) {
    return { className: 'bg-terracotta text-white', label: 'Corrente' }
  }
  if (now > weekEnds[idx]) {
    return { className: 'bg-cream-alt text-warm-light', label: 'Passata' }
  }
  return { className: 'bg-stone text-warm-muted', label: 'In arrivo' }
}

function isToday(dateStr: string): boolean {
  if (!dateStr) return false
  const months: Record<string, number> = { Feb: 1, Mar: 2 }
  const parts = dateStr.split(' ')
  const day = parseInt(parts[0])
  const month = months[parts[1]]
  if (month === undefined) return false
  const d = new Date(2026, month, day)
  const now = new Date()
  return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
}

// ── SavedItemCard (used in the detail panel) ──

function SavedItemCard({
  item,
  onDelete,
  onMove,
  onUpdate,
}: {
  item: SavedCalendarItem
  onDelete: (id: string) => void
  onMove: (id: string, newDateKey: string) => void
  onUpdate: (id: string, changes: Partial<SavedCalendarItem>) => void
}) {
  const { toast } = useToast()
  const [showMove, setShowMove] = useState(false)
  const [editingCaption, setEditingCaption] = useState(false)
  const [captionDraft, setCaptionDraft] = useState(item.caption || '')
  const badge = contentTypeBadge[item.contentType]
  const weekGroups = getAllCalendarDates()

  function saveCaption() {
    const trimmed = captionDraft.trim()
    onUpdate(item.id, { caption: trimmed || undefined })
    setEditingCaption(false)
    toast('success', 'Caption aggiornata')
  }

  const handleDownload = useCallback(async () => {
    try {
      const blob = await getFullImage(item.id)
      if (!blob) {
        toast('error', 'Immagine non trovata')
        return
      }
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.download = `eva-${item.mode}-${item.dateKey}.png`
      link.href = url
      link.click()
      URL.revokeObjectURL(url)
    } catch {
      toast('error', 'Errore nel download')
    }
  }, [item.id, item.mode, item.dateKey, toast])

  const handleCopyCaption = useCallback(() => {
    if (!item.caption) return
    navigator.clipboard.writeText(item.caption).then(() => {
      toast('success', 'Caption copiata!')
    })
  }, [item.caption, toast])

  return (
    <div className="border border-muted-gold/30 bg-muted-gold/5 p-4 relative">
      <div className="flex items-start gap-4">
        <img
          src={item.thumbnail}
          alt={item.label}
          className="w-20 h-20 object-cover border border-stone flex-shrink-0 cursor-pointer"
          onClick={handleDownload}
          title="Scarica PNG"
        />
        <div className="flex-1 min-w-0">
          <span className={cn('inline-block px-2 py-0.5 text-xs font-body uppercase tracking-wider', badge.className)}>
            {badge.label}
          </span>
          <div className="text-base text-warm-text mt-1.5">{item.label}</div>
          {editingCaption ? (
            <div className="mt-1.5">
              <textarea
                value={captionDraft}
                onChange={e => setCaptionDraft(e.target.value)}
                autoFocus
                rows={3}
                className="w-full px-2 py-1.5 border border-muted-gold bg-white text-sm font-body text-warm-text outline-none resize-y"
                onKeyDown={e => {
                  if (e.key === 'Escape') { setEditingCaption(false); setCaptionDraft(item.caption || '') }
                }}
              />
              <div className="flex gap-1.5 mt-1">
                <button onClick={saveCaption} className="px-2 py-1 text-xs font-body bg-muted-gold text-white hover:bg-muted-gold/90 transition-colors">
                  Salva
                </button>
                <button onClick={() => { setEditingCaption(false); setCaptionDraft(item.caption || '') }} className="px-2 py-1 text-xs font-body border border-stone text-warm-muted hover:border-warm-light transition-colors">
                  Annulla
                </button>
              </div>
            </div>
          ) : (
            <div
              className="text-sm text-warm-muted mt-1 cursor-pointer hover:text-warm-text transition-colors"
              onClick={() => { setCaptionDraft(item.caption || ''); setEditingCaption(true) }}
              title="Clicca per modificare"
            >
              {item.caption || <span className="italic text-warm-light">Aggiungi caption...</span>}
            </div>
          )}
        </div>
      </div>

      {/* Actions row */}
      <div className="flex gap-2 mt-3">
        <button
          onClick={handleDownload}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-body border border-stone text-warm-muted hover:text-muted-gold hover:border-muted-gold transition-colors"
        >
          <Download size={13} /> Scarica
        </button>
        {item.caption && (
          <button
            onClick={handleCopyCaption}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-body border border-stone text-warm-muted hover:text-sage hover:border-sage transition-colors"
          >
            <Clipboard size={13} /> Caption
          </button>
        )}
        <div className="relative">
          <button
            onClick={() => setShowMove(!showMove)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-body border border-stone text-warm-muted hover:text-soft-blue hover:border-soft-blue transition-colors"
          >
            <ArrowRight size={13} /> Sposta
          </button>
          {showMove && (
            <div className="absolute top-full left-0 mt-1 z-20 bg-white border border-stone shadow-sm p-1.5 max-h-48 w-44 overflow-y-auto">
              <div className="text-[10px] text-warm-light px-1 mb-1 font-body uppercase tracking-wider">Sposta a:</div>
              {weekGroups.map(g => (
                <div key={g.week}>
                  <div className="text-[9px] text-warm-light px-1 pt-1.5 pb-0.5 font-body font-medium">{g.title}</div>
                  {g.dates.map(d => (
                    <button
                      key={d.dateKey}
                      onClick={() => {
                        onMove(item.id, d.dateKey)
                        setShowMove(false)
                      }}
                      disabled={d.dateKey === item.dateKey}
                      className={cn(
                        'block w-full text-left px-2 py-1 text-xs font-body hover:bg-cream-alt transition-colors',
                        d.dateKey === item.dateKey ? 'text-warm-light' : 'text-warm-text'
                      )}
                    >
                      {d.display}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={() => onDelete(item.id)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-body border border-stone text-warm-muted hover:text-dusty-rose hover:border-dusty-rose transition-colors ml-auto"
        >
          <Trash2 size={13} /> Elimina
        </button>
      </div>
    </div>
  )
}

// ── Day detail panel (shown below grid on click) ──

function DayDetail({
  day,
  savedItems,
  onClose,
  onDelete,
  onMove,
  onUpdate,
}: {
  day: CalendarDay
  savedItems: SavedCalendarItem[]
  onClose: () => void
  onDelete: (id: string) => void
  onMove: (id: string, newDateKey: string) => void
  onUpdate: (id: string, changes: Partial<SavedCalendarItem>) => void
}) {
  const today = isToday(day.date)

  return (
    <div className={cn(
      'border bg-white p-6 mt-2 animate-in fade-in slide-in-from-top-2 duration-200',
      today ? 'border-terracotta' : 'border-stone'
    )}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-4">
          <div className="text-3xl font-serif text-warm-text">{day.date.split(' ')[0]}</div>
          <div>
            <div className="text-base font-body text-warm-text font-medium">{day.day}</div>
            <div className="text-sm font-body text-warm-muted uppercase tracking-wider">{day.date.split(' ')[1]}</div>
          </div>
          {today && (
            <span className="px-2.5 py-1 text-xs font-body uppercase tracking-wider bg-terracotta text-white">Oggi</span>
          )}
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center border border-stone text-warm-muted hover:text-warm-text hover:border-warm-text transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Content items */}
      <div className="space-y-2.5 mb-5">
        {day.items.map((item, j) => (
          <div
            key={j}
            className={cn('text-base px-4 py-3 leading-relaxed', typeStyles[item.type])}
          >
            <div className="font-semibold text-xs uppercase tracking-wide opacity-70 mb-1">
              {item.series}
            </div>
            {item.text}
          </div>
        ))}
      </div>

      {/* Saved items */}
      {savedItems.length > 0 && (
        <div>
          <div className="text-xs font-body uppercase tracking-[0.2em] text-warm-light mb-3">
            Contenuti salvati
          </div>
          <div className="space-y-3">
            {savedItems.map(saved => (
              <SavedItemCard
                key={saved.id}
                item={saved}
                onDelete={onDelete}
                onMove={onMove}
                onUpdate={onUpdate}
              />
            ))}
          </div>
        </div>
      )}

      {day.items.length === 0 && savedItems.length === 0 && (
        <div className="text-base font-body text-warm-light italic py-6 text-center">
          Nessun contenuto per questo giorno
        </div>
      )}
    </div>
  )
}

// ── Main component ──

export function CampaignCalendar() {
  const { toast } = useToast()
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({})
  const [savedItems, setSavedItems] = useState<SavedCalendarItem[]>([])
  const [selectedDay, setSelectedDay] = useState<{ weekIdx: number; date: string } | null>(null)

  useEffect(() => {
    setSavedItems(loadSavedCalendarItems())
  }, [])

  const savedByDate: Record<string, SavedCalendarItem[]> = {}
  for (const item of savedItems) {
    if (!savedByDate[item.dateKey]) savedByDate[item.dateKey] = []
    savedByDate[item.dateKey].push(item)
  }

  function toggle(week: number) {
    setCollapsed((prev) => ({ ...prev, [week]: !prev[week] }))
  }

  function selectDay(weekIdx: number, date: string) {
    if (selectedDay?.weekIdx === weekIdx && selectedDay?.date === date) {
      setSelectedDay(null)
    } else {
      setSelectedDay({ weekIdx, date })
    }
  }

  async function handleDelete(id: string) {
    deleteCalendarItem(id)
    await deleteFullImage(id).catch(() => {})
    setSavedItems(loadSavedCalendarItems())
    toast('info', 'Contenuto rimosso')
  }

  function handleMove(id: string, newDateKey: string) {
    updateCalendarItem(id, { dateKey: newDateKey })
    setSavedItems(loadSavedCalendarItems())
    toast('success', `Spostato al ${keyToDisplayDate(newDateKey)}`)
  }

  function handleUpdate(id: string, changes: Partial<SavedCalendarItem>) {
    updateCalendarItem(id, changes)
    setSavedItems(loadSavedCalendarItems())
  }

  return (
    <div className="space-y-6">
      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-2">
        {(['feed', 'stories', 'reel', 'action'] as const).map((type) => (
          <div key={type} className="flex items-center gap-2 text-xs font-body">
            <div className={cn('w-3 h-3 rounded-full', typeDot[type])} />
            <span className="text-warm-muted capitalize">{type === 'feed' ? 'Feed Post' : type === 'stories' ? 'Stories' : type === 'reel' ? 'Reel' : 'Azione'}</span>
          </div>
        ))}
        {savedItems.length > 0 && (
          <div className="flex items-center gap-2 text-xs font-body">
            <div className="w-3 h-3 rounded-full bg-muted-gold/40 border border-muted-gold" />
            <span className="text-warm-muted">Salvati</span>
          </div>
        )}
      </div>

      {CALENDAR_DATA.map((week) => {
        const badge = getWeekBadge(week.week)
        const isCollapsed = collapsed[week.week]
        const selectedDayInWeek = selectedDay?.weekIdx === week.week
          ? week.days.find(d => d.date === selectedDay.date)
          : null

        return (
          <div key={week.week}>
            {/* Week header */}
            <button
              onClick={() => toggle(week.week)}
              className="w-full flex items-center gap-3 mb-3 text-left"
            >
              {isCollapsed ? (
                <ChevronRight size={16} className="text-warm-muted flex-shrink-0" />
              ) : (
                <ChevronDown size={16} className="text-warm-muted flex-shrink-0" />
              )}
              <span className={cn('text-xs font-body font-medium px-2 py-0.5', badge.className)}>
                Settimana {week.week}
              </span>
              <h2 className="font-serif text-xl text-warm-text">
                {week.title}
              </h2>
              <span className="text-sm text-warm-muted italic font-body">
                {week.dates} — {week.subtitle}
              </span>
            </button>

            {/* Day grid (compact overview) */}
            {!isCollapsed && (
              <>
                <div className="grid grid-cols-7 gap-2">
                  {week.days.map((day, i) => {
                    if (!day.date) return <div key={i} />
                    const today = isToday(day.date)
                    const dateKey = calendarDateToKey(day.date)
                    const daySaved = savedByDate[dateKey] || []
                    const isSelected = selectedDay?.weekIdx === week.week && selectedDay?.date === day.date

                    return (
                      <button
                        key={day.date}
                        onClick={() => selectDay(week.week, day.date)}
                        className={cn(
                          'bg-white border text-left p-3.5 min-h-[120px] transition-all duration-150 hover:shadow-sm cursor-pointer',
                          today && !isSelected && 'border-terracotta border-2',
                          isSelected
                            ? 'border-warm-text border-2 shadow-sm bg-cream-alt/30'
                            : !today && 'border-stone hover:border-warm-light',
                        )}
                      >
                        {/* Date header */}
                        <div className="flex items-baseline justify-between mb-3">
                          <span className="text-lg font-serif text-warm-text leading-none">
                            {day.date.split(' ')[0]}
                          </span>
                          <span className="text-xs font-body text-warm-light uppercase">
                            {day.day}
                          </span>
                        </div>

                        {/* Content dots */}
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {day.items.map((item, j) => (
                            <div
                              key={j}
                              className={cn('w-3 h-3 rounded-full', typeDot[item.type])}
                              title={`${item.series}: ${item.text}`}
                            />
                          ))}
                        </div>

                        {/* Saved thumbnails */}
                        {daySaved.length > 0 && (
                          <div className="flex gap-1.5 mt-2">
                            {daySaved.map(s => (
                              <img
                                key={s.id}
                                src={s.thumbnail}
                                alt=""
                                className="w-8 h-8 object-cover border border-muted-gold/40 rounded-sm"
                              />
                            ))}
                          </div>
                        )}

                        {/* Item count */}
                        <div className="text-xs font-body text-warm-light mt-2">
                          {day.items.length} attività
                          {daySaved.length > 0 && ` · ${daySaved.length} salvat${daySaved.length === 1 ? 'o' : 'i'}`}
                        </div>
                      </button>
                    )
                  })}
                </div>

                {/* Day detail panel */}
                {selectedDayInWeek && (
                  <DayDetail
                    day={selectedDayInWeek}
                    savedItems={savedByDate[calendarDateToKey(selectedDayInWeek.date)] || []}
                    onClose={() => setSelectedDay(null)}
                    onDelete={handleDelete}
                    onMove={handleMove}
                    onUpdate={handleUpdate}
                  />
                )}
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}
