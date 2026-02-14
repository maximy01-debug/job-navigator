"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Circle, Plus, ExternalLink } from "lucide-react"

interface DailyGoal {
  id: string
  content: string
  isCompleted: boolean
}

const mockGoals: DailyGoal[] = [
  { id: '1', content: 'JavaScript 배열 메서드 복습하기', isCompleted: true },
  { id: '2', content: 'React 컴포넌트 3개 만들기', isCompleted: true },
  { id: '3', content: '알고리즘 문제 2개 풀기', isCompleted: false }
]

export function DailyQuest() {
  const [goals, setGoals] = useState<DailyGoal[]>(mockGoals)
  const [showInput, setShowInput] = useState(false)
  const [newGoal, setNewGoal] = useState("")

  const completedCount = goals.filter(g => g.isCompleted).length
  const progressPercentage = goals.length > 0 ? (completedCount / goals.length) * 100 : 0

  const toggleGoal = (id: string) => {
    setGoals(goals.map(goal =>
      goal.id === id ? { ...goal, isCompleted: !goal.isCompleted } : goal
    ))
  }

  const handleAddGoal = () => {
    if (newGoal.trim()) {
      const goal: DailyGoal = {
        id: Date.now().toString(),
        content: newGoal,
        isCompleted: false
      }
      setGoals([...goals, goal])
      setNewGoal("")
      setShowInput(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>오늘의 퀘스트 🎯</span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowInput(!showInput)}
          >
            <Plus className="h-4 w-4 mr-1" />
            추가
          </Button>
        </CardTitle>
        <CardDescription>
          {completedCount}/{goals.length} 완료
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={progressPercentage} className="h-2" />

        {/* 새 목표 추가 입력창 */}
        {showInput && (
          <div className="flex gap-2 p-3 border rounded-lg bg-muted/50">
            <input
              type="text"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddGoal()}
              placeholder="새 목표를 입력하세요..."
              className="flex-1 px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
            <Button size="sm" onClick={handleAddGoal}>
              추가
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setShowInput(false)
                setNewGoal("")
              }}
            >
              취소
            </Button>
          </div>
        )}

        <div className="space-y-3">
          {goals.map((goal) => (
            <div
              key={goal.id}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => toggleGoal(goal.id)}
            >
              {goal.isCompleted ? (
                <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              )}
              <span
                className={`text-sm ${
                  goal.isCompleted
                    ? 'line-through text-muted-foreground'
                    : 'text-foreground'
                }`}
              >
                {goal.content}
              </span>
            </div>
          ))}
        </div>

        {progressPercentage === 100 && goals.length > 0 && (
          <div className="mt-4 p-4 bg-secondary/10 rounded-lg text-center">
            <p className="text-sm font-medium text-secondary">
              🎉 오늘의 모든 목표를 달성했어요!
            </p>
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
