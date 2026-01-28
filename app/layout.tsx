import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
  title: '고구마마켓 - 우리 동네 중고 직거래',
  description: '당근마켓처럼 쉽고 편한 중고거래',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>
        <header className="bg-white border-b sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/">
              <h1 className="text-2xl font-bold text-primary cursor-pointer">
                🍠 고구마마켓
              </h1>
            </Link>
            <Link
              href="/products/new"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-orange-600 transition"
            >
              상품 등록
            </Link>
          </div>
        </header>
        {children}
      </body>
    </html>
  )
}
