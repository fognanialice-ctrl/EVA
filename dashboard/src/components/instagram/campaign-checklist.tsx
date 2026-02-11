'use client'

import { useEffect, useState, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { CHECKLIST_WEEKS } from '@/lib/instagram-content'

const STORAGE_KEY = 'eva-campaign-checklist'

type ChecklistState = Record<string, boolean[]>

export function CampaignChecklist() {
  const [state, setState] = useState<ChecklistState>({})

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setState(JSON.parse(stored))
      }
    } catch {
      // ignore parse errors
    }
  }, [])

  const save = useCallback((next: ChecklistState) => {
    setState(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }, [])

  function toggle(weekKey: string, idx: number) {
    const current = state[weekKey] || []
    const next = [...current]
    next[idx] = !next[idx]
    save({ ...state, [weekKey]: next })
  }

  function getChecked(weekKey: string, idx: number): boolean {
    return state[weekKey]?.[idx] ?? false
  }

  function weekProgress(weekKey: string, total: number): number {
    const checks = state[weekKey] || []
    const done = checks.filter(Boolean).length
    return total > 0 ? Math.round((done / total) * 100) : 0
  }

  return (
    <div className="space-y-8">
      {CHECKLIST_WEEKS.map((week) => {
        const weekKey = `w${week.week}`
        const pct = weekProgress(weekKey, week.items.length)
        const doneCount = (state[weekKey] || []).filter(Boolean).length

        return (
          <div key={week.week}>
            <div className="flex items-center gap-3 mb-3 pb-2 border-b border-stone">
              <h2 className="font-serif text-xl text-warm-text">
                Settimana {week.week} — {week.title}
              </h2>
              <span className="text-xs font-body text-warm-muted">
                ({week.dates})
              </span>
              <span className={cn(
                'text-xs font-body font-medium px-2 py-0.5 ml-auto',
                pct === 100 ? 'bg-sage/20 text-sage' : 'bg-stone text-warm-muted'
              )}>
                {doneCount}/{week.items.length}
              </span>
            </div>

            {/* Mini progress bar */}
            <div className="h-1 bg-stone mb-3 overflow-hidden">
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: `${pct}%`,
                  background: pct === 100 ? 'var(--sage)' : 'var(--terracotta)',
                }}
              />
            </div>

            <ul className="space-y-0">
              {week.items.map((item, i) => {
                const checked = getChecked(weekKey, i)
                return (
                  <li
                    key={i}
                    className="flex items-start gap-3 py-2 px-3 border-b border-cream-alt"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(weekKey, i)}
                      className="mt-0.5 w-4 h-4 accent-terracotta flex-shrink-0"
                    />
                    <span
                      className={cn(
                        'text-sm font-body leading-relaxed',
                        checked ? 'text-warm-light line-through' : 'text-warm-text'
                      )}
                    >
                      {item}
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
        )
      })}
    </div>
  )
}
