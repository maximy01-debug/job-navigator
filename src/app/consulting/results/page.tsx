"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileCheck, Download, ArrowLeft, Loader2 } from "lucide-react"
import { getCurrentStudent } from "@/lib/supabase/auth"
import { getFinalizedResultsByStudent } from "@/lib/consulting/storage"
import { RESULT_TYPE_LABELS, RESULT_TYPE_COLORS } from "@/lib/consulting/types"
import type { ConsultingResult } from "@/lib/consulting/types"
import Link from "next/link"

export default function ConsultingResultsPage() {
  const router = useRouter()
  const [results, setResults] = useState<ConsultingResult[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    const student = getCurrentStudent()
    if (!student) { router.push("/auth/login"); return }
    setResults(getFinalizedResultsByStudent(student.student_number))
    setLoading(false)
  }, [router])

  const handleDownload = (result: ConsultingResult) => {
    const blob = new Blob([result.content], { type: 'text/plain;charset=utf-8' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${result.title}.txt`
    link.click()
    URL.revokeObjectURL(link.href)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/consulting" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" />
          컨설팅 대시보드로 돌아가기
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5" />
            컨설팅 결과 보관함
          </CardTitle>
          <CardDescription>컨설턴트가 확정한 피드백 결과를 확인하고 다운로드할 수 있습니다</CardDescription>
        </CardHeader>
        <CardContent>
          {results.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileCheck className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg">아직 확정된 결과가 없습니다</p>
              <p className="text-sm mt-1">컨설턴트가 피드백을 완료하면 여기에 표시됩니다</p>
            </div>
          ) : (
            <div className="space-y-4">
              {results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((result) => (
                <div key={result.id} className="border rounded-lg overflow-hidden">
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50"
                    onClick={() => setExpandedId(expandedId === result.id ? null : result.id)}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{result.title}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${RESULT_TYPE_COLORS[result.type]}`}>
                          {RESULT_TYPE_LABELS[result.type]}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(result.createdAt).toLocaleDateString('ko-KR')}
                      </p>
                    </div>
                    <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); handleDownload(result) }}>
                      <Download className="h-4 w-4 mr-1" />
                      다운로드
                    </Button>
                  </div>
                  {expandedId === result.id && (
                    <div className="px-4 pb-4 border-t">
                      <pre className="text-sm whitespace-pre-wrap bg-muted/30 p-4 rounded-lg mt-3 max-h-96 overflow-y-auto">
                        {result.content}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
