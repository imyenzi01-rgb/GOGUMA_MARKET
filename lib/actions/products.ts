'use server'

import { revalidatePath } from 'next/cache'
import { createServiceClient } from '@/lib/supabase/service'
import { profileSchema, productSchema, type ProfileFormData, type ProductFormData } from '@/lib/validation/product'
import { parseImageUrls } from '@/lib/utils'

// 응답 타입
type ActionResponse<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string }

// 사용자 이름 중복 확인
export async function checkUsernameAvailable(username: string): Promise<ActionResponse<boolean>> {
  try {
    const supabase = createServiceClient()

    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .maybeSingle()

    if (error) {
      return { success: false, error: '사용자 이름 확인 중 오류가 발생했습니다' }
    }

    return { success: true, data: data === null }
  } catch (error) {
    console.error('Check username error:', error)
    return { success: false, error: '사용자 이름 확인 중 오류가 발생했습니다' }
  }
}

// 프로필 생성
export async function createProfile(formData: ProfileFormData): Promise<ActionResponse<{ id: string; username: string; location: string }>> {
  try {
    // 유효성 검증
    const validated = profileSchema.parse(formData)

    // 사용자 이름 중복 확인
    const availabilityCheck = await checkUsernameAvailable(validated.username)
    if (!availabilityCheck.success) {
      return { success: false, error: availabilityCheck.error }
    }
    if (!availabilityCheck.data) {
      return { success: false, error: '이미 사용 중인 이름입니다' }
    }

    const supabase = createServiceClient()

    const { data, error } = await supabase
      .from('profiles')
      .insert([{
        username: validated.username,
        location: validated.location || null
      }])
      .select('id, username, location')
      .single()

    if (error) {
      console.error('Create profile error:', error)
      return { success: false, error: '프로필 생성 중 오류가 발생했습니다' }
    }

    return {
      success: true,
      data: {
        id: data.id,
        username: data.username,
        location: data.location || ''
      }
    }
  } catch (error) {
    console.error('Create profile error:', error)
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: '프로필 생성 중 오류가 발생했습니다' }
  }
}

// 상품 생성
export async function createProduct(
  formData: ProductFormData & { sellerId: string }
): Promise<ActionResponse<{ id: string }>> {
  try {
    // 유효성 검증
    const validated = productSchema.parse(formData)

    // 이미지 URL 파싱
    const imageUrls = parseImageUrls(validated.images)

    const supabase = createServiceClient()

    const { data, error } = await supabase
      .from('products')
      .insert([{
        seller_id: formData.sellerId,
        title: validated.title,
        description: validated.description || null,
        price: validated.price,
        category: validated.category || null,
        location: validated.location || null,
        images: imageUrls,
        status: 'available'
      }])
      .select('id')
      .single()

    if (error) {
      console.error('Create product error:', error)
      return { success: false, error: '상품 등록 중 오류가 발생했습니다' }
    }

    // 홈페이지 캐시 갱신
    revalidatePath('/')

    return {
      success: true,
      data: { id: data.id }
    }
  } catch (error) {
    console.error('Create product error:', error)
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: '상품 등록 중 오류가 발생했습니다' }
  }
}
