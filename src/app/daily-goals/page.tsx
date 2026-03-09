"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Circle, Plus, Calendar as CalendarIcon, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { getQuestKey, type DailyGoal } from "@/components/dashboard/daily-quest"
import { getCurrentStudent } from "@/lib/supabase/auth"

// 히스토리 키 (날짜별 과거 기록)
const getHistoryKey = (studentNumber: number) => `daily_goals_history_${studentNumber}`

const getTodayStr = () => new Date().toISOString().split('T')[0]

export default function DailyGoalsPage() {
  const [todayGoals, setTodayGoals] = useState<DailyGoal[]>([])
  const [history, setHistory] = useState<{ date: string; goals: DailyGoal[] }[]>([])
  const [newGoal, setNewGoal] = useState("")
  const [studentNumber, setStudentNumber] = useState<number | null>(null)

  const today = format(new Date(), 'yyyy년 MM월 dd일')

  const loadGoals = (sn: number) => {
    const stored = localStorage.getItem(getQuestKey(sn))
    if (stored) {
      try {
        const parsed: DailyGoal[] = JSON.parse(stored)
        const todayStr = getTodayStr()
        setTodayGoals(parsed.map(g => ({ ...g, date: g.date || todayStr })))
      } catch {}
    } else {
      setTodayGoals([])
    }

    const storedHistory = localStorage.getItem(getHistoryKey(sn))
    if (storedHistory) {
      try { setHistory(JSON.parse(storedHistory)) } catch {}
    } else {
      setHistory([])
    }
  }

  useEffect(() => {
    const student = getCurrentStudent()
    if (student) {
      setStudentNumber(student.student_number)
      loadGoals(student.student_number)
    }

    const handleStorage = () => {
      const s = getCurrentStudent()
      if (s) loadGoals(s.student_number)
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const saveGoals = (updated: DailyGoal[]) => {
    if (!studentNumber) return
    setTodayGoals(updated)
    localStorage.setItem(getQuestKey(studentNumber), JSON.stringify(updated))
    window.dispatchEvent(new Event('storage'))
  }

  const handleAddGoal = () => {
    if (!newGoal.trim()) return
    const goal: DailyGoal = {
      id: Date.now().toString(),
      content: newGoal.trim(),
      isCompleted: false,
      date: getTodayStr(),
    }
    saveGoals([...todayGoals, goal])
    setNewGoal("")
  }

  const handleToggleGoal = (id: string) => {
    saveGoals(todayGoals.map(g => g.id === id ? { ...g, isCompleted: !g.isCompleted } : g))
  }

  const handleDeleteGoal = (id: string) => {
    saveGoals(todayGoals.filter(g => g.id !== id))
  }

  const completedCount = todayGoals.filter(g => g.isCompleted).length
  const progressPercentage = todayGoals.length > 0 ? (completedCount / todayGoals.length) * 100 : 0

  // 잔디 데이터 (최근 30일)
  const grassData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (29 - i))
    const count = Math.random() > 0.3 ? Math.floor(Math.random() * 3) + 1 : 0
    return { date: date.toISOString().split('T')[0], count }
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            📅 일일 목표 관리
          </h1>
          <p className="text-muted-foreground">
            매일의 작은 목표를 달성하며 성장하세요 — 대시보드 '오늘의 퀘스트'와 실시간 동기화됩니다
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
                    <CardDescription>
                      {today}
                      <span className="ml-2 text-xs text-primary font-medium">
                        ↔ 대시보드 '오늘의 퀘스트'와 동기화
                      </span>
                    </CardDescription>
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
                    onKeyDown={(e) => e.key === 'Enter' && handleAddGoal()}
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
                      <button onClick={() => handleToggleGoal(goal.id)} className="flex-shrink-0">
                        {goal.isCompleted ? (
                          <CheckCircle2 className="h-5 w-5 text-secondary" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground" />
                        )}
                      </button>
                      <span className={`flex-1 text-sm ${goal.isCompleted ? 'line-through text-muted-foreground' : ''}`}>
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
                {history.map((h) => {
                  const completed = h.goals.filter(g => g.isCompleted).length
                  const total = h.goals.length
                  const percent = total > 0 ? (completed / total) * 100 : 0
                  return (
                    <div key={h.date} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {format(new Date(h.date + 'T00:00:00'), 'yyyy년 MM월 dd일')}
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

          {/* Right Column */}
          <div className="space-y-6">
            {/* Stats */}
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
                  {grassData.map((day, i) => (
                    <div
                      key={i}
                      className={`aspect-square rounded-sm ${
                        day.count === 0 ? 'bg-muted'
                        : day.count === 1 ? 'bg-secondary/30'
                        : day.count === 2 ? 'bg-secondary/60'
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

            {/* Motivation */}
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
