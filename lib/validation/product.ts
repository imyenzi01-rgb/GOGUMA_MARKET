import { z } from 'zod'

// 카테고리 목록
export const CATEGORIES = [
  '디지털기기',
  '생활가전',
  '가구/인테리어',
  '유아용품',
  '스포츠/레저',
  '여성의류',
  '남성의류',
  '생활/가공식품',
  '도서',
  '기타'
] as const

// 프로필 스키마
export const profileSchema = z.object({
  username: z.string()
    .min(2, '사용자 이름은 최소 2자 이상이어야 합니다')
    .max(20, '사용자 이름은 최대 20자까지 입력 가능합니다')
    .regex(/^[가-힣a-zA-Z0-9_]+$/, '사용자 이름은 한글, 영문, 숫자, 밑줄만 사용 가능합니다'),
  location: z.string().optional()
})

// 상품 스키마
export const productSchema = z.object({
  title: z.string()
    .min(1, '제목을 입력해주세요')
    .max(100, '제목은 최대 100자까지 입력 가능합니다'),
  description: z.string()
    .max(1000, '설명은 최대 1000자까지 입력 가능합니다')
    .optional(),
  price: z.number()
    .int('가격은 정수만 입력 가능합니다')
    .min(0, '가격은 0원 이상이어야 합니다')
    .max(999999999, '가격이 너무 큽니다'),
  category: z.enum(CATEGORIES).optional(),
  location: z.string().optional(),
  images: z.string().optional() // 쉼표로 구분된 URL 문자열
})

// 이미지 URL 스키마
export const imageUrlSchema = z.string().url('올바른 URL 형식이 아닙니다')

// 타입 export
export type ProfileFormData = z.infer<typeof profileSchema>
export type ProductFormData = z.infer<typeof productSchema>
