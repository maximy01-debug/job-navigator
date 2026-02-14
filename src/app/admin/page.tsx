"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getCurrentAdmin, signOutAdmin } from "@/lib/supabase/auth"
import { getAllStudents, getStudentPhotos, saveStudentPhoto, uploadStudentsFromCSV } from "@/lib/students/storage"
import { Shield, Users, Upload, Image as ImageIcon, LogOut, Download } from "lucide-react"
import type { Student } from "@/lib/students/data"

export default function AdminDashboardPage() {
  const router = useRouter()
  const [admin, setAdmin] = useState<any>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [photos, setPhotos] = useState<Record<number, string>>({})
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null)
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    const currentAdmin = getCurrentAdmin()
    if (!currentAdmin) {
      router.push("/admin/login")
      return
    }

    setAdmin(currentAdmin)
    loadData()
  }, [router])

  const loadData = () => {
    setStudents(getAllStudents())
    setPhotos(getStudentPhotos())
  }

  const handleLogout = () => {
    signOutAdmin()
    router.push("/admin/login")
  }

  const handlePhotoUpload = (studentNumber: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result as string
      saveStudentPhoto(studentNumber, base64)
      loadData()
    }
    reader.readAsDataURL(file)
  }

  const handleCSVUpload = () => {
    if (!csvFile) return

    setUploading(true)
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string
        const lines = text.split('\n')
        const headers = lines[0].split(',')

        const parsedStudents: Student[] = []

        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim()
          if (!line) continue

          const values = line.split(',')
          const student: Student = {
            student_number: parseInt(values[0]),
            name: values[1],
            password: values[2],
            first_login: values[3] === 'TRUE',
            is_data_confirmed: values[4] === 'FALSE',
            department: values[5],
            class_name: values[6],
            gender: values[7],
            clubs_joined: values[8],
            parent_share_consent: values[9],
            photo: values[10] || ''
          }
          parsedStudents.push(student)
        }

        if (uploadStudentsFromCSV(parsedStudents)) {
          alert(`${parsedStudents.length}명의 학생 데이터가 업로드되었습니다.`)
          loadData()
        } else {
          alert('업로드에 실패했습니다.')
        }
      } catch (error) {
        alert('CSV 파일 파싱 중 오류가 발생했습니다.')
      } finally {
        setUploading(false)
        setCsvFile(null)
      }
    }
    reader.readAsText(csvFile)
  }

  const exportToCSV = () => {
    const headers = ['student_number', 'name', 'password', 'first_login', 'is_data_confirmed', 'department', 'class_name', 'gender', 'clubs_joined', 'parent_share_consent', 'photo']
    const csvContent = [
      headers.join(','),
      ...students.map(s => [
        s.student_number,
        s.name,
        s.password,
        s.first_login,
        s.is_data_confirmed,
        s.department,
        s.class_name,
        s.gender,
        s.clubs_joined,
        s.parent_share_consent,
        s.photo
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `students_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  if (!admin) {
    return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Admin Header */}
      <header className="border-b bg-red-500 text-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-6 w-6" />
              <div>
                <h1 className="text-lg font-bold">관리자 대시보드</h1>
                <p className="text-xs text-red-100">{admin.name}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="text-white border-white hover:bg-red-600"
            >
              <LogOut className="h-4 w-4 mr-2" />
              로그아웃
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">총 학생 수</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{students.length}명</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">사진 등록</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{Object.keys(photos).length}명</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">사진 미등록</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{students.length - Object.keys(photos).length}명</div>
            </CardContent>
          </Card>
        </div>

        {/* CSV Upload Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="h-5 w-5" />
              <span>학생 데이터 관리</span>
            </CardTitle>
            <CardDescription>CSV 파일로 학생 데이터를 일괄 업로드하거나 다운로드할 수 있습니다</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                className="flex-1 text-sm"
              />
              <Button
                onClick={handleCSVUpload}
                disabled={!csvFile || uploading}
              >
                {uploading ? "업로드 중..." : "CSV 업로드"}
              </Button>
              <Button
                variant="outline"
                onClick={exportToCSV}
              >
                <Download className="h-4 w-4 mr-2" />
                CSV 다운로드
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              CSV 파일 형식: student_number, name, password, first_login, is_data_confirmed, department, class_name, gender, clubs_joined, parent_share_consent, photo
            </p>
          </CardContent>
        </Card>

        {/* Students List with Photo Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>학생 목록 및 사진 관리</span>
            </CardTitle>
            <CardDescription>학생별로 사진을 업로드할 수 있습니다</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {students.map((student) => (
                <div
                  key={student.student_number}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                >
                  <div className="flex items-center space-x-4">
                    <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                      {photos[student.student_number] ? (
                        <img
                          src={photos[student.student_number]}
                          alt={student.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Users className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-muted-foreground">
                        학생번호: {student.student_number} | {student.department} {student.class_name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <label htmlFor={`photo-${student.student_number}`} className="cursor-pointer">
                      <Button size="sm" variant="outline" type="button">
                        <ImageIcon className="h-4 w-4 mr-2" />
                        {photos[student.student_number] ? "사진 변경" : "사진 업로드"}
                      </Button>
                    </label>
                    <input
                      id={`photo-${student.student_number}`}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handlePhotoUpload(student.student_number, e)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
