'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useToast } from '@/components/ui/toast'
import {
  generateId,
  saveCalendarItem,
  saveFullImage,
  getAllCalendarDates,
  type SavedCalendarItem,
} from '@/lib/calendar-storage'
import { captureThumbnail, captureFullImage } from '@/lib/covers/capture-thumbnail'

interface CalendarSavePanelProps {
  coverRef: React.RefObject<HTMLDivElement | null>
  label: string
  mode: 'cover' | 'card'
  caption?: string
}

const CONTENT_TYPES = [
  { id: 'post' as const, label: 'Post' },
  { id: 'story' as const, label: 'Story' },
  { id: 'reel' as const, label: 'Reel' },
]

export function CalendarSavePanel({ coverRef, label, mode, caption }: CalendarSavePanelProps) {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [contentType, setContentType] = useState<SavedCalendarItem['contentType']>('post')
  const [dateKey, setDateKey] = useState('')
  const [captionText, setCaptionText] = useState(caption || '')

  const weekGroups = getAllCalendarDates()

  async function handleSave() {
    if (!dateKey) {
      toast('error', 'Seleziona una data')
      return
    }
    if (!coverRef.current) {
      toast('error', 'Anteprima non disponibile')
      return
    }

    setSaving(true)
    try {
      const id = generateId()

      // Capture thumbnail and full image in sequence
      const thumbnail = await captureThumbnail(coverRef.current)
      const fullBlob = await captureFullImage(coverRef.current)

      // Save full image to IndexedDB
      await saveFullImage(id, fullBlob)

      // Save metadata to localStorage
      const item: SavedCalendarItem = {
        id,
        dateKey,
        thumbnail,
        label,
        contentType,
        mode,
        caption: captionText || undefined,
        createdAt: new Date().toISOString(),
      }
      saveCalendarItem(item)

      toast('success', 'Salvato nel calendario!')
      setOpen(false)
    } catch (err) {
      console.error('Calendar save error:', err)
      toast('error', 'Errore nel salvataggio')
    } finally {
      setSaving(false)
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => {
          setCaptionText(caption || '')
          setOpen(true)
        }}
        className="border border-muted-gold text-muted-gold px-4 py-2 text-sm font-body hover:bg-muted-gold/10 transition-colors duration-150"
      >
        Salva nel Calendario
      </button>
    )
  }

  return (
    <div className="border border-muted-gold bg-white p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-body uppercase tracking-[0.2em] text-muted-gold">
          Salva nel Calendario
        </h4>
        <button
          onClick={() => setOpen(false)}
          className="text-warm-light hover:text-warm-muted text-sm transition-colors"
        >
          &times;
        </button>
      </div>

      {/* Content type */}
      <div>
        <div className="text-[11px] font-body uppercase tracking-[0.2em] text-warm-light mb-2">
          Tipo contenuto
        </div>
        <div className="flex gap-2">
          {CONTENT_TYPES.map(t => (
            <button
              key={t.id}
              onClick={() => setContentType(t.id)}
              className={cn(
                'px-3 py-1.5 text-xs font-body border transition-colors duration-150',
                contentType === t.id
                  ? 'border-muted-gold text-muted-gold bg-muted-gold/5'
                  : 'border-stone text-warm-muted hover:border-warm-light'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Date select */}
      <div>
        <div className="text-[11px] font-body uppercase tracking-[0.2em] text-warm-light mb-2">
          Data
        </div>
        <select
          value={dateKey}
          onChange={e => setDateKey(e.target.value)}
          className="w-full px-3 py-2 border border-stone bg-white text-sm font-body text-warm-text outline-none focus:border-muted-gold transition-colors"
        >
          <option value="">Seleziona data...</option>
          {weekGroups.map(g => (
            <optgroup key={g.week} label={g.title}>
              {g.dates.map(d => (
                <option key={d.dateKey} value={d.dateKey}>
                  {d.display}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {/* Caption */}
      <div>
        <div className="text-[11px] font-body uppercase tracking-[0.2em] text-warm-light mb-2">
          Caption (opzionale)
        </div>
        <textarea
          value={captionText}
          onChange={e => setCaptionText(e.target.value)}
          rows={2}
          placeholder="Caption per il post..."
          className="w-full px-3 py-2 border border-stone bg-white text-sm font-body font-light text-warm-text outline-none focus:border-muted-gold transition-colors resize-y"
        />
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={saving || !dateKey}
        className={cn(
          'w-full px-4 py-2 text-sm font-body transition-colors duration-150',
          saving || !dateKey
            ? 'bg-stone text-warm-light cursor-not-allowed'
            : 'bg-muted-gold text-white hover:bg-muted-gold/90'
        )}
      >
        {saving ? 'Salvataggio...' : 'Salva'}
      </button>
    </div>
  )
}
