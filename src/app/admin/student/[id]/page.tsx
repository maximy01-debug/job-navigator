"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Shield, ArrowLeft, User, BookOpen, FolderKanban,
  MessageSquare, BarChart2, Plus, Trash2, Edit2, Check, X,
  Github, ExternalLink, Save, Sparkles, Loader2, RefreshCw
} from "lucide-react"
import { getCurrentAdmin } from "@/lib/supabase/auth"
import { getAllStudents, getStudentPhoto, saveStudentPhoto } from "@/lib/students/storage"
import {
  getProjects, addProject, updateProject, deleteProject,
  getCounselingRecords, addCounselingRecord, updateCounselingRecord, deleteCounselingRecord,
  getGradeRecords, addGradeRecord, updateGradeRecord, deleteGradeRecord,
  getProjectFeedback, saveProjectFeedback, deleteProjectFeedback,
  type Project, type CounselingRecord, type GradeRecord, type ProjectFeedback
} from "@/lib/students/extended-storage"
import type { Student } from "@/lib/students/data"

type Tab = 'info' | 'grades' | 'projects' | 'counseling'

const STATUS_LABELS: Record<Project['status'], string> = {
  planned: '계획', in_progress: '진행중', completed: '완료'
}
const STATUS_COLORS: Record<Project['status'], string> = {
  planned: 'bg-muted text-muted-foreground',
  in_progress: 'bg-primary/10 text-primary',
  completed: 'bg-secondary/10 text-secondary'
}
const CATEGORY_COLORS: Record<CounselingRecord['category'], string> = {
  진로: 'bg-blue-100 text-blue-700',
  학업: 'bg-purple-100 text-purple-700',
  생활: 'bg-green-100 text-green-700',
  심리: 'bg-orange-100 text-orange-700',
  기타: 'bg-muted text-muted-foreground'
}

// ── 공통 인풋 스타일 ──
const inputCls = "w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
const labelCls = "text-xs font-medium text-muted-foreground"

export default function StudentDetailPage() {
  const router = useRouter()
  const params = useParams()
  const studentId = Number(params.id)

  const [student, setStudent] = useState<Student | null>(null)
  const [photo, setPhoto] = useState<string | null>(null)
  const [tab, setTab] = useState<Tab>('info')

  // 데이터
  const [projects, setProjects] = useState<Project[]>([])
  const [counseling, setCounseling] = useState<CounselingRecord[]>([])
  const [grades, setGrades] = useState<GradeRecord[]>([])

  // 편집 상태
  const [editingProject, setEditingProject] = useState<string | null>(null)
  const [editingCounseling, setEditingCounseling] = useState<string | null>(null)
  const [editingGrade, setEditingGrade] = useState<string | null>(null)

  // 새 항목 폼
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [showCounselingForm, setShowCounselingForm] = useState(false)
  const [showGradeForm, setShowGradeForm] = useState(false)

  const emptyProject = (): Omit<Project, 'id' | 'createdAt'> => ({
    title: '', description: '', githubUrl: '', demoUrl: '', status: 'planned', techStack: ''
  })
  const emptyCounseling = (): Omit<CounselingRecord, 'id'> => ({
    date: new Date().toISOString().split('T')[0],
    counselor: '', category: '진로', content: '', followUp: '', nextDate: ''
  })
  const emptyGrade = (): Omit<GradeRecord, 'id'> => ({
    year: String(new Date().getFullYear()),
    semester: '1학기', subject: '', score: 0, grade: '', rank: '', notes: ''
  })

  const [newProject, setNewProject] = useState(emptyProject())
  const [newCounseling, setNewCounseling] = useState(emptyCounseling())
  const [newGrade, setNewGrade] = useState(emptyGrade())

  // 인라인 편집 상태
  const [editProjectData, setEditProjectData] = useState<Project | null>(null)
  const [editCounselingData, setEditCounselingData] = useState<CounselingRecord | null>(null)
  const [editGradeData, setEditGradeData] = useState<GradeRecord | null>(null)

  // AI 피드백 상태
  const [feedbacks, setFeedbacks] = useState<Record<string, ProjectFeedback>>({})
  const [generatingFeedback, setGeneratingFeedback] = useState<string | null>(null)

  useEffect(() => {
    if (!getCurrentAdmin()) { router.push('/admin/login'); return }
    const s = getAllStudents().find(x => x.student_number === studentId)
    if (!s) { router.push('/admin'); return }
    setStudent(s)
    setPhoto(getStudentPhoto(s.student_number))
    reload()
  }, [studentId, router])

  const reload = () => {
    const ps = getProjects(studentId)
    setProjects(ps)
    setCounseling(getCounselingRecords(studentId))
    setGrades(getGradeRecords(studentId))
    // 피드백 맵 로드
    const fbMap: Record<string, ProjectFeedback> = {}
    ps.forEach(p => {
      const fb = getProjectFeedback(studentId, p.id)
      if (fb) fbMap[p.id] = fb
    })
    setFeedbacks(fbMap)
  }

  const handleGenerateFeedback = async (p: Project) => {
    if (!student) return
    setGeneratingFeedback(p.id)
    try {
      const res = await fetch('/api/gemini-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectTitle: p.title,
          description: p.description,
          techStack: p.techStack,
          status: STATUS_LABELS[p.status],
          studentName: student.name,
        }),
      })
      const data = await res.json()
      if (data.error) {
        alert(`피드백 생성 실패: ${data.error}`)
      } else {
        saveProjectFeedback(studentId, p.id, data.feedback)
        reload()
      }
    } catch (err) {
      alert('피드백 생성 중 오류가 발생했습니다.')
    } finally {
      setGeneratingFeedback(null)
    }
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      saveStudentPhoto(studentId, reader.result as string)
      setPhoto(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  if (!student) return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>

  // ── 탭 설정 ──
  const tabs: { key: Tab; label: string; icon: typeof User; count?: number }[] = [
    { key: 'info',      label: '기본정보',  icon: User },
    { key: 'grades',    label: '학교성적',  icon: BarChart2,     count: grades.length },
    { key: 'projects',  label: '프로젝트',  icon: FolderKanban,  count: projects.length },
    { key: 'counseling',label: '상담내용',  icon: MessageSquare, count: counseling.length },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Admin Header */}
      <header className="border-b bg-red-500 text-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="text-white hover:bg-red-600">
                <ArrowLeft className="h-4 w-4 mr-1" /> 목록으로
              </Button>
            </Link>
            <Shield className="h-5 w-5" />
            <span className="font-bold">학생 상세 관리 — {student.name}</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {/* 프로필 요약 */}
        <Card className="mb-6">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-primary bg-muted flex items-center justify-center flex-shrink-0">
                  {photo
                    ? <img src={photo} alt={student.name} className="h-full w-full object-cover" />
                    : <User className="h-8 w-8 text-muted-foreground" />}
                </div>
                <label htmlFor="photo-change" className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1 cursor-pointer hover:bg-primary/80">
                  <Edit2 className="h-3 w-3" />
                </label>
                <input id="photo-change" type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
              </div>
              <div>
                <h2 className="text-xl font-bold">{student.name}</h2>
                <p className="text-muted-foreground text-sm">
                  {student.department} · {student.class_name} · 학생번호 {student.student_number}
                </p>
                <p className="text-muted-foreground text-sm">
                  성별: {student.gender} · 동아리: {student.clubs_joined || '없음'} · 보호자동의: {student.parent_share_consent}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 탭 */}
        <div className="flex gap-1 mb-6 bg-muted rounded-lg p-1">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                tab === t.key ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
              {t.count !== undefined && t.count > 0 && (
                <span className="bg-primary text-white text-xs rounded-full px-1.5 py-0.5 leading-none">{t.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* ───────────── 기본정보 탭 ───────────── */}
        {tab === 'info' && (
          <Card>
            <CardHeader><CardTitle>기본정보</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                ['학생번호', student.student_number],
                ['이름', student.name],
                ['학과', student.department],
                ['반', student.class_name],
                ['성별', student.gender],
                ['동아리', student.clubs_joined || '없음'],
                ['보호자 공유 동의', student.parent_share_consent],
                ['최초 로그인', student.first_login ? '미완료' : '완료'],
                ['데이터 확인', student.is_data_confirmed ? '확인됨' : '미확인'],
              ].map(([label, value]) => (
                <div key={String(label)} className="flex items-center justify-between py-2 border-b last:border-0">
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <span className="text-sm font-medium">{String(value)}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* ───────────── 학교성적 탭 ───────────── */}
        {tab === 'grades' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">학교성적 ({grades.length}건)</h3>
              <Button size="sm" onClick={() => setShowGradeForm(!showGradeForm)}>
                <Plus className="h-4 w-4 mr-1" /> 성적 추가
              </Button>
            </div>

            {/* 새 성적 입력 폼 */}
            {showGradeForm && (
              <Card className="border-primary/40">
                <CardHeader><CardTitle className="text-sm">새 성적 입력</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className={labelCls}>연도</label>
                      <input className={inputCls} value={newGrade.year}
                        onChange={e => setNewGrade(g => ({...g, year: e.target.value}))} placeholder="2025" /></div>
                    <div><label className={labelCls}>학기</label>
                      <select className={inputCls} value={newGrade.semester}
                        onChange={e => setNewGrade(g => ({...g, semester: e.target.value as GradeRecord['semester']}))}>
                        <option>1학기</option><option>2학기</option>
                      </select></div>
                  </div>
                  <div><label className={labelCls}>과목명</label>
                    <input className={inputCls} value={newGrade.subject}
                      onChange={e => setNewGrade(g => ({...g, subject: e.target.value}))} placeholder="예) 수학" /></div>
                  <div className="grid grid-cols-3 gap-3">
                    <div><label className={labelCls}>점수 (0~100)</label>
                      <input className={inputCls} type="number" min={0} max={100} value={newGrade.score}
                        onChange={e => setNewGrade(g => ({...g, score: Number(e.target.value)}))} /></div>
                    <div><label className={labelCls}>등급</label>
                      <input className={inputCls} value={newGrade.grade}
                        onChange={e => setNewGrade(g => ({...g, grade: e.target.value}))} placeholder="A+" /></div>
                    <div><label className={labelCls}>석차</label>
                      <input className={inputCls} value={newGrade.rank}
                        onChange={e => setNewGrade(g => ({...g, rank: e.target.value}))} placeholder="3/30" /></div>
                  </div>
                  <div><label className={labelCls}>메모</label>
                    <input className={inputCls} value={newGrade.notes}
                      onChange={e => setNewGrade(g => ({...g, notes: e.target.value}))} placeholder="특이사항" /></div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => {
                      addGradeRecord(studentId, newGrade); reload(); setNewGrade(emptyGrade()); setShowGradeForm(false)
                    }}>저장</Button>
                    <Button size="sm" variant="outline" onClick={() => setShowGradeForm(false)}>취소</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 성적 목록 */}
            {grades.length === 0 && <p className="text-muted-foreground text-sm text-center py-8">등록된 성적이 없습니다.</p>}
            {grades.map(g => (
              <Card key={g.id} className="group">
                <CardContent className="pt-4 pb-4">
                  {editingGrade === g.id && editGradeData ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div><label className={labelCls}>연도</label>
                          <input className={inputCls} value={editGradeData.year}
                            onChange={e => setEditGradeData(d => d ? {...d, year: e.target.value} : d)} /></div>
                        <div><label className={labelCls}>학기</label>
                          <select className={inputCls} value={editGradeData.semester}
                            onChange={e => setEditGradeData(d => d ? {...d, semester: e.target.value as GradeRecord['semester']} : d)}>
                            <option>1학기</option><option>2학기</option>
                          </select></div>
                      </div>
                      <div><label className={labelCls}>과목명</label>
                        <input className={inputCls} value={editGradeData.subject}
                          onChange={e => setEditGradeData(d => d ? {...d, subject: e.target.value} : d)} /></div>
                      <div className="grid grid-cols-3 gap-3">
                        <div><label className={labelCls}>점수</label>
                          <input className={inputCls} type="number" value={editGradeData.score}
                            onChange={e => setEditGradeData(d => d ? {...d, score: Number(e.target.value)} : d)} /></div>
                        <div><label className={labelCls}>등급</label>
                          <input className={inputCls} value={editGradeData.grade}
                            onChange={e => setEditGradeData(d => d ? {...d, grade: e.target.value} : d)} /></div>
                        <div><label className={labelCls}>석차</label>
                          <input className={inputCls} value={editGradeData.rank}
                            onChange={e => setEditGradeData(d => d ? {...d, rank: e.target.value} : d)} /></div>
                      </div>
                      <div><label className={labelCls}>메모</label>
                        <input className={inputCls} value={editGradeData.notes}
                          onChange={e => setEditGradeData(d => d ? {...d, notes: e.target.value} : d)} /></div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => {
                          updateGradeRecord(studentId, g.id, editGradeData); reload(); setEditingGrade(null)
                        }}><Save className="h-3 w-3 mr-1" />저장</Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingGrade(null)}>취소</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{g.subject}</span>
                          <span className="text-xs text-muted-foreground">{g.year} {g.semester}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-bold text-primary">{g.score}점</span>
                          {g.grade && <span className="text-sm font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded">{g.grade}</span>}
                          {g.rank && <span className="text-xs text-muted-foreground">석차: {g.rank}</span>}
                        </div>
                        {g.notes && <p className="text-xs text-muted-foreground">{g.notes}</p>}
                        <Progress value={g.score} className="h-1.5 w-40" />
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setEditingGrade(g.id); setEditGradeData({...g}) }} className="p-1.5 rounded hover:bg-muted">
                          <Edit2 className="h-4 w-4 text-muted-foreground" />
                        </button>
                        <button onClick={() => { deleteGradeRecord(studentId, g.id); reload() }} className="p-1.5 rounded hover:bg-muted">
                          <Trash2 className="h-4 w-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* ───────────── 프로젝트 탭 ───────────── */}
        {tab === 'projects' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">프로젝트 ({projects.length}건)</h3>
              <Button size="sm" onClick={() => setShowProjectForm(!showProjectForm)}>
                <Plus className="h-4 w-4 mr-1" /> 프로젝트 추가
              </Button>
            </div>

            {showProjectForm && (
              <Card className="border-primary/40">
                <CardHeader><CardTitle className="text-sm">새 프로젝트 입력</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div><label className={labelCls}>프로젝트명</label>
                    <input className={inputCls} value={newProject.title}
                      onChange={e => setNewProject(p => ({...p, title: e.target.value}))} placeholder="날씨 앱" /></div>
                  <div><label className={labelCls}>설명</label>
                    <textarea className={inputCls + " resize-none"} rows={2} value={newProject.description}
                      onChange={e => setNewProject(p => ({...p, description: e.target.value}))} placeholder="프로젝트 설명" /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className={labelCls}>GitHub URL</label>
                      <input className={inputCls} value={newProject.githubUrl}
                        onChange={e => setNewProject(p => ({...p, githubUrl: e.target.value}))} placeholder="https://github.com/..." /></div>
                    <div><label className={labelCls}>Demo URL</label>
                      <input className={inputCls} value={newProject.demoUrl}
                        onChange={e => setNewProject(p => ({...p, demoUrl: e.target.value}))} placeholder="https://..." /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className={labelCls}>기술스택 (쉼표 구분)</label>
                      <input className={inputCls} value={newProject.techStack}
                        onChange={e => setNewProject(p => ({...p, techStack: e.target.value}))} placeholder="React, TypeScript" /></div>
                    <div><label className={labelCls}>상태</label>
                      <select className={inputCls} value={newProject.status}
                        onChange={e => setNewProject(p => ({...p, status: e.target.value as Project['status']}))}>
                        <option value="planned">계획</option>
                        <option value="in_progress">진행중</option>
                        <option value="completed">완료</option>
                      </select></div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => {
                      addProject(studentId, newProject); reload(); setNewProject(emptyProject()); setShowProjectForm(false)
                    }}>저장</Button>
                    <Button size="sm" variant="outline" onClick={() => setShowProjectForm(false)}>취소</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {projects.length === 0 && <p className="text-muted-foreground text-sm text-center py-8">등록된 프로젝트가 없습니다.</p>}
            {projects.map(p => (
              <Card key={p.id} className="group">
                <CardContent className="pt-4 pb-4">
                  {editingProject === p.id && editProjectData ? (
                    <div className="space-y-3">
                      <div><label className={labelCls}>프로젝트명</label>
                        <input className={inputCls} value={editProjectData.title}
                          onChange={e => setEditProjectData(d => d ? {...d, title: e.target.value} : d)} /></div>
                      <div><label className={labelCls}>설명</label>
                        <textarea className={inputCls + " resize-none"} rows={2} value={editProjectData.description}
                          onChange={e => setEditProjectData(d => d ? {...d, description: e.target.value} : d)} /></div>
                      <div className="grid grid-cols-2 gap-3">
                        <div><label className={labelCls}>GitHub URL</label>
                          <input className={inputCls} value={editProjectData.githubUrl}
                            onChange={e => setEditProjectData(d => d ? {...d, githubUrl: e.target.value} : d)} /></div>
                        <div><label className={labelCls}>Demo URL</label>
                          <input className={inputCls} value={editProjectData.demoUrl}
                            onChange={e => setEditProjectData(d => d ? {...d, demoUrl: e.target.value} : d)} /></div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div><label className={labelCls}>기술스택</label>
                          <input className={inputCls} value={editProjectData.techStack}
                            onChange={e => setEditProjectData(d => d ? {...d, techStack: e.target.value} : d)} /></div>
                        <div><label className={labelCls}>상태</label>
                          <select className={inputCls} value={editProjectData.status}
                            onChange={e => setEditProjectData(d => d ? {...d, status: e.target.value as Project['status']} : d)}>
                            <option value="planned">계획</option>
                            <option value="in_progress">진행중</option>
                            <option value="completed">완료</option>
                          </select></div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => {
                          updateProject(studentId, p.id, editProjectData); reload(); setEditingProject(null)
                        }}><Save className="h-3 w-3 mr-1" />저장</Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingProject(null)}>취소</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium">{p.title}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[p.status]}`}>
                              {STATUS_LABELS[p.status]}
                            </span>
                          </div>
                          {p.description && <p className="text-sm text-muted-foreground">{p.description}</p>}
                          {p.techStack && (
                            <div className="flex flex-wrap gap-1">
                              {p.techStack.split(',').map(t => (
                                <span key={t} className="text-xs bg-muted px-2 py-0.5 rounded">{t.trim()}</span>
                              ))}
                            </div>
                          )}
                          <div className="flex gap-2 flex-wrap">
                            {p.githubUrl && (
                              <a href={p.githubUrl} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                                <Github className="h-3 w-3" /> GitHub
                              </a>
                            )}
                            {p.demoUrl && (
                              <a href={p.demoUrl} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                                <ExternalLink className="h-3 w-3" /> Demo
                              </a>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                          <button onClick={() => { setEditingProject(p.id); setEditProjectData({...p}) }} className="p-1.5 rounded hover:bg-muted">
                            <Edit2 className="h-4 w-4 text-muted-foreground" />
                          </button>
                          <button onClick={() => { deleteProject(studentId, p.id); deleteProjectFeedback(studentId, p.id); reload() }} className="p-1.5 rounded hover:bg-muted">
                            <Trash2 className="h-4 w-4 text-red-400" />
                          </button>
                        </div>
                      </div>

                      {/* AI 피드백 섹션 */}
                      <div className="border-t pt-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="h-4 w-4 text-purple-500" />
                          <span className="text-xs font-semibold text-purple-700">AI 피드백</span>
                          {feedbacks[p.id] && (
                            <span className="text-xs text-muted-foreground">
                              {new Date(feedbacks[p.id].generatedAt).toLocaleDateString('ko-KR')} 생성
                            </span>
                          )}
                        </div>

                        {feedbacks[p.id] ? (
                          <div className="space-y-2">
                            <div className="text-sm bg-purple-50 border border-purple-100 rounded-lg p-3 whitespace-pre-wrap leading-relaxed">
                              {feedbacks[p.id].feedback}
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleGenerateFeedback(p)}
                              disabled={generatingFeedback === p.id}
                              className="text-xs h-7"
                            >
                              {generatingFeedback === p.id
                                ? <><Loader2 className="h-3 w-3 mr-1 animate-spin" />생성 중...</>
                                : <><RefreshCw className="h-3 w-3 mr-1" />재생성</>
                              }
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleGenerateFeedback(p)}
                            disabled={generatingFeedback === p.id}
                            className="bg-purple-600 hover:bg-purple-700 text-white text-xs h-8"
                          >
                            {generatingFeedback === p.id
                              ? <><Loader2 className="h-3 w-3 mr-1.5 animate-spin" />AI 피드백 생성 중...</>
                              : <><Sparkles className="h-3 w-3 mr-1.5" />AI 피드백 생성</>
                            }
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* ───────────── 상담내용 탭 ───────────── */}
        {tab === 'counseling' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">상담내용 ({counseling.length}건)</h3>
              <Button size="sm" onClick={() => setShowCounselingForm(!showCounselingForm)}>
                <Plus className="h-4 w-4 mr-1" /> 상담 추가
              </Button>
            </div>

            {showCounselingForm && (
              <Card className="border-primary/40">
                <CardHeader><CardTitle className="text-sm">새 상담 기록 입력</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className={labelCls}>상담일</label>
                      <input className={inputCls} type="date" value={newCounseling.date}
                        onChange={e => setNewCounseling(c => ({...c, date: e.target.value}))} /></div>
                    <div><label className={labelCls}>상담교사</label>
                      <input className={inputCls} value={newCounseling.counselor}
                        onChange={e => setNewCounseling(c => ({...c, counselor: e.target.value}))} placeholder="홍길동 선생님" /></div>
                  </div>
                  <div><label className={labelCls}>분류</label>
                    <select className={inputCls} value={newCounseling.category}
                      onChange={e => setNewCounseling(c => ({...c, category: e.target.value as CounselingRecord['category']}))}>
                      {(['진로','학업','생활','심리','기타'] as const).map(c => <option key={c}>{c}</option>)}
                    </select></div>
                  <div><label className={labelCls}>상담내용</label>
                    <textarea className={inputCls + " resize-none"} rows={3} value={newCounseling.content}
                      onChange={e => setNewCounseling(c => ({...c, content: e.target.value}))} placeholder="상담 내용을 입력하세요" /></div>
                  <div><label className={labelCls}>사후조치 / 다음 계획</label>
                    <input className={inputCls} value={newCounseling.followUp}
                      onChange={e => setNewCounseling(c => ({...c, followUp: e.target.value}))} placeholder="추후 진로 서류 준비 지원 예정" /></div>
                  <div><label className={labelCls}>다음 상담 예정일 (선택)</label>
                    <input className={inputCls} type="date" value={newCounseling.nextDate}
                      onChange={e => setNewCounseling(c => ({...c, nextDate: e.target.value}))} /></div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => {
                      addCounselingRecord(studentId, newCounseling); reload(); setNewCounseling(emptyCounseling()); setShowCounselingForm(false)
                    }}>저장</Button>
                    <Button size="sm" variant="outline" onClick={() => setShowCounselingForm(false)}>취소</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {counseling.length === 0 && <p className="text-muted-foreground text-sm text-center py-8">등록된 상담 기록이 없습니다.</p>}
            {counseling.map(c => (
              <Card key={c.id} className="group">
                <CardContent className="pt-4 pb-4">
                  {editingCounseling === c.id && editCounselingData ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div><label className={labelCls}>상담일</label>
                          <input className={inputCls} type="date" value={editCounselingData.date}
                            onChange={e => setEditCounselingData(d => d ? {...d, date: e.target.value} : d)} /></div>
                        <div><label className={labelCls}>상담교사</label>
                          <input className={inputCls} value={editCounselingData.counselor}
                            onChange={e => setEditCounselingData(d => d ? {...d, counselor: e.target.value} : d)} /></div>
                      </div>
                      <div><label className={labelCls}>분류</label>
                        <select className={inputCls} value={editCounselingData.category}
                          onChange={e => setEditCounselingData(d => d ? {...d, category: e.target.value as CounselingRecord['category']} : d)}>
                          {(['진로','학업','생활','심리','기타'] as const).map(cat => <option key={cat}>{cat}</option>)}
                        </select></div>
                      <div><label className={labelCls}>상담내용</label>
                        <textarea className={inputCls + " resize-none"} rows={3} value={editCounselingData.content}
                          onChange={e => setEditCounselingData(d => d ? {...d, content: e.target.value} : d)} /></div>
                      <div><label className={labelCls}>사후조치</label>
                        <input className={inputCls} value={editCounselingData.followUp}
                          onChange={e => setEditCounselingData(d => d ? {...d, followUp: e.target.value} : d)} /></div>
                      <div><label className={labelCls}>다음 상담 예정일</label>
                        <input className={inputCls} type="date" value={editCounselingData.nextDate}
                          onChange={e => setEditCounselingData(d => d ? {...d, nextDate: e.target.value} : d)} /></div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => {
                          updateCounselingRecord(studentId, c.id, editCounselingData); reload(); setEditingCounseling(null)
                        }}><Save className="h-3 w-3 mr-1" />저장</Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingCounseling(null)}>취소</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium">{c.date}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[c.category]}`}>
                            {c.category}
                          </span>
                          {c.counselor && <span className="text-xs text-muted-foreground">{c.counselor}</span>}
                        </div>
                        <p className="text-sm">{c.content}</p>
                        {c.followUp && <p className="text-xs text-muted-foreground">📌 {c.followUp}</p>}
                        {c.nextDate && <p className="text-xs text-primary">🗓 다음 상담: {c.nextDate}</p>}
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                        <button onClick={() => { setEditingCounseling(c.id); setEditCounselingData({...c}) }} className="p-1.5 rounded hover:bg-muted">
                          <Edit2 className="h-4 w-4 text-muted-foreground" />
                        </button>
                        <button onClick={() => { deleteCounselingRecord(studentId, c.id); reload() }} className="p-1.5 rounded hover:bg-muted">
                          <Trash2 className="h-4 w-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
