"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Circle, Plus, Calendar as CalendarIcon, Trash2 } from "lucide-react"
import { format } from "date-fns"

interface DailyGoal {
  id: string
  content: string
  isCompleted: boolean
  date: string
}

// Mock data - 동적으로 현재 날짜 기준 생성
const getMockGoalsHistory = () => {
  const now = new Date()
  const formatDate = (date: Date) => date.toISOString().split('T')[0]

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)
  const twoDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2)

  const todayStr = formatDate(today)
  const yesterdayStr = formatDate(yesterday)
  const twoDaysAgoStr = formatDate(twoDaysAgo)

  return [
    {
      date: todayStr,
      goals: [
        { id: '1', content: 'JavaScript 배열 메서드 복습하기', isCompleted: true, date: todayStr },
        { id: '2', content: 'React 컴포넌트 3개 만들기', isCompleted: true, date: todayStr },
        { id: '3', content: '알고리즘 문제 2개 풀기', isCompleted: false, date: todayStr }
      ]
    },
    {
      date: yesterdayStr,
      goals: [
        { id: '4', content: 'CSS Grid 레이아웃 학습', isCompleted: true, date: yesterdayStr },
        { id: '5', content: '프로젝트 README 작성', isCompleted: true, date: yesterdayStr },
        { id: '6', content: 'Git 명령어 정리', isCompleted: true, date: yesterdayStr }
      ]
    },
    {
      date: twoDaysAgoStr,
      goals: [
        { id: '7', content: 'TypeScript 기초 문법', isCompleted: true, date: twoDaysAgoStr },
        { id: '8', content: 'Next.js 튜토리얼 따라하기', isCompleted: false, date: twoDaysAgoStr },
        { id: '9', content: '코드 리뷰 반영', isCompleted: true, date: twoDaysAgoStr }
      ]
    }
  ]
}

export default function DailyGoalsPage() {
  const mockGoalsHistory = getMockGoalsHistory()
  const [todayGoals, setTodayGoals] = useState<DailyGoal[]>(mockGoalsHistory[0].goals)
  const [newGoal, setNewGoal] = useState("")

  const today = format(new Date(), 'yyyy년 MM월 dd일')
  const completedCount = todayGoals.filter(g => g.isCompleted).length
  const progressPercentage = todayGoals.length > 0 ? (completedCount / todayGoals.length) * 100 : 0

  const handleAddGoal = () => {
    if (newGoal.trim()) {
      const goal: DailyGoal = {
        id: Date.now().toString(),
        content: newGoal,
        isCompleted: false,
        date: new Date().toISOString().split('T')[0]
      }
      setTodayGoals([...todayGoals, goal])
      setNewGoal("")
    }
  }

  const handleToggleGoal = (id: string) => {
    setTodayGoals(todayGoals.map(goal =>
      goal.id === id ? { ...goal, isCompleted: !goal.isCompleted } : goal
    ))
  }

  const handleDeleteGoal = (id: string) => {
    setTodayGoals(todayGoals.filter(goal => goal.id !== id))
  }

  // 잔디 심기 데이터 (최근 30일)
  const grassData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (29 - i))
    const completed = Math.random() > 0.3 // 70% 확률로 목표 달성
    return {
      date: date.toISOString().split('T')[0],
      count: completed ? Math.floor(Math.random() * 3) + 1 : 0
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            📅 일일 목표 관리
          </h1>
          <p className="text-muted-foreground">
            매일의 작은 목표를 달성하며 성장하세요
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Today's Goals */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Goals Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>오늘의 목표 🎯</CardTitle>
                    <CardDescription>{today}</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      {completedCount}/{todayGoals.length}
                    </div>
                    <div className="text-xs text-muted-foreground">완료</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress value={progressPercentage} className="h-2" />

                {/* Add Goal Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddGoal()}
                    placeholder="새로운 목표를 입력하세요..."
                    className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                  <Button onClick={handleAddGoal} size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    추가
                  </Button>
                </div>

                {/* Goals List */}
                <div className="space-y-2">
                  {todayGoals.map((goal) => (
                    <div
                      key={goal.id}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                    >
                      <button
                        onClick={() => handleToggleGoal(goal.id)}
                        className="flex-shrink-0"
                      >
                        {goal.isCompleted ? (
                          <CheckCircle2 className="h-5 w-5 text-secondary" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground" />
                        )}
                      </button>
                      <span
                        className={`flex-1 text-sm ${
                          goal.isCompleted
                            ? 'line-through text-muted-foreground'
                            : 'text-foreground'
                        }`}
                      >
                        {goal.content}
                      </span>
                      <button
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </button>
                    </div>
                  ))}
                </div>

                {todayGoals.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <CalendarIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">오늘의 목표를 추가해보세요!</p>
                  </div>
                )}

                {progressPercentage === 100 && todayGoals.length > 0 && (
                  <div className="mt-4 p-4 bg-secondary/10 rounded-lg text-center">
                    <p className="text-sm font-medium text-secondary">
                      🎉 오늘의 모든 목표를 달성했어요!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent History */}
            <Card>
              <CardHeader>
                <CardTitle>최근 목표 기록</CardTitle>
                <CardDescription>지난 며칠간의 목표 달성 현황</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockGoalsHistory.slice(1).map((history) => {
                  const completed = history.goals.filter(g => g.isCompleted).length
                  const total = history.goals.length
                  const percent = (completed / total) * 100

                  return (
                    <div key={history.date} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {format(new Date(history.date), 'yyyy년 MM월 dd일')}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {completed}/{total} 완료
                        </span>
                      </div>
                      <Progress value={percent} className="h-1.5" />
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Stats & Grass */}
          <div className="space-y-6">
            {/* Stats Cards */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">이번 주 통계</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">연속 달성</span>
                  <span className="text-2xl font-bold text-secondary">7일</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">평균 달성률</span>
                  <span className="text-2xl font-bold text-primary">85%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">총 목표 수</span>
                  <span className="text-2xl font-bold">42개</span>
                </div>
              </CardContent>
            </Card>

            {/* Grass Calendar */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">활동 잔디 🌱</CardTitle>
                <CardDescription>최근 30일간의 목표 달성</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-10 gap-1">
                  {grassData.map((day, index) => (
                    <div
                      key={index}
                      className={`aspect-square rounded-sm ${
                        day.count === 0
                          ? 'bg-muted'
                          : day.count === 1
                          ? 'bg-secondary/30'
                          : day.count === 2
                          ? 'bg-secondary/60'
                          : 'bg-secondary'
                      }`}
                      title={`${day.date}: ${day.count}개 완료`}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-end gap-2 mt-4 text-xs text-muted-foreground">
                  <span>적게</span>
                  <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-sm bg-muted" />
                    <div className="w-3 h-3 rounded-sm bg-secondary/30" />
                    <div className="w-3 h-3 rounded-sm bg-secondary/60" />
                    <div className="w-3 h-3 rounded-sm bg-secondary" />
                  </div>
                  <span>많이</span>
                </div>
              </CardContent>
            </Card>

            {/* Motivation Card */}
            <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <div className="text-4xl mb-2">💪</div>
                  <h3 className="font-semibold">계속 도전하세요!</h3>
                  <p className="text-sm text-muted-foreground">
                    작은 목표의 달성이 큰 성장을 만듭니다
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
