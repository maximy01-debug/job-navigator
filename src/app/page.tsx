"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { StatsCard } from "@/components/dashboard/stats-card"
import { DailyQuest } from "@/components/dashboard/daily-quest"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { RoadmapProgress } from "@/components/dashboard/roadmap-progress"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Target, Trophy, Briefcase, Calendar, User } from "lucide-react"
import { getCurrentStudent } from "@/lib/supabase/auth"
import { getStudentPhoto } from "@/lib/students/storage"
import type { Student } from "@/lib/students/data"

export default function DashboardPage() {
  const [student, setStudent] = useState<Student | null>(null)
  const [studentPhoto, setStudentPhoto] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentStudent = getCurrentStudent()
    setStudent(currentStudent)

    if (currentStudent) {
      const photo = getStudentPhoto(currentStudent.student_number)
      setStudentPhoto(photo)
    }

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
            <div className="flex items-center space-x-6">
              {/* Student Photo */}
              <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center overflow-hidden flex-shrink-0 border-4 border-primary">
                {studentPhoto ? (
                  <img
                    src={studentPhoto}
                    alt={student.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-12 w-12 text-muted-foreground" />
                )}
              </div>
              {/* Welcome Message */}
              <div>
                <h1 className="text-3xl font-bold mb-2">안녕하세요, {student.name}님! 👋</h1>
                <p className="text-muted-foreground">
                  {student.department} {student.class_name} | 학생번호: {student.student_number}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  오늘도 성장을 향해 한 걸음 나아가봐요.
                </p>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-bold mb-2">로그인 해주세요 🔐</h1>
              <p className="text-muted-foreground mb-4">
                Job Navigator를 이용하려면 로그인이 필요합니다.
              </p>
              <div className="flex gap-3">
                <Link href="/auth/select">
                  <Button>로그인하기</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button variant="outline">회원가입</Button>
                </Link>
              </div>
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
        <RoadmapProgress />

        {/* D-Day Counter */}
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">다가오는 목표</h3>
                <p className="text-sm text-muted-foreground">
                  팀 프로젝트 참여 마감
                </p>
              </div>
              <div className="text-center">
                {(() => {
                  const now = new Date()
                  const target = new Date(now.getFullYear(), now.getMonth() + 2, 15)
                  const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
                  return (
                    <>
                      <div className="text-4xl font-bold text-primary">D-{diff}</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {target.getFullYear()}년 {target.getMonth() + 1}월 {target.getDate()}일
                      </p>
                    </>
                  )
                })()}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
