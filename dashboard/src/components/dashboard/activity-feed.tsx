'use client'

import { cn, formatRelativeTime } from '@/lib/utils'
import type { ActivityLog } from '@/types'

interface ActivityFeedProps {
  activities: ActivityLog[]
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  if (activities.length === 0) {
    return (
      <p className="text-sm font-body text-warm-muted py-4">
        Nessuna attività recente
      </p>
    )
  }

  return (
    <div className="space-y-0">
      {activities.map((activity, index) => (
        <div key={activity.id} className="relative flex gap-3 py-3">
          {/* Timeline line */}
          {index < activities.length - 1 && (
            <div className="absolute left-[7px] top-[26px] bottom-0 w-px bg-stone/50" />
          )}

          {/* Dot indicator */}
          <div className="relative flex-shrink-0 mt-1.5">
            <div className="h-[15px] w-[15px] border border-stone bg-white flex items-center justify-center">
              <div className="h-[5px] w-[5px] bg-terracotta" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-body text-warm-text leading-snug">
              {activity.description}
            </p>
            <p className="text-xs font-body text-warm-muted mt-0.5">
              {formatRelativeTime(activity.created_at)}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
