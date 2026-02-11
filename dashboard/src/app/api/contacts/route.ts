import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { contactSchema } from '@/lib/validators'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const source = searchParams.get('source') || ''
    const tag = searchParams.get('tag') || ''

    let query = supabase
      .from('contacts')
      .select('*, contact_tags(tag_id, tags(*))')
      .order('created_at', { ascending: false })

    if (search) {
      query = query.or(
        `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%,city.ilike.%${search}%`
      )
    }

    if (status) {
      query = query.eq('status', status)
    }

    if (source) {
      query = query.eq('source', source)
    }

    const { data: contacts, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Flatten tags from contact_tags join
    const contactsWithTags = (contacts || []).map((contact) => {
      const tags = (contact.contact_tags || [])
        .map((ct: { tags: unknown }) => ct.tags)
        .filter(Boolean)
      const { contact_tags: _, ...rest } = contact
      return { ...rest, tags }
    })

    // Filter by tag if specified (must be done after fetching due to many-to-many)
    let filtered = contactsWithTags
    if (tag) {
      filtered = contactsWithTags.filter((c) =>
        c.tags.some((t: { id: string }) => t.id === tag)
      )
    }

    return NextResponse.json({ contacts: filtered })
  } catch (err) {
    console.error('GET /api/contacts error:', err)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const parsed = contactSchema.safeParse(body)
    if (!parsed.success) {
      const errors = parsed.error.flatten()
      return NextResponse.json(
        { error: 'Dati non validi', details: errors },
        { status: 400 }
      )
    }

    const contactData = parsed.data

    // Set GDPR consent date if consent is given
    if (contactData.gdpr_consent && !contactData.gdpr_consent_date) {
      contactData.gdpr_consent_date = new Date().toISOString()
    }

    const { data: contact, error } = await supabase
      .from('contacts')
      .insert(contactData)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Log activity
    await supabase.from('activity_log').insert({
      action: 'contact.created',
      entity_type: 'contact',
      entity_id: contact.id,
      description: `Contatto creato: ${contact.first_name}${contact.last_name ? ' ' + contact.last_name : ''}`,
      performed_by: 'admin',
    })

    return NextResponse.json({ contact }, { status: 201 })
  } catch (err) {
    console.error('POST /api/contacts error:', err)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}
