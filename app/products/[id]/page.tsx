import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ImageGallery from '@/components/ImageGallery'
import StatusBadge from '@/components/StatusBadge'
import { timeAgo } from '@/lib/utils'
import type { ProductWithProfile } from '@/lib/types'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch product data with seller profile
  const { data: product, error } = await supabase
    .from('products')
    .select('*, profiles(*)')
    .eq('id', id)
    .single()

  if (error || !product) {
    notFound()
  }

  const typedProduct = product as unknown as ProductWithProfile

  // Increment view count (non-blocking)
  supabase
    .from('products')
    .update({ view_count: (typedProduct.view_count || 0) + 1 })
    .eq('id', id)
    .then(() => {})

  return (
    <main className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <svg
          className="w-5 h-5 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        뒤로 가기
      </Link>

      {/* Image gallery */}
      <ImageGallery
        images={typedProduct.images}
        alt={typedProduct.title}
      />

      {/* Product information */}
      <div className="mt-6 space-y-4">
        {/* Status badge */}
        <div>
          <StatusBadge status={typedProduct.status} />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900">
          {typedProduct.title}
        </h1>

        {/* Price */}
        <p className="text-4xl font-bold text-primary">
          {typedProduct.price.toLocaleString('ko-KR')}원
        </p>

        {/* Meta information */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          {typedProduct.category && (
            <>
              <span>{typedProduct.category}</span>
              <span>•</span>
            </>
          )}
          {typedProduct.location && (
            <>
              <span>{typedProduct.location}</span>
              <span>•</span>
            </>
          )}
          <span>{timeAgo(typedProduct.created_at)}</span>
        </div>
      </div>

      {/* Description */}
      {typedProduct.description && (
        <div className="mt-8 pt-8 border-t">
          <h2 className="text-xl font-semibold mb-4">상품 설명</h2>
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
            {typedProduct.description}
          </p>
        </div>
      )}

      {/* Seller information */}
      <div className="mt-8 pt-8 border-t">
        <h2 className="text-xl font-semibold mb-4">판매자 정보</h2>
        <div className="bg-gray-50 rounded-lg p-6 space-y-2">
          <div className="flex items-center gap-3">
            {typedProduct.profiles?.avatar_url ? (
              <img
                src={typedProduct.profiles.avatar_url}
                alt={typedProduct.profiles.username}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-xl">👤</span>
              </div>
            )}
            <div>
              <p className="font-semibold text-lg">
                {typedProduct.profiles?.username || '알 수 없음'}
              </p>
              {typedProduct.profiles?.location && (
                <p className="text-sm text-gray-600">
                  {typedProduct.profiles.location}
                </p>
              )}
            </div>
          </div>
          {typedProduct.profiles?.created_at && (
            <p className="text-sm text-gray-600 pt-2">
              가입일: {timeAgo(typedProduct.profiles.created_at)}
            </p>
          )}
        </div>
      </div>

      {/* View count */}
      <div className="mt-8 pt-8 border-t">
        <p className="text-sm text-gray-600">
          조회 수: {(typedProduct.view_count || 0).toLocaleString('ko-KR')}회
        </p>
      </div>
    </main>
  )
}
