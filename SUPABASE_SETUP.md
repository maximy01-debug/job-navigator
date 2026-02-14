# 🔐 Supabase 인증 설정 가이드

로그인 기능이 추가되었습니다! 이제 Supabase를 설정하여 실제로 작동하도록 만들어봅시다.

---

## 📋 필수 준비사항

- Supabase 계정 (https://supabase.com)
- 프로젝트 실행 중 (npm run dev)

---

## 1️⃣ Supabase 프로젝트 생성

### Step 1: Supabase 접속 및 프로젝트 생성

1. https://supabase.com 접속 → 로그인
2. **"New Project"** 클릭
3. 프로젝트 정보 입력:
   - **Name**: `job-navigator`
   - **Database Password**: 안전한 비밀번호 입력 (저장해두세요!)
   - **Region**: Northeast Asia (Seoul)
4. **"Create new project"** 클릭 (약 2분 소요)

---

## 2️⃣ 데이터베이스 스키마 생성

### SQL Editor에서 스키마 실행

1. Supabase 대시보드 → 왼쪽 메뉴의 **SQL Editor** 클릭
2. **"New query"** 클릭
3. 프로젝트의 `supabase/schema.sql` 파일 내용 복사
4. SQL Editor에 붙여넣기
5. **"Run"** 버튼 클릭

✅ 성공하면 4개의 테이블이 생성됩니다:
- `users`
- `roadmaps`
- `daily_goals`
- `projects`

---

## 3️⃣ 환경변수 설정

### Step 1: API 키 복사

1. Supabase 대시보드 → **Settings** (⚙️) → **API**
2. 다음 두 값을 복사:
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public**: `eyJ...` (긴 문자열)

### Step 2: .env.local 파일 생성

프로젝트 루트 디렉토리에 `.env.local` 파일 생성:

```bash
# Windows (명령 프롬프트)
copy .env.local.example .env.local

# Mac/Linux
cp .env.local.example .env.local
```

### Step 3: 환경변수 입력

`.env.local` 파일을 열고 복사한 값 입력:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 4: 개발 서버 재시작

```bash
# Ctrl+C로 서버 중지
npm run dev
```

---

## 4️⃣ 이메일 인증 설정 (선택사항)

### 기본 설정 (개발용)

Supabase는 기본적으로 **확인 이메일 없이** 회원가입을 허용합니다 (개발 중).

### 이메일 확인 활성화 (프로덕션용)

1. Supabase 대시보드 → **Authentication** → **Settings**
2. **Email Auth** 섹션:
   - ✅ **Enable email confirmations** 체크
3. **Save** 클릭

---

## 5️⃣ OAuth 설정 (Google, GitHub 로그인)

### Google OAuth 설정

1. **Google Cloud Console** 접속:
   - https://console.cloud.google.com

2. **OAuth 클라이언트 ID 생성**:
   - APIs & Services → Credentials
   - Create Credentials → OAuth client ID
   - Application type: Web application
   - Authorized redirect URIs:
     ```
     https://xxxxxxxxxxxxx.supabase.co/auth/v1/callback
     ```

3. **Client ID**와 **Client Secret** 복사

4. **Supabase에 설정**:
   - Supabase → Authentication → Providers → Google
   - ✅ Enable
   - Client ID, Client Secret 입력
   - Save

### GitHub OAuth 설정

1. **GitHub Settings** 접속:
   - https://github.com/settings/developers

2. **New OAuth App** 클릭:
   - Application name: `Job Navigator`
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL:
     ```
     https://xxxxxxxxxxxxx.supabase.co/auth/v1/callback
     ```

3. **Client ID**와 **Client Secret** 생성 및 복사

4. **Supabase에 설정**:
   - Supabase → Authentication → Providers → GitHub
   - ✅ Enable
   - Client ID, Client Secret 입력
   - Save

---

## 6️⃣ 테스트하기

### 로컬에서 테스트

1. **개발 서버 실행**:
   ```bash
   npm run dev
   ```

2. **회원가입 테스트**:
   - http://localhost:3000/auth/signup 접속
   - 이름, 이메일, 비밀번호 입력
   - 회원가입 클릭

3. **로그인 테스트**:
   - http://localhost:3000/auth/login 접속
   - 이메일, 비밀번호 입력
   - 로그인 클릭

4. **로그인 확인**:
   - 헤더에 사용자 이름 표시
   - 로그아웃 버튼 표시

### OAuth 테스트 (선택)

1. 로그인 페이지에서:
   - **Google로 로그인** 또는
   - **GitHub로 로그인** 클릭

2. 권한 승인

3. 자동으로 대시보드로 리다이렉트

---

## 7️⃣ Vercel 배포 시 환경변수 설정

### Vercel 환경변수 추가

1. Vercel 프로젝트 → **Settings** → **Environment Variables**

2. 다음 변수 추가:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` |

3. **Environment**: Production, Preview, Development 모두 선택

4. **Save** 클릭

5. **Deployments** → **Redeploy** 클릭

---

## ✅ 확인 체크리스트

로그인 기능이 제대로 작동하는지 확인하세요:

- [ ] Supabase 프로젝트 생성 완료
- [ ] 데이터베이스 스키마 실행 (4개 테이블)
- [ ] .env.local 파일 생성 및 환경변수 입력
- [ ] 개발 서버 재시작
- [ ] 회원가입 성공
- [ ] 로그인 성공
- [ ] 헤더에 사용자 이름 표시
- [ ] 로그아웃 기능 작동
- [ ] (선택) OAuth 로그인 작동

---

## 🔍 문제 해결

### 문제 1: "Invalid API key" 오류

**해결**:
- `.env.local` 파일의 URL과 Key가 정확한지 확인
- 앞뒤 공백 제거
- 개발 서버 재시작

### 문제 2: 회원가입 후 이메일이 오지 않음

**해결**:
- 스팸 메일함 확인
- Supabase → Authentication → Settings에서 이메일 확인 비활성화 (개발 중)

### 문제 3: OAuth 로그인 실패

**해결**:
- Redirect URI가 정확한지 확인
- Client ID, Secret이 올바른지 확인
- Supabase Provider 설정 재확인

### 문제 4: 데이터베이스 연결 실패

**해결**:
- Supabase 프로젝트 상태 확인 (초록불)
- 네트워크 연결 확인
- SQL 스키마가 제대로 실행되었는지 확인

---

## 📚 다음 단계

로그인 기능이 작동하면:

1. **사용자 프로필 페이지** 추가
2. **실제 데이터베이스 CRUD** 구현
3. **로드맵 데이터** 사용자별로 저장
4. **프로젝트 업로드** 기능 추가

---

**설정 완료 후 로그인이 정상 작동하는지 테스트해보세요!** 🚀
