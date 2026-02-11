'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError('Email o password non validi.')
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream">
      <div className="w-full max-w-sm border border-stone bg-card-bg p-8">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-3xl font-light tracking-[0.15em] text-warm-text">
            EVA
          </h1>
          <p className="mt-2 font-body text-sm text-warm-muted">
            Accedi al pannello di gestione
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block font-body text-xs font-medium text-warm-muted"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className={cn(
                'w-full border border-input-border bg-white px-3 py-2',
                'font-sans text-sm text-warm-text',
                'focus:border-input-focus focus:outline-none focus:ring-1 focus:ring-input-focus',
                'placeholder:text-warm-light'
              )}
              placeholder="il-tuo@email.it"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block font-body text-xs font-medium text-warm-muted"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className={cn(
                'w-full border border-input-border bg-white px-3 py-2',
                'font-sans text-sm text-warm-text',
                'focus:border-input-focus focus:outline-none focus:ring-1 focus:ring-input-focus',
                'placeholder:text-warm-light'
              )}
              placeholder="La tua password"
            />
          </div>

          {error && (
            <p className="font-body text-sm text-dusty-rose">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={cn(
              'w-full border border-terracotta py-2',
              'font-sans text-sm text-terracotta',
              'transition-colors duration-150',
              'hover:bg-terracotta hover:text-white',
              'disabled:cursor-not-allowed disabled:opacity-60',
              loading && 'cursor-wait'
            )}
          >
            {loading ? 'Accesso in corso...' : 'Accedi'}
          </button>
        </form>
      </div>
    </div>
  )
}
