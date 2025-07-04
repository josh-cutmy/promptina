'use client'

import { useState, useRef, useEffect } from 'react'
import { UserProfile } from '@/lib/types'
import { useSearchUsers } from '@/hooks/useUsers'
import { Search, X, User } from 'lucide-react'

interface UserSearchProps {
  selectedUsers: UserProfile[]
  onUserSelect: (user: UserProfile) => void
  onUserRemove: (userId: string) => void
  placeholder?: string
}

export default function UserSearch({ 
  selectedUsers, 
  onUserSelect, 
  onUserRemove,
  placeholder = "Type @ to search users..."
}: UserSearchProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { data: searchResults = [], isLoading } = useSearchUsers(searchTerm)

  // Filter out already selected users
  const filteredResults = searchResults.filter(
    user => !selectedUsers.some(selected => selected.id === user.id)
  )

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    setShowDropdown(value.length >= 2)
  }

  const handleUserClick = (user: UserProfile) => {
    onUserSelect(user)
    setSearchTerm('')
    setShowDropdown(false)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === '@' && searchTerm === '') {
      setShowDropdown(true)
    }
  }

  return (
    <div className="space-y-3">
      {/* Selected Users */}
      {selectedUsers.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
            >
              <User size={14} />
              <span>{user.display_name || user.email}</span>
              <button
                onClick={() => onUserRemove(user.id)}
                className="hover:bg-blue-200 rounded-full p-0.5"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => searchTerm.length >= 2 && setShowDropdown(true)}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Dropdown */}
        {showDropdown && (
          <div
            ref={dropdownRef}
            className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto"
          >
            {isLoading ? (
              <div className="px-4 py-2 text-gray-500">Searching...</div>
            ) : filteredResults.length > 0 ? (
              filteredResults.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleUserClick(user)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-3"
                >
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <User size={16} className="text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900">
                      {user.display_name || 'No name'}
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                      {user.email}
                    </div>
                  </div>
                </button>
              ))
            ) : searchTerm.length >= 2 ? (
              <div className="px-4 py-2 text-gray-500">No users found</div>
            ) : (
              <div className="px-4 py-2 text-gray-500">Type @ or start typing to search</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}