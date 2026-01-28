import Link from 'next/link'
import CreateProductForm from '@/components/CreateProductForm'

export default function NewProductPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-2xl">
      {/* 헤더 */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          ← 뒤로 가기
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">상품 등록</h1>
        <p className="text-gray-600 mt-2">
          판매하고 싶은 상품 정보를 입력해주세요
        </p>
      </div>

      {/* 폼 */}
      <CreateProductForm />
    </main>
  )
}
