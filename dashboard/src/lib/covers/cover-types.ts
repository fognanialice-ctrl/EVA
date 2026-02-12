export type CoverVariant = 'type-only' | 'editorial' | 'noir' | 'card'

export type CoverFormat = 'portrait' | 'square' | 'story'

export const COVER_FORMATS: Record<CoverFormat, { width: number; height: number; label: string }> = {
  portrait: { width: 1080, height: 1350, label: 'Portrait (4:5)' },
  square: { width: 1080, height: 1080, label: 'Square (1:1)' },
  story: { width: 1080, height: 1920, label: 'Story (9:16)' },
}

export interface CoverTheme {
  name: string
  background: string
  text: string
  textMuted: string
  accent: string
  accentSecondary: string
  overlay?: string
}

export type OverlayColorId = 'nero' | 'crema' | 'burgundy' | 'oro'

export interface OverlayColorOption {
  id: OverlayColorId
  label: string
  hex: string
}

export const OVERLAY_COLORS: OverlayColorOption[] = [
  { id: 'nero', label: 'Nero', hex: '#080C12' },
  { id: 'crema', label: 'Crema', hex: '#FAF7F2' },
  { id: 'burgundy', label: 'Burgundy', hex: '#6B2D3E' },
  { id: 'oro', label: 'Oro', hex: '#B59A5B' },
]

export interface CoverTextStyle {
  titleItalic: boolean
  titleUppercase: boolean
  footerText: string
  overlayColor: string
  overlayOpacity: number
}

export const defaultTextStyle: CoverTextStyle = {
  titleItalic: false,
  titleUppercase: false,
  footerText: '',
  overlayColor: '#080C12',
  overlayOpacity: 0,
}

export interface CoverEventData {
  title: string
  subtitle: string
  date: string
  time: string
  venue: string
  city: string
  tagline?: string
  photos: {
    hero: string
    interior: string
    detail: string
    atmosphere: string
    [key: string]: string
  }
  // Card-specific fields
  cardText?: string
  cardSeriesLabel?: string
  cardItalic?: boolean
  cardInteractive?: 'poll' | 'slider' | 'tot' | 'qbox'
  cardOptionA?: string
  cardOptionB?: string
  cardSliderEmoji?: string
  cardColorStyle?: string
  cardPhotoUrl?: string
  cardOverlayOpacity?: number
}

export interface CoverProps {
  event: CoverEventData
  theme: CoverTheme
  format: CoverFormat
  textStyle?: CoverTextStyle
}
