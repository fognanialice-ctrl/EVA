import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

function escapeCsvField(field: string | null | undefined): string {
  if (field === null || field === undefined) return ''
  const str = String(field)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: contacts, error } = await supabase
      .from('contacts')
      .select('*, contact_tags(tag_id, tags(name))')
      .order('last_name', { ascending: true })
      .order('first_name', { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const headers = [
      'Nome',
      'Cognome',
      'Email',
      'Telefono',
      'Citta',
      'Stato',
      'Fonte',
      'Tag',
      'Data creazione',
    ]

    const rows = (contacts || []).map((contact) => {
      const tags = (contact.contact_tags || [])
        .map((ct: { tags: { name: string } | null }) => ct.tags?.name)
        .filter(Boolean)
        .join('; ')

      return [
        escapeCsvField(contact.first_name),
        escapeCsvField(contact.last_name),
        escapeCsvField(contact.email),
        escapeCsvField(contact.phone),
        escapeCsvField(contact.city),
        escapeCsvField(contact.status),
        escapeCsvField(contact.source),
        escapeCsvField(tags),
        escapeCsvField(
          contact.created_at
            ? new Date(contact.created_at).toLocaleDateString('it-IT')
            : ''
        ),
      ].join(',')
    })

    const csv = [headers.join(','), ...rows].join('\n')

    const today = new Date().toISOString().split('T')[0]

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="contatti_eva_${today}.csv"`,
      },
    })
  } catch (err) {
    console.error('GET /api/contacts/export error:', err)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}
