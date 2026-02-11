'use client'

import useSWR from 'swr'
import { useRouter } from 'next/navigation'
import { Users, Mail, Calendar, CreditCard, Plus, UserPlus, CalendarPlus } from 'lucide-react'
import { StatCard } from '@/components/dashboard/stat-card'
import { ActivityFeed } from '@/components/dashboard/activity-feed'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { PageLoading } from '@/components/ui/loading'
import { formatCurrency } from '@/lib/utils'
import type { DashboardStats, ActivityLog } from '@/types'

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error('Errore durante il caricamento')
  }
  return res.json()
}

export default function DashboardPage() {
  const router = useRouter()

  const { data: statsData, isLoading: statsLoading } = useSWR<DashboardStats>(
    '/api/stats',
    fetcher
  )

  const { data: activityData, isLoading: activityLoading } = useSWR<{ activities: ActivityLog[] }>(
    '/api/activity',
    fetcher
  )

  if (statsLoading) return <PageLoading />

  const stats = statsData || {
    total_contacts: 0,
    mailing_subscribers: 0,
    upcoming_events: 0,
    total_revenue_cents: 0,
  }

  const activities = activityData?.activities || []

  return (
    <div>
      {/* Welcome header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-light text-warm-text">
          Benvenuta, Alice
        </h1>
        <p className="mt-1 font-sans text-sm text-warm-muted">
          Ecco un riepilogo della tua community
        </p>
      </div>

      {/* Stat cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Contatti totali"
          value={stats.total_contacts}
          icon={Users}
        />
        <StatCard
          title="Iscritte mailing"
          value={stats.mailing_subscribers}
          icon={Mail}
        />
        <StatCard
          title="Prossimi eventi"
          value={stats.upcoming_events}
          icon={Calendar}
        />
        <StatCard
          title="Ricavi totali"
          value={formatCurrency(stats.total_revenue_cents)}
          icon={CreditCard}
        />
      </div>

      {/* Quick actions + Activity feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick actions */}
        <div className="lg:col-span-1">
          <Card title="Azioni rapide">
            <div className="space-y-3">
              <Button
                variant="secondary"
                size="md"
                className="w-full justify-start"
                onClick={() => router.push('/dashboard/contacts/new')}
              >
                <UserPlus className="h-4 w-4" />
                Nuovo contatto
              </Button>
              <Button
                variant="secondary"
                size="md"
                className="w-full justify-start"
                onClick={() => router.push('/dashboard/events/new')}
              >
                <CalendarPlus className="h-4 w-4" />
                Nuovo evento
              </Button>
              <Button
                variant="secondary"
                size="md"
                className="w-full justify-start"
                onClick={() => router.push('/dashboard/payments/new')}
              >
                <CreditCard className="h-4 w-4" />
                Registra pagamento
              </Button>
            </div>
          </Card>
        </div>

        {/* Activity feed */}
        <div className="lg:col-span-2">
          <Card title="Attività recente">
            {activityLoading ? (
              <p className="text-sm font-body text-warm-muted py-4">
                Caricamento...
              </p>
            ) : (
              <ActivityFeed activities={activities} />
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
