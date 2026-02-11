'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CALENDAR_DATA, type CalendarDayItem } from '@/lib/instagram-content'

const typeStyles: Record<CalendarDayItem['type'], string> = {
  feed: 'bg-terracotta/10 text-terracotta border-l-2 border-terracotta',
  stories: 'bg-sage/10 text-sage border-l-2 border-sage',
  action: 'bg-muted-gold/10 text-muted-gold border-l-2 border-muted-gold',
  reel: 'bg-burgundy/10 text-burgundy border-l-2 border-burgundy',
}

function getWeekBadge(week: number): { className: string; label: string } {
  const now = new Date()
  // Approximate week boundaries
  const weekStarts = [
    new Date('2026-02-11'),
    new Date('2026-02-18'),
    new Date('2026-02-25'),
    new Date('2026-03-04'),
    new Date('2026-03-11'),
  ]
  const weekEnds = [
    new Date('2026-02-17'),
    new Date('2026-02-24'),
    new Date('2026-03-03'),
    new Date('2026-03-10'),
    new Date('2026-03-16'),
  ]

  const idx = week - 1
  if (now >= weekStarts[idx] && now <= new Date(weekEnds[idx].getTime() + 86400000)) {
    return { className: 'bg-terracotta text-white', label: 'Corrente' }
  }
  if (now > weekEnds[idx]) {
    return { className: 'bg-cream-alt text-warm-light', label: 'Passata' }
  }
  return { className: 'bg-stone text-warm-muted', label: 'In arrivo' }
}

function isToday(dateStr: string): boolean {
  if (!dateStr) return false
  const months: Record<string, number> = { Feb: 1, Mar: 2 }
  const parts = dateStr.split(' ')
  const day = parseInt(parts[0])
  const month = months[parts[1]]
  if (month === undefined) return false
  const d = new Date(2026, month, day)
  const now = new Date()
  return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
}

export function CampaignCalendar() {
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({})

  function toggle(week: number) {
    setCollapsed((prev) => ({ ...prev, [week]: !prev[week] }))
  }

  return (
    <div className="space-y-6">
      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-2">
        {(['feed', 'stories', 'reel', 'action'] as const).map((type) => (
          <div key={type} className="flex items-center gap-2 text-xs font-body">
            <div className={cn('w-3 h-3', typeStyles[type])} />
            <span className="text-warm-muted capitalize">{type === 'feed' ? 'Feed Post' : type === 'stories' ? 'Stories' : type === 'reel' ? 'Reel' : 'Azione'}</span>
          </div>
        ))}
      </div>

      {CALENDAR_DATA.map((week) => {
        const badge = getWeekBadge(week.week)
        const isCollapsed = collapsed[week.week]

        return (
          <div key={week.week}>
            {/* Week header */}
            <button
              onClick={() => toggle(week.week)}
              className="w-full flex items-center gap-3 mb-3 text-left"
            >
              {isCollapsed ? (
                <ChevronRight size={16} className="text-warm-muted flex-shrink-0" />
              ) : (
                <ChevronDown size={16} className="text-warm-muted flex-shrink-0" />
              )}
              <span className={cn('text-xs font-body font-medium px-2 py-0.5', badge.className)}>
                Settimana {week.week}
              </span>
              <h2 className="font-serif text-xl text-warm-text">
                {week.title}
              </h2>
              <span className="text-sm text-warm-muted italic font-body">
                {week.dates} — {week.subtitle}
              </span>
            </button>

            {/* Day grid */}
            {!isCollapsed && (
              <div className="grid grid-cols-7 gap-2">
                {week.days.map((day, i) => {
                  if (!day.date) return <div key={i} />
                  const today = isToday(day.date)
                  return (
                    <div
                      key={day.date}
                      className={cn(
                        'bg-white border border-stone p-2 min-h-[140px]',
                        today && 'border-terracotta border-2'
                      )}
                    >
                      <div className="text-[10px] uppercase tracking-wider text-warm-light mb-2 font-body">
                        <strong className="text-warm-text">{day.day}</strong> {day.date}
                      </div>
                      <div className="space-y-1">
                        {day.items.map((item, j) => (
                          <div
                            key={j}
                            className={cn('text-xs px-1.5 py-1 leading-tight', typeStyles[item.type])}
                          >
                            <div className="font-semibold text-[9px] uppercase tracking-wide opacity-70">
                              {item.series}
                            </div>
                            {item.text}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
