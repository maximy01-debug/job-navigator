"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Trophy, FileText, Plus, Trash2, X } from "lucide-react"
import { format } from "date-fns"

interface Activity {
  id: string
  type: 'goal' | 'roadmap' | 'project'
  title: string
  description: string
  timestamp: string // ISO 문자열로 저장
}

const ACTIVITY_KEY_PREFIX = 'dashboard_activities'

export function getActivityKey(studentNumber: number): string {
  return `${ACTIVITY_KEY_PREFIX}_${studentNumber}`
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

interface ActivityFeedProps {
  studentNumber?: number
}

export function ActivityFeed({ studentNumber }: ActivityFeedProps) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [showForm, setShowForm] = useState(false)
  const [newForm, setNewForm] = useState({
    type: 'goal' as Activity['type'],
    title: '',
    description: '',
  })

  useEffect(() => {
    if (!studentNumber) return
    const stored = localStorage.getItem(getActivityKey(studentNumber))
    if (stored) {
      try { setActivities(JSON.parse(stored)) } catch {}
    }
  }, [studentNumber])

  const saveActivities = (updated: Activity[]) => {
    if (!studentNumber) return
    setActivities(updated)
    localStorage.setItem(getActivityKey(studentNumber), JSON.stringify(updated))
  }

  const handleAdd = () => {
    if (!newForm.title.trim()) return
    const activity: Activity = {
      id: Date.now().toString(),
      type: newForm.type,
      title: newForm.title.trim(),
      description: newForm.description.trim(),
      timestamp: new Date().toISOString(),
    }
    saveActivities([activity, ...activities])
    setNewForm({ type: 'goal', title: '', description: '' })
    setShowForm(false)
  }

  const handleDelete = (id: string) => {
    saveActivities(activities.filter(a => a.id !== id))
  }

  const getActivityIcon = (type: Activity['type']) => {
    if (type === 'goal') return <CheckCircle2 className="h-5 w-5 text-secondary" />
    if (type === 'roadmap') return <Trophy className="h-5 w-5 text-primary" />
    return <FileText className="h-5 w-5 text-blue-500" />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>최근 활동</span>
          <Button size="sm" variant="outline" onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-1" />
            추가
          </Button>
        </CardTitle>
        <CardDescription>나의 최근 학습 및 프로젝트 기록</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 활동 추가 폼 */}
        {showForm && (
          <div className="p-4 border rounded-lg bg-muted/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">새 활동 추가</span>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* 유형 선택 */}
            <div className="flex gap-2">
              {(['goal', 'roadmap', 'project'] as const).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setNewForm(f => ({ ...f, type: t }))}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    newForm.type === t
                      ? 'bg-primary text-white border-primary'
                      : 'bg-background text-muted-foreground border-border hover:border-primary'
                  }`}
                >
                  {TYPE_LABELS[t]}
                </button>
              ))}
            </div>

            {/* 제목 */}
            <input
              type="text"
              value={newForm.title}
              onChange={e => setNewForm(f => ({ ...f, title: e.target.value }))}
              placeholder="활동 제목"
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />

            {/* 설명 */}
            <input
              type="text"
              value={newForm.description}
              onChange={e => setNewForm(f => ({ ...f, description: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              placeholder="활동 설명 (선택)"
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <div className="flex gap-2">
              <Button size="sm" onClick={handleAdd} className="flex-1">추가</Button>
              <Button size="sm" variant="outline" onClick={() => setShowForm(false)}>취소</Button>
            </div>
          </div>
        )}

        {/* 활동 목록 */}
        {activities.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-6">
            + 추가 버튼으로 활동을 기록해보세요!
          </p>
        )}

        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 group">
            <div className="mt-1 flex-shrink-0">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-medium leading-none">{activity.title}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_COLORS[activity.type]}`}>
                  {TYPE_LABELS[activity.type]}
                </span>
              </div>
              {activity.description && (
                <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {format(new Date(activity.timestamp), 'yyyy년 MM월 dd일 HH:mm')}
              </p>
            </div>
            {/* 삭제 버튼 */}
            <button
              onClick={() => handleDelete(activity.id)}
              className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-500 transition-all mt-1 flex-shrink-0"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
