import { createClient } from '@/lib/supabase/server'
import HubGrid from './hub-grid'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: contact } = await supabase
    .from('contacts')
    .select('first_name')
    .eq('auth_user_id', user!.id)
    .single()

  const firstName = contact?.first_name || 'Membro'

  // Get count of upcoming events for the badge
  const { count: upcomingCount } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true })
    .in('status', ['published', 'registration_open'])
    .gte('event_date', new Date().toISOString().split('T')[0])

  return (
    <main className="min-h-dvh bg-cream">
      {/* Header */}
      <header className="bg-cream pt-safe-top">
        <div className="mx-auto max-w-[500px] px-5 pb-4 pt-8">
          <p className="text-[13px] font-medium text-warm-muted">Benvenuta nella community</p>
          <h1 className="mt-1 font-display text-[26px] font-semibold text-warm-text">
            Ciao, {firstName}
          </h1>
        </div>
      </header>

      <div className="mx-auto max-w-[500px] px-5 pb-8">
        <HubGrid upcomingEventsCount={upcomingCount || 0} />
      </div>
    </main>
  )
}
