import type { CoverTheme } from './cover-types'

export const coverThemes: Record<string, CoverTheme> = {
  'cream-gold': {
    name: 'Cream & Gold',
    background: '#FAF7F2',
    text: '#1A1714',
    textMuted: '#5C544B',
    accent: '#B59A5B',
    accentSecondary: '#C9A84C',
  },
  'night-gold': {
    name: 'Night & Gold',
    background: '#0A0A0A',
    text: '#FAF7F2',
    textMuted: '#9A8E86',
    accent: '#B59A5B',
    accentSecondary: '#C9A84C',
    overlay: 'rgba(0, 0, 0, 0.55)',
  },
  'burgundy-gold': {
    name: 'Burgundy & Gold',
    background: '#2A1520',
    text: '#FAF7F2',
    textMuted: '#C4A0A0',
    accent: '#B59A5B',
    accentSecondary: '#C9A84C',
    overlay: 'rgba(42, 21, 32, 0.5)',
  },
}
