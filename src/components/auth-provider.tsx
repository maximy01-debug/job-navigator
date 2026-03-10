"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { getCurrentStudent, signOutStudent } from "@/lib/supabase/auth"
import type { Student } from "@/lib/students/data"

interface AuthContextValue {
  student: Student | null
  loading: boolean
  refreshAuth: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue>({
  student: null,
  loading: true,
  refreshAuth: () => {},
  logout: () => {},
})

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [student, setStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshAuth = useCallback(() => {
    const current = getCurrentStudent()
    setStudent(current)
    setLoading(false)
  }, [])

  const logout = useCallback(() => {
    signOutStudent()
    setStudent(null)
  }, [])

  useEffect(() => {
    refreshAuth()

    // 다른 탭에서 로그인/로그아웃 시 동기화
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'logged_in_student') {
        refreshAuth()
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [refreshAuth])

  return (
    <AuthContext.Provider value={{ student, loading, refreshAuth, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
