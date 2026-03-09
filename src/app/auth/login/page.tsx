"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { signInAsStudent } from "@/lib/supabase/auth"
import { Target, ArrowLeft } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [studentNumber, setStudentNumber] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const result = signInAsStudent(name, studentNumber)

    if (result.success) {
      router.push("/")
      router.refresh()
    } else {
      setError(result.error || "로그인에 실패했습니다.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4">
      <Card className="w-full max-w-md">
        <div className="px-6 pt-4">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            홈으로 돌아가기
          </Link>
        </div>
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Target className="h-7 w-7 text-white" />
            </div>
          </div>
          <div className="text-center">
            <CardTitle className="text-2xl">Job Navigator 로그인</CardTitle>
            <CardDescription>계정에 로그인하여 로드맵을 관리하세요</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                이름
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="김민수"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="studentNumber" className="text-sm font-medium">
                학생번호
              </label>
              <input
                id="studentNumber"
                type="text"
                value={studentNumber}
                onChange={(e) => setStudentNumber(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="1"
                required
              />
              <p className="text-xs text-muted-foreground">
                회원가입 시 등록한 학생번호를 입력하세요
              </p>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "로그인 중..." : "로그인"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">계정이 없으신가요? </span>
            <Link href="/auth/signup" className="text-primary hover:underline font-medium">
              회원가입
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
