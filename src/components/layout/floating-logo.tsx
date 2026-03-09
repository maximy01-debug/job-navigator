"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Target } from "lucide-react"

// Header가 이미 로고를 표시하는 페이지 목록
const PAGES_WITH_HEADER = ['/', '/roadmap', '/projects', '/daily-goals', '/consulting', '/mypage']

export function FloatingLogo() {
  const pathname = usePathname()

  // Header가 있는 페이지에서는 중복 표시하지 않음
  const hasHeader = PAGES_WITH_HEADER.some(
    p => pathname === p || (p !== '/' && pathname.startsWith(p))
  )
  if (hasHeader) return null

  return (
    <Link
      href="/"
      className="fixed top-4 left-4 z-[60] flex items-center space-x-2 px-3 py-2 rounded-xl bg-white/90 backdrop-blur shadow-md border hover:shadow-lg transition-shadow"
    >
      <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
        <Target className="h-4 w-4 text-white" />
      </div>
      <span className="text-sm font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        Job Navigator
      </span>
    </Link>
  )
}
