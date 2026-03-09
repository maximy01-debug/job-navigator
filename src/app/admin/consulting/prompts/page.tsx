"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, BookOpen, Plus, Pencil, Trash2, ArrowLeft, X, Save } from "lucide-react"
import { getCurrentAdmin } from "@/lib/supabase/auth"
import {
  getAllPromptTemplates, addPromptTemplate, updatePromptTemplate, deletePromptTemplate,
} from "@/lib/consulting/storage"
import { MAJOR_OPTIONS, JOB_TYPE_OPTIONS } from "@/lib/consulting/types"
import type { PromptTemplate } from "@/lib/consulting/types"

const EMPTY: Omit<PromptTemplate, 'id' | 'createdAt' | 'updatedAt'> = {
  name: '', category: '', major: MAJOR_OPTIONS[0], jobType: JOB_TYPE_OPTIONS[0], systemPrompt: '',
}

export default function AdminPromptsPage() {
  const router = useRouter()
  const [templates, setTemplates] = useState<PromptTemplate[]>([])
  const [majorFilter, setMajorFilter] = useState<string>('all')
  const [jobFilter, setJobFilter] = useState<string>('all')

  const [editing, setEditing] = useState<Partial<PromptTemplate> & typeof EMPTY | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null) // null = new

  useEffect(() => {
    if (!getCurrentAdmin()) { router.push("/admin/login"); return }
    reload()
  }, [router])

  const reload = () => setTemplates(getAllPromptTemplates())

  const filtered = templates.filter(t => {
    if (majorFilter !== 'all' && t.major !== majorFilter) return false
    if (jobFilter !== 'all' && t.jobType !== jobFilter) return false
    return true
  })

  const startNew = () => { setEditing({ ...EMPTY }); setEditingId(null) }
  const startEdit = (t: PromptTemplate) => { setEditing({ ...t }); setEditingId(t.id) }
  const cancel = () => { setEditing(null); setEditingId(null) }

  const handleSave = () => {
    if (!editing) return
    if (!editing.name?.trim() || !editing.systemPrompt?.trim()) {
      alert('이름과 시스템 프롬프트를 입력해주세요.')
      return
    }
    if (editingId) {
      updatePromptTemplate(editingId, editing)
    } else {
      addPromptTemplate(editing as Omit<PromptTemplate, 'id' | 'createdAt' | 'updatedAt'>)
    }
    cancel()
    reload()
  }

  const handleDelete = (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return
    deletePromptTemplate(id)
    reload()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <header className="border-b bg-red-500 text-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-6 w-6" />
              <div>
                <h1 className="text-lg font-bold">AI 프롬프트 라이브러리</h1>
                <p className="text-xs text-red-100">전공별/직무별 프롬프트 템플릿 관리</p>
              </div>
            </div>
            <Link href="/admin">
              <Button variant="outline" size="sm" className="text-white border-white hover:bg-red-600">
                <ArrowLeft className="h-4 w-4 mr-2" />
                대시보드
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* 필터 + 추가 */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <select
            value={majorFilter}
            onChange={(e) => setMajorFilter(e.target.value)}
            className="text-sm border rounded px-3 py-1.5"
          >
            <option value="all">전공 전체</option>
            {MAJOR_OPTIONS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <select
            value={jobFilter}
            onChange={(e) => setJobFilter(e.target.value)}
            className="text-sm border rounded px-3 py-1.5"
          >
            <option value="all">직무 전체</option>
            {JOB_TYPE_OPTIONS.map(j => <option key={j} value={j}>{j}</option>)}
          </select>
          <div className="flex-1" />
          <Button size="sm" onClick={startNew}>
            <Plus className="h-4 w-4 mr-1" />
            새 프롬프트
          </Button>
        </div>

        {/* 편집 폼 */}
        {editing && (
          <Card className="mb-6 border-primary">
            <CardHeader>
              <CardTitle className="text-base">{editingId ? '프롬프트 수정' : '새 프롬프트 추가'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium">이름 *</label>
                  <input
                    value={editing.name}
                    onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded text-sm"
                    placeholder="프롬프트 이름"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">전공</label>
                  <select
                    value={editing.major}
                    onChange={(e) => setEditing({ ...editing, major: e.target.value })}
                    className="w-full px-3 py-2 border rounded text-sm"
                  >
                    {MAJOR_OPTIONS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">직무</label>
                  <select
                    value={editing.jobType}
                    onChange={(e) => setEditing({ ...editing, jobType: e.target.value })}
                    className="w-full px-3 py-2 border rounded text-sm"
                  >
                    {JOB_TYPE_OPTIONS.map(j => <option key={j} value={j}>{j}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium">카테고리</label>
                <input
                  value={editing.category}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                  className="w-full px-3 py-2 border rounded text-sm"
                  placeholder="예: 기본 분석, 심화 피드백"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium">시스템 프롬프트 *</label>
                <textarea
                  value={editing.systemPrompt}
                  onChange={(e) => setEditing({ ...editing, systemPrompt: e.target.value })}
                  className="w-full h-48 px-3 py-2 border rounded text-sm resize-y"
                  placeholder="AI에게 전달할 시스템 프롬프트를 입력하세요..."
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={cancel}>
                  <X className="h-4 w-4 mr-1" />
                  취소
                </Button>
                <Button size="sm" onClick={handleSave}>
                  <Save className="h-4 w-4 mr-1" />
                  저장
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 목록 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              프롬프트 목록
            </CardTitle>
            <CardDescription>{filtered.length}개의 템플릿</CardDescription>
          </CardHeader>
          <CardContent>
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p>프롬프트가 없습니다</p>
                <Button className="mt-4" size="sm" onClick={startNew}>
                  <Plus className="h-4 w-4 mr-1" />
                  새 프롬프트 추가
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((tpl) => (
                  <div key={tpl.id} className="p-4 border rounded-lg hover:bg-muted/50">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{tpl.name}</span>
                          <span className="text-xs px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">{tpl.major}</span>
                          <span className="text-xs px-1.5 py-0.5 rounded bg-purple-100 text-purple-700">{tpl.jobType}</span>
                          {tpl.category && <span className="text-xs text-muted-foreground">· {tpl.category}</span>}
                        </div>
                        <pre className="text-xs text-muted-foreground mt-2 whitespace-pre-wrap line-clamp-3">
                          {tpl.systemPrompt}
                        </pre>
                      </div>
                      <div className="flex gap-1 ml-4">
                        <Button size="sm" variant="ghost" onClick={() => startEdit(tpl)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-red-500" onClick={() => handleDelete(tpl.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
