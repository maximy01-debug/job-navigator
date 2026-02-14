"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Circle, Plus } from "lucide-react"

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
  const [goals] = useState<DailyGoal[]>(mockGoals)

  const completedCount = goals.filter(g => g.isCompleted).length
  const progressPercentage = (completedCount / goals.length) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>오늘의 퀘스트 🎯</span>
          <Button size="sm" variant="outline">
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

        <div className="space-y-3">
          {goals.map((goal) => (
            <div
              key={goal.id}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
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

        {progressPercentage === 100 && (
          <div className="mt-4 p-4 bg-secondary/10 rounded-lg text-center">
            <p className="text-sm font-medium text-secondary">
              🎉 오늘의 모든 목표를 달성했어요!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
