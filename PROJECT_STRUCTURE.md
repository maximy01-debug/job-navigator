# 📁 Job Navigator - 프로젝트 구조 상세 설명

이 문서는 Job Navigator 프로젝트의 전체 폴더 구조와 각 파일의 역할을 자세히 설명합니다.

## 🌲 전체 디렉토리 구조

```
job-navigator/
├── src/                                # 소스 코드 루트
│   ├── app/                           # Next.js 14 App Router
│   │   ├── layout.tsx                # 🎨 전역 레이아웃 (HTML, Body 래퍼)
│   │   ├── page.tsx                  # 📊 대시보드 메인 페이지
│   │   ├── globals.css               # 🎨 Tailwind CSS 전역 스타일
│   │   ├── roadmap/                  # 로드맵 관련 페이지
│   │   │   └── page.tsx             # 📍 3년 로드맵 타임라인
│   │   ├── daily-goals/              # (예정) 일일 목표 페이지
│   │   └── projects/                 # (예정) 포트폴리오 페이지
│   │
│   ├── components/                    # 재사용 가능한 React 컴포넌트
│   │   ├── ui/                       # Shadcn/UI 기본 컴포넌트
│   │   │   ├── card.tsx             # 🃏 Card 컴포넌트
│   │   │   ├── button.tsx           # 🔘 Button 컴포넌트
│   │   │   └── progress.tsx         # 📊 Progress Bar 컴포넌트
│   │   │
│   │   ├── layout/                   # 레이아웃 컴포넌트
│   │   │   └── header.tsx           # 🧭 상단 네비게이션 바
│   │   │
│   │   ├── dashboard/                # 대시보드 전용 컴포넌트
│   │   │   ├── stats-card.tsx       # 📈 통계 카드
│   │   │   ├── daily-quest.tsx      # ✅ 오늘의 퀘스트
│   │   │   └── activity-feed.tsx    # 📰 최근 활동 피드
│   │   │
│   │   └── roadmap/                  # 로드맵 전용 컴포넌트
│   │       └── timeline-item.tsx    # 🗓️ 타임라인 아이템
│   │
│   └── lib/                          # 유틸리티 및 설정
│       ├── supabase/                # Supabase 클라이언트
│       │   ├── client.ts           # 🌐 브라우저 클라이언트
│       │   └── server.ts           # 🖥️ 서버 클라이언트
│       └── utils.ts                # 🛠️ 유틸리티 함수 (cn 등)
│
├── supabase/                         # Supabase 관련 파일
│   └── schema.sql                   # 🗄️ 데이터베이스 스키마
│
├── public/                           # 정적 파일 (이미지, 아이콘 등)
│
├── 설정 파일들
├── package.json                      # 📦 NPM 의존성 및 스크립트
├── tsconfig.json                     # ⚙️ TypeScript 설정
├── tailwind.config.ts                # 🎨 Tailwind CSS 설정
├── postcss.config.mjs                # 🎨 PostCSS 설정
├── next.config.mjs                   # ⚙️ Next.js 설정
├── .gitignore                        # 🚫 Git 무시 파일 목록
├── .env.local.example                # 🔐 환경변수 예시
│
└── 문서 파일들
    ├── README.md                     # 📖 프로젝트 개요
    ├── SETUP_GUIDE.md                # 🚀 설치 가이드
    └── PROJECT_STRUCTURE.md          # 📁 이 문서
```

---

## 📂 주요 디렉토리 설명

### 1️⃣ `src/app/` - Next.js App Router

Next.js 14의 App Router를 사용하는 페이지 디렉토리입니다.

#### `layout.tsx`
```typescript
// 전체 앱을 감싸는 루트 레이아웃
// - HTML, Body 태그 정의
// - 전역 CSS 임포트
// - 메타데이터 설정
```

#### `page.tsx`
```typescript
// 대시보드 메인 페이지 (/)
// - 통계 카드 4개
// - 오늘의 퀘스트
// - 최근 활동 피드
// - 학년별 로드맵 진행 상황
// - D-Day 카운터
```

#### `globals.css`
```css
/* Tailwind CSS 레이어 */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* CSS 변수 정의 (컬러, 폰트 등) */
/* Pretendard 폰트 CDN 임포트 */
```

#### `roadmap/page.tsx`
```typescript
// 로드맵 페이지 (/roadmap)
// - 전체 진행 상황 카드
// - 학년별 통계 (1, 2, 3학년)
// - 타임라인 리스트
// - 목표 추가 CTA
```

---

### 2️⃣ `src/components/` - React 컴포넌트

#### `ui/` - Shadcn/UI 기본 컴포넌트

**card.tsx**
```typescript
// Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
// 재사용 가능한 카드 컴포넌트
```

**button.tsx**
```typescript
// Button 컴포넌트
// variants: default, destructive, outline, secondary, ghost, link
// sizes: default, sm, lg, icon
```

**progress.tsx**
```typescript
// Progress Bar 컴포넌트
// value prop으로 진행률 표시 (0-100)
```

#### `layout/` - 레이아웃 컴포넌트

**header.tsx**
```typescript
// 상단 네비게이션 바
// - Job Navigator 로고
// - 메뉴: 대시보드, 로드맵, 프로젝트, 일일 목표
// - 로그인 버튼
// - 현재 페이지 하이라이트
```

#### `dashboard/` - 대시보드 컴포넌트

**stats-card.tsx**
```typescript
// 통계 카드 컴포넌트
// Props:
// - title: 카드 제목
// - value: 표시할 값
// - description: 설명
// - icon: Lucide React 아이콘
// - trend: 증감률 (선택)
```

**daily-quest.tsx**
```typescript
// 오늘의 퀘스트 컴포넌트
// - 진행률 바
// - 체크리스트 (완료/미완료)
// - 목표 추가 버튼
// - 완료 시 축하 메시지
```

**activity-feed.tsx**
```typescript
// 최근 활동 피드 컴포넌트
// - 활동 타입별 아이콘
// - 시간 정보 (date-fns 사용)
// - 활동 제목 및 설명
```

#### `roadmap/` - 로드맵 컴포넌트

**timeline-item.tsx**
```typescript
// 타임라인 아이템 컴포넌트
// Props:
// - title, description: 목표 정보
// - status: pending | in_progress | completed
// - grade: 1 | 2 | 3
// - targetDate: 목표 날짜
// - isLast: 마지막 아이템 여부
```

---

### 3️⃣ `src/lib/` - 유틸리티 및 설정

#### `supabase/client.ts`
```typescript
// 클라이언트 사이드 Supabase 클라이언트
// 브라우저에서 사용 (클라이언트 컴포넌트)
```

#### `supabase/server.ts`
```typescript
// 서버 사이드 Supabase 클라이언트
// 서버 컴포넌트, API 라우트에서 사용
// 쿠키 기반 인증 처리
```

#### `utils.ts`
```typescript
// cn() 함수: Tailwind CSS 클래스 병합
// clsx + tailwind-merge 조합
```

---

### 4️⃣ `supabase/schema.sql` - 데이터베이스 스키마

```sql
-- 1. Users 테이블
-- Supabase Auth와 연동, 사용자 프로필 정보

-- 2. Roadmaps 테이블
-- 학년별 로드맵 목표 (1, 2, 3학년)
-- 상태: pending, in_progress, completed

-- 3. Daily Goals 테이블
-- 일일 목표 내용 및 완료 여부

-- 4. Projects 테이블
-- 포트폴리오 프로젝트 정보

-- 인덱스, RLS 정책, Trigger 포함
```

---

## 🔑 주요 파일별 역할

### 설정 파일

| 파일 | 역할 |
|------|------|
| `package.json` | NPM 의존성, 스크립트 정의 |
| `tsconfig.json` | TypeScript 컴파일러 설정 |
| `tailwind.config.ts` | Tailwind CSS 커스텀 설정 |
| `next.config.mjs` | Next.js 빌드 및 이미지 설정 |
| `postcss.config.mjs` | PostCSS 플러그인 설정 |
| `.env.local` | 환경변수 (Supabase URL, Key) |

---

## 🎯 파일 네이밍 규칙

### 컴포넌트 파일
- **kebab-case**: `stats-card.tsx`, `activity-feed.tsx`
- **PascalCase 함수명**: `StatsCard`, `ActivityFeed`

### 페이지 파일
- **page.tsx**: 라우트 페이지
- **layout.tsx**: 레이아웃
- **loading.tsx**: 로딩 상태 (예정)
- **error.tsx**: 에러 상태 (예정)

### 유틸리티 파일
- **camelCase**: `utils.ts`, `client.ts`

---

## 📊 데이터 흐름

```
1. 사용자 요청 (브라우저)
   ↓
2. Next.js App Router (src/app/page.tsx)
   ↓
3. 컴포넌트 렌더링 (src/components/dashboard/*)
   ↓
4. Supabase 클라이언트 호출 (src/lib/supabase/client.ts)
   ↓
5. Supabase API (PostgreSQL 데이터베이스)
   ↓
6. 데이터 응답
   ↓
7. UI 업데이트
```

---

## 🚀 다음 구현 예정

### 추가할 페이지
- `src/app/daily-goals/page.tsx` - 일일 목표 관리
- `src/app/projects/page.tsx` - 포트폴리오 프로젝트
- `src/app/auth/login/page.tsx` - 로그인 페이지

### 추가할 컴포넌트
- `src/components/projects/project-card.tsx` - 프로젝트 카드
- `src/components/auth/login-form.tsx` - 로그인 폼
- `src/components/common/grass-calendar.tsx` - 잔디 심기 UI

### 추가할 기능
- Supabase Auth 연동
- 실시간 데이터베이스 CRUD
- 이미지 업로드 (Supabase Storage)
- PWA 지원

---

## 💡 컴포넌트 사용 예시

### StatsCard 사용
```tsx
import { StatsCard } from "@/components/dashboard/stats-card"
import { Trophy } from "lucide-react"

<StatsCard
  title="취득 자격증"
  value="3개"
  description="정보처리기능사 외 2개"
  icon={Trophy}
  trend={{ value: 12, isPositive: true }}
/>
```

### Button 사용
```tsx
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

<Button variant="default" size="lg">
  <Plus className="h-4 w-4 mr-2" />
  목표 추가
</Button>
```

---

이 구조를 기반으로 프로젝트를 확장해나가세요! 🎉
