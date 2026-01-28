// TypeScript types for Supabase tables

export interface Profile {
  id: string
  username: string
  avatar_url: string | null
  location: string | null
  created_at: string
}

export interface Product {
  id: string
  seller_id: string | null
  title: string
  description: string | null
  price: number
  category: string | null
  location: string | null
  status: 'available' | 'reserved' | 'sold'
  images: string[]
  view_count: number
  created_at: string
  updated_at: string
}

export interface ProductWithProfile extends Product {
  profiles: Profile | null
}
