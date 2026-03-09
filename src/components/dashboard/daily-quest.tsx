"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Circle, Plus, ExternalLink, Trash2 } from "lucide-react"

export interface DailyGoal {
  id: string
  content: string
  isCompleted: boolean
  date: string // yyyy-MM-dd
}

export const DAILY_QUEST_KEY = 'dashboard_quests'

// 학생별 키 생성
export function getQuestKey(studentNumber: number): string {
  return `${DAILY_QUEST_KEY}_${studentNumber}`
}

const getTodayStr = () => new Date().toISOString().split('T')[0]

interface DailyQuestProps {
  studentNumber?: number
}

export function DailyQuest({ studentNumber }: DailyQuestProps) {
  const [goals, setGoals] = useState<DailyGoal[]>([])
  const [showInput, setShowInput] = useState(false)
  const [newGoal, setNewGoal] = useState("")

  useEffect(() => {
    if (!studentNumber) return
    const key = getQuestKey(studentNumber)
    const stored = localStorage.getItem(key)
    if (stored) {
      try {
        const parsed: DailyGoal[] = JSON.parse(stored)
        const today = getTodayStr()
        setGoals(parsed.map(g => ({ ...g, date: g.date || today })))
      } catch {}
    }
  }, [studentNumber])

  const saveGoals = (updated: DailyGoal[]) => {
    if (!studentNumber) return
    setGoals(updated)
    localStorage.setItem(getQuestKey(studentNumber), JSON.stringify(updated))
    window.dispatchEvent(new Event('storage'))
  }

  const toggleGoal = (id: string) => {
    saveGoals(goals.map(g => g.id === id ? { ...g, isCompleted: !g.isCompleted } : g))
  }

  const deleteGoal = (id: string) => {
    saveGoals(goals.filter(g => g.id !== id))
  }

  const handleAddGoal = () => {
    if (!newGoal.trim()) return
    const goal: DailyGoal = {
      id: Date.now().toString(),
      content: newGoal.trim(),
      isCompleted: false,
      date: getTodayStr(),
    }
    saveGoals([...goals, goal])
    setNewGoal("")
    setShowInput(false)
  }

  const completedCount = goals.filter(g => g.isCompleted).length
  const progressPercentage = goals.length > 0 ? (completedCount / goals.length) * 100 : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>오늘의 퀘스트 🎯</span>
          <Button size="sm" variant="outline" onClick={() => setShowInput(!showInput)}>
            <Plus className="h-4 w-4 mr-1" />
            추가
          </Button>
        </CardTitle>
        <CardDescription>{completedCount}/{goals.length} 완료</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <Progress value={progressPercentage} className="h-2" />

        {showInput && (
          <div className="flex gap-2 p-3 border rounded-lg bg-muted/50">
            <input
              type="text"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddGoal()}
              placeholder="새 목표를 입력하세요..."
              className="flex-1 px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
            <Button size="sm" onClick={handleAddGoal}>추가</Button>
            <Button size="sm" variant="outline" onClick={() => { setShowInput(false); setNewGoal("") }}>취소</Button>
          </div>
        )}

        <div className="space-y-2">
          {goals.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">
              + 추가 버튼으로 퀘스트를 입력해보세요!
            </p>
          )}
          {goals.map((goal) => (
            <div key={goal.id} className="flex items-center gap-2 p-3 rounded-lg hover:bg-muted/50 transition-colors group">
              <div
                className="flex items-center gap-3 flex-1 cursor-pointer"
                onClick={() => toggleGoal(goal.id)}
              >
                {goal.isCompleted ? (
                  <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                )}
                <span className={`text-sm ${goal.isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                  {goal.content}
                </span>
              </div>
              <button
                onClick={() => deleteGoal(goal.id)}
                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-500 transition-all p-1"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        {progressPercentage === 100 && goals.length > 0 && (
          <div className="p-4 bg-secondary/10 rounded-lg text-center">
            <p className="text-sm font-medium text-secondary">🎉 오늘의 모든 목표를 달성했어요!</p>
          </div>
        )}
      </CardContent>

      <CardFooter className="border-t pt-4">
        <Link href="/roadmap" className="w-full">
          <Button variant="outline" className="w-full">
            <ExternalLink className="h-4 w-4 mr-2" />
            로드맵 자세히 보기
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
