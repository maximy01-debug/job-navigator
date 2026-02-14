"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { StatsCard } from "@/components/dashboard/stats-card"
import { DailyQuest } from "@/components/dashboard/daily-quest"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Target, Trophy, Briefcase, Calendar, TrendingUp } from "lucide-react"
import { getCurrentStudent } from "@/lib/supabase/auth"
import type { Student } from "@/lib/students/data"

export default function DashboardPage() {
  const [student, setStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentStudent = getCurrentStudent()
    setStudent(currentStudent)
    setLoading(false)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          {loading ? (
            <h1 className="text-3xl font-bold mb-2">로딩 중...</h1>
          ) : student ? (
            <>
              <h1 className="text-3xl font-bold mb-2">안녕하세요, {student.name}님! 👋</h1>
              <p className="text-muted-foreground">
                {student.department} {student.class_name} - 오늘도 성장을 향해 한 걸음 나아가봐요.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold mb-2">로그인 해주세요 🔐</h1>
              <p className="text-muted-foreground mb-4">
                Job Navigator를 이용하려면 로그인이 필요합니다.
              </p>
              <Link href="/auth/login">
                <Button>로그인하기</Button>
              </Link>
            </>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatsCard
            title="전체 로드맵 달성률"
            value="68%"
            description="12개 중 8개 완료"
            icon={Target}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="이번 달 목표 달성"
            value="24일"
            description="목표 달성 연속 기록"
            icon={Calendar}
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="포트폴리오 프로젝트"
            value="7개"
            description="최근 1개 추가됨"
            icon={Briefcase}
          />
          <StatsCard
            title="취득 자격증"
            value="3개"
            description="정보처리기능사 외 2개"
            icon={Trophy}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          <DailyQuest />
          <ActivityFeed />
        </div>

        {/* Roadmap Progress Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>학년별 로드맵 진행 상황</span>
            </CardTitle>
            <CardDescription>3년 계획 중 현재 위치를 확인하세요</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">1학년 - 기초 다지기</span>
                <span className="text-sm text-muted-foreground">100%</span>
              </div>
              <Progress value={100} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                기초 자격증 취득, HTML/CSS 학습 완료
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">2학년 - 실전 프로젝트 (현재)</span>
                <span className="text-sm text-primary font-semibold">65%</span>
              </div>
              <Progress value={65} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                React 학습 중, 팀 프로젝트 2개 진행
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">3학년 - 취업 준비</span>
                <span className="text-sm text-muted-foreground">0%</span>
              </div>
              <Progress value={0} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                포트폴리오 완성, 기업 프로젝트 참여 예정
              </p>
            </div>

            <div className="pt-4 flex justify-end">
              <Button>
                <Target className="h-4 w-4 mr-2" />
                로드맵 자세히 보기
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* D-Day Counter */}
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">다가오는 목표</h3>
                <p className="text-sm text-muted-foreground">
                  정보처리산업기사 필기 시험
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">D-30</div>
                <p className="text-xs text-muted-foreground mt-1">2024년 3월 15일</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
