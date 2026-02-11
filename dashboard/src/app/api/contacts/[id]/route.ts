import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { contactSchema } from '@/lib/validators'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Fetch contact with tags
    const { data: contact, error: contactError } = await supabase
      .from('contacts')
      .select('*, contact_tags(tag_id, tags(*))')
      .eq('id', id)
      .single()

    if (contactError) {
      if (contactError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Contatto non trovato' },
          { status: 404 }
        )
      }
      return NextResponse.json(
        { error: contactError.message },
        { status: 500 }
      )
    }

    // Flatten tags
    const tags = (contact.contact_tags || [])
      .map((ct: { tags: unknown }) => ct.tags)
      .filter(Boolean)
    const { contact_tags: _, ...contactData } = contact

    // Fetch event registrations with event info
    const { data: registrations } = await supabase
      .from('event_registrations')
      .select('*, event:events(id, title, event_date)')
      .eq('contact_id', id)
      .order('registered_at', { ascending: false })

    // Fetch payments with event info
    const { data: payments } = await supabase
      .from('payments')
      .select('*, event:events(id, title)')
      .eq('contact_id', id)
      .order('created_at', { ascending: false })

    // Fetch activity log
    const { data: activities } = await supabase
      .from('activity_log')
      .select('*')
      .eq('entity_type', 'contact')
      .eq('entity_id', id)
      .order('created_at', { ascending: false })
      .limit(20)

    return NextResponse.json({
      contact: {
        ...contactData,
        tags,
        event_registrations: registrations || [],
        payments: payments || [],
      },
      activities: activities || [],
    })
  } catch (err) {
    console.error('GET /api/contacts/[id] error:', err)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const body = await request.json()

    // Handle tag operations separately
    if (body._action === 'add_tag') {
      const { tag_id } = body
      const { error } = await supabase
        .from('contact_tags')
        .insert({ contact_id: id, tag_id })

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      await supabase.from('activity_log').insert({
        action: 'contact.tag_added',
        entity_type: 'contact',
        entity_id: id,
        description: `Tag aggiunto al contatto`,
        performed_by: 'admin',
      })

      return NextResponse.json({ success: true })
    }

    if (body._action === 'remove_tag') {
      const { tag_id } = body
      const { error } = await supabase
        .from('contact_tags')
        .delete()
        .eq('contact_id', id)
        .eq('tag_id', tag_id)

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      await supabase.from('activity_log').insert({
        action: 'contact.tag_removed',
        entity_type: 'contact',
        entity_id: id,
        description: `Tag rimosso dal contatto`,
        performed_by: 'admin',
      })

      return NextResponse.json({ success: true })
    }

    // Regular contact update
    const parsed = contactSchema.safeParse(body)
    if (!parsed.success) {
      const errors = parsed.error.flatten()
      return NextResponse.json(
        { error: 'Dati non validi', details: errors },
        { status: 400 }
      )
    }

    const contactData = parsed.data

    // Set GDPR consent date if consent changed to true
    if (contactData.gdpr_consent && !contactData.gdpr_consent_date) {
      contactData.gdpr_consent_date = new Date().toISOString()
    }

    const { data: contact, error } = await supabase
      .from('contacts')
      .update(contactData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Contatto non trovato' },
          { status: 404 }
        )
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    await supabase.from('activity_log').insert({
      action: 'contact.updated',
      entity_type: 'contact',
      entity_id: id,
      description: `Contatto aggiornato: ${contact.first_name}${contact.last_name ? ' ' + contact.last_name : ''}`,
      performed_by: 'admin',
    })

    return NextResponse.json({ contact })
  } catch (err) {
    console.error('PUT /api/contacts/[id] error:', err)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Fetch contact name before deleting for the activity log
    const { data: existing } = await supabase
      .from('contacts')
      .select('first_name, last_name')
      .eq('id', id)
      .single()

    // Delete contact_tags first
    await supabase.from('contact_tags').delete().eq('contact_id', id)

    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (existing) {
      await supabase.from('activity_log').insert({
        action: 'contact.deleted',
        entity_type: 'contact',
        entity_id: id,
        description: `Contatto eliminato: ${existing.first_name}${existing.last_name ? ' ' + existing.last_name : ''}`,
        performed_by: 'admin',
      })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/contacts/[id] error:', err)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}
