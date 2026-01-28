import { createClient } from '@/lib/supabase/server'
import ProductGrid from '@/components/ProductGrid'
import type { Product } from '@/lib/types'

export default async function HomePage() {
  const supabase = await createClient()

  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'available')
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) {
    console.error('Error fetching products:', error)
    return (
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8">우리 동네 중고 직거래</h2>
        <p className="text-red-500 text-center py-16">
          상품을 불러올 수 없습니다.
        </p>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8">우리 동네 중고 직거래</h2>
      <ProductGrid products={(products as Product[]) || []} />
    </main>
  )
}
