'use client'

import { useState, useRef, useCallback } from 'react'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'
import { contactDisplayName } from '@/lib/utils'
import { Search, UserPlus, Users } from 'lucide-react'
import type { Contact } from '@/types'

interface AddRegistrationDialogProps {
  eventId: string
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

type Mode = 'select' | 'new'

export function AddRegistrationDialog({
  eventId,
  open,
  onClose,
  onSuccess,
}: AddRegistrationDialogProps) {
  const { toast } = useToast()
  const [mode, setMode] = useState<Mode>('select')
  const [loading, setLoading] = useState(false)

  // Contact search state
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Contact[]>([])
  const [searching, setSearching] = useState(false)
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null)

  // New contact state
  const [newContact, setNewContact] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
  })

  // Registration fields
  const [regFields, setRegFields] = useState({
    dietary_requirements: '',
    notes: '',
    plus_one: false,
    plus_one_name: '',
  })

  const fetchContacts = useCallback(async (query: string) => {
    setSearching(true)
    try {
      const url = query
        ? `/api/contacts?search=${encodeURIComponent(query)}`
        : '/api/contacts'
      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        setSearchResults(data.contacts || [])
      }
    } catch {
      // Silently fail search
    } finally {
      setSearching(false)
    }
  }, [])

  function resetForm() {
    setMode('select')
    setSearchQuery('')
    setSearchResults([])
    setSelectedContactId(null)
    setNewContact({ first_name: '', last_name: '', email: '', phone: '' })
    setRegFields({ dietary_requirements: '', notes: '', plus_one: false, plus_one_name: '' })
    setLoading(false)
    setSearching(false)
  }

  function handleClose() {
    resetForm()
    onClose()
  }

  function handleSearchChange(query: string) {
    setSearchQuery(query)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (query.length === 0) {
      setSearchResults([])
      return
    }
    debounceRef.current = setTimeout(() => {
      fetchContacts(query)
    }, 200)
  }

  function handleShowAll() {
    fetchContacts('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const body: Record<string, unknown> = {
        dietary_requirements: regFields.dietary_requirements || null,
        notes: regFields.notes || null,
        plus_one: regFields.plus_one,
        plus_one_name: regFields.plus_one ? (regFields.plus_one_name || null) : null,
        registration_source: 'dashboard',
      }

      if (mode === 'select') {
        if (!selectedContactId) {
          toast('error', 'Seleziona un contatto')
          setLoading(false)
          return
        }
        body.contact_id = selectedContactId
      } else {
        if (!newContact.first_name) {
          toast('error', 'Il nome è obbligatorio')
          setLoading(false)
          return
        }
        if (!newContact.email && !newContact.phone) {
          toast('error', 'Email o telefono è obbligatorio')
          setLoading(false)
          return
        }
        body.new_contact = newContact
      }

      const res = await fetch(`/api/events/${eventId}/registrations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (!res.ok) {
        toast('error', data.error || 'Errore durante la registrazione')
        return
      }

      toast('success', 'Registrazione aggiunta')
      resetForm()
      onSuccess()
    } catch {
      toast('error', 'Errore di rete')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} title="Aggiungi registrazione">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Mode toggle */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setMode('select')
              setSelectedContactId(null)
            }}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-body border rounded-none transition-colors ${
              mode === 'select'
                ? 'border-terracotta text-terracotta bg-terracotta/5'
                : 'border-stone text-warm-muted hover:border-warm-muted'
            }`}
          >
            <Users className="h-4 w-4" />
            Seleziona contatto
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('new')
              setSelectedContactId(null)
              setSearchResults([])
            }}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-body border rounded-none transition-colors ${
              mode === 'new'
                ? 'border-terracotta text-terracotta bg-terracotta/5'
                : 'border-stone text-warm-muted hover:border-warm-muted'
            }`}
          >
            <UserPlus className="h-4 w-4" />
            Nuovo contatto
          </button>
        </div>

        {/* Contact selection mode */}
        {mode === 'select' && (
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-warm-muted" />
              <input
                type="text"
                placeholder="Cerca per nome, email o telefono..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full rounded-none border border-stone bg-white pl-9 pr-3 py-2 text-sm font-body text-warm-text placeholder:text-warm-muted focus:outline-none focus:ring-2 focus:ring-terracotta/40 focus:border-terracotta"
              />
            </div>

            {searching && (
              <p className="text-xs text-warm-muted font-body">Ricerca...</p>
            )}

            {!searching && searchResults.length === 0 && !searchQuery && (
              <button
                type="button"
                onClick={handleShowAll}
                className="text-xs text-terracotta hover:text-terracotta/80 font-body transition-colors"
              >
                Mostra tutti i contatti
              </button>
            )}

            {searchResults.length > 0 && (
              <div className="max-h-48 overflow-y-auto border border-stone rounded-none divide-y divide-stone/50">
                {searchResults.map((contact) => (
                  <button
                    type="button"
                    key={contact.id}
                    onClick={() => setSelectedContactId(contact.id)}
                    className={`w-full text-left px-3 py-2 transition-colors ${
                      selectedContactId === contact.id
                        ? 'bg-terracotta/10 border-l-2 border-l-terracotta'
                        : 'hover:bg-cream-alt'
                    }`}
                  >
                    <p className="text-sm font-body font-medium text-warm-text">
                      {contactDisplayName(contact)}
                    </p>
                    <p className="text-xs text-warm-muted">
                      {contact.email || contact.phone}
                    </p>
                  </button>
                ))}
              </div>
            )}

            {!searching && searchResults.length === 0 && searchQuery && (
              <p className="text-xs text-warm-muted font-body text-center py-3">
                Nessun contatto trovato
              </p>
            )}
          </div>
        )}

        {/* New contact mode */}
        {mode === 'new' && (
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Nome"
              value={newContact.first_name}
              onChange={(e) =>
                setNewContact((prev) => ({ ...prev, first_name: e.target.value }))
              }
              placeholder="Nome"
              required
            />
            <Input
              label="Cognome"
              value={newContact.last_name}
              onChange={(e) =>
                setNewContact((prev) => ({ ...prev, last_name: e.target.value }))
              }
              placeholder="Cognome"
            />
            <Input
              label="Email"
              type="email"
              value={newContact.email}
              onChange={(e) =>
                setNewContact((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder="email@esempio.it"
            />
            <Input
              label="Telefono"
              type="tel"
              value={newContact.phone}
              onChange={(e) =>
                setNewContact((prev) => ({ ...prev, phone: e.target.value }))
              }
              placeholder="+39..."
            />
          </div>
        )}

        {/* Registration optional fields */}
        <div className="border-t border-stone pt-4 space-y-3">
          <p className="text-xs font-sans font-medium uppercase tracking-wider text-warm-muted">
            Dettagli registrazione
          </p>

          <Input
            label="Requisiti dietetici"
            value={regFields.dietary_requirements}
            onChange={(e) =>
              setRegFields((prev) => ({
                ...prev,
                dietary_requirements: e.target.value,
              }))
            }
            placeholder="es. Vegetariana, senza glutine..."
          />

          <Input
            label="Note"
            value={regFields.notes}
            onChange={(e) =>
              setRegFields((prev) => ({ ...prev, notes: e.target.value }))
            }
            placeholder="Eventuali note..."
          />

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={regFields.plus_one}
                onChange={(e) =>
                  setRegFields((prev) => ({
                    ...prev,
                    plus_one: e.target.checked,
                  }))
                }
                className="rounded-none border-stone text-terracotta focus:ring-terracotta/40"
              />
              <span className="text-sm font-body text-warm-text">
                Accompagnatore (+1)
              </span>
            </label>
          </div>

          {regFields.plus_one && (
            <Input
              label="Nome accompagnatore"
              value={regFields.plus_one_name}
              onChange={(e) =>
                setRegFields((prev) => ({
                  ...prev,
                  plus_one_name: e.target.value,
                }))
              }
              placeholder="Nome dell'accompagnatore"
            />
          )}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Annulla
          </Button>
          <Button type="submit" loading={loading}>
            Aggiungi
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
