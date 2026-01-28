'use client'

import { useState, useEffect, useTransition, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { getStoredProfile, storeProfile, type StoredProfile } from '@/lib/profile'
import { createProfile, createProduct } from '@/lib/actions/products'
import { CATEGORIES } from '@/lib/validation/product'

export default function CreateProductForm() {
  const router = useRouter()
  const [profile, setProfile] = useState<StoredProfile | null>(null)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string>('')

  // 폼 상태
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    // 저장된 프로필 확인
    const stored = getStoredProfile()
    setProfile(stored)
  }, [])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      let sellerId = profile?.id

      // 프로필이 없으면 먼저 생성
      if (!profile) {
        const username = formData.get('username') as string
        const location = formData.get('location') as string

        if (!username || username.trim().length < 2) {
          setError('사용자 이름은 최소 2자 이상이어야 합니다')
          return
        }

        const profileResult = await createProfile({ username, location })

        if (!profileResult.success) {
          setError(profileResult.error)
          return
        }

        // 프로필 저장
        storeProfile(profileResult.data)
        setProfile(profileResult.data)
        sellerId = profileResult.data.id
      }

      // 상품 생성
      const categoryValue = formData.get('category') as string
      const productData = {
        title: formData.get('title') as string,
        description: (formData.get('description') as string) || undefined,
        price: Number(formData.get('price')),
        category: categoryValue ? (categoryValue as typeof CATEGORIES[number]) : undefined,
        location: (formData.get('location') as string) || undefined,
        images: (formData.get('images') as string) || undefined,
        sellerId: sellerId!
      }

      const result = await createProduct(productData)

      if (!result.success) {
        setError(result.error)
        return
      }

      // 성공: 홈페이지로 리다이렉트
      router.push('/')
      router.refresh()
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* 프로필이 없으면 프로필 정보 입력 */}
      {!profile && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 space-y-4">
          <h3 className="font-semibold text-gray-900">판매자 정보</h3>

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              사용자 이름 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="username"
              name="username"
              required
              minLength={2}
              maxLength={20}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="예: 고구마팔아요"
            />
            <p className="text-xs text-gray-500 mt-1">2-20자, 한글/영문/숫자/밑줄 사용 가능</p>
          </div>

          <div>
            <label htmlFor="profile-location" className="block text-sm font-medium text-gray-700 mb-1">
              거래 지역
            </label>
            <input
              type="text"
              id="profile-location"
              name="location"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="예: 서울시 강남구"
            />
          </div>
        </div>
      )}

      {/* 상품 정보 */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">상품 정보</h3>

        {/* 제목 */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            제목 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            maxLength={100}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="상품 제목을 입력하세요"
          />
          <p className="text-xs text-gray-500 mt-1">{title.length}/100자</p>
        </div>

        {/* 카테고리 */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            카테고리
          </label>
          <select
            id="category"
            name="category"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">선택 안함</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* 가격 */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
            가격 <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              id="price"
              name="price"
              required
              min={0}
              step={1000}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="0"
            />
            <span className="absolute right-3 top-2 text-gray-500">원</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">0원 이상 입력 (무료 나눔은 0원)</p>
        </div>

        {/* 설명 */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            설명
          </label>
          <textarea
            id="description"
            name="description"
            maxLength={1000}
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="상품 설명을 입력하세요"
          />
          <p className="text-xs text-gray-500 mt-1">{description.length}/1000자</p>
        </div>

        {/* 거래 지역 */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            거래 지역
          </label>
          <input
            type="text"
            id="location"
            name="location"
            defaultValue={profile?.location || ''}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="예: 서울시 강남구"
          />
        </div>

        {/* 이미지 URL */}
        <div>
          <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-1">
            이미지 URL
          </label>
          <input
            type="text"
            id="images"
            name="images"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="https://example.com/image.jpg"
          />
          <p className="text-xs text-gray-500 mt-1">
            여러 이미지는 쉼표(,)로 구분하세요. 예: url1, url2, url3
          </p>
        </div>
      </div>

      {/* 제출 버튼 */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
          disabled={isPending}
        >
          취소
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 px-4 py-3 bg-primary text-white rounded-md hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? '등록 중...' : '상품 등록'}
        </button>
      </div>
    </form>
  )
}
