// ── 컨설팅 요청 ──

export type ConsultingRequestStatus = 'requested' | 'in_progress' | 'completed'

export interface ConsultingRequest {
  id: string
  studentNumber: number
  studentName: string
  status: ConsultingRequestStatus
  desiredJob: string
  targetCompany: string
  jobPostingUrl: string
  jobPostingText: string
  resumeText: string
  coverLetterText: string
  portfolioText: string
  createdAt: string
  updatedAt: string
}

export const STATUS_LABELS: Record<ConsultingRequestStatus, string> = {
  requested: '요청 완료',
  in_progress: '진행 중',
  completed: '완료',
}

export const STATUS_COLORS: Record<ConsultingRequestStatus, string> = {
  requested: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-green-100 text-green-700',
}

// ── 프롬프트 템플릿 ──

export interface PromptTemplate {
  id: string
  name: string
  category: string
  major: string
  jobType: string
  systemPrompt: string
  createdAt: string
  updatedAt: string
}

export const MAJOR_OPTIONS = ['IT개발', '경영지원', '디자인', '마케팅', '전자전기', '미디어', '기타'] as const
export const JOB_TYPE_OPTIONS = ['포트폴리오_분석용', '면접질문_추출용', '자소서_피드백용', '직무기술서_작성용', '기타'] as const

// ── 컨설팅 결과 ──

export type ConsultingResultType = 'cover_letter_feedback' | 'job_description' | 'interview_qa'

export interface ConsultingResult {
  id: string
  requestId: string
  type: ConsultingResultType
  title: string
  content: string
  isFinalized: boolean
  createdAt: string
}

export const RESULT_TYPE_LABELS: Record<ConsultingResultType, string> = {
  cover_letter_feedback: '자소서 피드백',
  job_description: '직무기술서',
  interview_qa: '모의면접 Q&A',
}

export const RESULT_TYPE_COLORS: Record<ConsultingResultType, string> = {
  cover_letter_feedback: 'bg-blue-100 text-blue-700',
  job_description: 'bg-purple-100 text-purple-700',
  interview_qa: 'bg-green-100 text-green-700',
}
