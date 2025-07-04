export type ItemType = 'prompt' | 'rule'

export interface Item {
  id: string
  created_at: string
  content: string
  type: ItemType
  user_id: string
}