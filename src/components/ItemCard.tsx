'use client'

import { useState } from 'react'
import { Item } from '@/lib/types'
import { Copy, Edit, Trash2, Check, Share2 } from 'lucide-react'

interface ItemCardProps {
  item: Item
  onEdit: (item: Item) => void
  onDelete: (id: string) => void
  onShare: (item: Item) => void
}

export default function ItemCard({ item, onEdit, onDelete, onShare }: ItemCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(item.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <div className="group bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden min-h-[300px]">
      {/* Header with title, tag and actions */}
      <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 truncate pr-4">
            {item.title || 'Untitled'}
          </h3>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold flex-shrink-0 ${
            item.type === 'prompt' 
              ? 'bg-blue-100 text-blue-800 border border-blue-300' 
              : 'bg-purple-100 text-purple-800 border border-purple-300'
          }`}>
            {item.type === 'prompt' ? '💬 Prompt' : '📝 Rule'}
          </span>
        </div>
        
        {/* Action buttons - always visible for better UX */}
        <div className="flex items-center justify-end space-x-2">
          <button
            onClick={handleCopy}
            className={`p-2 rounded-lg transition-all duration-200 ${
              copied 
                ? 'text-green-700 bg-green-100 border border-green-300 shadow-sm' 
                : 'text-gray-600 hover:text-blue-700 hover:bg-blue-100 border border-gray-300 hover:border-blue-400 shadow-sm hover:shadow-md'
            }`}
            title="Copy to clipboard"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </button>
          
          <button
            onClick={() => onShare(item)}
            className="p-2 text-gray-600 hover:text-green-700 hover:bg-green-100 border border-gray-300 hover:border-green-400 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
            title="Share"
          >
            <Share2 size={18} />
          </button>
          
          <button
            onClick={() => onEdit(item)}
            className="p-2 text-gray-600 hover:text-blue-700 hover:bg-blue-100 border border-gray-300 hover:border-blue-400 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
            title="Edit"
          >
            <Edit size={18} />
          </button>
          
          <button
            onClick={() => onDelete(item.id)}
            className="p-2 text-gray-600 hover:text-red-700 hover:bg-red-100 border border-gray-300 hover:border-red-400 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      
      {/* Code block content - larger and more spacious */}
      <div className="p-6 bg-gray-900 text-gray-100 min-h-[160px] flex-1">
        <pre className="font-mono text-base whitespace-pre-wrap break-words leading-relaxed text-green-400 max-h-48 overflow-y-auto">
          {item.content}
        </pre>
      </div>
      
      {/* Footer with date - more prominent */}
      <div className="px-6 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600 font-medium">
            📅 {new Date(item.created_at).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
          <div className="text-xs text-gray-500">
            {item.content.length} characters
          </div>
        </div>
      </div>
    </div>
  )
}