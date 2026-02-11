import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()

    // Run all queries in parallel
    const [contactsResult, mailingResult, eventsResult, revenueResult] = await Promise.all([
      // Total contacts
      supabase
        .from('contacts')
        .select('id', { count: 'exact', head: true }),

      // Mailing subscribers
      supabase
        .from('contacts')
        .select('id', { count: 'exact', head: true })
        .eq('subscribed_to_mailing', true),

      // Upcoming events (event_date >= today)
      supabase
        .from('events')
        .select('id', { count: 'exact', head: true })
        .gte('event_date', new Date().toISOString().split('T')[0]),

      // Total revenue from completed payments
      supabase
        .from('payments')
        .select('amount_cents')
        .eq('status', 'completed'),
    ])

    const total_contacts = contactsResult.count || 0
    const mailing_subscribers = mailingResult.count || 0
    const upcoming_events = eventsResult.count || 0
    const total_revenue_cents = (revenueResult.data || []).reduce(
      (sum, p) => sum + (p.amount_cents || 0),
      0
    )

    return NextResponse.json({
      total_contacts,
      mailing_subscribers,
      upcoming_events,
      total_revenue_cents,
    })
  } catch (err) {
    console.error('GET /api/stats error:', err)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}
