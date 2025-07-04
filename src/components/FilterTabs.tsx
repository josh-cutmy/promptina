'use client'

import { ItemType } from '@/lib/types'

interface FilterTabsProps {
  activeFilter: 'all' | ItemType
  onFilterChange: (filter: 'all' | ItemType) => void
  counts: {
    all: number
    prompt: number
    rule: number
  }
}

export default function FilterTabs({ activeFilter, onFilterChange, counts }: FilterTabsProps) {
  const tabs = [
    { key: 'all' as const, label: 'All', count: counts.all },
    { key: 'prompt' as const, label: 'Prompts', count: counts.prompt },
    { key: 'rule' as const, label: 'Rules', count: counts.rule },
  ]

  return (
    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onFilterChange(tab.key)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            activeFilter === tab.key
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {tab.label}
          {tab.count > 0 && (
            <span className={`ml-2 ${
              activeFilter === tab.key ? 'text-blue-500' : 'text-gray-400'
            }`}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}