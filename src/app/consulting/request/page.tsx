"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Upload, Loader2, CheckCircle, ArrowLeft } from "lucide-react"
import { getCurrentStudent } from "@/lib/supabase/auth"
import { addConsultingRequest } from "@/lib/consulting/storage"
import type { Student } from "@/lib/students/data"
import Link from "next/link"

export default function ConsultingRequestPage() {
  const router = useRouter()
  const [student, setStudent] = useState<Student | null>(null)

  const [desiredJob, setDesiredJob] = useState("")
  const [targetCompany, setTargetCompany] = useState("")
  const [jobPostingUrl, setJobPostingUrl] = useState("")
  const [jobPostingText, setJobPostingText] = useState("")

  const [resumeText, setResumeText] = useState("")
  const [coverLetterText, setCoverLetterText] = useState("")
  const [portfolioText, setPortfolioText] = useState("")

  const [uploading, setUploading] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const s = getCurrentStudent()
    if (!s) { router.push("/auth/login"); return }
    setStudent(s)
  }, [router])

  const handlePdfUpload = async (
    field: 'resume' | 'coverLetter' | 'portfolio',
    file: File
  ) => {
    setUploading(field)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/extract-pdf', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) { alert(data.error || 'PDF 추출 실패'); return }

      if (field === 'resume') setResumeText(data.text)
      else if (field === 'coverLetter') setCoverLetterText(data.text)
      else setPortfolioText(data.text)
    } catch (err) {
      alert('PDF 업로드 중 오류가 발생했습니다.')
    } finally {
      setUploading(null)
    }
  }

  const handleSubmit = () => {
    if (!student) return
    if (!desiredJob.trim()) { alert('희망 직무를 입력해주세요.'); return }

    setSubmitting(true)
    try {
      addConsultingRequest({
        studentNumber: student.student_number,
        studentName: student.name,
        status: 'requested',
        desiredJob: desiredJob.trim(),
        targetCompany: targetCompany.trim(),
        jobPostingUrl: jobPostingUrl.trim(),
        jobPostingText: jobPostingText.trim(),
        resumeText,
        coverLetterText,
        portfolioText,
      })
      alert('컨설팅 요청이 등록되었습니다!')
      router.push('/consulting')
    } catch {
      alert('요청 등록 중 오류가 발생했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  const PdfUploadSection = ({
    label, field, text, setText,
  }: {
    label: string; field: 'resume' | 'coverLetter' | 'portfolio'; text: string; setText: (v: string) => void
  }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label} (PDF)</label>
      <div className="flex items-center gap-2">
        <label className="cursor-pointer">
          <input
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) handlePdfUpload(field, f)
            }}
          />
          <span className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 cursor-pointer">
            {uploading === field ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" />추출 중...</>
            ) : text ? (
              <><CheckCircle className="h-4 w-4 mr-2 text-green-500" />변경</>
            ) : (
              <><Upload className="h-4 w-4 mr-2" />PDF 업로드</>
            )}
          </span>
        </label>
        {text && (
          <span className="text-xs text-muted-foreground">
            {text.length.toLocaleString()}자 추출됨
          </span>
        )}
      </div>
      {text && (
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-32 text-xs p-3 border rounded-lg bg-muted/30 resize-y"
          placeholder="추출된 텍스트 미리보기"
        />
      )}
    </div>
  )

  if (!student) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-6">
        <Link href="/consulting" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" />
          컨설팅 대시보드로 돌아가기
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            새 컨설팅 요청
          </CardTitle>
          <CardDescription>희망 직무와 관련 자료를 업로드하여 컨설팅을 요청하세요</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 기본 정보 */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground">기본 정보</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">희망 직무 *</label>
                <input
                  type="text"
                  value={desiredJob}
                  onChange={(e) => setDesiredJob(e.target.value)}
                  placeholder="예: 프론트엔드 개발자"
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">타겟 회사명</label>
                <input
                  type="text"
                  value={targetCompany}
                  onChange={(e) => setTargetCompany(e.target.value)}
                  placeholder="예: 네이버"
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
            </div>
          </div>

          {/* 채용공고 */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground">채용공고 정보</h3>
            <div className="space-y-2">
              <label className="text-sm font-medium">채용공고 URL</label>
              <input
                type="url"
                value={jobPostingUrl}
                onChange={(e) => setJobPostingUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">채용공고 내용 (텍스트)</label>
              <textarea
                value={jobPostingText}
                onChange={(e) => setJobPostingText(e.target.value)}
                placeholder="채용공고 내용을 붙여넣기 해주세요"
                className="w-full h-32 px-3 py-2 border rounded-lg text-sm resize-y"
              />
            </div>
          </div>

          {/* PDF 업로드 */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground">자료 업로드 (PDF → 텍스트 추출)</h3>
            <PdfUploadSection label="이력서" field="resume" text={resumeText} setText={setResumeText} />
            <PdfUploadSection label="자기소개서" field="coverLetter" text={coverLetterText} setText={setCoverLetterText} />
            <PdfUploadSection label="포트폴리오" field="portfolio" text={portfolioText} setText={setPortfolioText} />
          </div>

          {/* 제출 */}
          <div className="pt-4 border-t">
            <Button onClick={handleSubmit} disabled={submitting || !desiredJob.trim()} className="w-full">
              {submitting ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />요청 등록 중...</>
              ) : (
                '컨설팅 요청 등록'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
