'use client'

import { useCallback, useRef, useState } from 'react'
import { CoverRenderer } from '@/components/covers/cover-renderer'
import { CoverExport } from '@/components/covers/cover-export'
import { CalendarSavePanel } from '@/components/instagram/calendar-save-panel'
import { bellezzaEvent } from '@/lib/covers/bellezza-data'
import { coverThemes } from '@/lib/covers/cover-themes'
import {
  COVER_FORMATS,
  OVERLAY_COLORS,
  type CoverFormat,
  type CoverVariant,
  type CoverEventData,
  type CoverTextStyle,
  defaultTextStyle,
} from '@/lib/covers/cover-types'
import {
  CARD_SERIES,
  CARD_COLOR_CONFIGS,
  CARD_SERIES_MAP,
  type CardSeriesId,
  type CardColorStyleId,
} from '@/lib/covers/card-presets'
import { useToast } from '@/components/ui/toast'
import { cn } from '@/lib/utils'

type EditorMode = 'covers' | 'cards'

const VARIANTS: { id: CoverVariant; label: string; description: string; theme: string }[] = [
  { id: 'type-only', label: 'Type Only', description: 'Solo testo, nessuna foto', theme: 'cream-gold' },
  { id: 'editorial', label: 'Editorial', description: 'Foto a schermo intero', theme: 'night-gold' },
  { id: 'noir', label: 'Noir', description: 'Foto in alto, testo in basso', theme: 'burgundy-gold' },
]

const FORMAT_OPTIONS = Object.entries(COVER_FORMATS) as [CoverFormat, (typeof COVER_FORMATS)[CoverFormat]][]

const CARD_FORMAT_OPTIONS: [CoverFormat, { label: string }][] = [
  ['square', { label: 'Feed (1:1)' }],
  ['story', { label: 'Story (9:16)' }],
]

type EditableField = 'title' | 'tagline' | 'subtitle' | 'date' | 'time' | 'venue' | 'city'

const FIELD_CONFIG: { key: EditableField; label: string; multiline: boolean; help?: string }[] = [
  { key: 'title', label: 'Titolo', multiline: true, help: 'Usa a capo per dividere su più righe' },
  { key: 'tagline', label: 'Tagline', multiline: false },
  { key: 'subtitle', label: 'Sottotitolo', multiline: true },
  { key: 'date', label: 'Data', multiline: false },
  { key: 'time', label: 'Orario', multiline: false },
  { key: 'venue', label: 'Location', multiline: false },
  { key: 'city', label: 'Città', multiline: false },
]

interface PhotoOption {
  src: string
  label: string
}

function truncate(str: string, len: number) {
  return str.length > len ? str.substring(0, len) + '...' : str
}

const variantUsesPhoto = (v: CoverVariant) => v === 'editorial' || v === 'noir'

export function CoverEditor() {
  const { toast } = useToast()

  // Shared state
  const [mode, setMode] = useState<EditorMode>('covers')
  const coverRef = useRef<HTMLDivElement | null>(null)

  // Cover mode state
  const [variant, setVariant] = useState<CoverVariant>('type-only')
  const [format, setFormat] = useState<CoverFormat>('portrait')
  const [eventData, setEventData] = useState<CoverEventData>({ ...bellezzaEvent })
  const [textStyle, setTextStyle] = useState<CoverTextStyle>({ ...defaultTextStyle })
  const [photos, setPhotos] = useState<PhotoOption[]>([])

  // Card mode state
  const [cardSeries, setCardSeries] = useState<CardSeriesId>('domanda')
  const [cardFormat, setCardFormat] = useState<CoverFormat>('square')
  const [cardColorStyle, setCardColorStyle] = useState<CardColorStyleId>('cream')
  const [cardPresetIndex, setCardPresetIndex] = useState(0)
  const [cardText, setCardText] = useState(CARD_SERIES[0].presets[0].text)
  const [cardCaption, setCardCaption] = useState(CARD_SERIES[0].presets[0].caption || '')
  const [cardOptionA, setCardOptionA] = useState('')
  const [cardOptionB, setCardOptionB] = useState('')
  const [cardSliderEmoji, setCardSliderEmoji] = useState('❤️')
  const [cardPhotoUrl, setCardPhotoUrl] = useState('')
  const [cardOverlayOpacity, setCardOverlayOpacity] = useState(40)

  const activeVariant = VARIANTS.find(v => v.id === variant)!
  const activeSeries = CARD_SERIES_MAP[cardSeries]
  const isInteractive = !!activeSeries.interactive
  const showCoverPhoto = variantUsesPhoto(variant)

  // Cover mode helpers
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
    const input = e.target
    setTimeout(() => { input.value = '' }, 0)
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

  function selectPhoto(src: string) {
    const photoKey = variant === 'editorial' ? 'hero' : 'interior'
    setEventData(prev => ({
      ...prev,
      photos: { ...prev.photos, [photoKey]: src },
    }))
  }

  function removePhoto(src: string) {
    setPhotos(prev => prev.filter(p => p.src !== src))
    // Clear from event data if it was selected
    setEventData(prev => {
      const updated = { ...prev, photos: { ...prev.photos } }
      if (updated.photos.hero === src) updated.photos.hero = ''
      if (updated.photos.interior === src) updated.photos.interior = ''
      return updated
    })
  }

  const selectedPhotoSrc = variant === 'editorial' ? eventData.photos.hero : eventData.photos.interior

  // Card mode helpers
  function selectSeries(id: CardSeriesId) {
    setCardSeries(id)
    const series = CARD_SERIES_MAP[id]
    const firstPreset = series.presets[0]
    setCardPresetIndex(0)
    setCardText(firstPreset.text)
    setCardCaption(firstPreset.caption || '')
    setCardOptionA(firstPreset.optionA || '')
    setCardOptionB(firstPreset.optionB || '')
    setCardSliderEmoji(firstPreset.emoji || '❤️')
    if (series.interactive) {
      setCardFormat('story')
    }
  }

  function selectPreset(index: number) {
    const preset = activeSeries.presets[index]
    setCardPresetIndex(index)
    setCardText(preset.text)
    setCardCaption(preset.caption || '')
    if (preset.optionA) setCardOptionA(preset.optionA)
    if (preset.optionB) setCardOptionB(preset.optionB)
    if (preset.emoji) setCardSliderEmoji(preset.emoji)
  }

  function copyCaption() {
    if (!cardCaption) return
    navigator.clipboard.writeText(cardCaption).then(() => {
      toast('success', 'Caption copiata!')
    })
  }

  const handleCardPhotoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !file.type.startsWith('image/')) return
    const url = URL.createObjectURL(file)
    setCardPhotoUrl(url)
    const input = e.target
    setTimeout(() => { input.value = '' }, 0)
  }, [])

  const handleCardPhotoDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (!file || !file.type.startsWith('image/')) return
    const url = URL.createObjectURL(file)
    setCardPhotoUrl(url)
  }, [])

  // Build card event data for CoverRenderer
  const cardEventData: CoverEventData = {
    ...bellezzaEvent,
    cardText,
    cardSeriesLabel: activeSeries.label,
    cardItalic: activeSeries.italic,
    cardInteractive: activeSeries.interactive,
    cardOptionA,
    cardOptionB,
    cardSliderEmoji,
    cardColorStyle,
    cardPhotoUrl: cardPhotoUrl || undefined,
    cardOverlayOpacity: cardOverlayOpacity / 100,
  }

  // Determine what to render
  const isCardMode = mode === 'cards'
  const currentVariant: CoverVariant = isCardMode ? 'card' : variant
  const currentFormat: CoverFormat = isCardMode ? cardFormat : format
  const currentEvent = isCardMode ? cardEventData : eventData
  const currentTheme = isCardMode ? coverThemes['cream-gold'] : coverThemes[activeVariant.theme]
  const previewLabel = isCardMode
    ? `${activeSeries.tabLabel} — ${cardFormat === 'square' ? 'Feed (1:1)' : 'Story (9:16)'}`
    : `${activeVariant.label} — ${COVER_FORMATS[format].label}`
  const exportFilename = isCardMode
    ? `eva-card-${cardSeries}-${cardFormat}`
    : `eva-cover-${variant}-${format}`

  return (
    <div className="space-y-6">
      {/* Mode toggle */}
      <div className="flex gap-0">
        <button
          onClick={() => setMode('covers')}
          className={cn(
            'px-6 py-2.5 text-sm font-body tracking-[0.1em] uppercase transition-colors duration-150 border',
            mode === 'covers'
              ? 'border-warm-text bg-warm-text text-white'
              : 'border-stone text-warm-muted hover:border-warm-light'
          )}
        >
          Covers
        </button>
        <button
          onClick={() => setMode('cards')}
          className={cn(
            'px-6 py-2.5 text-sm font-body tracking-[0.1em] uppercase transition-colors duration-150 border border-l-0',
            mode === 'cards'
              ? 'border-warm-text bg-warm-text text-white'
              : 'border-stone text-warm-muted hover:border-warm-light'
          )}
        >
          Cards
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8">
        {/* Left: Editor controls */}
        <div className="space-y-6">
          {isCardMode ? (
            <>
              {/* ── SERIE & FORMATO ── */}
              <div className="border border-stone bg-white p-5">
                <h3 className="text-xs font-body uppercase tracking-[0.2em] text-warm-muted mb-4">
                  Serie
                </h3>
                <div className="flex flex-wrap gap-2 mb-5">
                  {CARD_SERIES.map(s => (
                    <button
                      key={s.id}
                      onClick={() => selectSeries(s.id)}
                      className={cn(
                        'px-4 py-2 text-sm font-body transition-colors duration-150 border rounded-full',
                        cardSeries === s.id
                          ? 'border-warm-text bg-warm-text text-white'
                          : 'border-stone text-warm-muted hover:border-terracotta hover:text-terracotta'
                      )}
                    >
                      {s.tabLabel}
                    </button>
                  ))}
                </div>

                <h3 className="text-xs font-body uppercase tracking-[0.2em] text-warm-muted mb-3">
                  Formato
                </h3>
                <div className="flex gap-2">
                  {CARD_FORMAT_OPTIONS.map(([key, { label }]) => (
                    <button
                      key={key}
                      onClick={() => {
                        if (isInteractive && key === 'square') return
                        setCardFormat(key)
                      }}
                      className={cn(
                        'px-4 py-2 text-sm font-body transition-colors duration-150 border',
                        cardFormat === key
                          ? 'border-muted-gold text-muted-gold bg-muted-gold/5'
                          : 'border-stone text-warm-muted hover:border-warm-light',
                        isInteractive && key === 'square' && 'opacity-40 cursor-not-allowed'
                      )}
                    >
                      {label}
                    </button>
                  ))}
                  {isInteractive && (
                    <span className="self-center text-[10px] font-body text-warm-light ml-1">
                      Story obbligatorio
                    </span>
                  )}
                </div>
              </div>

              {/* ── STILE COLORE ── */}
              <div className="border border-stone bg-white p-5">
                <h3 className="text-xs font-body uppercase tracking-[0.2em] text-warm-muted mb-4">
                  Stile colore
                </h3>
                <div className="grid grid-cols-4 gap-3">
                  {(Object.values(CARD_COLOR_CONFIGS)).map(c => (
                    <button
                      key={c.id}
                      onClick={() => setCardColorStyle(c.id)}
                      className={cn(
                        'p-3 border text-center text-xs font-body transition-colors duration-150',
                        cardColorStyle === c.id
                          ? 'border-warm-text bg-cream-alt'
                          : 'border-stone hover:border-terracotta'
                      )}
                    >
                      <div
                        className="w-full h-7 rounded mb-2"
                        style={{ background: c.swatchGradient }}
                      />
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── CONTENUTO ── */}
              <div className="border border-stone bg-white p-5">
                <h3 className="text-xs font-body uppercase tracking-[0.2em] text-warm-muted mb-4">
                  Contenuto
                </h3>

                {/* Preset list */}
                <div className="text-[11px] font-body uppercase tracking-[0.2em] text-warm-light mb-2">
                  Contenuti pronti
                </div>
                <div className="max-h-48 overflow-y-auto border border-stone mb-4">
                  {activeSeries.presets.map((preset, i) => (
                    <button
                      key={i}
                      onClick={() => selectPreset(i)}
                      className={cn(
                        'w-full text-left px-4 py-3 text-sm font-serif leading-relaxed border-b border-cream-alt transition-colors duration-150',
                        cardPresetIndex === i
                          ? 'bg-cream-alt text-terracotta'
                          : 'text-warm-muted hover:bg-cream-alt hover:text-warm-text'
                      )}
                    >
                      {truncate(preset.text, 80)}
                    </button>
                  ))}
                </div>

                {/* Editable text */}
                <div className="text-[11px] font-body uppercase tracking-[0.2em] text-warm-light mb-2">
                  Testo della card
                </div>
                <textarea
                  value={cardText}
                  onChange={e => setCardText(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-stone bg-white text-sm font-serif font-light text-warm-text outline-none focus:border-muted-gold transition-colors resize-y leading-relaxed"
                />

                {/* Interactive controls */}
                {(activeSeries.interactive === 'poll' || activeSeries.interactive === 'tot') && (
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-body uppercase tracking-[0.2em] text-warm-light mb-1">
                        Opzione A
                      </label>
                      <input
                        type="text"
                        value={cardOptionA}
                        onChange={e => setCardOptionA(e.target.value)}
                        placeholder="Prima opzione..."
                        className="w-full px-3 py-2 border border-stone bg-white text-sm font-body font-light text-warm-text outline-none focus:border-muted-gold transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-body uppercase tracking-[0.2em] text-warm-light mb-1">
                        Opzione B
                      </label>
                      <input
                        type="text"
                        value={cardOptionB}
                        onChange={e => setCardOptionB(e.target.value)}
                        placeholder="Seconda opzione..."
                        className="w-full px-3 py-2 border border-stone bg-white text-sm font-body font-light text-warm-text outline-none focus:border-muted-gold transition-colors"
                      />
                    </div>
                  </div>
                )}

                {activeSeries.interactive === 'slider' && (
                  <div className="mt-4">
                    <label className="block text-[11px] font-body uppercase tracking-[0.2em] text-warm-light mb-1">
                      Emoji slider
                    </label>
                    <input
                      type="text"
                      value={cardSliderEmoji}
                      onChange={e => setCardSliderEmoji(e.target.value)}
                      className="w-20 px-3 py-2 border border-stone bg-white text-lg text-center outline-none focus:border-muted-gold transition-colors"
                    />
                  </div>
                )}
              </div>

              {/* ── CAPTION ── */}
              <div className="border border-stone bg-white p-5">
                <h3 className="text-xs font-body uppercase tracking-[0.2em] text-warm-muted mb-4">
                  Caption
                </h3>
                <textarea
                  value={cardCaption}
                  onChange={e => setCardCaption(e.target.value)}
                  rows={3}
                  placeholder="Scrivi la caption..."
                  className="w-full px-3 py-2 border border-stone bg-white text-sm font-body font-light text-warm-text outline-none focus:border-muted-gold transition-colors resize-y"
                />
                <button
                  onClick={copyCaption}
                  className="mt-2 w-full px-3 py-2 text-xs font-body border border-stone text-warm-muted hover:border-terracotta hover:text-terracotta transition-colors"
                >
                  Copia Caption + Hashtag
                </button>
              </div>

              {/* ── FOTO SFONDO (opzionale) ── */}
              <div className="border border-stone bg-white p-5">
                <h3 className="text-xs font-body uppercase tracking-[0.2em] text-warm-muted mb-1">
                  Foto sfondo
                </h3>
                <p className="text-[10px] font-body text-warm-light mb-4">
                  Opzionale — aggiunge una foto dietro il testo della card
                </p>

                {cardPhotoUrl ? (
                  <div className="relative mb-3">
                    <img src={cardPhotoUrl} alt="" className="w-full h-32 object-cover border border-stone" />
                    <button
                      onClick={() => setCardPhotoUrl('')}
                      className="absolute top-2 right-2 w-6 h-6 bg-white/80 border border-stone text-warm-muted text-xs flex items-center justify-center hover:bg-white transition-colors"
                    >
                      &times;
                    </button>
                  </div>
                ) : (
                  <label
                    onDrop={handleCardPhotoDrop}
                    onDragOver={e => e.preventDefault()}
                    onDragEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#B59A5B' }}
                    onDragLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '' }}
                    className="block border border-dashed border-stone p-6 mb-3 text-center cursor-pointer transition-colors hover:border-muted-gold"
                  >
                    <span className="text-xs font-body text-warm-light">
                      Clicca o trascina un&apos;immagine
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCardPhotoUpload}
                      className="hidden"
                    />
                  </label>
                )}

                <div>
                  <label className="block text-[11px] font-body uppercase tracking-[0.2em] text-warm-light mb-2">
                    Opacità overlay — {cardOverlayOpacity}%
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={80}
                    value={cardOverlayOpacity}
                    onChange={e => setCardOverlayOpacity(Number(e.target.value))}
                    className="w-full accent-terracotta"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              {/* ══════════ COVERS MODE ══════════ */}

              {/* ── VARIANTE & FORMATO ── */}
              <div className="border border-stone bg-white p-5">
                <h3 className="text-xs font-body uppercase tracking-[0.2em] text-warm-muted mb-4">
                  Variante
                </h3>
                <div className="flex flex-wrap gap-2 mb-5">
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
                </div>
                <p className="text-[11px] font-body text-warm-light mb-5">
                  {activeVariant.description}
                </p>

                <h3 className="text-xs font-body uppercase tracking-[0.2em] text-warm-muted mb-3">
                  Formato
                </h3>
                <div className="flex flex-wrap gap-2">
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
              </div>

              {/* ── TESTO ── */}
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

              {/* ── FOTO ── */}
              <div className="border border-stone bg-white p-5">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-xs font-body uppercase tracking-[0.2em] text-warm-muted">
                    Foto
                  </h3>
                  <label className="text-xs font-body px-3 py-1 border border-stone text-warm-muted hover:border-muted-gold hover:text-muted-gold transition-colors cursor-pointer">
                    + Carica foto
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-[10px] font-body text-warm-light mb-4">
                  {showCoverPhoto
                    ? `Carica le tue foto, poi seleziona quella da usare per la cover ${activeVariant.label}.`
                    : 'Le foto vengono usate per le varianti Editorial e Noir. Caricale qui e seleziona la variante.'}
                </p>

                {photos.length === 0 ? (
                  <label
                    onDrop={handleDrop}
                    onDragOver={e => e.preventDefault()}
                    onDragEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#B59A5B' }}
                    onDragLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '' }}
                    className="block border border-dashed border-stone p-8 text-center cursor-pointer transition-colors hover:border-muted-gold"
                  >
                    <span className="text-xs font-body text-warm-light">
                      Clicca o trascina qui le immagini
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <>
                    {/* Drop zone (compact) */}
                    <label
                      onDrop={handleDrop}
                      onDragOver={e => e.preventDefault()}
                      onDragEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#B59A5B' }}
                      onDragLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '' }}
                      className="block border border-dashed border-stone p-3 mb-4 text-center cursor-pointer transition-colors hover:border-muted-gold"
                    >
                      <span className="text-xs font-body text-warm-light">
                        Trascina qui altre immagini
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>

                    {/* Photo grid — single selection */}
                    <div className="flex gap-2 flex-wrap">
                      {photos.map(({ src, label }) => (
                        <div key={src} className="relative group">
                          <button
                            onClick={() => selectPhoto(src)}
                            className={cn(
                              'w-20 h-14 p-0 overflow-hidden cursor-pointer bg-transparent',
                              !showCoverPhoto && 'opacity-50 cursor-not-allowed',
                              selectedPhotoSrc === src
                                ? 'ring-2 ring-muted-gold'
                                : 'border border-stone hover:border-warm-light'
                            )}
                            disabled={!showCoverPhoto}
                          >
                            <img src={src} alt={label} className="w-full h-full object-cover block" />
                          </button>
                          <button
                            onClick={() => removePhoto(src)}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white border border-stone text-warm-light text-[10px] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:text-dusty-rose hover:border-dusty-rose"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Overlay controls */}
                    {showCoverPhoto && (
                      <div className="mt-5 pt-4 border-t border-stone">
                        <div className="text-[11px] font-body uppercase tracking-[0.2em] text-warm-light mb-3">
                          Colore overlay
                        </div>
                        <div className="flex gap-2 mb-4 flex-wrap">
                          <button
                            onClick={() => setTextStyle(prev => ({ ...prev, overlayOpacity: 0 }))}
                            className={cn(
                              'flex items-center gap-2 px-3 py-1.5 text-xs font-body border transition-colors duration-150',
                              textStyle.overlayOpacity === 0
                                ? 'border-warm-text bg-cream-alt'
                                : 'border-stone hover:border-warm-light'
                            )}
                          >
                            Nessuno
                          </button>
                          {OVERLAY_COLORS.map(c => (
                            <button
                              key={c.id}
                              onClick={() => setTextStyle(prev => ({
                                ...prev,
                                overlayColor: c.hex,
                                overlayOpacity: prev.overlayOpacity === 0 ? 30 : prev.overlayOpacity,
                              }))}
                              className={cn(
                                'flex items-center gap-2 px-3 py-1.5 text-xs font-body border transition-colors duration-150',
                                textStyle.overlayColor === c.hex && textStyle.overlayOpacity > 0
                                  ? 'border-warm-text bg-cream-alt'
                                  : 'border-stone hover:border-warm-light'
                              )}
                            >
                              <span
                                className="w-4 h-4 rounded-full border border-stone/50 inline-block"
                                style={{ background: c.hex }}
                              />
                              {c.label}
                            </button>
                          ))}
                        </div>
                        <div className="text-[11px] font-body uppercase tracking-[0.2em] text-warm-light mb-2">
                          Opacità overlay — {textStyle.overlayOpacity}%
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={90}
                          value={textStyle.overlayOpacity}
                          onChange={e => setTextStyle(prev => ({ ...prev, overlayOpacity: Number(e.target.value) }))}
                          className="w-full accent-terracotta"
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </div>

        {/* Right: Preview */}
        <div className="lg:sticky lg:top-6 self-start">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-body uppercase tracking-[0.2em] text-warm-muted">
              {previewLabel}
            </h3>
          </div>

          <div ref={coverRef}>
            <CoverRenderer
              variant={currentVariant}
              format={currentFormat}
              event={currentEvent}
              theme={currentTheme}
              textStyle={isCardMode ? undefined : textStyle}
            />
          </div>

          <div className="flex gap-2 mt-4">
            <CoverExport
              targetRef={{ current: coverRef.current }}
              filename={exportFilename}
            />
            <CalendarSavePanel
              coverRef={coverRef}
              label={previewLabel}
              mode={isCardMode ? 'card' : 'cover'}
              caption={isCardMode ? cardCaption : undefined}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
