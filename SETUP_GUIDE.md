# 🚀 Job Navigator 설치 가이드

이 가이드는 Job Navigator 프로젝트를 처음부터 설치하고 실행하는 방법을 자세히 설명합니다.

## 📋 사전 요구사항

시작하기 전에 다음 프로그램들이 설치되어 있어야 합니다:

- **Node.js** 18.x 이상 ([다운로드](https://nodejs.org/))
- **Git** ([다운로드](https://git-scm.com/))
- **코드 에디터** (VS Code 권장)

## 🔧 1단계: 프로젝트 설치

### 1-1. 의존성 설치

프로젝트 루트 디렉토리에서 다음 명령어를 실행합니다:

```bash
npm install
```

> **참고**: `yarn` 또는 `pnpm`을 사용하는 경우:
> ```bash
> yarn install
> # 또는
> pnpm install
> ```

설치가 완료되면 `node_modules` 폴더와 `package-lock.json` 파일이 생성됩니다.

## 🗄️ 2단계: Supabase 설정

### 2-1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com)에 접속하여 계정을 만듭니다 (무료)
2. "New Project" 버튼을 클릭합니다
3. 프로젝트 정보를 입력합니다:
   - **Name**: `job-navigator` (원하는 이름)
   - **Database Password**: 안전한 비밀번호 설정 (기억해두세요!)
   - **Region**: Northeast Asia (Seoul) - 한국과 가장 가까운 지역
4. "Create new project" 버튼을 클릭하고 프로젝트가 생성될 때까지 기다립니다 (약 2분)

### 2-2. 데이터베이스 스키마 생성

1. Supabase 대시보드에서 왼쪽 메뉴의 **SQL Editor**를 클릭합니다
2. "New query" 버튼을 클릭합니다
3. 프로젝트의 `supabase/schema.sql` 파일을 열고 **전체 내용을 복사**합니다
4. SQL Editor에 붙여넣고 **"RUN"** 버튼을 클릭합니다
5. 성공 메시지가 나타나면 완료! ✅

> **확인하기**: 왼쪽 메뉴의 "Table Editor"를 클릭하면 `users`, `roadmaps`, `daily_goals`, `projects` 테이블이 생성된 것을 확인할 수 있습니다.

### 2-3. API 키 가져오기

1. Supabase 대시보드에서 왼쪽 메뉴의 **Settings** (톱니바퀴 아이콘)를 클릭합니다
2. **API** 탭을 선택합니다
3. 다음 두 값을 복사해둡니다:
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co` 형태
   - **anon public**: `eyJ...` 로 시작하는 긴 문자열

## 🔐 3단계: 환경변수 설정

### 3-1. .env.local 파일 생성

프로젝트 루트 디렉토리에서:

```bash
# Windows (명령 프롬프트)
copy .env.local.example .env.local

# Mac/Linux
cp .env.local.example .env.local
```

### 3-2. 환경변수 입력

`.env.local` 파일을 열고 2-3단계에서 복사한 값을 입력합니다:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> ⚠️ **중요**: `.env.local` 파일은 절대 Git에 커밋하지 마세요! (이미 .gitignore에 포함되어 있습니다)

## ▶️ 4단계: 개발 서버 실행

모든 설정이 완료되었습니다! 이제 개발 서버를 실행해봅시다:

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 엽니다.

### 성공! 🎉

다음과 같은 화면이 보이면 성공입니다:
- ✅ Job Navigator 로고와 네비게이션
- ✅ 대시보드 통계 카드 4개
- ✅ 오늘의 퀘스트 섹션
- ✅ 최근 활동 피드

## 🔍 문제 해결

### 문제 1: `npm install` 시 오류 발생

**증상**: 의존성 설치 중 오류 메시지가 나타남

**해결**:
```bash
# npm 캐시 정리
npm cache clean --force

# 다시 설치
npm install
```

### 문제 2: "Module not found" 오류

**증상**: 개발 서버 실행 시 모듈을 찾을 수 없다는 오류

**해결**:
```bash
# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install
```

### 문제 3: Supabase 연결 오류

**증상**: "Invalid API key" 또는 연결 실패 메시지

**해결**:
1. `.env.local` 파일의 URL과 Key가 정확한지 확인
2. 앞뒤 공백이 없는지 확인
3. 개발 서버를 재시작 (Ctrl+C 후 `npm run dev`)

### 문제 4: 포트 3000이 이미 사용 중

**증상**: "Port 3000 is already in use"

**해결**:
```bash
# 다른 포트로 실행
PORT=3001 npm run dev
```

## 📚 다음 단계

설치가 완료되었다면:

1. **로드맵 페이지 확인**: [http://localhost:3000/roadmap](http://localhost:3000/roadmap)
2. **코드 살펴보기**:
   - `src/app/page.tsx` - 대시보드 메인 페이지
   - `src/components/` - 재사용 가능한 컴포넌트들
   - `supabase/schema.sql` - 데이터베이스 구조

3. **기능 추가하기**:
   - Supabase Auth를 이용한 로그인 기능
   - 실제 데이터베이스 연동
   - 프로젝트 업로드 기능

## 🆘 추가 도움이 필요하신가요?

- [Next.js 공식 문서](https://nextjs.org/docs)
- [Supabase 공식 문서](https://supabase.com/docs)
- [Tailwind CSS 공식 문서](https://tailwindcss.com/docs)

---

Happy Coding! 🚀
