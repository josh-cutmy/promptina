import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { SharedItem } from '@/lib/types'

export function useShareItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ 
      itemId, 
      userIds, 
      message 
    }: { 
      itemId: string
      userIds: string[]
      message?: string 
    }) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Create sharing records for each user
      const sharingRecords = userIds.map(userId => ({
        item_id: itemId,
        shared_by: user.id,
        shared_with: userId,
        message: message || null,
        permission: 'read' as const
      }))

      const { data, error } = await supabase
        .from('shared_items')
        .insert(sharingRecords)
        .select()
      
      if (error) throw error
      return data as SharedItem[]
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shared-items'] })
      queryClient.invalidateQueries({ queryKey: ['items-shared-with-me'] })
    },
  })
}

export function useSharedItems() {
  return useQuery({
    queryKey: ['shared-items'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('shared_items')
        .select(`
          *,
          items:item_id (
            id,
            title,
            content,
            type,
            created_at
          ),
          shared_with_user:shared_with (
            id,
            email,
            display_name
          )
        `)
        .eq('shared_by', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    },
  })
}

export function useItemsSharedWithMe() {
  return useQuery({
    queryKey: ['items-shared-with-me'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('shared_items')
        .select(`
          *,
          items:item_id (
            id,
            title,
            content,
            type,
            created_at
          ),
          shared_by_user:shared_by (
            id,
            email,
            display_name
          )
        `)
        .eq('shared_with', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    },
  })
}

export function useUnshareItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (sharedItemId: string) => {
      const { error } = await supabase
        .from('shared_items')
        .update({ is_active: false })
        .eq('id', sharedItemId)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shared-items'] })
      queryClient.invalidateQueries({ queryKey: ['items-shared-with-me'] })
    },
  })
}