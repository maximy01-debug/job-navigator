import { Student, students as defaultStudents } from './data'

const STUDENTS_DB_KEY = 'students_database'
const STUDENT_PHOTOS_KEY = 'student_photos'

// 학생 데이터베이스 초기화
export function initializeStudentsDB(): void {
  if (typeof window === 'undefined') return

  const existing = localStorage.getItem(STUDENTS_DB_KEY)
  if (!existing) {
    localStorage.setItem(STUDENTS_DB_KEY, JSON.stringify(defaultStudents))
  }
}

// 모든 학생 가져오기
export function getAllStudents(): Student[] {
  if (typeof window === 'undefined') return defaultStudents

  const stored = localStorage.getItem(STUDENTS_DB_KEY)
  if (!stored) {
    initializeStudentsDB()
    return defaultStudents
  }

  try {
    return JSON.parse(stored) as Student[]
  } catch {
    return defaultStudents
  }
}

// 학생 데이터 업데이트
export function updateStudent(studentNumber: number, updatedData: Partial<Student>): boolean {
  if (typeof window === 'undefined') return false

  const students = getAllStudents()
  const index = students.findIndex(s => s.student_number === studentNumber)

  if (index === -1) return false

  students[index] = { ...students[index], ...updatedData }
  localStorage.setItem(STUDENTS_DB_KEY, JSON.stringify(students))
  return true
}

// 학생 추가
export function addStudent(student: Student): boolean {
  if (typeof window === 'undefined') return false

  const students = getAllStudents()

  // 중복 확인
  if (students.some(s => s.student_number === student.student_number)) {
    return false
  }

  students.push(student)
  localStorage.setItem(STUDENTS_DB_KEY, JSON.stringify(students))
  return true
}

// 학생 삭제
export function deleteStudent(studentNumber: number): boolean {
  if (typeof window === 'undefined') return false

  const students = getAllStudents()
  const filtered = students.filter(s => s.student_number !== studentNumber)

  if (filtered.length === students.length) return false

  localStorage.setItem(STUDENTS_DB_KEY, JSON.stringify(filtered))
  return true
}

// 학생 사진 저장 (Base64)
export function saveStudentPhoto(studentNumber: number, photoBase64: string): void {
  if (typeof window === 'undefined') return

  const photos = getStudentPhotos()
  photos[studentNumber] = photoBase64
  localStorage.setItem(STUDENT_PHOTOS_KEY, JSON.stringify(photos))
}

// 모든 학생 사진 가져오기
export function getStudentPhotos(): Record<number, string> {
  if (typeof window === 'undefined') return {}

  const stored = localStorage.getItem(STUDENT_PHOTOS_KEY)
  if (!stored) return {}

  try {
    return JSON.parse(stored) as Record<number, string>
  } catch {
    return {}
  }
}

// 특정 학생 사진 가져오기
export function getStudentPhoto(studentNumber: number): string | null {
  const photos = getStudentPhotos()
  return photos[studentNumber] || null
}

// CSV에서 학생 데이터 일괄 업로드
export function uploadStudentsFromCSV(csvData: Student[]): boolean {
  if (typeof window === 'undefined') return false

  try {
    localStorage.setItem(STUDENTS_DB_KEY, JSON.stringify(csvData))
    return true
  } catch {
    return false
  }
}
