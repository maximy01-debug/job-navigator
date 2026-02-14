"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Target, Shield, Users } from "lucide-react"

export default function SelectLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Target className="h-9 w-9 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Job Navigator</h1>
          <p className="text-muted-foreground">로그인 유형을 선택하세요</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Student Login */}
          <Link href="/auth/login">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <Users className="h-10 w-10 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl">학생 로그인</CardTitle>
                <CardDescription>이름과 학생번호로 로그인</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button className="w-full" size="lg">
                  학생으로 로그인
                </Button>
                <p className="text-xs text-muted-foreground mt-4">
                  로드맵 관리, 프로젝트 등록, 일일 목표 설정
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* Admin Login */}
          <Link href="/admin/login">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-red-500">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                    <Shield className="h-10 w-10 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl">관리자 로그인</CardTitle>
                <CardDescription>시스템 관리자 전용</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button className="w-full bg-red-500 hover:bg-red-600" size="lg">
                  관리자로 로그인
                </Button>
                <p className="text-xs text-muted-foreground mt-4">
                  학생 데이터 관리, 사진 업로드, CSV 관리
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
