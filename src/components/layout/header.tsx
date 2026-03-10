"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Target, LayoutDashboard, FolderKanban, Calendar, LogOut, User, MessageCircle, Menu, X } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

const navigation = [
  { name: '대시보드', href: '/', icon: LayoutDashboard },
  { name: '로드맵', href: '/roadmap', icon: Target },
  { name: '프로젝트', href: '/projects', icon: FolderKanban },
  { name: '일일 목표', href: '/daily-goals', icon: Calendar },
  { name: '컨설팅', href: '/consulting', icon: MessageCircle },
]

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const { student, loading, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSignOut = () => {
    logout()
    router.push("/auth/login")
  }

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Target className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Job Navigator
              </span>
            </Link>

            <button
              className="md:hidden p-2 rounded-md hover:bg-muted"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <nav className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link key={item.name} href={item.href}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      className="flex items-center space-x-2"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Button>
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {loading ? (
              <div className="h-9 w-20 bg-muted animate-pulse rounded-md" />
            ) : student ? (
              <div className="flex items-center space-x-2">
                <Link href="/mypage">
                  <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/70 transition-colors cursor-pointer">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {student.name} ({student.class_name})
                    </span>
                  </div>
                </Link>
                <Link href="/mypage">
                  <Button variant="outline" size="sm">
                    마이페이지
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="flex items-center space-x-1 text-muted-foreground"
                >
                  <LogOut className="h-4 w-4" />
                  <span>로그아웃</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth/select">
                  <Button variant="outline" size="sm">
                    로그인
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm">
                    회원가입
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container mx-auto px-4 py-3 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.name} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className="w-full justify-start flex items-center space-x-2"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Button>
                </Link>
              )
            })}
            {student ? (
              <div className="pt-2 border-t mt-2 space-y-1">
                <Link href="/mypage" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <User className="h-4 w-4 mr-2" />
                    마이페이지
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { handleSignOut(); setMobileMenuOpen(false) }}
                  className="w-full justify-start text-muted-foreground"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  로그아웃
                </Button>
              </div>
            ) : (
              <div className="pt-2 border-t mt-2 flex gap-2">
                <Link href="/auth/select" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">로그인</Button>
                </Link>
                <Link href="/auth/signup" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                  <Button size="sm" className="w-full">회원가입</Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
