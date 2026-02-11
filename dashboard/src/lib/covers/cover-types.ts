export type CoverVariant = 'type-only' | 'editorial' | 'noir'

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

export interface CoverTextStyle {
  titleItalic: boolean
  titleUppercase: boolean
  footerText: string
}

export const defaultTextStyle: CoverTextStyle = {
  titleItalic: false,
  titleUppercase: false,
  footerText: '',
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
}

export interface CoverProps {
  event: CoverEventData
  theme: CoverTheme
  format: CoverFormat
  textStyle?: CoverTextStyle
}
