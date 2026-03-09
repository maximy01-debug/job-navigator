"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageCircle, Plus, Clock, CheckCircle, Loader2 } from "lucide-react"
import { getCurrentStudent } from "@/lib/supabase/auth"
import { getConsultingRequestsByStudent } from "@/lib/consulting/storage"
import { STATUS_LABELS, STATUS_COLORS } from "@/lib/consulting/types"
import type { ConsultingRequest } from "@/lib/consulting/types"

export default function ConsultingDashboardPage() {
  const router = useRouter()
  const [requests, setRequests] = useState<ConsultingRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const student = getCurrentStudent()
    if (!student) {
      router.push("/auth/login")
      return
    }
    setRequests(getConsultingRequestsByStudent(student.student_number))
    setLoading(false)
  }, [router])

  const counts = {
    requested: requests.filter(r => r.status === 'requested').length,
    in_progress: requests.filter(r => r.status === 'in_progress').length,
    completed: requests.filter(r => r.status === 'completed').length,
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <MessageCircle className="h-6 w-6" />
            취업 컨설팅
          </h1>
          <p className="text-muted-foreground mt-1">이력서, 자소서, 포트폴리오 컨설팅을 요청하세요</p>
        </div>
        <div className="flex gap-2">
          <Link href="/consulting/results">
            <Button variant="outline">결과 보관함</Button>
          </Link>
          <Link href="/consulting/request">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              새 컨설팅 요청
            </Button>
          </Link>
        </div>
      </div>

      {/* 상태 요약 */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              요청 완료
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{counts.requested}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Loader2 className="h-4 w-4 text-yellow-500" />
              진행 중
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{counts.in_progress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              완료
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{counts.completed}</div>
          </CardContent>
        </Card>
      </div>

      {/* 요청 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>컨설팅 요청 목록</CardTitle>
          <CardDescription>내 컨설팅 요청 현황을 확인합니다</CardDescription>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg">아직 컨설팅 요청이 없습니다</p>
              <p className="text-sm mt-1">새 컨설팅 요청을 생성해 보세요</p>
              <Link href="/consulting/request">
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  새 컨설팅 요청
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {requests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((req) => (
                <div
                  key={req.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{req.desiredJob}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[req.status]}`}>
                        {STATUS_LABELS[req.status]}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {req.targetCompany && `${req.targetCompany} · `}
                      {new Date(req.createdAt).toLocaleDateString('ko-KR')}
                    </p>
                  </div>
                  {req.status === 'completed' && (
                    <Link href="/consulting/results">
                      <Button size="sm" variant="outline">결과 보기</Button>
                    </Link>
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
