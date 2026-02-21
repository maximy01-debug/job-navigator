"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Target, TrendingUp, Edit2, Check, X } from "lucide-react"

interface GradeProgress {
  grade: number
  title: string
  percentage: number
  description: string
}

const STORAGE_KEY = 'dashboard_roadmap_progress'

const defaultProgress: GradeProgress[] = [
  { grade: 1, title: '1학년 - 기초 다지기', percentage: 100, description: '기초 자격증 취득, HTML/CSS 학습 완료' },
  { grade: 2, title: '2학년 - 실전 프로젝트 (현재)', percentage: 65, description: 'React 학습 중, 팀 프로젝트 2개 진행' },
  { grade: 3, title: '3학년 - 취업 준비', percentage: 0, description: '포트폴리오 완성, 기업 프로젝트 참여 예정' },
]

export function RoadmapProgress() {
  const [progress, setProgress] = useState<GradeProgress[]>(defaultProgress)
  const [editingIdx, setEditingIdx] = useState<number | null>(null)
  const [editForm, setEditForm] = useState<GradeProgress | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try { setProgress(JSON.parse(stored)) } catch {}
    }
  }, [])

  const saveProgress = (updated: GradeProgress[]) => {
    setProgress(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }

  const startEdit = (idx: number) => {
    setEditingIdx(idx)
    setEditForm({ ...progress[idx] })
  }

  const cancelEdit = () => {
    setEditingIdx(null)
    setEditForm(null)
  }

  const saveEdit = () => {
    if (editingIdx === null || !editForm) return
    const updated = [...progress]
    updated[editingIdx] = editForm
    saveProgress(updated)
    setEditingIdx(null)
    setEditForm(null)
  }

  const getPercentageColor = (pct: number) => {
    if (pct === 100) return 'text-secondary font-semibold'
    if (pct > 0) return 'text-primary font-semibold'
    return 'text-muted-foreground'
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5" />
          <span>학년별 로드맵 진행 상황</span>
        </CardTitle>
        <CardDescription>각 항목 오른쪽 ✏️ 버튼을 눌러 수정할 수 있습니다</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {progress.map((item, idx) => (
          <div key={item.grade}>
            {editingIdx === idx ? (
              /* ── 편집 모드 ── */
              <div className="space-y-3 p-4 border-2 border-primary/30 rounded-lg bg-primary/5">
                {/* 제목 */}
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground font-medium">제목</label>
                  <input
                    value={editForm?.title ?? ''}
                    onChange={e => setEditForm(f => f ? { ...f, title: e.target.value } : f)}
                    className="w-full px-3 py-2 text-sm font-medium border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* 진행률 슬라이더 */}
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground font-medium">
                    진행률 — <span className="text-primary font-bold">{editForm?.percentage}%</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={editForm?.percentage ?? 0}
                    onChange={e => setEditForm(f => f ? { ...f, percentage: Number(e.target.value) } : f)}
                    className="w-full accent-primary"
                  />
                  <Progress value={editForm?.percentage ?? 0} className="h-2" />
                </div>

                {/* 설명 */}
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground font-medium">설명</label>
                  <input
                    value={editForm?.description ?? ''}
                    onChange={e => setEditForm(f => f ? { ...f, description: e.target.value } : f)}
                    onKeyDown={e => e.key === 'Enter' && saveEdit()}
                    className="w-full px-3 py-2 text-xs border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="진행 상황을 입력하세요"
                  />
                </div>

                <div className="flex gap-2">
                  <Button size="sm" onClick={saveEdit} className="flex-1">
                    <Check className="h-3 w-3 mr-1" />
                    저장
                  </Button>
                  <Button size="sm" variant="outline" onClick={cancelEdit}>
                    <X className="h-3 w-3 mr-1" />
                    취소
                  </Button>
                </div>
              </div>
            ) : (
              /* ── 보기 모드 ── */
              <div className="group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{item.title}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${getPercentageColor(item.percentage)}`}>
                      {item.percentage}%
                    </span>
                    <button
                      onClick={() => startEdit(idx)}
                      className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-primary transition-all p-1 rounded"
                      title="수정"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <Progress value={item.percentage} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
              </div>
            )}
          </div>
        ))}

        <div className="pt-2 flex justify-end">
          <Link href="/roadmap">
            <Button>
              <Target className="h-4 w-4 mr-2" />
              로드맵 자세히 보기
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
