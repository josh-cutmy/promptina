export type ItemType = 'prompt' | 'rule'

export interface Item {
  id: string
  created_at: string
  title: string | null
  content: string
  type: ItemType
  user_id: string
}