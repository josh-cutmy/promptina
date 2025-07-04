export type ItemType = 'prompt' | 'rule'

export interface Item {
  id: string
  created_at: string
  title: string | null
  content: string
  type: ItemType
  user_id: string
}

export interface UserProfile {
  id: string
  email: string
  display_name: string | null
  username: string | null
  avatar_url: string | null
}

export interface SharedItem {
  id: string
  created_at: string
  item_id: string
  shared_by: string
  shared_with: string
  permission: 'read' | 'write'
  message: string | null
  is_active: boolean
}