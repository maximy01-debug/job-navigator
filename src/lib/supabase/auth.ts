import { createClient } from './client'
import { type Student } from '@/lib/students/data'
import { getAllStudents } from '@/lib/students/storage'

// 로컬 스토리지 키
const STUDENT_STORAGE_KEY = 'logged_in_student'
const ADMIN_STORAGE_KEY = 'logged_in_admin'

// 관리자 계정 (실제로는 데이터베이스에 저장해야 함)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin1234',
  name: '시스템 관리자'
}

export interface Admin {
  username: string
  name: string
}

export async function signUp(email: string, password: string, name: string) {
  const supabase = createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  })

  return { data, error }
}

export async function signIn(email: string, password: string) {
  const supabase = createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  return { data, error }
}

export async function signOut() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getCurrentUser() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function signInWithGoogle() {
  const supabase = createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })

  return { data, error }
}

export async function signInWithGithub() {
  const supabase = createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })

  return { data, error }
}

// 학생 로그인 (이름 + 학생번호)
export function signInAsStudent(name: string, studentNumber: string): { success: boolean; student: Student | null; error?: string } {
  // 로컬스토리지에서 학생 데이터 가져오기
  const students = getAllStudents()
  const student = students.find(
    s => s.name === name && s.student_number.toString() === studentNumber
  )

  if (student) {
    // 로컬 스토리지에 학생 정보 저장
    if (typeof window !== 'undefined') {
      localStorage.setItem(STUDENT_STORAGE_KEY, JSON.stringify(student))
    }
    return { success: true, student }
  }

  return { success: false, student: null, error: '이름 또는 학생번호가 일치하지 않습니다.' }
}

// 현재 로그인된 학생 정보 가져오기
export function getCurrentStudent(): Student | null {
  if (typeof window === 'undefined') return null

  const stored = localStorage.getItem(STUDENT_STORAGE_KEY)
  if (!stored) return null

  try {
    return JSON.parse(stored) as Student
  } catch {
    return null
  }
}

// 학생 로그아웃
export function signOutStudent(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STUDENT_STORAGE_KEY)
  }
}

// 관리자 로그인
export function signInAsAdmin(username: string, password: string): { success: boolean; admin: Admin | null; error?: string } {
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    const admin: Admin = {
      username: ADMIN_CREDENTIALS.username,
      name: ADMIN_CREDENTIALS.name
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(admin))
    }

    return { success: true, admin }
  }

  return { success: false, admin: null, error: '아이디 또는 비밀번호가 일치하지 않습니다.' }
}

// 현재 로그인된 관리자 정보 가져오기
export function getCurrentAdmin(): Admin | null {
  if (typeof window === 'undefined') return null

  const stored = localStorage.getItem(ADMIN_STORAGE_KEY)
  if (!stored) return null

  try {
    return JSON.parse(stored) as Admin
  } catch {
    return null
  }
}

// 관리자 로그아웃
export function signOutAdmin(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(ADMIN_STORAGE_KEY)
  }
}
