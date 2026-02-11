import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { publicRegistrationSchema } from '@/lib/validators'

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 })
    return true
  }

  if (entry.count >= 10) {
    return false
  }

  entry.count++
  return true
}

// Clean up old entries periodically (every 5 minutes)
setInterval(() => {
  const now = Date.now()
  for (const [ip, entry] of rateLimitMap.entries()) {
    if (now > entry.resetAt) {
      rateLimitMap.delete(ip)
    }
  }
}, 300_000)

function getCorsHeaders() {
  const teaserUrl = process.env.NEXT_PUBLIC_TEASER_URL || '*'
  return {
    'Access-Control-Allow-Origin': teaserUrl,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(),
  })
}

export async function POST(request: NextRequest) {
  const corsHeaders = getCorsHeaders()

  try {
    // Rate limiting
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded?.split(',')[0]?.trim() || 'unknown'

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Troppe richieste. Riprova tra un minuto.' },
        { status: 429, headers: corsHeaders }
      )
    }

    const body = await request.json()

    // Validate input
    const parsed = publicRegistrationSchema.safeParse(body)
    if (!parsed.success) {
      const errors = parsed.error.flatten()
      return NextResponse.json(
        { error: 'Dati non validi', details: errors },
        { status: 400, headers: corsHeaders }
      )
    }

    const { first_name, email, phone, gdpr_consent } = parsed.data

    // Use admin client to bypass RLS
    const supabase = createAdminClient()

    // Check if contact already exists by email
    const { data: existing } = await supabase
      .from('contacts')
      .select('id, first_name')
      .eq('email', email)
      .maybeSingle()

    let contactId: string

    if (existing) {
      // Update existing contact
      const { data: updated, error: updateError } = await supabase
        .from('contacts')
        .update({
          first_name,
          phone: phone || existing.first_name ? undefined : null,
          subscribed_to_mailing: true,
          gdpr_consent: true,
          gdpr_consent_date: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select('id')
        .single()

      if (updateError) {
        console.error('Error updating contact:', updateError)
        return NextResponse.json(
          { error: 'Errore durante la registrazione' },
          { status: 500, headers: corsHeaders }
        )
      }

      contactId = updated.id
    } else {
      // Create new contact
      const { data: created, error: createError } = await supabase
        .from('contacts')
        .insert({
          first_name,
          email,
          phone: phone || null,
          source: 'website_form',
          status: 'lead',
          subscribed_to_mailing: true,
          gdpr_consent: true,
          gdpr_consent_date: new Date().toISOString(),
          photo_consent: false,
        })
        .select('id')
        .single()

      if (createError) {
        console.error('Error creating contact:', createError)
        // Check for unique constraint violation
        if (createError.code === '23505') {
          return NextResponse.json(
            { error: 'Questo indirizzo email è già registrato' },
            { status: 409, headers: corsHeaders }
          )
        }
        return NextResponse.json(
          { error: 'Errore durante la registrazione' },
          { status: 500, headers: corsHeaders }
        )
      }

      contactId = created.id
    }

    // Log activity
    await supabase.from('activity_log').insert({
      action: existing ? 'contact.updated_via_form' : 'contact.created_via_form',
      entity_type: 'contact',
      entity_id: contactId,
      description: existing
        ? `Contatto aggiornato dal form pubblico: ${first_name} (${email})`
        : `Nuova registrazione dal form pubblico: ${first_name} (${email})`,
      performed_by: 'public_form',
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Registrazione completata con successo',
        isNew: !existing,
      },
      { status: existing ? 200 : 201, headers: corsHeaders }
    )
  } catch (err) {
    console.error('POST /api/registration error:', err)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500, headers: getCorsHeaders() }
    )
  }
}
