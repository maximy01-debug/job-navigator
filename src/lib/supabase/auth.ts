import { createClient } from './client'
import { authenticateStudent, type Student } from '@/lib/students/data'

// 로컬 스토리지 키
const STUDENT_STORAGE_KEY = 'logged_in_student'

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
  const student = authenticateStudent(name, studentNumber)

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
