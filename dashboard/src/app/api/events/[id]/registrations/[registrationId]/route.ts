import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { RegistrationStatus } from '@/types'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; registrationId: string }> }
) {
  try {
    const { id: eventId, registrationId } = await params
    const supabase = await createClient()
    const body = await request.json()

    const newStatus = body.status as RegistrationStatus
    const validStatuses: RegistrationStatus[] = [
      'pending',
      'confirmed',
      'waitlisted',
      'cancelled',
      'attended',
      'no_show',
    ]

    if (!newStatus || !validStatuses.includes(newStatus)) {
      return NextResponse.json(
        { error: 'Stato non valido' },
        { status: 400 }
      )
    }

    // Get current registration for logging
    const { data: currentReg } = await supabase
      .from('event_registrations')
      .select(`
        *,
        contact:contacts(id, first_name, last_name)
      `)
      .eq('id', registrationId)
      .eq('event_id', eventId)
      .single()

    if (!currentReg) {
      return NextResponse.json(
        { error: 'Registrazione non trovata' },
        { status: 404 }
      )
    }

    // Build update data with appropriate timestamp fields
    const now = new Date().toISOString()
    const updateData: Record<string, unknown> = { status: newStatus }

    if (newStatus === 'confirmed' && !currentReg.confirmed_at) {
      updateData.confirmed_at = now
    }
    if (newStatus === 'cancelled' && !currentReg.cancelled_at) {
      updateData.cancelled_at = now
    }
    if (newStatus === 'attended' && !currentReg.attended_at) {
      updateData.attended_at = now
    }

    const { data: registration, error } = await supabase
      .from('event_registrations')
      .update(updateData)
      .eq('id', registrationId)
      .eq('event_id', eventId)
      .select(`
        *,
        contact:contacts(id, first_name, last_name, email, phone)
      `)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Log activity
    const contactName = currentReg.contact
      ? `${currentReg.contact.first_name}${currentReg.contact.last_name ? ' ' + currentReg.contact.last_name : ''}`
      : currentReg.contact_id

    const statusLabels: Record<string, string> = {
      pending: 'in attesa',
      confirmed: 'confermata',
      waitlisted: 'lista d\'attesa',
      cancelled: 'cancellata',
      attended: 'presente',
      no_show: 'assente',
    }

    await supabase.from('activity_log').insert({
      action: 'registration.status_changed',
      entity_type: 'event_registration',
      entity_id: registrationId,
      description: `Stato registrazione di ${contactName} cambiato da ${statusLabels[currentReg.status] || currentReg.status} a ${statusLabels[newStatus] || newStatus}`,
      metadata: {
        event_id: eventId,
        contact_id: currentReg.contact_id,
        old_status: currentReg.status,
        new_status: newStatus,
      },
      performed_by: 'admin',
    })

    return NextResponse.json({ registration })
  } catch (err) {
    console.error('PUT /api/events/[id]/registrations/[registrationId] error:', err)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}
