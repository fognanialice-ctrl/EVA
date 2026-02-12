'use client'

import Link from 'next/link'

interface HubCard {
  title: string
  subtitle: string
  icon: React.ReactNode
  href: string
  external?: boolean
  badge?: string
}

export default function HubGrid({ upcomingEventsCount }: { upcomingEventsCount: number }) {
  const cards: HubCard[] = [
    {
      title: 'Prossimi Eventi',
      subtitle: 'Scopri e iscriviti',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C4704B" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      ),
      href: '/eventi',
      badge: upcomingEventsCount > 0 ? `${upcomingEventsCount}` : undefined,
    },
    {
      title: 'Community WhatsApp',
      subtitle: 'Resta connessa',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7A8B6F" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      ),
      href: 'https://chat.whatsapp.com/EVA',
      external: true,
    },
    {
      title: 'Playlist EVA',
      subtitle: 'La nostra musica',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#B59A5B" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
      ),
      href: 'https://open.spotify.com',
      external: true,
    },
    {
      title: 'Scrivici',
      subtitle: 'Siamo qui per te',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C4A0A0" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <path d="m22 6-10 7L2 6" />
        </svg>
      ),
      href: 'https://www.instagram.com/eva.community',
      external: true,
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3">
      {cards.map((card) => {
        const content = (
          <div
            key={card.title}
            className="relative flex flex-col rounded-2xl bg-white p-5 transition-all duration-200 active:scale-[0.97]"
            style={{ boxShadow: '0 2px 12px rgba(61,43,31,0.05)', border: '1px solid #DDD3C4' }}
          >
            {card.badge && (
              <span className="absolute right-3 top-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-terracotta px-1.5 text-[10px] font-bold text-white">
                {card.badge}
              </span>
            )}
            <div className="mb-3">{card.icon}</div>
            <h3 className="text-[14px] font-semibold text-warm-text">{card.title}</h3>
            <p className="mt-0.5 text-[11px] text-warm-muted">{card.subtitle}</p>
            {card.external && (
              <svg className="absolute bottom-4 right-4 opacity-30" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B5E54" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <path d="M15 3h6v6" />
                <path d="M10 14 21 3" />
              </svg>
            )}
          </div>
        )

        if (card.external) {
          return (
            <a key={card.title} href={card.href} target="_blank" rel="noopener noreferrer">
              {content}
            </a>
          )
        }

        return (
          <Link key={card.title} href={card.href}>
            {content}
          </Link>
        )
      })}
    </div>
  )
}
