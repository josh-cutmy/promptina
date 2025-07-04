'use client'

import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { createContext, useContext, useEffect, useState } from 'react'

const SupabaseContext = createContext<SupabaseClient | null>(null)

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)

  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (supabaseUrl && supabaseAnonKey) {
      const client = createClient(supabaseUrl, supabaseAnonKey)
      setSupabase(client)
    }
  }, [])

  return (
    <SupabaseContext.Provider value={supabase}>
      {children}
    </SupabaseContext.Provider>
  )
}

export function useSupabase() {
  const context = useContext(SupabaseContext)
  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseProvider')
  }
  return context
}