"use client"

import { Header } from "@/components/layout/header"
import { TimelineItem } from "@/components/roadmap/timeline-item"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Plus, Target, TrendingUp } from "lucide-react"

// Mock data
const roadmapItems = [
  {
    id: '1',
    grade: 1 as const,
    title: 'HTML/CSS 기초 마스터',
    description: '웹 개발의 기초인 HTML과 CSS를 완벽하게 학습합니다. 반응형 웹 디자인까지 포함.',
    status: 'completed' as const,
    targetDate: new Date(2023, 5, 30)
  },
  {
    id: '2',
    grade: 1 as const,
    title: '정보처리기능사 자격증 취득',
    description: '필기 시험 합격 후 실기 시험 준비 및 합격',
    status: 'completed' as const,
    targetDate: new Date(2023, 8, 15)
  },
  {
    id: '3',
    grade: 1 as const,
    title: 'JavaScript 기초 학습',
    description: '변수, 함수, DOM 조작 등 JavaScript 기본 문법 학습',
    status: 'completed' as const,
    targetDate: new Date(2023, 11, 20)
  },
  {
    id: '4',
    grade: 2 as const,
    title: 'React 프레임워크 학습',
    description: '컴포넌트 기반 개발, Hooks, 상태 관리 학습',
    status: 'in_progress' as const,
    targetDate: new Date(2024, 2, 30)
  },
  {
    id: '5',
    grade: 2 as const,
    title: '팀 프로젝트 참여',
    description: '학교 동아리 웹사이트 리뉴얼 프로젝트 참여',
    status: 'in_progress' as const,
    targetDate: new Date(2024, 4, 15)
  },
  {
    id: '6',
    grade: 2 as const,
    title: '지역 공모전 참가',
    description: '앱/웹 개발 공모전 출품 및 수상 목표',
    status: 'pending' as const,
    targetDate: new Date(2024, 6, 30)
  },
  {
    id: '7',
    grade: 2 as const,
    title: '정보처리산업기사 필기 합격',
    description: '2급 자격증 취득을 위한 필기 시험 합격',
    status: 'pending' as const,
    targetDate: new Date(2024, 8, 10)
  },
  {
    id: '8',
    grade: 3 as const,
    title: '포트폴리오 웹사이트 완성',
    description: '그동안의 프로젝트를 정리한 개인 포트폴리오 사이트 제작',
    status: 'pending' as const,
    targetDate: new Date(2024, 11, 30)
  },
  {
    id: '9',
    grade: 3 as const,
    title: '기업 연계 프로젝트 참여',
    description: '지역 기업과 협력하여 실제 프로젝트 개발 경험',
    status: 'pending' as const,
    targetDate: new Date(2025, 2, 15)
  },
  {
    id: '10',
    grade: 3 as const,
    title: '취업 박람회 참가 및 면접',
    description: '목표 기업 선정 및 채용 프로세스 진행',
    status: 'pending' as const,
    targetDate: new Date(2025, 4, 30)
  }
]

export default function RoadmapPage() {
  const totalItems = roadmapItems.length
  const completedItems = roadmapItems.filter(item => item.status === 'completed').length
  const progressPercentage = (completedItems / totalItems) * 100

  // 학년별 통계
  const gradeStats = [1, 2, 3].map(grade => {
    const gradeItems = roadmapItems.filter(item => item.grade === grade)
    const completed = gradeItems.filter(item => item.status === 'completed').length
    return {
      grade,
      total: gradeItems.length,
      completed,
      percentage: gradeItems.length > 0 ? (completed / gradeItems.length) * 100 : 0
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                <Target className="h-8 w-8 text-primary" />
                나의 3년 취업 로드맵
              </h1>
              <p className="text-muted-foreground">
                특성화고 3년 동안의 성장 목표를 설정하고 관리하세요
              </p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              목표 추가
            </Button>
          </div>
        </div>

        {/* Overall Progress Card */}
        <Card className="mb-8 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              전체 진행 상황
            </CardTitle>
            <CardDescription>
              총 {totalItems}개 목표 중 {completedItems}개 완료
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">전체 달성률</span>
                  <span className="text-2xl font-bold text-primary">
                    {progressPercentage.toFixed(0)}%
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-3" />
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4">
                {gradeStats.map(stat => (
                  <div key={stat.grade} className="text-center p-4 rounded-lg bg-background/50">
                    <div className="text-2xl font-bold mb-1">
                      {stat.percentage.toFixed(0)}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {stat.grade}학년
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {stat.completed}/{stat.total} 완료
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold mb-4">타임라인</h2>

          {roadmapItems.map((item, index) => (
            <TimelineItem
              key={item.id}
              {...item}
              isLast={index === roadmapItems.length - 1}
            />
          ))}
        </div>

        {/* Add Goal CTA */}
        <Card className="mt-8 border-dashed">
          <CardContent className="pt-6 text-center">
            <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">새로운 목표를 추가하세요</h3>
            <p className="text-sm text-muted-foreground mb-4">
              단계별 목표를 설정하면 체계적인 성장이 가능합니다
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              목표 추가하기
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
