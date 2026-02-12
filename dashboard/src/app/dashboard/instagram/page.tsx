'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { PageHeader } from '@/components/layout/page-header'
import { CampaignOverview } from '@/components/instagram/campaign-overview'
import { CampaignCalendar } from '@/components/instagram/campaign-calendar'
import { ContentBank } from '@/components/instagram/content-bank'
import { CoverEditor } from '@/components/instagram/cover-editor'
import { CampaignChecklist } from '@/components/instagram/campaign-checklist'

const TABS = [
  { id: 'overview', label: 'Panoramica' },
  { id: 'calendar', label: 'Calendario' },
  { id: 'content', label: 'Contenuti' },
  { id: 'create', label: 'Crea' },
  { id: 'checklist', label: 'Checklist' },
] as const

type TabId = (typeof TABS)[number]['id']

export default function InstagramPage() {
  const [activeTab, setActiveTab] = useState<TabId>('overview')

  return (
    <div>
      <PageHeader
        title="Da Zero a Comunità"
        description="@evathesanctuary · 14 Marzo 2026 · Genova"
      />

      {/* Tab navigation */}
      <div className="flex border-b border-stone mb-6 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'px-4 py-3 text-sm font-body whitespace-nowrap border-b-2 transition-colors duration-150',
              activeTab === tab.id
                ? 'text-terracotta border-terracotta font-medium'
                : 'text-warm-muted border-transparent hover:text-warm-text'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'overview' && <CampaignOverview />}
      {activeTab === 'calendar' && <CampaignCalendar />}
      {activeTab === 'content' && <ContentBank />}
      {activeTab === 'create' && <CoverEditor />}
      {activeTab === 'checklist' && <CampaignChecklist />}
    </div>
  )
}
