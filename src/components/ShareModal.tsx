'use client'

import { useState } from 'react'
import { Item, UserProfile } from '@/lib/types'
import { useShareItem } from '@/hooks/useSharing'
import { X, Share2, Users } from 'lucide-react'
import UserSearch from './UserSearch'

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  item: Item | null
}

export default function ShareModal({ isOpen, onClose, item }: ShareModalProps) {
  const [selectedUsers, setSelectedUsers] = useState<UserProfile[]>([])
  const [message, setMessage] = useState('')
  const [isSharing, setIsSharing] = useState(false)

  const shareItem = useShareItem()

  const handleUserSelect = (user: UserProfile) => {
    if (!selectedUsers.some(selected => selected.id === user.id)) {
      setSelectedUsers([...selectedUsers, user])
    }
  }

  const handleUserRemove = (userId: string) => {
    setSelectedUsers(selectedUsers.filter(user => user.id !== userId))
  }

  const handleShare = async () => {
    if (!item || selectedUsers.length === 0) return

    setIsSharing(true)
    try {
      await shareItem.mutateAsync({
        itemId: item.id,
        userIds: selectedUsers.map(user => user.id),
        message: message.trim() || undefined
      })
      
      // Reset form and close
      setSelectedUsers([])
      setMessage('')
      onClose()
    } catch (error) {
      console.error('Failed to share item:', error)
    } finally {
      setIsSharing(false)
    }
  }

  const handleClose = () => {
    setSelectedUsers([])
    setMessage('')
    onClose()
  }

  if (!isOpen || !item) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Share2 size={24} className="text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Share Item</h2>
              <p className="text-sm text-gray-600">
                Share &quot;{item.title || 'Untitled'}&quot; with other users
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Item Preview */}
          <div className="bg-gray-50 rounded-lg p-4 border">
            <div className="flex items-center gap-2 mb-2">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                item.type === 'prompt' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-purple-100 text-purple-800'
              }`}>
                {item.type === 'prompt' ? '💬 Prompt' : '📝 Rule'}
              </span>
              <span className="font-medium text-gray-900">
                {item.title || 'Untitled'}
              </span>
            </div>
            <div className="text-sm text-gray-600 font-mono bg-white p-2 rounded border max-h-20 overflow-y-auto">
              {item.content.slice(0, 200)}{item.content.length > 200 ? '...' : ''}
            </div>
          </div>

          {/* User Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Users size={16} className="inline mr-2" />
              Share with users
            </label>
            <UserSearch
              selectedUsers={selectedUsers}
              onUserSelect={handleUserSelect}
              onUserRemove={handleUserRemove}
              placeholder="Type @ to search users or start typing a name/email..."
            />
          </div>

          {/* Optional Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Optional message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a note about why you're sharing this..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            onClick={handleShare}
            disabled={selectedUsers.length === 0 || isSharing}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSharing ? 'Sharing...' : `Share with ${selectedUsers.length} user${selectedUsers.length !== 1 ? 's' : ''}`}
          </button>
        </div>
      </div>
    </div>
  )
}