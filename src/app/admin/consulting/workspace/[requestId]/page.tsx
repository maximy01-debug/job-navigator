"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Shield, ArrowLeft, Play, Save, CheckCircle, Loader2,
  FileText, BookOpen, Trash2,
} from "lucide-react"
import { useAdminAuth } from "@/components/auth-provider"
import {
  getConsultingRequestById, getAllPromptTemplates,
  addConsultingResult, getResultsByRequestId,
  updateConsultingResult, deleteConsultingResult, finalizeResult,
} from "@/lib/consulting/storage"
import {
  MAJOR_OPTIONS, JOB_TYPE_OPTIONS,
  RESULT_TYPE_LABELS, RESULT_TYPE_COLORS,
} from "@/lib/consulting/types"
import type {
  ConsultingRequest, PromptTemplate, ConsultingResult, ConsultingResultType,
} from "@/lib/consulting/types"

type DocTab = 'resume' | 'coverLetter' | 'portfolio' | 'jobPosting'

const TAB_LABELS: Record<DocTab, string> = {
  resume: '이력서',
  coverLetter: '자기소개서',
  portfolio: '포트폴리오',
  jobPosting: '채용공고',
}

export default function WorkspacePage() {
  const router = useRouter()
  const params = useParams()
  const requestId = params.requestId as string

  const [request, setRequest] = useState<ConsultingRequest | null>(null)
  const [templates, setTemplates] = useState<PromptTemplate[]>([])
  const [results, setResults] = useState<ConsultingResult[]>([])

  // 좌측: 문서 탭
  const [activeTab, setActiveTab] = useState<DocTab>('resume')

  // 우측: 프롬프트 + AI
  const [majorFilter, setMajorFilter] = useState<string>('all')
  const [jobFilter, setJobFilter] = useState<string>('all')
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('')
  const [aiOutput, setAiOutput] = useState('')
  const [generating, setGenerating] = useState(false)

  // 결과 저장
  const [resultType, setResultType] = useState<ConsultingResultType>('cover_letter_feedback')
  const [resultTitle, setResultTitle] = useState('')

  const { admin: currentAdmin, adminLoading } = useAdminAuth()

  useEffect(() => {
    if (adminLoading) return
    if (!currentAdmin) { router.push("/admin/login"); return }
    const req = getConsultingRequestById(requestId)
    if (!req) { router.push("/admin/consulting"); return }
    setRequest(req)
    setTemplates(getAllPromptTemplates())
    setResults(getResultsByRequestId(requestId))
  }, [requestId, currentAdmin, adminLoading, router])

  const reload = () => setResults(getResultsByRequestId(requestId))

  const getDocText = (tab: DocTab): string => {
    if (!request) return ''
    switch (tab) {
      case 'resume': return request.resumeText || ''
      case 'coverLetter': return request.coverLetterText || ''
      case 'portfolio': return request.portfolioText || ''
      case 'jobPosting': return request.jobPostingText || ''
    }
  }

  const filteredTemplates = templates.filter(t => {
    if (majorFilter !== 'all' && t.major !== majorFilter) return false
    if (jobFilter !== 'all' && t.jobType !== jobFilter) return false
    return true
  })

  const selectedTemplate = templates.find(t => t.id === selectedTemplateId)

  const buildContext = (): string => {
    if (!request) return ''
    const parts: string[] = []
    parts.push(`## 학생 정보\n- 이름: ${request.studentName}\n- 희망 직무: ${request.desiredJob}`)
    if (request.targetCompany) parts.push(`- 타겟 회사: ${request.targetCompany}`)
    if (request.jobPostingUrl) parts.push(`- 채용공고 URL: ${request.jobPostingUrl}`)
    if (request.jobPostingText) parts.push(`\n## 채용공고\n${request.jobPostingText}`)
    if (request.resumeText) parts.push(`\n## 이력서\n${request.resumeText}`)
    if (request.coverLetterText) parts.push(`\n## 자기소개서\n${request.coverLetterText}`)
    if (request.portfolioText) parts.push(`\n## 포트폴리오\n${request.portfolioText}`)
    return parts.join('\n')
  }

  const handleGenerate = async () => {
    if (!selectedTemplate) { alert('프롬프트를 선택해주세요.'); return }
    setGenerating(true)
    setAiOutput('')
    try {
      const res = await fetch('/api/gemini-consulting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt: selectedTemplate.systemPrompt,
          context: buildContext(),
        }),
      })
      const data = await res.json()
      if (!res.ok) { alert(data.error || 'AI 생성 실패'); return }
      setAiOutput(data.output)
    } catch (err) {
      alert('AI 호출 중 오류가 발생했습니다.')
    } finally {
      setGenerating(false)
    }
  }

  const handleSaveResult = () => {
    if (!aiOutput.trim()) { alert('AI 출력 결과가 없습니다.'); return }
    if (!resultTitle.trim()) { alert('결과 제목을 입력해주세요.'); return }
    addConsultingResult({
      requestId,
      type: resultType,
      title: resultTitle.trim(),
      content: aiOutput,
      isFinalized: false,
    })
    setResultTitle('')
    reload()
  }

  const handleFinalize = (id: string) => {
    finalizeResult(id)
    reload()
  }

  const handleDeleteResult = (id: string) => {
    if (!confirm('삭제하시겠습니까?')) return
    deleteConsultingResult(id)
    reload()
  }

  if (!request) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <header className="border-b bg-red-500 text-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5" />
              <div>
                <h1 className="text-base font-bold">
                  AI 워크스페이스 — {request.studentName} ({request.desiredJob})
                </h1>
              </div>
            </div>
            <Link href="/admin/consulting">
              <Button variant="outline" size="sm" className="text-white border-white hover:bg-red-600">
                <ArrowLeft className="h-4 w-4 mr-2" />
                요청 목록
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* ══════ LEFT PANEL: 문서 뷰어 ══════ */}
          <Card className="h-[calc(100vh-200px)] flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <FileText className="h-4 w-4" />
                학생 제출 자료
              </CardTitle>
              <div className="flex gap-1 mt-2">
                {(Object.keys(TAB_LABELS) as DocTab[]).map((tab) => (
                  <Button
                    key={tab}
                    variant={activeTab === tab ? 'default' : 'outline'}
                    size="sm"
                    className="text-xs"
                    onClick={() => setActiveTab(tab)}
                  >
                    {TAB_LABELS[tab]}
                    {getDocText(tab) ? '' : ' ❌'}
                  </Button>
                ))}
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
              {getDocText(activeTab) ? (
                <pre className="text-sm whitespace-pre-wrap">{getDocText(activeTab)}</pre>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">{TAB_LABELS[activeTab]} 데이터가 없습니다</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ══════ RIGHT PANEL: AI 프롬프트 + 실행 ══════ */}
          <div className="h-[calc(100vh-200px)] flex flex-col gap-4 overflow-y-auto">
            {/* 프롬프트 선택 */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  프롬프트 선택
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <select
                    value={majorFilter}
                    onChange={(e) => setMajorFilter(e.target.value)}
                    className="text-xs border rounded px-2 py-1"
                  >
                    <option value="all">전공 전체</option>
                    {MAJOR_OPTIONS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <select
                    value={jobFilter}
                    onChange={(e) => setJobFilter(e.target.value)}
                    className="text-xs border rounded px-2 py-1"
                  >
                    <option value="all">직무 전체</option>
                    {JOB_TYPE_OPTIONS.map(j => <option key={j} value={j}>{j}</option>)}
                  </select>
                </div>
                <select
                  value={selectedTemplateId}
                  onChange={(e) => setSelectedTemplateId(e.target.value)}
                  className="w-full text-sm border rounded px-3 py-2"
                >
                  <option value="">— 프롬프트 선택 —</option>
                  {filteredTemplates.map(t => (
                    <option key={t.id} value={t.id}>[{t.major}] {t.name}</option>
                  ))}
                </select>
                {selectedTemplate && (
                  <pre className="text-xs bg-muted/30 p-3 rounded max-h-32 overflow-y-auto whitespace-pre-wrap">
                    {selectedTemplate.systemPrompt}
                  </pre>
                )}
                <Button
                  className="w-full"
                  onClick={handleGenerate}
                  disabled={generating || !selectedTemplateId}
                >
                  {generating ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" />AI 생성 중...</>
                  ) : (
                    <><Play className="h-4 w-4 mr-2" />AI 실행</>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* AI 출력 */}
            {aiOutput && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">AI 출력 결과</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <pre className="text-sm whitespace-pre-wrap bg-muted/30 p-3 rounded max-h-64 overflow-y-auto">
                    {aiOutput}
                  </pre>
                  <div className="flex gap-2 items-end">
                    <div className="flex-1 space-y-1">
                      <label className="text-xs font-medium">결과 제목</label>
                      <input
                        value={resultTitle}
                        onChange={(e) => setResultTitle(e.target.value)}
                        className="w-full px-2 py-1.5 border rounded text-sm"
                        placeholder="예: 자소서 1차 피드백"
                      />
                    </div>
                    <select
                      value={resultType}
                      onChange={(e) => setResultType(e.target.value as ConsultingResultType)}
                      className="text-xs border rounded px-2 py-1.5"
                    >
                      <option value="cover_letter_feedback">자소서 피드백</option>
                      <option value="job_description">직무기술서</option>
                      <option value="interview_qa">모의면접 Q&A</option>
                    </select>
                    <Button size="sm" onClick={handleSaveResult}>
                      <Save className="h-4 w-4 mr-1" />
                      저장
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 저장된 결과 목록 */}
            {results.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">저장된 결과 ({results.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((r) => (
                      <div key={r.id} className="flex items-center justify-between p-3 border rounded text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{r.title}</span>
                          <span className={`text-xs px-1.5 py-0.5 rounded-full ${RESULT_TYPE_COLORS[r.type]}`}>
                            {RESULT_TYPE_LABELS[r.type]}
                          </span>
                          {r.isFinalized && (
                            <span className="text-xs px-1.5 py-0.5 rounded-full bg-green-100 text-green-700">
                              공개됨
                            </span>
                          )}
                        </div>
                        <div className="flex gap-1">
                          {!r.isFinalized && (
                            <Button size="sm" variant="outline" className="text-xs" onClick={() => handleFinalize(r.id)}>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              학생 공개
                            </Button>
                          )}
                          <Button size="sm" variant="ghost" className="text-red-500" onClick={() => handleDeleteResult(r.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
