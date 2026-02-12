'use client'

import { useToast } from '@/components/ui/toast'
import { Card } from '@/components/ui/card'
import { CONTENT_SERIES, HASHTAG_SETS, DM_TEMPLATES, WHATSAPP_BRIDGE } from '@/lib/instagram-content'

export function ContentBank() {
  const { toast } = useToast()

  function copyText(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      toast('success', 'Copiato!')
    })
  }

  return (
    <div>
      {/* Content series */}
      <div className="space-y-8 mb-12">
        {CONTENT_SERIES.map((series) => (
          <div key={series.name}>
            <div className="flex items-center gap-3 mb-3 pb-2 border-b border-stone">
              <h3 className="font-serif text-xl text-warm-text">{series.name}</h3>
              <span className="text-xs font-body text-warm-muted px-2 py-0.5 bg-cream-alt">
                {series.freq}
              </span>
            </div>
            <div className="space-y-2">
              {series.items.map((item, i) => (
                <button
                  key={i}
                  onClick={() => copyText(item.text)}
                  className="w-full text-left bg-white border border-stone p-4 hover:border-terracotta transition-colors duration-150 group"
                >
                  <p className="font-serif text-base leading-relaxed text-warm-text whitespace-pre-line mb-2">
                    {item.text}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {item.meta.map((m) => (
                      <span key={m} className="text-xs font-body text-warm-light px-2 py-0.5 bg-cream-alt">
                        {m}
                      </span>
                    ))}
                    <span className="text-xs font-body text-warm-light opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
                      Clicca per copiare
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Hashtag sets */}
      <h2 className="font-serif text-xl text-warm-text mb-2">Set di Hashtag</h2>
      <p className="text-sm text-warm-muted font-body mb-4">
        Clicca su un set per copiarlo. Usa 5-8 hashtag per post, ruota i set.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {HASHTAG_SETS.map((set) => (
          <Card key={set.label}>
            <div className="text-xs uppercase tracking-widest text-warm-muted mb-2 font-body font-semibold">
              {set.label}
            </div>
            <button
              onClick={() => copyText(set.tags)}
              className="w-full text-left text-terracotta font-body text-sm leading-relaxed p-2 hover:bg-cream-alt transition-colors duration-150"
            >
              {set.tags}
            </button>
          </Card>
        ))}
      </div>

      {/* DM Templates */}
      <h2 className="font-serif text-xl text-warm-text mb-2">Template DM</h2>
      <p className="text-sm text-warm-muted font-body mb-4">
        Clicca su un template per copiarlo. Personalizza sempre con il nome della donna.
      </p>
      <div className="space-y-2 mb-8">
        {DM_TEMPLATES.map((dm) => (
          <button
            key={dm.label}
            onClick={() => copyText(dm.text)}
            className="w-full text-left bg-white border border-stone p-4 hover:border-terracotta transition-colors duration-150 group"
          >
            <div className="text-xs uppercase tracking-widest text-warm-muted mb-2 font-body">
              {dm.label}
            </div>
            <p className="text-sm text-warm-text font-body leading-relaxed">
              {dm.text}
            </p>
            <span className="text-xs font-body text-warm-light opacity-0 group-hover:opacity-100 transition-opacity mt-1 inline-block">
              Clicca per copiare
            </span>
          </button>
        ))}
      </div>

      {/* WhatsApp Bridge */}
      <h2 className="font-serif text-xl text-warm-text mb-3">WhatsApp Bridge</h2>
      <Card>
        <p className="text-sm font-body text-warm-text leading-relaxed">
          <strong>{WHATSAPP_BRIDGE.principle}</strong>
        </p>
        <p className="text-sm font-body text-warm-text leading-relaxed mt-2">
          {WHATSAPP_BRIDGE.cta}
        </p>
        <p className="text-sm font-body text-warm-muted mt-1">
          {WHATSAPP_BRIDGE.note}
        </p>
        <p className="text-sm font-body text-warm-text mt-3">
          <strong>WhatsApp:</strong> {WHATSAPP_BRIDGE.number}
        </p>
      </Card>
    </div>
  )
}
