'use client'

import { Fragment, useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { CAMPAIGN, OVERVIEW_STATS, PROGRESS_LABELS, METRIC_ROWS, TIME_ESTIMATES } from '@/lib/instagram-content'

export function CampaignOverview() {
  const [daysLeft, setDaysLeft] = useState<number | null>(null)
  const [weeksLeft, setWeeksLeft] = useState<number | null>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    function update() {
      const event = new Date(CAMPAIGN.eventDate)
      const now = new Date()
      const diff = event.getTime() - now.getTime()
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
      setDaysLeft(days)
      setWeeksLeft(Math.ceil(days / 7))

      const start = new Date(CAMPAIGN.startDate)
      const total = event.getTime() - start.getTime()
      const elapsed = now.getTime() - start.getTime()
      setProgress(Math.max(0, Math.min(100, (elapsed / total) * 100)))
    }
    update()
    const interval = setInterval(update, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div>
      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <Card>
          <div className="text-xs uppercase tracking-widest text-warm-muted mb-2 font-body">
            Settimane all&apos;evento
          </div>
          <div className="font-serif text-3xl text-terracotta">
            {weeksLeft ?? '—'}
          </div>
          <div className="text-xs text-warm-light mt-1 font-body">
            14 Marzo 2026 &middot; {daysLeft !== null ? `${daysLeft} giorni` : ''}
          </div>
        </Card>
        {OVERVIEW_STATS.map((stat) => (
          <Card key={stat.label}>
            <div className="text-xs uppercase tracking-widest text-warm-muted mb-2 font-body">
              {stat.label}
            </div>
            <div className="font-serif text-3xl text-terracotta">
              {stat.value}
            </div>
            <div className="text-xs text-warm-light mt-1 font-body">
              {stat.detail}
            </div>
          </Card>
        ))}
      </div>

      {/* Progress bar */}
      <Card className="mb-6">
        <h2 className="font-serif text-xl text-warm-text mb-3">
          Il Cammino verso il 14 Marzo
        </h2>
        <div className="h-2 bg-stone overflow-hidden">
          <div
            className="h-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, var(--terracotta), var(--muted-gold))',
            }}
          />
        </div>
        <div className="flex justify-between mt-2">
          {PROGRESS_LABELS.map((label) => (
            <span key={label} className="text-xs text-warm-muted font-body">
              {label}
            </span>
          ))}
        </div>
      </Card>

      {/* Golden Thread */}
      <Card className="border-muted-gold mb-8">
        <h2 className="font-serif text-xl text-warm-text mb-3">
          Il Filo d&apos;Oro — La Domanda Guida
        </h2>
        <p className="font-serif text-2xl text-muted-gold italic mb-4">
          &ldquo;{CAMPAIGN.goldenThread}&rdquo;
        </p>
        <div className="flex flex-wrap gap-2">
          {CAMPAIGN.goldenThreadAppears.map((item) => (
            <span
              key={item}
              className="text-xs font-body px-2 py-1 bg-cream-alt text-warm-muted"
            >
              {item}
            </span>
          ))}
        </div>
      </Card>

      {/* Weekly metric targets */}
      <h2 className="font-serif text-xl text-warm-text mb-4 pb-2 border-b border-stone">
        Obiettivi per Settimana
      </h2>

      <div className="grid grid-cols-5 gap-2 mb-8">
        {/* Headers */}
        <div className="text-xs uppercase tracking-widest text-warm-muted font-body font-semibold p-2">
          Metrica
        </div>
        {[1, 2, 3, 4].map((w) => (
          <div key={w} className="text-xs uppercase tracking-widest text-warm-muted font-body font-semibold p-2 text-center">
            Sett. {w}
          </div>
        ))}

        {/* Data rows */}
        {METRIC_ROWS.map((row) => (
          <Fragment key={row.label}>
            <div className="bg-white border border-stone p-3 flex items-center">
              <span className="text-xs text-warm-light font-body">{row.label}</span>
            </div>
            {row.values.map((val, i) => (
              <div key={i} className="bg-white border border-stone p-3 text-center">
                <span className="font-serif text-lg text-terracotta">{val}</span>
              </div>
            ))}
          </Fragment>
        ))}
      </div>

      {/* Time estimates */}
      <h2 className="font-serif text-xl text-warm-text mb-4 pb-2 border-b border-stone">
        Tempo Settimanale Stimato
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {TIME_ESTIMATES.map((est) => (
          <Card key={est.label}>
            <div className="text-xs uppercase tracking-widest text-warm-muted mb-2 font-body">
              {est.label}
            </div>
            <p className={`text-sm font-body leading-relaxed ${est.label === 'Totale' ? 'text-terracotta font-medium' : 'text-warm-text'}`}>
              {est.text}
            </p>
          </Card>
        ))}
      </div>
    </div>
  )
}
