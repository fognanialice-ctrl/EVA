import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { registrationSchema } from '@/lib/validators'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data: registrations, error } = await supabase
      .from('event_registrations')
      .select(`
        *,
        contact:contacts(id, first_name, last_name, email, phone)
      `)
      .eq('event_id', id)
      .order('registered_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ registrations: registrations || [] })
  } catch (err) {
    console.error('GET /api/events/[id]/registrations error:', err)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await params
    const supabase = await createClient()
    const body = await request.json()

    let contactId = body.contact_id

    // If no contact_id, create a new contact from inline data
    if (!contactId && body.new_contact) {
      const { first_name, last_name, email, phone } = body.new_contact

      if (!first_name) {
        return NextResponse.json(
          { error: 'Il nome del contatto è obbligatorio' },
          { status: 400 }
        )
      }

      if (!email && !phone) {
        return NextResponse.json(
          { error: 'Email o telefono è obbligatorio' },
          { status: 400 }
        )
      }

      const { data: contact, error: contactError } = await supabase
        .from('contacts')
        .insert({
          first_name,
          last_name: last_name || null,
          email: email || null,
          phone: phone || null,
          source: 'manual',
          status: 'lead',
          subscribed_to_mailing: true,
          gdpr_consent: false,
          photo_consent: false,
        })
        .select()
        .single()

      if (contactError) {
        return NextResponse.json(
          { error: contactError.message },
          { status: 500 }
        )
      }

      contactId = contact.id

      // Log contact creation
      await supabase.from('activity_log').insert({
        action: 'contact.created',
        entity_type: 'contact',
        entity_id: contact.id,
        description: `Contatto creato durante registrazione: ${first_name}${last_name ? ' ' + last_name : ''}`,
        performed_by: 'admin',
      })
    }

    if (!contactId) {
      return NextResponse.json(
        { error: 'Contatto obbligatorio' },
        { status: 400 }
      )
    }

    // Build registration data
    const registrationData = {
      event_id: eventId,
      contact_id: contactId,
      status: body.status || 'pending',
      dietary_requirements: body.dietary_requirements || null,
      notes: body.notes || null,
      plus_one: body.plus_one || false,
      plus_one_name: body.plus_one_name || null,
      registration_source: body.registration_source || 'dashboard',
    }

    const parsed = registrationSchema.safeParse(registrationData)
    if (!parsed.success) {
      const errors = parsed.error.flatten()
      return NextResponse.json(
        { error: 'Dati non validi', details: errors },
        { status: 400 }
      )
    }

    const { data: registration, error: regError } = await supabase
      .from('event_registrations')
      .insert(parsed.data)
      .select(`
        *,
        contact:contacts(id, first_name, last_name, email, phone)
      `)
      .single()

    if (regError) {
      return NextResponse.json({ error: regError.message }, { status: 500 })
    }

    // Log activity
    const contactName = registration.contact
      ? `${registration.contact.first_name}${registration.contact.last_name ? ' ' + registration.contact.last_name : ''}`
      : contactId

    await supabase.from('activity_log').insert({
      action: 'registration.created',
      entity_type: 'event_registration',
      entity_id: registration.id,
      description: `Registrazione creata per ${contactName}`,
      metadata: { event_id: eventId, contact_id: contactId },
      performed_by: 'admin',
    })

    return NextResponse.json({ registration }, { status: 201 })
  } catch (err) {
    console.error('POST /api/events/[id]/registrations error:', err)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}
