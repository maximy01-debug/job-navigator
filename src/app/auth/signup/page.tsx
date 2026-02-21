"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Target, CheckCircle2, Camera, User } from "lucide-react"
import { addStudent, getAllStudents, saveStudentPhoto } from "@/lib/students/storage"
import type { Student } from "@/lib/students/data"

const DEPARTMENTS = [
  '경영회계과',
  '전자전기과',
  '컴퓨터소프트웨어과',
  '스마트미디어과',
  '인공지능소프트웨어과',
  '일반과',
]

const CLUBS = [
  '진로탐색동아리',
  '학생자치동아리',
  '봉사활동동아리',
  '문화예술동아리',
  '체육동아리',
]

export default function SignUpPage() {
  const router = useRouter()
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [photoBase64, setPhotoBase64] = useState<string | null>(null)

  // CSV 1행(헤더) 기준 필드
  const [form, setForm] = useState({
    student_number: "",      // student_number
    name: "",                // name
    password: "",            // password
    department: "",          // department
    class_name: "",          // class_name
    gender: "",              // gender
    clubs_joined: [] as string[], // clubs_joined
    parent_share_consent: "No",  // parent_share_consent
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setPhotoBase64(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleClubToggle = (club: string) => {
    setForm(prev => ({
      ...prev,
      clubs_joined: prev.clubs_joined.includes(club)
        ? prev.clubs_joined.filter(c => c !== club)
        : [...prev.clubs_joined, club]
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // 필수 항목 검증
    if (!form.student_number || !form.name || !form.password || !form.department || !form.class_name || !form.gender) {
      setError("모든 필수 항목을 입력해주세요.")
      setLoading(false)
      return
    }

    const studentNum = parseInt(form.student_number)
    if (isNaN(studentNum) || studentNum <= 0) {
      setError("학생번호는 양의 정수여야 합니다.")
      setLoading(false)
      return
    }

    // 중복 학생번호 / 이름 체크
    const existing = getAllStudents()
    if (existing.some(s => s.student_number === studentNum)) {
      setError("이미 등록된 학생번호입니다.")
      setLoading(false)
      return
    }
    if (existing.some(s => s.name === form.name)) {
      setError("이미 등록된 이름입니다.")
      setLoading(false)
      return
    }

    const newStudent: Student = {
      student_number: studentNum,
      name: form.name,
      password: form.password,
      first_login: true,
      is_data_confirmed: false,
      department: form.department,
      class_name: form.class_name,
      gender: form.gender,
      clubs_joined: form.clubs_joined.join(', '),
      parent_share_consent: form.parent_share_consent,
      photo: '',
    }

    const ok = addStudent(newStudent)
    if (!ok) {
      setError("회원가입에 실패했습니다. 다시 시도해주세요.")
      setLoading(false)
      return
    }

    // 사진 업로드 시 관리자 학생사진 저장소에 저장
    if (photoBase64) {
      saveStudentPhoto(studentNum, photoBase64)
    }

    setSuccess(true)
    setLoading(false)
    setTimeout(() => router.push("/auth/login"), 2500)
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-8 pb-8">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-full bg-secondary/20 flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-secondary" />
                </div>
              </div>
              <h2 className="text-2xl font-bold">회원가입 완료!</h2>
              <p className="text-muted-foreground">
                학생 데이터베이스에 추가되었습니다.<br />
                잠시 후 로그인 페이지로 이동합니다...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4 py-10">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Target className="h-7 w-7 text-white" />
            </div>
          </div>
          <div className="text-center">
            <CardTitle className="text-2xl">Job Navigator 회원가입</CardTitle>
            <CardDescription>아래 정보를 입력하면 학생 DB에 등록됩니다</CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg">
                {error}
              </div>
            )}

            {/* student_number */}
            <div className="space-y-1">
              <label className="text-sm font-medium">학생번호 <span className="text-red-500">*</span></label>
              <input
                name="student_number"
                type="number"
                min="1"
                value={form.student_number}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="예) 26"
                required
              />
            </div>

            {/* name */}
            <div className="space-y-1">
              <label className="text-sm font-medium">이름 <span className="text-red-500">*</span></label>
              <input
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="홍길동"
                required
              />
            </div>

            {/* password */}
            <div className="space-y-1">
              <label className="text-sm font-medium">비밀번호(학생번호) <span className="text-red-500">*</span></label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="로그인 시 사용할 비밀번호"
                required
              />
            </div>

            {/* department */}
            <div className="space-y-1">
              <label className="text-sm font-medium">학과 <span className="text-red-500">*</span></label>
              <select
                name="department"
                value={form.department}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                required
              >
                <option value="">학과를 선택하세요</option>
                {DEPARTMENTS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* class_name */}
            <div className="space-y-1">
              <label className="text-sm font-medium">반 <span className="text-red-500">*</span></label>
              <input
                name="class_name"
                type="text"
                value={form.class_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="예) 1반"
                required
              />
            </div>

            {/* gender */}
            <div className="space-y-1">
              <label className="text-sm font-medium">성별 <span className="text-red-500">*</span></label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                required
              >
                <option value="">성별을 선택하세요</option>
                <option value="남">남</option>
                <option value="여">여</option>
              </select>
            </div>

            {/* clubs_joined */}
            <div className="space-y-1">
              <label className="text-sm font-medium">가입한 동아리 (복수 선택 가능)</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {CLUBS.map(club => (
                  <button
                    key={club}
                    type="button"
                    onClick={() => handleClubToggle(club)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      form.clubs_joined.includes(club)
                        ? 'bg-primary text-white border-primary'
                        : 'bg-background text-muted-foreground border-border hover:border-primary'
                    }`}
                  >
                    {club}
                  </button>
                ))}
              </div>
              {form.clubs_joined.length > 0 && (
                <p className="text-xs text-muted-foreground mt-1">선택됨: {form.clubs_joined.join(', ')}</p>
              )}
            </div>

            {/* parent_share_consent */}
            <div className="space-y-1">
              <label className="text-sm font-medium">보호자 공유 동의</label>
              <select
                name="parent_share_consent"
                value={form.parent_share_consent}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
              >
                <option value="No">동의 안함 (No)</option>
                <option value="Yes">동의함 (Yes)</option>
              </select>
            </div>

            {/* photo */}
            <div className="space-y-2">
              <label className="text-sm font-medium">프로필 사진 (선택)</label>
              <div className="flex items-center gap-4">
                {/* 미리보기 */}
                <div className="h-20 w-20 rounded-full border-2 border-dashed border-border flex items-center justify-center overflow-hidden bg-muted flex-shrink-0">
                  {photoBase64 ? (
                    <img src={photoBase64} alt="미리보기" className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => document.getElementById('photo-upload')?.click()}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    {photoBase64 ? "사진 변경" : "사진 업로드"}
                  </Button>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                  {photoBase64 && (
                    <button
                      type="button"
                      onClick={() => setPhotoBase64(null)}
                      className="text-xs text-muted-foreground hover:text-red-500 w-full text-center"
                    >
                      사진 삭제
                    </button>
                  )}
                  <p className="text-xs text-muted-foreground">
                    업로드한 사진은 관리자 학생사진 폴더에 저장됩니다
                  </p>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "등록 중..." : "회원가입 (DB에 추가)"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">이미 계정이 있으신가요? </span>
            <Link href="/auth/login" className="text-primary hover:underline font-medium">
              로그인
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
