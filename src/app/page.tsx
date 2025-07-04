'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Item, ItemType } from '@/lib/types'
import { useItems, useCreateItem, useUpdateItem, useDeleteItem } from '@/hooks/useItems'
import { useAuth } from '@/hooks/useAuth'
import Header from '@/components/Header'
import FilterTabs from '@/components/FilterTabs'
import ItemCard from '@/components/ItemCard'
import ItemModal from '@/components/ItemModal'
import ShareModal from '@/components/ShareModal'
import FloatingActionButton from '@/components/FloatingActionButton'

function Home() {
  const [activeFilter, setActiveFilter] = useState<'all' | ItemType>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [sharingItem, setSharingItem] = useState<Item | null>(null)
  const router = useRouter()
  
  // All hooks must be called before any conditional logic
  const { user, loading: authLoading } = useAuth()
  const { data: items = [], isLoading } = useItems()
  const createItem = useCreateItem()
  const updateItem = useUpdateItem()
  const deleteItem = useDeleteItem()

  const filteredItems = useMemo(() => {
    if (activeFilter === 'all') return items
    return items.filter(item => item.type === activeFilter)
  }, [items, activeFilter])

  const counts = useMemo(() => ({
    all: items.length,
    prompt: items.filter(item => item.type === 'prompt').length,
    rule: items.filter(item => item.type === 'rule').length,
  }), [items])

  // Redirect to login if not authenticated (after all hooks)
  if (!authLoading && !user) {
    router.push('/login')
    return null
  }

  const handleSave = async (title: string, content: string, type: ItemType) => {
    if (editingItem) {
      await updateItem.mutateAsync({
        id: editingItem.id,
        title,
        content,
        type,
      })
      setEditingItem(null)
    } else {
      await createItem.mutateAsync({ title, content, type })
    }
    setIsModalOpen(false)
  }

  const handleEdit = (item: Item) => {
    setEditingItem(item)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      await deleteItem.mutateAsync(id)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingItem(null)
  }

  const handleShare = (item: Item) => {
    setSharingItem(item)
    setIsShareModalOpen(true)
  }

  const handleCloseShareModal = () => {
    setIsShareModalOpen(false)
    setSharingItem(null)
  }

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-lg text-gray-600">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <FilterTabs
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            counts={counts}
          />
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">
              {activeFilter === 'all' 
                ? 'No items yet. Create your first prompt or rule!' 
                : `No ${activeFilter}s found.`}
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Your First Item
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {filteredItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onShare={handleShare}
              />
            ))}
          </div>
        )}
      </main>

      <FloatingActionButton onClick={() => setIsModalOpen(true)} />

      <ItemModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        item={editingItem}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={handleCloseShareModal}
        item={sharingItem}
      />
    </div>
  )
}

export const dynamic = 'force-dynamic'

export default Home