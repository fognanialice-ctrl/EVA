import type { CoverEventData } from './cover-types'

export const bellezzaPhotos = [
  { src: '/covers/bellezza-che-nutre/hero-dimora.jpg', label: 'Dimora (esterno)' },
  { src: '/covers/bellezza-che-nutre/dimora-salotto.jpg', label: 'Salotto' },
  { src: '/covers/bellezza-che-nutre/dimora-dettaglio.jpg', label: 'Dettaglio' },
  { src: '/covers/bellezza-che-nutre/te-salotto.jpg', label: 'Tè' },
  { src: '/covers/bellezza-che-nutre/dimora-finestra.jpg', label: 'Finestra' },
  { src: '/covers/bellezza-che-nutre/dimora-angeli.jpg', label: 'Angeli' },
]

export const bellezzaEvent: CoverEventData = {
  title: 'Bellezza\nche Nutre',
  subtitle: 'Un pomeriggio tra bellezza, connessione e cura di sé',
  date: '14 Marzo 2026',
  time: '14:00 — 19:00',
  venue: 'Dimora Storica',
  city: 'Genova',
  tagline: 'Il primo incontro EVA',
  photos: {
    hero: '/covers/bellezza-che-nutre/hero-dimora.jpg',
    interior: '/covers/bellezza-che-nutre/dimora-salotto.jpg',
    detail: '/covers/bellezza-che-nutre/dimora-dettaglio.jpg',
    atmosphere: '/covers/bellezza-che-nutre/te-salotto.jpg',
    window: '/covers/bellezza-che-nutre/dimora-finestra.jpg',
    angels: '/covers/bellezza-che-nutre/dimora-angeli.jpg',
  },
}
