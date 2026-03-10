"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { getCurrentStudent, signOutStudent, getCurrentAdmin, signOutAdmin } from "@/lib/supabase/auth"
import type { Student } from "@/lib/students/data"

// ── Student Auth Context ──
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

// ── Admin Auth Context ──
interface Admin {
  username: string
  name: string
}

interface AdminAuthContextValue {
  admin: Admin | null
  adminLoading: boolean
  refreshAdminAuth: () => void
  adminLogout: () => void
}

const AdminAuthContext = createContext<AdminAuthContextValue>({
  admin: null,
  adminLoading: true,
  refreshAdminAuth: () => {},
  adminLogout: () => {},
})

export function useAdminAuth() {
  return useContext(AdminAuthContext)
}

// ── Combined Provider ──
export function AuthProvider({ children }: { children: ReactNode }) {
  // Student state
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

  // Admin state
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [adminLoading, setAdminLoading] = useState(true)

  const refreshAdminAuth = useCallback(() => {
    const current = getCurrentAdmin()
    setAdmin(current)
    setAdminLoading(false)
  }, [])

  const adminLogout = useCallback(() => {
    signOutAdmin()
    setAdmin(null)
  }, [])

  useEffect(() => {
    refreshAuth()
    refreshAdminAuth()

    // 다른 탭에서 로그인/로그아웃 시 동기화
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'logged_in_student') {
        refreshAuth()
      }
      if (e.key === 'logged_in_admin') {
        refreshAdminAuth()
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [refreshAuth, refreshAdminAuth])

  return (
    <AuthContext.Provider value={{ student, loading, refreshAuth, logout }}>
      <AdminAuthContext.Provider value={{ admin, adminLoading, refreshAdminAuth, adminLogout }}>
        {children}
      </AdminAuthContext.Provider>
    </AuthContext.Provider>
  )
}
