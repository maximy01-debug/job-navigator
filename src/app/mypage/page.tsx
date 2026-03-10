"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  User, CheckCircle2, Circle, Trophy, FileText,
  TrendingUp, Target, Calendar, BookOpen, Users, Shield, Sparkles
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { getStudentPhoto } from "@/lib/students/storage"
import { DAILY_QUEST_KEY, type DailyGoal } from "@/components/dashboard/daily-quest"
import { format } from "date-fns"

// 다른 컴포넌트에서 쓰는 localStorage 키
const ROADMAP_KEY = 'dashboard_roadmap_progress'
const ACTIVITY_KEY = 'dashboard_activities'

interface GradeProgress {
  grade: number
  title: string
  percentage: number
  description: string
}

interface Activity {
  id: string
  type: 'goal' | 'roadmap' | 'project'
  title: string
  description: string
  timestamp: string
}

const TYPE_LABELS: Record<Activity['type'], string> = {
  goal: '목표 달성',
  roadmap: '로드맵',
  project: '프로젝트',
}
const TYPE_COLORS: Record<Activity['type'], string> = {
  goal: 'bg-secondary/10 text-secondary',
  roadmap: 'bg-primary/10 text-primary',
  project: 'bg-blue-100 text-blue-700',
}

const getActivityIcon = (type: Activity['type']) => {
  if (type === 'goal') return <CheckCircle2 className="h-4 w-4 text-secondary" />
  if (type === 'roadmap') return <Trophy className="h-4 w-4 text-primary" />
  return <FileText className="h-4 w-4 text-blue-500" />
}

interface FeedbackItem {
  projectId: string
  projectTitle: string
  feedback: string
  generatedAt: string
}

export default function MyPage() {
  const router = useRouter()
  const { student, loading: authLoading } = useAuth()
  const [photo, setPhoto] = useState<string | null>(null)
  const [quests, setQuests] = useState<DailyGoal[]>([])
  const [roadmap, setRoadmap] = useState<GradeProgress[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([])

  useEffect(() => {
    if (authLoading) return
    if (!student) {
      router.push('/auth/select')
      return
    }
    const s = student
    setPhoto(getStudentPhoto(s.student_number))

    // 오늘의 퀘스트
    try {
      const q = localStorage.getItem(DAILY_QUEST_KEY)
      if (q) setQuests(JSON.parse(q))
    } catch {}

    // 로드맵 진행 상황
    const defaultRoadmap: GradeProgress[] = [
      { grade: 1, title: '1학년 - 기초 다지기', percentage: 100, description: '기초 자격증 취득, HTML/CSS 학습 완료' },
      { grade: 2, title: '2학년 - 실전 프로젝트 (현재)', percentage: 65, description: 'React 학습 중, 팀 프로젝트 2개 진행' },
      { grade: 3, title: '3학년 - 취업 준비', percentage: 0, description: '포트폴리오 완성, 기업 프로젝트 참여 예정' },
    ]
    try {
      const r = localStorage.getItem(ROADMAP_KEY)
      setRoadmap(r ? JSON.parse(r) : defaultRoadmap)
    } catch { setRoadmap(defaultRoadmap) }

    // 최근 활동
    try {
      const a = localStorage.getItem(ACTIVITY_KEY)
      if (a) setActivities(JSON.parse(a).slice(0, 5))
    } catch {}

    // AI 피드백 로딩 — localStorage에서 직접 읽어 키 타입 불일치를 방지
    try {
      const fbRaw = localStorage.getItem('admin_student_project_feedback')
      const prRaw = localStorage.getItem('admin_student_projects')
      if (fbRaw) {
        const fbAll = JSON.parse(fbRaw)
        // 숫자·문자열 키 둘 다 시도
        const fbList: { projectId: string; feedback: string; generatedAt: string }[] =
          fbAll[s.student_number] ?? fbAll[String(s.student_number)] ?? []

        if (fbList.length > 0) {
          // 프로젝트 제목 보완 (없어도 피드백은 표시)
          const prAll = prRaw ? JSON.parse(prRaw) : {}
          const prList: { id: string; title: string }[] =
            prAll[s.student_number] ?? prAll[String(s.student_number)] ?? []

          const items: FeedbackItem[] = fbList.map(fb => ({
            projectId: fb.projectId,
            projectTitle: prList.find(p => p.id === fb.projectId)?.title ?? '프로젝트',
            feedback: fb.feedback,
            generatedAt: fb.generatedAt,
          }))
          setFeedbackItems(items)
        }
      }
    } catch {}
  }, [student, authLoading, router])

  if (!student) return null

  const completedQuests = quests.filter(q => q.isCompleted).length
  const questProgress = quests.length > 0 ? (completedQuests / quests.length) * 100 : 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* 페이지 타이틀 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1">마이페이지</h1>
          <p className="text-muted-foreground">나의 학습 현황과 목표를 한눈에 확인하세요</p>
        </div>

        {/* ── 프로필 카드 ── */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* 사진 */}
              <div className="h-28 w-28 rounded-full overflow-hidden border-4 border-primary flex-shrink-0 bg-muted flex items-center justify-center">
                {photo
                  ? <img src={photo} alt={student.name} className="h-full w-full object-cover" />
                  : <User className="h-12 w-12 text-muted-foreground" />
                }
              </div>

              {/* 기본 정보 */}
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl font-bold">{student.name}</h2>
                <p className="text-muted-foreground mt-1">
                  {student.department} · {student.class_name} · 학생번호 {student.student_number}
                </p>

                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-muted-foreground">성별</span>
                    <span className="font-medium">{student.gender}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm col-span-2 sm:col-span-1">
                    <BookOpen className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-muted-foreground">동아리</span>
                    <span className="font-medium">{student.clubs_joined || '없음'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-muted-foreground">보호자 동의</span>
                    <span className="font-medium">{student.parent_share_consent === 'Yes' ? '동의' : '미동의'}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* ── 오늘의 퀘스트 ── */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                오늘의 퀘스트
              </CardTitle>
              <CardDescription>
                {completedQuests}/{quests.length} 완료
                <span className="ml-2 text-xs text-primary">↔ 대시보드와 동기화</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Progress value={questProgress} className="h-2" />

              {quests.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-sm text-muted-foreground">아직 등록된 퀘스트가 없습니다</p>
                  <Link href="/">
                    <Button size="sm" variant="outline" className="mt-3">
                      대시보드에서 추가하기
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {quests.map((q) => (
                    <div key={q.id} className="flex items-center gap-3 p-2 rounded-lg">
                      {q.isCompleted
                        ? <CheckCircle2 className="h-4 w-4 text-secondary flex-shrink-0" />
                        : <Circle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      }
                      <span className={`text-sm ${q.isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                        {q.content}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {questProgress === 100 && quests.length > 0 && (
                <div className="p-3 bg-secondary/10 rounded-lg text-center">
                  <p className="text-sm font-medium text-secondary">🎉 오늘 목표 모두 달성!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ── 최근 활동 ── */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                최근 활동
              </CardTitle>
              <CardDescription>최근 5개 기록</CardDescription>
            </CardHeader>
            <CardContent>
              {activities.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-sm text-muted-foreground">아직 활동 기록이 없습니다</p>
                  <Link href="/">
                    <Button size="sm" variant="outline" className="mt-3">
                      대시보드에서 추가하기
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {activities.map((a) => (
                    <div key={a.id} className="flex items-start gap-3">
                      <div className="mt-0.5 flex-shrink-0">{getActivityIcon(a.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-medium">{a.title}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_COLORS[a.type]}`}>
                            {TYPE_LABELS[a.type]}
                          </span>
                        </div>
                        {a.description && (
                          <p className="text-xs text-muted-foreground mt-0.5">{a.description}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {format(new Date(a.timestamp), 'MM월 dd일 HH:mm')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ── 학년별 로드맵 진행 상황 ── */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              학년별 로드맵 진행 상황
            </CardTitle>
            <CardDescription>대시보드에서 수정한 진행률이 반영됩니다</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {roadmap.map((item) => (
              <div key={item.grade}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium">{item.title}</span>
                  <span className={`text-sm font-semibold ${
                    item.percentage === 100 ? 'text-secondary'
                    : item.percentage > 0 ? 'text-primary'
                    : 'text-muted-foreground'
                  }`}>
                    {item.percentage}%
                  </span>
                </div>
                <Progress value={item.percentage} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
              </div>
            ))}

            <div className="pt-2 flex justify-end">
              <Link href="/roadmap">
                <Button variant="outline" size="sm">
                  <Target className="h-4 w-4 mr-2" />
                  로드맵 자세히 보기
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* ── AI 피드백 ── */}
        {feedbackItems.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-500" />
                AI 프로젝트 피드백
              </CardTitle>
              <CardDescription>선생님이 요청한 AI 피드백 결과입니다</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {feedbackItems.map((item) => (
                <div key={item.projectId} className="border rounded-lg overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 border-b border-purple-100">
                    <Sparkles className="h-4 w-4 text-purple-500 flex-shrink-0" />
                    <span className="font-medium text-sm">{item.projectTitle}</span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {format(new Date(item.generatedAt), 'MM월 dd일')} 생성
                    </span>
                  </div>
                  <div className="px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed text-foreground">
                    {item.feedback}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* ── 바로가기 ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href: '/', label: '대시보드', icon: Target },
            { href: '/roadmap', label: '로드맵', icon: TrendingUp },
            { href: '/daily-goals', label: '일일 목표', icon: Calendar },
            { href: '/projects', label: '프로젝트', icon: FileText },
          ].map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}>
              <Card className="hover:border-primary transition-colors cursor-pointer h-full">
                <CardContent className="flex flex-col items-center justify-center py-5 gap-2">
                  <Icon className="h-6 w-6 text-primary" />
                  <span className="text-sm font-medium">{label}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
