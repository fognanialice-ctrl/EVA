'use client'

import { useState } from 'react'
import { X, Plus, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTags } from '@/hooks/useContacts'
import { useToast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Tag } from '@/types'

interface ContactTagsProps {
  contactId: string
  tags: Tag[]
  onUpdate: () => void
}

const TAG_COLORS = [
  '#C67A5C', '#8B7355', '#6B8E6B', '#5B7E9E',
  '#9B6B8E', '#C4956A', '#7B8E6B', '#6B7E9B',
]

export function ContactTags({ contactId, tags, onUpdate }: ContactTagsProps) {
  const { tags: allTags, mutate: mutateTags } = useTags()
  const { toast } = useToast()

  const [showDropdown, setShowDropdown] = useState(false)
  const [showNewForm, setShowNewForm] = useState(false)
  const [newTagName, setNewTagName] = useState('')
  const [newTagColor, setNewTagColor] = useState(TAG_COLORS[0])
  const [creating, setCreating] = useState(false)

  const currentTagIds = new Set(tags.map((t) => t.id))
  const availableTags = allTags.filter((t) => !currentTagIds.has(t.id))

  async function removeTag(tagId: string) {
    try {
      const res = await fetch(`/api/contacts/${contactId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _action: 'remove_tag', tag_id: tagId }),
      })

      if (!res.ok) {
        const json = await res.json()
        toast('error', json.error || 'Errore nella rimozione del tag')
        return
      }

      onUpdate()
    } catch {
      toast('error', 'Errore di rete')
    }
  }

  async function addTag(tagId: string) {
    try {
      const res = await fetch(`/api/contacts/${contactId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _action: 'add_tag', tag_id: tagId }),
      })

      if (!res.ok) {
        const json = await res.json()
        toast('error', json.error || 'Errore nell\'aggiunta del tag')
        return
      }

      setShowDropdown(false)
      onUpdate()
    } catch {
      toast('error', 'Errore di rete')
    }
  }

  async function createAndAddTag() {
    if (!newTagName.trim()) return

    setCreating(true)
    try {
      const res = await fetch('/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newTagName.trim(), color: newTagColor }),
      })

      const json = await res.json()

      if (!res.ok) {
        toast('error', json.error || 'Errore nella creazione del tag')
        return
      }

      await mutateTags()
      await addTag(json.tag.id)

      setNewTagName('')
      setShowNewForm(false)
    } catch {
      toast('error', 'Errore di rete')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="space-y-3">
      {/* Current tags */}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag.id}
            className="inline-flex items-center gap-1.5 rounded-none px-2.5 py-1 text-xs font-sans"
            style={{
              backgroundColor: `${tag.color}20`,
              color: tag.color,
              border: `1px solid ${tag.color}40`,
            }}
          >
            {tag.name}
            <button
              onClick={() => removeTag(tag.id)}
              className="hover:opacity-70 transition-opacity"
              aria-label={`Rimuovi tag ${tag.name}`}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}

        {/* Add tag button */}
        <div className="relative">
          <button
            onClick={() => {
              setShowDropdown(!showDropdown)
              setShowNewForm(false)
            }}
            className={cn(
              'inline-flex items-center gap-1 rounded-none px-2.5 py-1',
              'text-xs font-sans border border-dashed border-stone text-warm-muted',
              'hover:border-terracotta hover:text-terracotta transition-colors'
            )}
          >
            <Plus className="h-3 w-3" />
            Aggiungi tag
          </button>

          {/* Dropdown */}
          {showDropdown && (
            <div className="absolute top-full left-0 mt-1 z-10 w-56 bg-white border border-stone rounded-none shadow-lg">
              {availableTags.length > 0 && (
                <div className="max-h-40 overflow-y-auto">
                  {availableTags.map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => addTag(tag.id)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm font-sans text-warm-text hover:bg-cream-alt/50 transition-colors"
                    >
                      <span
                        className="h-3 w-3 rounded-none flex-shrink-0"
                        style={{ backgroundColor: tag.color }}
                      />
                      {tag.name}
                    </button>
                  ))}
                </div>
              )}

              {availableTags.length > 0 && (
                <div className="border-t border-stone" />
              )}

              {!showNewForm ? (
                <button
                  onClick={() => setShowNewForm(true)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm font-sans text-terracotta hover:bg-cream-alt/50 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Crea nuovo tag
                </button>
              ) : (
                <div className="p-3 space-y-2">
                  <Input
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    placeholder="Nome del tag"
                    className="text-xs"
                  />
                  <div className="flex items-center gap-1.5">
                    {TAG_COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() => setNewTagColor(color)}
                        className={cn(
                          'h-5 w-5 rounded-none border flex items-center justify-center',
                          newTagColor === color
                            ? 'border-warm-text'
                            : 'border-transparent'
                        )}
                        style={{ backgroundColor: color }}
                        aria-label={`Colore ${color}`}
                      >
                        {newTagColor === color && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        setShowNewForm(false)
                        setNewTagName('')
                      }}
                    >
                      Annulla
                    </Button>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={createAndAddTag}
                      loading={creating}
                      disabled={!newTagName.trim()}
                    >
                      Crea
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
