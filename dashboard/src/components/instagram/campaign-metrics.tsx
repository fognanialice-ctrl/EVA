'use client'

import { Fragment } from 'react'
import { Card } from '@/components/ui/card'
import { METRIC_ROWS, TIME_ESTIMATES } from '@/lib/instagram-content'

export function CampaignMetrics() {
  return (
    <div>
      <h2 className="font-serif text-xl text-warm-text mb-4 pb-2 border-b border-stone">
        Obiettivi per Settimana
      </h2>

      {/* Metrics grid: 5 columns (label + 4 weeks) */}
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
