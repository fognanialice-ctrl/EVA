'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { Search, Download, Users, Plus } from 'lucide-react'
import { cn, formatDateShort, contactDisplayName } from '@/lib/utils'
import { CONTACT_STATUSES, CONTACT_SOURCES } from '@/lib/constants'
import { useContacts, useTags } from '@/hooks/useContacts'
import { useDebounce } from '@/hooks/useDebounce'
import { useToast } from '@/components/ui/toast'
import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import { EmptyState } from '@/components/ui/empty-state'
import { PageLoading } from '@/components/ui/loading'
import type { ContactStatus, Tag } from '@/types'

const statusBadgeVariant: Record<ContactStatus, 'lead' | 'pending' | 'confirmed' | 'attended' | 'draft'> = {
  lead: 'lead',
  contacted: 'pending',
  confirmed: 'confirmed',
  attended: 'attended',
  inactive: 'draft',
}

export default function ContactsPage() {
  const { toast } = useToast()
  const { tags } = useTags()

  const [searchInput, setSearchInput] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sourceFilter, setSourceFilter] = useState('')
  const [tagFilter, setTagFilter] = useState('')
  const [exporting, setExporting] = useState(false)

  const debouncedSearch = useDebounce(searchInput, 300)

  const { contacts, isLoading } = useContacts({
    search: debouncedSearch,
    status: statusFilter,
    source: sourceFilter,
    tag: tagFilter,
  })

  const handleExport = useCallback(async () => {
    setExporting(true)
    try {
      const res = await fetch('/api/contacts/export')
      if (!res.ok) {
        toast('error', 'Errore durante l\'esportazione')
        return
      }

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `contatti_eva_${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast('success', 'Esportazione completata')
    } catch {
      toast('error', 'Errore di rete')
    } finally {
      setExporting(false)
    }
  }, [toast])

  function getStatusLabel(status: string) {
    return CONTACT_STATUSES.find((s) => s.value === status)?.label ?? status
  }

  function getSourceLabel(source: string) {
    return CONTACT_SOURCES.find((s) => s.value === source)?.label ?? source
  }

  return (
    <div>
      <PageHeader
        title="Contatti"
        description="Gestisci il tuo CRM contatti"
        action={
          <Link href="/dashboard/contacts/new">
            <Button variant="primary">
              <Plus className="h-4 w-4" />
              Nuovo contatto
            </Button>
          </Link>
        }
      />

      {/* Filters */}
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-warm-muted" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Cerca per nome, email, telefono, citta..."
              className={cn(
                'w-full rounded-none border border-stone bg-white pl-9 pr-3 py-2',
                'text-sm font-sans text-warm-text placeholder:text-warm-muted',
                'focus:outline-none focus:ring-2 focus:ring-terracotta/40 focus:border-terracotta'
              )}
            />
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={cn(
              'rounded-none border border-stone bg-white px-3 py-2',
              'text-sm font-sans text-warm-text',
              'focus:outline-none focus:ring-2 focus:ring-terracotta/40 focus:border-terracotta',
              'appearance-none min-w-[140px]'
            )}
          >
            <option value="">Tutti gli stati</option>
            {CONTACT_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>

          {/* Source filter */}
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className={cn(
              'rounded-none border border-stone bg-white px-3 py-2',
              'text-sm font-sans text-warm-text',
              'focus:outline-none focus:ring-2 focus:ring-terracotta/40 focus:border-terracotta',
              'appearance-none min-w-[140px]'
            )}
          >
            <option value="">Tutte le fonti</option>
            {CONTACT_SOURCES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>

          {/* Tag filter */}
          <select
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            className={cn(
              'rounded-none border border-stone bg-white px-3 py-2',
              'text-sm font-sans text-warm-text',
              'focus:outline-none focus:ring-2 focus:ring-terracotta/40 focus:border-terracotta',
              'appearance-none min-w-[140px]'
            )}
          >
            <option value="">Tutti i tag</option>
            {tags.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          {/* Export */}
          <Button
            variant="secondary"
            onClick={handleExport}
            loading={exporting}
          >
            <Download className="h-4 w-4" />
            Esporta CSV
          </Button>
        </div>
      </Card>

      {/* Content */}
      {isLoading ? (
        <PageLoading />
      ) : contacts.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Nessun contatto"
          description={
            debouncedSearch || statusFilter || sourceFilter || tagFilter
              ? 'Nessun contatto corrisponde ai filtri selezionati'
              : 'Inizia aggiungendo il primo contatto al tuo CRM'
          }
          action={
            !debouncedSearch && !statusFilter && !sourceFilter && !tagFilter ? (
              <Link href="/dashboard/contacts/new">
                <Button variant="primary">
                  <Plus className="h-4 w-4" />
                  Nuovo contatto
                </Button>
              </Link>
            ) : undefined
          }
        />
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefono</TableHead>
                <TableHead>Citta</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead>Fonte</TableHead>
                <TableHead>Tag</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell>
                    <Link
                      href={`/dashboard/contacts/${contact.id}`}
                      className="font-sans font-medium text-warm-text hover:text-terracotta transition-colors"
                    >
                      {contactDisplayName(contact)}
                    </Link>
                  </TableCell>
                  <TableCell className="text-warm-muted">
                    {contact.email || '-'}
                  </TableCell>
                  <TableCell className="text-warm-muted">
                    {contact.phone || '-'}
                  </TableCell>
                  <TableCell className="text-warm-muted">
                    {contact.city || '-'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusBadgeVariant[contact.status] ?? 'default'}>
                      {getStatusLabel(contact.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-warm-muted text-xs">
                    {getSourceLabel(contact.source)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {(contact.tags || []).map((tag: Tag) => (
                        <span
                          key={tag.id}
                          className="inline-block rounded-none px-1.5 py-0.5 text-[10px] font-sans"
                          style={{
                            backgroundColor: `${tag.color}20`,
                            color: tag.color,
                          }}
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-warm-muted text-xs whitespace-nowrap">
                    {formatDateShort(contact.created_at)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  )
}
