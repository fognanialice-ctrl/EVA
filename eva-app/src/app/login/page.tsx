'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()

    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    setLoading(false)

    if (authError) {
      console.error('signInWithOtp error:', authError)
      // Translate common Supabase auth errors to Italian
      if (authError.message.includes('security purposes')) {
        setError('Attendi qualche secondo prima di richiedere un nuovo link.')
      } else if (authError.message.includes('rate limit')) {
        setError('Troppe richieste. Riprova tra un minuto.')
      } else if (authError.message.includes('Email not confirmed')) {
        setError('Email non confermata. Controlla la tua casella di posta.')
      } else {
        setError('Errore nell\'invio del link. Riprova tra poco.')
      }
      return
    }

    setSent(true)
  }

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-cream px-5">
      <div className="w-full max-w-[380px]">
        {/* Logo + Header */}
        <div className="mb-10 flex flex-col items-center text-center">
          <div
            className="mb-5 flex h-[72px] w-[72px] items-center justify-center rounded-[20px]"
            style={{ background: 'rgba(196, 112, 75, 0.1)' }}
          >
            <svg width="36" height="36" viewBox="0 0 192 192" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M96 45C96 45 90 30 102 27" stroke="#7A8B6F" strokeWidth="4" strokeLinecap="round"/>
              <path d="M130 58C142 58 160 72 160 92C160 116 142 140 130 140C124 140 118 134 96 134C74 134 68 140 62 140C50 140 32 116 32 92C32 72 50 58 62 58C70 58 78 68 96 68C114 68 122 58 130 58Z" fill="#C4704B" opacity="0.95"/>
              <path d="M96 68C96 68 93 47 102 35" stroke="#7A8B6F" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 className="font-display text-[26px] font-semibold text-warm-text">
            Bentornata
          </h1>
          <p className="mt-1.5 text-[13px] text-warm-muted">
            Accedi alla tua area personale EVA
          </p>
        </div>

        {sent ? (
          <div
            className="rounded-2xl bg-white p-6 text-center"
            style={{ boxShadow: '0 2px 12px rgba(61,43,31,0.05)', border: '1px solid #DDD3C4' }}
          >
            <div className="mb-3 text-[40px]">✉️</div>
            <h2 className="font-display text-[20px] font-semibold text-warm-text">
              Controlla la tua email
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-warm-muted">
              Ti abbiamo inviato un link magico a{' '}
              <strong className="font-semibold text-warm-text">{email}</strong>.
              <br />Clicca il link per accedere.
            </p>
            <button
              onClick={() => { setSent(false); setEmail('') }}
              className="mt-5 text-[13px] font-medium text-terracotta transition-colors hover:text-terracotta-hover"
            >
              Usa un&apos;altra email
            </button>
          </div>
        ) : (
          <div
            className="rounded-2xl bg-white p-6"
            style={{ boxShadow: '0 2px 12px rgba(61,43,31,0.05)', border: '1px solid #DDD3C4' }}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[1px] text-warm-muted">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="la-tua@email.it"
                  required
                  className="w-full rounded-xl border bg-white px-4 py-3 text-[14px] font-medium text-warm-text placeholder:text-warm-light placeholder:font-normal focus:border-terracotta focus:ring-1 focus:ring-terracotta"
                  style={{ borderColor: '#DDD3C4' }}
                />
              </div>

              {error && (
                <div className="rounded-xl bg-red-50 p-3 text-[13px] text-red-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-[14px] py-3.5 text-[15px] font-semibold text-white transition-all duration-300 active:scale-[0.96] active:opacity-90 disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #C4704B, #B3613E)' }}
              >
                {loading ? 'Invio in corso...' : 'Invia link di accesso'}
              </button>
            </form>
          </div>
        )}

        <p className="mt-8 text-center text-[11px] text-warm-light">
          Riceverai un link di accesso via email.<br />
          Nessuna password necessaria.
        </p>
      </div>
    </main>
  )
}
