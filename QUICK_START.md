# ⚡ Quick Start - Job Navigator

> 5분 안에 프로젝트를 실행해보세요!

## 🎯 빠른 시작 (개발 환경)

### 1️⃣ 의존성 설치 (1분)

```bash
npm install
```

### 2️⃣ 환경변수 설정 (1분)

`.env.local` 파일을 생성하고 Supabase 정보를 입력하세요:

```bash
# .env.local 파일 생성
cp .env.local.example .env.local
```

파일 내용:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

> 💡 아직 Supabase 프로젝트가 없다면? [Supabase 설정 가이드](#supabase-설정)를 참고하세요.

### 3️⃣ 개발 서버 실행 (10초)

```bash
npm run dev
```

브라우저에서 **[http://localhost:3000](http://localhost:3000)** 을 엽니다.

---

## 🗄️ Supabase 설정 (3분)

Supabase가 처음이신가요? 걱정 마세요! 무료로 사용할 수 있습니다.

### Step 1: 프로젝트 생성

1. [Supabase](https://supabase.com) 접속 → 회원가입 (무료)
2. "New Project" 클릭
3. 정보 입력:
   - **Name**: `job-navigator`
   - **Database Password**: 비밀번호 설정
   - **Region**: Northeast Asia (Seoul)
4. "Create new project" 클릭 (약 2분 소요)

### Step 2: 데이터베이스 테이블 생성

1. Supabase 대시보드 → **SQL Editor** 클릭
2. "New query" 클릭
3. `supabase/schema.sql` 파일 내용을 **복사 → 붙여넣기**
4. **RUN** 버튼 클릭

### Step 3: API 키 복사

1. Settings (⚙️) → **API** 탭
2. 다음 두 값을 복사:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public**: `eyJ...` (긴 문자열)
3. `.env.local` 파일에 붙여넣기

---

## 📸 스크린샷으로 보는 실행 결과

### 대시보드 (메인 페이지)
- ✅ 통계 카드 4개 (로드맵 달성률, 목표 달성, 프로젝트, 자격증)
- ✅ 오늘의 퀘스트 (일일 목표)
- ✅ 최근 활동 피드
- ✅ 학년별 로드맵 진행 상황
- ✅ D-Day 카운터

### 로드맵 페이지 (/roadmap)
- ✅ 전체 진행 상황 카드
- ✅ 학년별 통계 (1, 2, 3학년)
- ✅ 타임라인 형태의 목표 리스트

---

## 🛠 사용 가능한 명령어

```bash
# 개발 서버 실행 (Hot Reload 지원)
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm run start

# 코드 린트 (ESLint)
npm run lint
```

---

## 📁 주요 파일 위치

| 파일 | 설명 |
|------|------|
| `src/app/page.tsx` | 대시보드 메인 페이지 |
| `src/app/roadmap/page.tsx` | 로드맵 페이지 |
| `src/components/` | 재사용 가능한 컴포넌트 |
| `supabase/schema.sql` | 데이터베이스 스키마 |
| `.env.local` | 환경변수 (Supabase 설정) |

---

## 🔍 자주 묻는 질문 (FAQ)

### Q1: Supabase 없이도 실행할 수 있나요?

**A**: 네! 현재 프로젝트는 Mock 데이터로 동작하므로 Supabase 없이도 UI를 확인할 수 있습니다. 단, 실제 데이터 저장/불러오기는 Supabase 연동 후 가능합니다.

### Q2: 포트 3000이 이미 사용 중이에요!

**A**: 다른 포트로 실행하세요:
```bash
PORT=3001 npm run dev
```

### Q3: "Module not found" 오류가 나요!

**A**: 의존성을 다시 설치해보세요:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Q4: 어떤 기능들이 구현되어 있나요?

**A**: 현재 구현된 기능:
- ✅ 대시보드 UI (통계, 퀘스트, 활동 피드)
- ✅ 로드맵 타임라인 UI
- ✅ 학년별 진행률 시각화
- ✅ 반응형 웹 디자인 (모바일 지원)

아직 구현되지 않은 기능:
- ⏳ 실제 데이터베이스 CRUD
- ⏳ 로그인/회원가입
- ⏳ 프로젝트 업로드
- ⏳ 일일 목표 추가/수정/삭제

---

## 🚀 다음 단계

프로젝트가 실행되었다면:

1. **코드 탐색하기**
   - `src/app/page.tsx` 파일을 열어 대시보드 코드를 확인해보세요
   - `src/components/` 폴더에서 재사용 가능한 컴포넌트들을 살펴보세요

2. **디자인 커스터마이징**
   - `src/app/globals.css`에서 색상 변경
   - `tailwind.config.ts`에서 테마 수정

3. **기능 추가하기**
   - Supabase Auth를 이용한 로그인 기능 추가
   - 실제 데이터베이스 연동
   - 프로젝트 업로드 기능 구현

4. **배포하기**
   - Vercel 또는 Netlify에 무료 배포

---

## 📚 추가 자료

- [전체 설치 가이드](SETUP_GUIDE.md) - 상세한 설치 방법
- [프로젝트 구조](PROJECT_STRUCTURE.md) - 파일 구조 상세 설명
- [README](README.md) - 프로젝트 개요

---

**문제가 발생했나요?**

[SETUP_GUIDE.md](SETUP_GUIDE.md)의 "문제 해결" 섹션을 참고하세요!

Happy Coding! 🎉
