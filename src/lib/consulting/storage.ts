import type {
  ConsultingRequest, ConsultingRequestStatus,
  PromptTemplate,
  ConsultingResult, ConsultingResultType,
} from './types'

// ── localStorage 키 ──
const REQUESTS_KEY = 'consulting_requests'
const PROMPTS_KEY  = 'consultant_prompts'
const RESULTS_KEY  = 'consulting_results'

// ── 공통 헬퍼 ──
function loadArray<T>(key: string): T[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function saveArray<T>(key: string, data: T[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(data))
}

const genId = () => Date.now().toString()
const now   = () => new Date().toISOString()

// ════════════════════════════════════════════════════
// ConsultingRequest CRUD
// ════════════════════════════════════════════════════

export function getAllConsultingRequests(): ConsultingRequest[] {
  return loadArray<ConsultingRequest>(REQUESTS_KEY)
}

export function getConsultingRequestsByStudent(studentNumber: number): ConsultingRequest[] {
  return getAllConsultingRequests().filter(r => r.studentNumber === studentNumber)
}

export function getConsultingRequestById(id: string): ConsultingRequest | null {
  return getAllConsultingRequests().find(r => r.id === id) ?? null
}

export function addConsultingRequest(
  req: Omit<ConsultingRequest, 'id' | 'createdAt' | 'updatedAt'>
): ConsultingRequest {
  const list = getAllConsultingRequests()
  const newReq: ConsultingRequest = { ...req, id: genId(), createdAt: now(), updatedAt: now() }
  list.push(newReq)
  saveArray(REQUESTS_KEY, list)
  return newReq
}

export function updateConsultingRequest(id: string, updates: Partial<ConsultingRequest>): void {
  const list = getAllConsultingRequests().map(r =>
    r.id === id ? { ...r, ...updates, updatedAt: now() } : r
  )
  saveArray(REQUESTS_KEY, list)
}

export function deleteConsultingRequest(id: string): void {
  saveArray(REQUESTS_KEY, getAllConsultingRequests().filter(r => r.id !== id))
}

// ════════════════════════════════════════════════════
// PromptTemplate CRUD
// ════════════════════════════════════════════════════

export function getAllPromptTemplates(): PromptTemplate[] {
  return loadArray<PromptTemplate>(PROMPTS_KEY)
}

export function getPromptTemplatesByMajor(major: string): PromptTemplate[] {
  return getAllPromptTemplates().filter(t => t.major === major)
}

export function getPromptTemplatesByJobType(jobType: string): PromptTemplate[] {
  return getAllPromptTemplates().filter(t => t.jobType === jobType)
}

export function addPromptTemplate(
  tpl: Omit<PromptTemplate, 'id' | 'createdAt' | 'updatedAt'>
): PromptTemplate {
  const list = getAllPromptTemplates()
  const newTpl: PromptTemplate = { ...tpl, id: genId(), createdAt: now(), updatedAt: now() }
  list.push(newTpl)
  saveArray(PROMPTS_KEY, list)
  return newTpl
}

export function updatePromptTemplate(id: string, updates: Partial<PromptTemplate>): void {
  const list = getAllPromptTemplates().map(t =>
    t.id === id ? { ...t, ...updates, updatedAt: now() } : t
  )
  saveArray(PROMPTS_KEY, list)
}

export function deletePromptTemplate(id: string): void {
  saveArray(PROMPTS_KEY, getAllPromptTemplates().filter(t => t.id !== id))
}

// ════════════════════════════════════════════════════
// ConsultingResult CRUD
// ════════════════════════════════════════════════════

function getAllResults(): ConsultingResult[] {
  return loadArray<ConsultingResult>(RESULTS_KEY)
}

export function getResultsByRequestId(requestId: string): ConsultingResult[] {
  return getAllResults().filter(r => r.requestId === requestId)
}

export function getFinalizedResultsByStudent(studentNumber: number): ConsultingResult[] {
  const reqIds = new Set(
    getConsultingRequestsByStudent(studentNumber).map(r => r.id)
  )
  return getAllResults().filter(r => r.isFinalized && reqIds.has(r.requestId))
}

export function addConsultingResult(
  res: Omit<ConsultingResult, 'id' | 'createdAt'>
): ConsultingResult {
  const list = getAllResults()
  const newRes: ConsultingResult = { ...res, id: genId(), createdAt: now() }
  list.push(newRes)
  saveArray(RESULTS_KEY, list)
  return newRes
}

export function updateConsultingResult(id: string, updates: Partial<ConsultingResult>): void {
  const list = getAllResults().map(r =>
    r.id === id ? { ...r, ...updates } : r
  )
  saveArray(RESULTS_KEY, list)
}

export function deleteConsultingResult(id: string): void {
  saveArray(RESULTS_KEY, getAllResults().filter(r => r.id !== id))
}

export function finalizeResult(id: string): void {
  updateConsultingResult(id, { isFinalized: true })
}
