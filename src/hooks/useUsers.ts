import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { UserProfile } from '@/lib/types'

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('display_name')
      
      if (error) throw error
      return data as UserProfile[]
    },
  })
}

export function useSearchUsers(searchTerm: string) {
  return useQuery({
    queryKey: ['users', 'search', searchTerm],
    queryFn: async () => {
      if (!searchTerm || searchTerm.length < 2) return []
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .or(`display_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,username.ilike.%${searchTerm}%`)
        .order('display_name')
        .limit(10)
      
      if (error) throw error
      return data as UserProfile[]
    },
    enabled: searchTerm.length >= 2,
  })
}

export function useCurrentUserProfile() {
  return useQuery({
    queryKey: ['current-user-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (error) {
        // If profile doesn't exist, create it
        if (error.code === 'PGRST116') {
          const { data: newProfile, error: createError } = await supabase
            .from('user_profiles')
            .insert([{
              id: user.id,
              email: user.email!,
              display_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
            }])
            .select()
            .single()
          
          if (createError) throw createError
          return newProfile as UserProfile
        }
        throw error
      }
      
      return data as UserProfile
    },
  })
}