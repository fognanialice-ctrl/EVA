'use client'

import { useCallback, useRef, useState } from 'react'
import { CoverRenderer } from '@/components/covers/cover-renderer'
import { CoverExport } from '@/components/covers/cover-export'
import { bellezzaEvent, bellezzaPhotos } from '@/lib/covers/bellezza-data'
import { coverThemes } from '@/lib/covers/cover-themes'
import {
  COVER_FORMATS,
  type CoverFormat,
  type CoverVariant,
  type CoverEventData,
  type CoverTextStyle,
  defaultTextStyle,
} from '@/lib/covers/cover-types'
import { cn } from '@/lib/utils'

const VARIANTS: { id: CoverVariant; label: string; theme: string }[] = [
  { id: 'type-only', label: 'Type Only', theme: 'cream-gold' },
  { id: 'editorial', label: 'Editorial', theme: 'night-gold' },
  { id: 'noir', label: 'Noir', theme: 'burgundy-gold' },
]

const FORMAT_OPTIONS = Object.entries(COVER_FORMATS) as [CoverFormat, (typeof COVER_FORMATS)[CoverFormat]][]

type EditableField = 'title' | 'tagline' | 'subtitle' | 'date' | 'time' | 'venue' | 'city'

const FIELD_CONFIG: { key: EditableField; label: string; multiline: boolean; help?: string }[] = [
  { key: 'title', label: 'Titolo', multiline: true, help: 'Usa a capo per dividere su più righe' },
  { key: 'tagline', label: 'Tagline', multiline: false },
  { key: 'subtitle', label: 'Sottotitolo', multiline: false },
  { key: 'date', label: 'Data', multiline: false },
  { key: 'time', label: 'Orario', multiline: false },
  { key: 'venue', label: 'Location', multiline: false },
  { key: 'city', label: 'Città', multiline: false },
]

interface PhotoOption {
  src: string
  label: string
}

export function CoverEditor() {
  const [variant, setVariant] = useState<CoverVariant>('type-only')
  const [format, setFormat] = useState<CoverFormat>('portrait')
  const [eventData, setEventData] = useState<CoverEventData>({ ...bellezzaEvent })
  const [textStyle, setTextStyle] = useState<CoverTextStyle>({ ...defaultTextStyle })
  const [photos, setPhotos] = useState<PhotoOption[]>([...bellezzaPhotos])
  const coverRef = useRef<HTMLDivElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const activeVariant = VARIANTS.find(v => v.id === variant)!

  function updateField(field: EditableField, value: string) {
    setEventData(prev => ({ ...prev, [field]: value }))
  }

  function resetToDefaults() {
    setEventData({ ...bellezzaEvent })
    setTextStyle({ ...defaultTextStyle })
  }

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) return
      const url = URL.createObjectURL(file)
      const label = file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ')
      setPhotos(prev => [...prev, { src: url, label }])
    })
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) return
      const url = URL.createObjectURL(file)
      const label = file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ')
      setPhotos(prev => [...prev, { src: url, label }])
    })
  }, [])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8">
      {/* Left: Editor controls */}
      <div className="space-y-6">
        {/* Variant + Format selectors */}
        <div className="flex flex-wrap items-center gap-2">
          {VARIANTS.map(v => (
            <button
              key={v.id}
              onClick={() => setVariant(v.id)}
              className={cn(
                'px-4 py-2 text-sm font-body transition-colors duration-150 border',
                variant === v.id
                  ? 'border-terracotta text-terracotta bg-terracotta/5'
                  : 'border-stone text-warm-muted hover:border-warm-light'
              )}
            >
              {v.label}
            </button>
          ))}

          <div className="w-px h-6 bg-stone mx-1" />

          {FORMAT_OPTIONS.map(([key, { label }]) => (
            <button
              key={key}
              onClick={() => setFormat(key)}
              className={cn(
                'px-3 py-2 text-sm font-body transition-colors duration-150 border',
                format === key
                  ? 'border-muted-gold text-muted-gold bg-muted-gold/5'
                  : 'border-stone text-warm-muted hover:border-warm-light'
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Text fields */}
        <div className="border border-stone bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-body uppercase tracking-[0.2em] text-warm-muted">
              Testo
            </h3>
            <button
              onClick={resetToDefaults}
              className="text-xs font-body text-warm-light hover:text-warm-muted transition-colors"
            >
              Ripristina
            </button>
          </div>

          {/* Title style toggles */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[11px] font-body uppercase tracking-[0.2em] text-warm-light">
              Stile titolo
            </span>
            <button
              onClick={() => setTextStyle(prev => ({ ...prev, titleItalic: !prev.titleItalic }))}
              className={cn(
                'px-3 py-1 text-sm font-serif transition-colors duration-150 border italic',
                textStyle.titleItalic
                  ? 'border-muted-gold text-muted-gold bg-muted-gold/5'
                  : 'border-stone text-warm-muted hover:border-warm-light'
              )}
            >
              Italic
            </button>
            <button
              onClick={() => setTextStyle(prev => ({ ...prev, titleUppercase: !prev.titleUppercase }))}
              className={cn(
                'px-3 py-1 text-sm font-body tracking-wider transition-colors duration-150 border',
                textStyle.titleUppercase
                  ? 'border-muted-gold text-muted-gold bg-muted-gold/5'
                  : 'border-stone text-warm-muted hover:border-warm-light'
              )}
            >
              MAIUSCOLO
            </button>
          </div>

          <div className="grid grid-cols-3 gap-x-4 gap-y-3">
            {FIELD_CONFIG.map(({ key, label, multiline, help }) => (
              <div key={key} className={key === 'title' ? 'col-span-2' : undefined}>
                <label className="block text-[11px] font-body uppercase tracking-[0.2em] text-warm-light mb-1">
                  {label}
                </label>
                {multiline ? (
                  <textarea
                    value={eventData[key] ?? ''}
                    onChange={e => updateField(key, e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-stone bg-white text-sm font-body font-light text-warm-text outline-none focus:border-muted-gold transition-colors resize-y"
                  />
                ) : (
                  <input
                    type="text"
                    value={eventData[key] ?? ''}
                    onChange={e => updateField(key, e.target.value)}
                    className="w-full px-3 py-2 border border-stone bg-white text-sm font-body font-light text-warm-text outline-none focus:border-muted-gold transition-colors"
                  />
                )}
                {help && (
                  <div className="text-[10px] font-body text-warm-light mt-1">{help}</div>
                )}
              </div>
            ))}

            {/* Footer override */}
            <div className="col-span-2">
              <label className="block text-[11px] font-body uppercase tracking-[0.2em] text-warm-light mb-1">
                Footer
              </label>
              <input
                type="text"
                value={textStyle.footerText}
                onChange={e => setTextStyle(prev => ({ ...prev, footerText: e.target.value }))}
                placeholder={`${eventData.venue} — ${eventData.city}`}
                className="w-full px-3 py-2 border border-stone bg-white text-sm font-body font-light text-warm-text outline-none focus:border-muted-gold transition-colors placeholder:text-warm-light/50"
              />
              <div className="text-[10px] font-body text-warm-light mt-1">
                Lascia vuoto per usare Location — Città
              </div>
            </div>
          </div>
        </div>

        {/* Photos */}
        <div className="border border-stone bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-body uppercase tracking-[0.2em] text-warm-muted">
              Foto
            </h3>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-body px-3 py-1 border border-stone text-warm-muted hover:border-muted-gold hover:text-muted-gold transition-colors"
              >
                + Aggiungi
              </button>
            </div>
          </div>

          {/* Drop zone */}
          <div
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            onDragEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#B59A5B' }}
            onDragLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '' }}
            className="border border-dashed border-stone p-4 mb-4 text-center transition-colors"
          >
            <span className="text-xs font-body text-warm-light">
              Trascina qui le immagini
            </span>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Hero photo */}
            <div>
              <label className="block text-[11px] font-body uppercase tracking-[0.2em] text-warm-light mb-2">
                Editorial (hero)
              </label>
              <div className="flex gap-2 flex-wrap">
                {photos.map(({ src, label }) => (
                  <button
                    key={src}
                    onClick={() => setEventData(prev => ({
                      ...prev,
                      photos: { ...prev.photos, hero: src },
                    }))}
                    className={cn(
                      'w-16 h-12 p-0 overflow-hidden cursor-pointer bg-transparent',
                      eventData.photos.hero === src
                        ? 'ring-2 ring-muted-gold'
                        : 'border border-stone hover:border-warm-light'
                    )}
                  >
                    <img src={src} alt={label} className="w-full h-full object-cover block" />
                  </button>
                ))}
              </div>
            </div>

            {/* Interior photo */}
            <div>
              <label className="block text-[11px] font-body uppercase tracking-[0.2em] text-warm-light mb-2">
                Noir (interni)
              </label>
              <div className="flex gap-2 flex-wrap">
                {photos.map(({ src, label }) => (
                  <button
                    key={src}
                    onClick={() => setEventData(prev => ({
                      ...prev,
                      photos: { ...prev.photos, interior: src },
                    }))}
                    className={cn(
                      'w-16 h-12 p-0 overflow-hidden cursor-pointer bg-transparent',
                      eventData.photos.interior === src
                        ? 'ring-2 ring-muted-gold'
                        : 'border border-stone hover:border-warm-light'
                    )}
                  >
                    <img src={src} alt={label} className="w-full h-full object-cover block" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Cover preview */}
      <div className="lg:sticky lg:top-6 self-start">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-body uppercase tracking-[0.2em] text-warm-muted">
            {activeVariant.label} — {COVER_FORMATS[format].label}
          </h3>
          <CoverExport
            targetRef={{ current: coverRef.current }}
            filename={`eva-cover-${variant}-${format}`}
          />
        </div>

        <div ref={coverRef}>
          <CoverRenderer
            variant={variant}
            format={format}
            event={eventData}
            theme={coverThemes[activeVariant.theme]}
            textStyle={textStyle}
          />
        </div>
      </div>
    </div>
  )
}
