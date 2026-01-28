import Link from 'next/link'
import { timeAgo } from '@/lib/utils'
import type { Product } from '@/lib/types'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="block border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white"
    >
      {/* 이미지 */}
      <div className="aspect-square relative bg-gray-200 flex items-center justify-center">
        {product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-gray-400 text-4xl">📦</div>
        )}
      </div>

      {/* 내용 */}
      <div className="p-4">
        <h3 className="font-semibold truncate text-gray-900">
          {product.title}
        </h3>
        <p className="text-lg font-bold mt-1 text-gray-900">
          {product.price.toLocaleString('ko-KR')}원
        </p>
        <p className="text-sm text-gray-600 mt-2">
          {product.location || '위치 미지정'} · {timeAgo(product.created_at)}
        </p>
      </div>
    </Link>
  )
}
