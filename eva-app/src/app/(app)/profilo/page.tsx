import { createClient } from '@/lib/supabase/server'
import ProfileForm from './profile-form'

export default async function ProfiloPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Auth is handled by (app)/layout.tsx — user is guaranteed here
  const { data: contact } = await supabase
    .from('contacts')
    .select('*')
    .eq('auth_user_id', user!.id)
    .single()

  if (!contact) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center bg-cream px-6">
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm" style={{ border: '1px solid #DDD3C4' }}>
          <div className="mb-4 text-4xl">🔍</div>
          <h1 className="font-display text-xl font-semibold text-warm-text">
            Profilo non trovato
          </h1>
          <p className="mt-2 text-sm text-warm-muted">
            Non riusciamo a trovare il tuo profilo. Contattaci per assistenza.
          </p>
        </div>
      </main>
    )
  }

  // Calculate profile completion
  const fields = [
    contact.first_name, contact.last_name, contact.email, contact.phone,
    contact.city, contact.date_of_birth, contact.profession,
    contact.instagram_handle, contact.preferred_contact_method,
    contact.dietary_requirements,
  ]
  const filled = fields.filter(Boolean).length
  const completionPercent = Math.round((filled / fields.length) * 100)

  return (
    <main className="min-h-dvh bg-cream">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-cream/95 backdrop-blur-[20px]" style={{ borderBottom: '1px solid #DDD3C4' }}>
        <div className="mx-auto flex max-w-[500px] items-center justify-between px-5 py-3">
          <h1 className="font-display text-lg font-semibold text-warm-text">Il tuo profilo</h1>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="text-[13px] font-medium text-warm-muted transition-colors hover:text-terracotta"
            >
              Esci
            </button>
          </form>
        </div>
      </header>

      <div className="mx-auto max-w-[500px] px-5 pb-8 pt-6">
        {/* Profile header — avatar + name */}
        <div className="flex flex-col items-center pb-2">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-full font-display text-[28px] font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #C4704B, #C9A96E)' }}
          >
            {contact.first_name?.charAt(0)?.toUpperCase()}
          </div>
          <h2 className="mt-3 font-display text-[22px] font-semibold text-warm-text">
            {contact.first_name}{contact.last_name ? ` ${contact.last_name}` : ''}
          </h2>
          <p className="mt-1 text-[13px] font-medium text-terracotta">
            Membro EVA ✦
          </p>
          <p className="mt-1 text-xs text-warm-muted">
            Dal {new Date(contact.created_at).toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Completion bar */}
        {completionPercent < 100 && (
          <div className="mt-5 rounded-2xl bg-white p-[18px]" style={{ boxShadow: '0 2px 12px rgba(61,43,31,0.05)', border: '1px solid #DDD3C4' }}>
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-medium text-warm-text">Profilo completato</p>
              <p className="text-[13px] font-semibold text-terracotta">{completionPercent}%</p>
            </div>
            <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-stone/50">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${completionPercent}%`,
                  background: 'linear-gradient(90deg, #C4704B, #C9A96E)',
                }}
              />
            </div>
            <p className="mt-2 text-[11px] text-warm-muted">
              Completa il tuo profilo per aiutarci a personalizzare la tua esperienza EVA.
            </p>
          </div>
        )}

        {/* Profile form */}
        <div className="mt-5">
          <ProfileForm contact={contact} />
        </div>
      </div>
    </main>
  )
}
