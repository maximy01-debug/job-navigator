"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Circle, Trophy, FileText } from "lucide-react"
import { format } from "date-fns"

interface Activity {
  id: string
  type: 'goal' | 'roadmap' | 'project'
  title: string
  description: string
  timestamp: Date
  completed?: boolean
}

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'goal',
    title: '오늘의 목표 달성',
    description: 'Python 기초 문법 학습 완료',
    timestamp: new Date(2024, 1, 14, 14, 30),
    completed: true
  },
  {
    id: '2',
    type: 'project',
    title: '프로젝트 업로드',
    description: '날씨 앱 프로젝트 포트폴리오 추가',
    timestamp: new Date(2024, 1, 13, 16, 0),
    completed: true
  },
  {
    id: '3',
    type: 'roadmap',
    title: '로드맵 목표 완료',
    description: '정보처리기능사 필기 시험 합격',
    timestamp: new Date(2024, 1, 12, 10, 0),
    completed: true
  }
]

export function ActivityFeed() {
  const getActivityIcon = (type: Activity['type'], completed?: boolean) => {
    if (type === 'goal') {
      return completed ? (
        <CheckCircle2 className="h-5 w-5 text-secondary" />
      ) : (
        <Circle className="h-5 w-5 text-muted-foreground" />
      )
    }
    if (type === 'roadmap') return <Trophy className="h-5 w-5 text-primary" />
    return <FileText className="h-5 w-5 text-accent" />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>최근 활동</CardTitle>
        <CardDescription>나의 최근 학습 및 프로젝트 기록</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockActivities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4">
              <div className="mt-1">
                {getActivityIcon(activity.type, activity.completed)}
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{activity.title}</p>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
                <p className="text-xs text-muted-foreground">
                  {format(activity.timestamp, 'yyyy년 MM월 dd일 HH:mm')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
