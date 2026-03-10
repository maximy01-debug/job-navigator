"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, MessageCircle, ArrowLeft, Wrench } from "lucide-react"
import { useAdminAuth } from "@/components/auth-provider"
import { getAllConsultingRequests, updateConsultingRequest } from "@/lib/consulting/storage"
import { STATUS_LABELS, STATUS_COLORS } from "@/lib/consulting/types"
import type { ConsultingRequest, ConsultingRequestStatus } from "@/lib/consulting/types"

export default function AdminConsultingPage() {
  const router = useRouter()
  const [requests, setRequests] = useState<ConsultingRequest[]>([])
  const { admin, adminLoading } = useAdminAuth()
  const [filter, setFilter] = useState<ConsultingRequestStatus | 'all'>('all')

  useEffect(() => {
    if (adminLoading) return
    if (!admin) { router.push("/admin/login"); return }
    reload()
  }, [admin, adminLoading, router])

  const reload = () => setRequests(getAllConsultingRequests())

  const handleStatusChange = (id: string, status: ConsultingRequestStatus) => {
    updateConsultingRequest(id, { status })
    reload()
  }

  const filtered = filter === 'all' ? requests : requests.filter(r => r.status === filter)

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <header className="border-b bg-red-500 text-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-6 w-6" />
              <div>
                <h1 className="text-lg font-bold">컨설팅 요청 관리</h1>
                <p className="text-xs text-red-100">학생 컨설팅 요청을 관리합니다</p>
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
        {/* 필터 */}
        <div className="flex gap-2 mb-6">
          {(['all', 'requested', 'in_progress', 'completed'] as const).map((s) => (
            <Button
              key={s}
              variant={filter === s ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(s)}
            >
              {s === 'all' ? `전체 (${requests.length})` : `${STATUS_LABELS[s]} (${requests.filter(r => r.status === s).length})`}
            </Button>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              컨설팅 요청 목록
            </CardTitle>
            <CardDescription>
              {filtered.length}개의 요청
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p>컨설팅 요청이 없습니다</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((req) => (
                  <div key={req.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{req.studentName}</span>
                        <span className="text-xs text-muted-foreground">#{req.studentNumber}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[req.status]}`}>
                          {STATUS_LABELS[req.status]}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {req.desiredJob}{req.targetCompany && ` · ${req.targetCompany}`} · {new Date(req.createdAt).toLocaleDateString('ko-KR')}
                      </p>
                      <div className="flex gap-1 mt-1">
                        {req.resumeText && <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">이력서</span>}
                        {req.coverLetterText && <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">자소서</span>}
                        {req.portfolioText && <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">포트폴리오</span>}
                        {req.jobPostingText && <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">채용공고</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={req.status}
                        onChange={(e) => handleStatusChange(req.id, e.target.value as ConsultingRequestStatus)}
                        className="text-xs border rounded px-2 py-1"
                      >
                        <option value="requested">요청 완료</option>
                        <option value="in_progress">진행 중</option>
                        <option value="completed">완료</option>
                      </select>
                      <Link href={`/admin/consulting/workspace/${req.id}`}>
                        <Button size="sm">
                          <Wrench className="h-4 w-4 mr-1" />
                          워크스페이스
                        </Button>
                      </Link>
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
