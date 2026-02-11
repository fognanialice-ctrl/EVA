'use client'

import { ExternalLink } from 'lucide-react'
import { useToast } from '@/components/ui/toast'
import { CONTENT_SERIES } from '@/lib/instagram-content'

export function ContentBank() {
  const { toast } = useToast()

  function copyText(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      toast('success', 'Copiato!')
    })
  }

  return (
    <div>
      <a
        href="/EVA/sprints/01_genova_gathering/instagram/card-generator.html"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 border border-warm-text text-warm-text px-4 py-2 text-sm font-body hover:bg-warm-text hover:text-white transition-colors duration-150 mb-6"
      >
        Apri Card Generator
        <ExternalLink size={14} />
      </a>

      <div className="space-y-8">
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
    </div>
  )
}
