// 학생 확장 데이터 (프로젝트, 상담내용, 학교성적) localStorage 저장소

// ── 타입 정의 ──────────────────────────────────────────

export interface Project {
  id: string
  title: string
  description: string
  githubUrl: string
  demoUrl: string
  status: 'planned' | 'in_progress' | 'completed'
  techStack: string      // 쉼표 구분 문자열
  createdAt: string      // ISO
}

export interface CounselingRecord {
  id: string
  date: string           // yyyy-MM-dd
  counselor: string
  category: '진로' | '학업' | '생활' | '심리' | '기타'
  content: string
  followUp: string
  nextDate: string       // yyyy-MM-dd (공백 허용)
}

export interface GradeRecord {
  id: string
  year: string           // 예) 2025
  semester: '1학기' | '2학기'
  subject: string
  score: number          // 0~100
  grade: string          // A+, A, B+, … 또는 수우미양가
  rank: string           // 선택 (예: 3/30)
  notes: string
}

// ── localStorage 키 ──────────────────────────────────

const PROJECTS_KEY    = 'admin_student_projects'
const COUNSELING_KEY  = 'admin_student_counseling'
const GRADES_KEY      = 'admin_student_grades'

// ── 헬퍼 ─────────────────────────────────────────────

function load<T>(key: string): Record<number, T[]> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}

function save<T>(key: string, data: Record<number, T[]>): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(data))
}

// ── 프로젝트 ─────────────────────────────────────────

export function getProjects(studentNumber: number): Project[] {
  return load<Project>(PROJECTS_KEY)[studentNumber] ?? []
}

export function addProject(studentNumber: number, project: Omit<Project, 'id' | 'createdAt'>): void {
  const db = load<Project>(PROJECTS_KEY)
  const list = db[studentNumber] ?? []
  list.push({ ...project, id: Date.now().toString(), createdAt: new Date().toISOString() })
  db[studentNumber] = list
  save(PROJECTS_KEY, db)
}

export function updateProject(studentNumber: number, id: string, updates: Partial<Project>): void {
  const db = load<Project>(PROJECTS_KEY)
  db[studentNumber] = (db[studentNumber] ?? []).map(p => p.id === id ? { ...p, ...updates } : p)
  save(PROJECTS_KEY, db)
}

export function deleteProject(studentNumber: number, id: string): void {
  const db = load<Project>(PROJECTS_KEY)
  db[studentNumber] = (db[studentNumber] ?? []).filter(p => p.id !== id)
  save(PROJECTS_KEY, db)
}

// ── 상담내용 ─────────────────────────────────────────

export function getCounselingRecords(studentNumber: number): CounselingRecord[] {
  return load<CounselingRecord>(COUNSELING_KEY)[studentNumber] ?? []
}

export function addCounselingRecord(studentNumber: number, record: Omit<CounselingRecord, 'id'>): void {
  const db = load<CounselingRecord>(COUNSELING_KEY)
  const list = db[studentNumber] ?? []
  list.push({ ...record, id: Date.now().toString() })
  db[studentNumber] = list.sort((a, b) => b.date.localeCompare(a.date))
  save(COUNSELING_KEY, db)
}

export function updateCounselingRecord(studentNumber: number, id: string, updates: Partial<CounselingRecord>): void {
  const db = load<CounselingRecord>(COUNSELING_KEY)
  db[studentNumber] = (db[studentNumber] ?? []).map(r => r.id === id ? { ...r, ...updates } : r)
  save(COUNSELING_KEY, db)
}

export function deleteCounselingRecord(studentNumber: number, id: string): void {
  const db = load<CounselingRecord>(COUNSELING_KEY)
  db[studentNumber] = (db[studentNumber] ?? []).filter(r => r.id !== id)
  save(COUNSELING_KEY, db)
}

// ── 학교성적 ─────────────────────────────────────────

export function getGradeRecords(studentNumber: number): GradeRecord[] {
  return load<GradeRecord>(GRADES_KEY)[studentNumber] ?? []
}

export function addGradeRecord(studentNumber: number, record: Omit<GradeRecord, 'id'>): void {
  const db = load<GradeRecord>(GRADES_KEY)
  const list = db[studentNumber] ?? []
  list.push({ ...record, id: Date.now().toString() })
  // 연도 내림차순, 학기 내림차순 정렬
  db[studentNumber] = list.sort((a, b) =>
    b.year.localeCompare(a.year) || b.semester.localeCompare(a.semester)
  )
  save(GRADES_KEY, db)
}

export function updateGradeRecord(studentNumber: number, id: string, updates: Partial<GradeRecord>): void {
  const db = load<GradeRecord>(GRADES_KEY)
  db[studentNumber] = (db[studentNumber] ?? []).map(r => r.id === id ? { ...r, ...updates } : r)
  save(GRADES_KEY, db)
}

export function deleteGradeRecord(studentNumber: number, id: string): void {
  const db = load<GradeRecord>(GRADES_KEY)
  db[studentNumber] = (db[studentNumber] ?? []).filter(r => r.id !== id)
  save(GRADES_KEY, db)
}
