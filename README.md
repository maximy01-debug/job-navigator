# 🎯 Job Navigator

> 특성화고 학생들을 위한 3년 취업 로드맵 관리 플랫폼

특성화고 학생들이 고교 3년 동안의 취업 로드맵을 설정하고, 매일의 목표(Daily Goal)를 달성하며, 프로젝트와 학습 기록을 아카이빙하여 취업용 포트폴리오로 활용할 수 있는 웹 플랫폼입니다.

## ✨ 주요 기능

### 1. 📍 Career Roadmap (비전 설정)
- 1학년, 2학년, 3학년 별 주요 목표 설정 (예: 자격증 취득, 공모전 수상)
- 타임라인 UI로 시각화하여 현재 위치 표시
- 학년별 진행률 추적

### 2. ✅ Daily Quest (일일 목표 관리)
- 매일 아침 "오늘의 목표" 3가지 설정
- 체크리스트 형태로 완료 시 성취감 부여
- 경험치 바 상승 등 Gamification 요소
- 잔디 심기(GitHub Contribution 스타일) UI로 성실도 시각화

### 3. 📁 Archive & Project (포트폴리오)
- 수업 결과물, 개인 프로젝트, 자격증 공부 흔적 업로드
- 텍스트, 이미지, GitHub 링크, 배포 URL 등을 카드 형태로 정리
- 태그 기능 지원 (#React, #Python, #정보처리기능사)

### 4. 📊 Dashboard (내 상황판)
- 현재 로드맵 달성률 시각화
- 최근 활동 로그 요약
- D-Day 카운터 (예: 취업 박람회까지 D-30)

## 🛠 기술 스택

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn/UI
- **Icons**: Lucide React

### Backend & Database
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (소셜 로그인 지원)
- **Storage**: Supabase Storage (이미지/파일 업로드)

### Deployment
- **Hosting**: Vercel / Netlify
- **Version Control**: Git/GitHub

## 📂 프로젝트 구조

```
job-navigator/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx           # 루트 레이아웃
│   │   ├── page.tsx             # 대시보드 (메인 페이지)
│   │   ├── roadmap/             # 로드맵 페이지
│   │   ├── daily-goals/         # 일일 목표 페이지
│   │   └── projects/            # 프로젝트 페이지
│   │
│   ├── components/               # 재사용 가능한 컴포넌트
│   │   ├── ui/                  # Shadcn/UI 컴포넌트
│   │   ├── dashboard/           # 대시보드 컴포넌트
│   │   ├── roadmap/             # 로드맵 컴포넌트
│   │   └── layout/              # 레이아웃 컴포넌트
│   │
│   └── lib/                      # 유틸리티 및 설정
│       ├── supabase/            # Supabase 클라이언트
│       └── utils.ts             # 유틸리티 함수
│
├── supabase/
│   └── schema.sql               # 데이터베이스 스키마
│
├── public/                       # 정적 파일
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.mjs
```

## 🚀 시작하기

### 1. 저장소 클론

```bash
git clone https://github.com/your-username/job-navigator.git
cd job-navigator
```

### 2. 의존성 설치

```bash
npm install
# 또는
yarn install
# 또는
pnpm install
```

### 3. 환경변수 설정

`.env.local.example` 파일을 복사하여 `.env.local` 파일을 생성하고, Supabase 프로젝트 정보를 입력합니다.

```bash
cp .env.local.example .env.local
```

`.env.local` 파일 내용:
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Supabase 데이터베이스 설정

1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. SQL Editor에서 `supabase/schema.sql` 파일의 내용을 실행
3. Settings > API에서 Project URL과 anon key를 복사하여 `.env.local`에 붙여넣기

### 5. 개발 서버 실행

```bash
npm run dev
# 또는
yarn dev
# 또는
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인합니다.

## 📊 데이터베이스 스키마

### Users
- 사용자 기본 정보 (이메일, 이름, 학교, 전공 등)

### Roadmaps
- 학년별 로드맵 목표 (1, 2, 3학년)
- 상태: pending, in_progress, completed

### Daily Goals
- 일일 목표 내용 및 완료 여부
- 날짜별 기록

### Projects
- 프로젝트 제목, 설명, 기술 스택
- 이미지, 링크, 태그

## 🎨 디자인 가이드라인

### 컬러 팔레트
- **Primary (Royal Blue)**: `hsl(221.2, 83.2%, 53.3%)` - 신뢰감, 전문성
- **Secondary (Light Green)**: `hsl(142.1, 76.2%, 36.3%)` - 성장, 희망

### 폰트
- **기본 폰트**: Pretendard (가독성이 뛰어난 한글 폰트)

### UI 원칙
- 모바일 우선 반응형 디자인
- 명확한 시각적 계층 구조
- 일관된 간격과 정렬
- Gamification 요소를 통한 동기부여

## 🔐 보안 (Row Level Security)

Supabase의 RLS(Row Level Security)를 활용하여 사용자는 자신의 데이터만 접근할 수 있습니다.

```sql
-- 예시: 사용자는 자신의 로드맵만 조회 가능
CREATE POLICY "Users can view own roadmaps"
  ON public.roadmaps FOR SELECT
  USING (auth.uid() = user_id);
```

## 📝 TODO

- [ ] 소셜 로그인 구현 (Google, GitHub)
- [ ] 프로젝트 업로드 기능 구현
- [ ] 일일 목표 CRUD 구현
- [ ] 잔디 심기 UI 구현
- [ ] 포트폴리오 공유 기능
- [ ] PWA 지원 (모바일 앱처럼 사용)
- [ ] 다크모드 지원

## 🤝 기여하기

이 프로젝트는 특성화고 학생들을 위한 오픈소스 프로젝트입니다. 기여를 환영합니다!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

MIT License

## 👥 만든 사람

특성화고 학생 개발자들을 위해 ❤️

---

**"나의 성장을 시각화한다"** - Job Navigator
