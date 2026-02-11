import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()

    // Fetch all contacts subscribed to mailing, with their tags
    const { data: contacts, error } = await supabase
      .from('contacts')
      .select('email, first_name, last_name, contact_tags(tags(name))')
      .eq('subscribed_to_mailing', true)
      .not('email', 'is', null)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Build CSV (Mailchimp-compatible format)
    const rows: string[] = ['Email Address,First Name,Last Name,Tags']

    for (const contact of contacts || []) {
      const email = (contact.email || '').replace(/"/g, '""')
      const firstName = (contact.first_name || '').replace(/"/g, '""')
      const lastName = (contact.last_name || '').replace(/"/g, '""')

      // Extract tags from the nested join
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const contactTags = (contact as any).contact_tags || []
      const tags = contactTags
        .map((ct: { tags: { name: string } | null }) => ct.tags?.name)
        .filter(Boolean)
        .join(', ')
        .replace(/"/g, '""')

      rows.push(`"${email}","${firstName}","${lastName}","${tags}"`)
    }

    const csv = rows.join('\n')

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="eva_mailing_list.csv"',
      },
    })
  } catch (err) {
    console.error('GET /api/mailing/export error:', err)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}
