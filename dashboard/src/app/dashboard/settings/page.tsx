'use client'

import { useState, useEffect } from 'react'
import { Settings, KeyRound, CreditCard, Database, CheckCircle, XCircle } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/toast'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

export default function SettingsPage() {
  const { toast } = useToast()
  const supabase = createClient()

  const [userEmail, setUserEmail] = useState<string>('')
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [changingPassword, setChangingPassword] = useState(false)
  const [passwordError, setPasswordError] = useState('')

  const [supabaseConnected, setSupabaseConnected] = useState<boolean | null>(null)
  const [paypalConfigured, setPaypalConfigured] = useState<boolean | null>(null)

  // Fetch current user
  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) {
        setUserEmail(user.email)
      }
    }
    fetchUser()
  }, [supabase])

  // Check Supabase connection status
  useEffect(() => {
    async function checkSupabase() {
      try {
        const { error } = await supabase.from('contacts').select('id', { count: 'exact', head: true })
        setSupabaseConnected(!error)
      } catch {
        setSupabaseConnected(false)
      }
    }
    checkSupabase()
  }, [supabase])

  // Check PayPal config status (check if env vars are present via a simple API call)
  useEffect(() => {
    async function checkPaypal() {
      try {
        const res = await fetch('/api/paypal/status')
        if (res.ok) {
          const data = await res.json()
          setPaypalConfigured(data.configured)
        } else {
          // If no status endpoint, assume configured if env vars exist
          // We check by trying to see if the env variable is referenced
          setPaypalConfigured(null)
        }
      } catch {
        setPaypalConfigured(null)
      }
    }
    checkPaypal()
  }, [])

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault()
    setPasswordError('')

    if (newPassword.length < 8) {
      setPasswordError('La password deve avere almeno 8 caratteri')
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Le password non coincidono')
      return
    }

    setChangingPassword(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) {
        setPasswordError(error.message)
        return
      }

      toast('success', 'Password aggiornata con successo')
      setPasswordDialogOpen(false)
      setNewPassword('')
      setConfirmPassword('')
    } catch {
      setPasswordError('Errore durante il cambio password')
    } finally {
      setChangingPassword(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Impostazioni"
        description="Gestisci il tuo profilo e le configurazioni del sistema"
      />

      <div className="space-y-6 max-w-2xl">
        {/* Profile Card */}
        <Card title="Profilo">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-sans text-warm-muted">Email</p>
              <p className="text-sm font-body text-warm-text mt-0.5">
                {userEmail || 'Caricamento...'}
              </p>
            </div>
            <div>
              <p className="text-sm font-sans text-warm-muted">Password</p>
              <div className="mt-1">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setPasswordDialogOpen(true)}
                >
                  <KeyRound className="h-4 w-4" />
                  Cambia password
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* PayPal Card */}
        <Card title="PayPal">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-warm-muted" />
              <div className="flex-1">
                <p className="text-sm font-sans text-warm-text">
                  Configurazione PayPal
                </p>
                <p className="text-xs font-body text-warm-muted mt-0.5">
                  Utilizzato per generare link di pagamento
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                {paypalConfigured === true && (
                  <>
                    <CheckCircle className="h-4 w-4 text-sage" />
                    <span className="text-xs font-body text-sage">Configurato</span>
                  </>
                )}
                {paypalConfigured === false && (
                  <>
                    <XCircle className="h-4 w-4 text-dusty-rose" />
                    <span className="text-xs font-body text-dusty-rose">Non configurato</span>
                  </>
                )}
                {paypalConfigured === null && (
                  <span className="text-xs font-body text-warm-muted">Stato sconosciuto</span>
                )}
              </div>
            </div>
            <p className="text-xs font-body text-warm-muted">
              Le variabili d&apos;ambiente PAYPAL_CLIENT_ID e PAYPAL_CLIENT_SECRET devono essere configurate nel file .env.local
            </p>
          </div>
        </Card>

        {/* Database Card */}
        <Card title="Database">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Database className="h-5 w-5 text-warm-muted" />
              <div className="flex-1">
                <p className="text-sm font-sans text-warm-text">
                  Connessione Supabase
                </p>
                <p className="text-xs font-body text-warm-muted mt-0.5">
                  Database PostgreSQL gestito da Supabase
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                {supabaseConnected === true && (
                  <>
                    <CheckCircle className="h-4 w-4 text-sage" />
                    <span className="text-xs font-body text-sage">Connesso</span>
                  </>
                )}
                {supabaseConnected === false && (
                  <>
                    <XCircle className="h-4 w-4 text-dusty-rose" />
                    <span className="text-xs font-body text-dusty-rose">Non connesso</span>
                  </>
                )}
                {supabaseConnected === null && (
                  <span className="text-xs font-body text-warm-muted">Verifica in corso...</span>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Password change dialog */}
      <Dialog
        open={passwordDialogOpen}
        onClose={() => {
          setPasswordDialogOpen(false)
          setNewPassword('')
          setConfirmPassword('')
          setPasswordError('')
        }}
        title="Cambia password"
      >
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <Input
            label="Nuova password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Minimo 8 caratteri"
          />
          <Input
            label="Conferma password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Ripeti la nuova password"
          />
          {passwordError && (
            <p className="text-xs font-body text-dusty-rose">{passwordError}</p>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setPasswordDialogOpen(false)
                setNewPassword('')
                setConfirmPassword('')
                setPasswordError('')
              }}
            >
              Annulla
            </Button>
            <Button type="submit" loading={changingPassword}>
              Salva
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  )
}
