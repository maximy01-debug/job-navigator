# 🚀 Job Navigator - GitHub & Vercel 배포 가이드

이 가이드는 Job Navigator 프로젝트를 GitHub에 업로드하고 Vercel로 자동 배포하는 방법을 안내합니다.

---

## 📋 사전 준비

배포하기 전에 다음 계정이 필요합니다:

1. **GitHub 계정** ([가입하기](https://github.com/join))
2. **Vercel 계정** ([가입하기](https://vercel.com/signup)) - GitHub 계정으로 가입 권장

---

## 1️⃣ GitHub 저장소 생성 및 업로드

### Step 1: GitHub에서 새 저장소 생성

1. [GitHub](https://github.com)에 로그인
2. 우측 상단의 **"+"** 버튼 → **"New repository"** 클릭
3. 저장소 정보 입력:
   - **Repository name**: `job-navigator` (원하는 이름)
   - **Description**: `특성화고 학생을 위한 3년 취업 로드맵 관리 플랫폼`
   - **Public** 선택 (무료 배포를 위해)
   - ⚠️ **중요**: "Add a README file", "Add .gitignore", "Choose a license" 모두 **체크 해제**
4. **"Create repository"** 버튼 클릭

### Step 2: 로컬 저장소와 GitHub 연결

GitHub 저장소가 생성되면, 다음 명령어들이 표시됩니다. 프로젝트 폴더에서 실행하세요:

```bash
# 원격 저장소 추가 (your-username을 본인의 GitHub 아이디로 변경)
git remote add origin https://github.com/your-username/job-navigator.git

# 메인 브랜치 이름 변경 (GitHub 기본값에 맞춤)
git branch -M main

# GitHub에 푸시
git push -u origin main
```

**예시:**
```bash
git remote add origin https://github.com/johndoe/job-navigator.git
git branch -M main
git push -u origin main
```

### Step 3: 푸시 성공 확인

- GitHub 저장소 페이지를 새로고침하면 모든 파일이 업로드된 것을 확인할 수 있습니다
- ✅ 30개 파일, 8,000+ 줄의 코드가 표시되어야 합니다

---

## 2️⃣ Vercel로 자동 배포

### Step 1: Vercel 계정 생성

1. [Vercel](https://vercel.com)에 접속
2. **"Sign Up"** 클릭
3. **"Continue with GitHub"** 선택 (권장)
4. GitHub 계정 연동 승인

### Step 2: 프로젝트 Import

1. Vercel 대시보드에서 **"Add New..."** → **"Project"** 클릭
2. **"Import Git Repository"** 섹션에서 `job-navigator` 저장소 찾기
3. **"Import"** 버튼 클릭

### Step 3: 프로젝트 설정

**Configure Project** 화면에서:

#### 기본 설정
- **Project Name**: `job-navigator` (자동 입력됨)
- **Framework Preset**: Next.js (자동 감지됨)
- **Root Directory**: `./` (변경 불필요)

#### 환경변수 설정 (선택사항)

Supabase를 연동하려면:

1. **"Environment Variables"** 섹션 펼치기
2. 다음 변수 추가:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |

> 💡 **팁**: 환경변수는 나중에도 추가할 수 있습니다.

3. **"Deploy"** 버튼 클릭

### Step 4: 배포 진행

- 빌드 로그가 실시간으로 표시됩니다
- ⏱️ 약 2-3분 소요
- ✅ 성공 메시지: "Your project has been successfully deployed"

### Step 5: 배포된 사이트 확인

배포가 완료되면:

1. **도메인 URL**이 표시됩니다:
   ```
   https://job-navigator-xxxx.vercel.app
   ```

2. **"Visit"** 버튼을 클릭하거나 URL을 복사하여 브라우저에서 열어보세요

3. 정상 작동 확인:
   - ✅ 대시보드 페이지 로드
   - ✅ 로드맵 페이지 이동
   - ✅ 반응형 디자인 작동

---

## 3️⃣ 자동 배포 설정

Vercel은 GitHub와 연동되어 **자동 배포**가 활성화됩니다:

### 작동 방식

1. **코드 수정 후 GitHub에 푸시**:
   ```bash
   git add .
   git commit -m "Update: 대시보드 UI 개선"
   git push
   ```

2. **자동으로 Vercel이 감지**하고 새로운 배포 시작

3. **2-3분 후 자동으로 업데이트**된 사이트가 배포됩니다

### 배포 상태 확인

- Vercel 대시보드 → **Deployments** 탭에서 배포 이력 확인
- 각 배포별 로그, 미리보기, 롤백 기능 제공

---

## 4️⃣ 커스텀 도메인 연결 (선택사항)

### 무료 도메인 옵션

Vercel은 기본적으로 `.vercel.app` 도메인을 제공하지만, 커스텀 도메인을 연결할 수도 있습니다:

1. Vercel 프로젝트 → **Settings** → **Domains**
2. **"Add"** 버튼 클릭
3. 도메인 입력 (예: `jobnavigator.com`)
4. DNS 설정 안내에 따라 설정

> 💡 **추천 무료 도메인 서비스**: [Freenom](https://www.freenom.com), [.tk 도메인](http://www.dot.tk)

---

## 5️⃣ Supabase 환경변수 추가 (중요!)

배포 후 Supabase를 연동하려면:

### Vercel에서 환경변수 추가

1. Vercel 프로젝트 → **Settings** → **Environment Variables**
2. 다음 변수 추가:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

3. **Environment**: `Production`, `Preview`, `Development` 모두 선택
4. **"Save"** 클릭
5. **"Redeploy"** 버튼 클릭하여 환경변수 적용

---

## 6️⃣ 배포 성공 확인 체크리스트

### ✅ GitHub

- [ ] 저장소에 모든 파일이 업로드되었는지 확인
- [ ] README.md가 표시되는지 확인
- [ ] 30개 파일이 모두 있는지 확인

### ✅ Vercel

- [ ] 배포 상태가 "Ready"인지 확인
- [ ] 도메인 URL이 정상 작동하는지 확인
- [ ] 대시보드 페이지가 정상 표시되는지 확인
- [ ] 로드맵 페이지 이동이 가능한지 확인
- [ ] 모바일에서도 정상 작동하는지 확인

---

## 🔧 문제 해결

### 문제 1: 빌드 실패 (Build Failed)

**증상**: Vercel 배포 중 오류 발생

**해결**:
1. Vercel 배포 로그 확인
2. 로컬에서 빌드 테스트:
   ```bash
   npm run build
   ```
3. 오류 수정 후 다시 푸시:
   ```bash
   git add .
   git commit -m "Fix: 빌드 오류 수정"
   git push
   ```

### 문제 2: 환경변수 적용 안됨

**증상**: Supabase 연결 실패

**해결**:
1. Vercel → Settings → Environment Variables 확인
2. 변수명과 값이 정확한지 확인
3. **"Redeploy"** 버튼으로 재배포

### 문제 3: GitHub 푸시 권한 오류

**증상**: `Permission denied (publickey)` 오류

**해결**:
1. HTTPS URL 사용:
   ```bash
   git remote set-url origin https://github.com/username/job-navigator.git
   ```
2. 다시 푸시:
   ```bash
   git push -u origin main
   ```

### 문제 4: 404 Not Found

**증상**: 배포된 사이트에서 페이지가 표시되지 않음

**해결**:
1. Vercel 빌드 로그 확인
2. `next.config.mjs` 설정 확인
3. 재배포 시도

---

## 📊 배포 후 할 일

### 1. README 업데이트

GitHub 저장소 README에 배포 URL 추가:

```markdown
## 🌐 Live Demo

👉 [Job Navigator 바로가기](https://job-navigator-xxxx.vercel.app)
```

### 2. Supabase 설정

- Supabase 프로젝트에서 환경변수 추가
- 데이터베이스 스키마 실행 (`supabase/schema.sql`)
- RLS 정책 확인

### 3. 성능 모니터링

Vercel Analytics를 활성화하여 사이트 성능 추적:

1. Vercel 프로젝트 → **Analytics** 탭
2. **"Enable Analytics"** 클릭

---

## 🎉 축하합니다!

Job Navigator가 성공적으로 배포되었습니다!

**배포된 사이트 공유하기:**
- 친구들에게 URL 공유
- 포트폴리오에 추가
- SNS에 프로젝트 소개

**다음 단계:**
- Supabase 데이터베이스 연동
- 로그인/회원가입 기능 추가
- 실제 데이터 CRUD 구현
- 커스텀 도메인 연결

---

## 📚 추가 자료

- [Vercel 공식 문서](https://vercel.com/docs)
- [Next.js 배포 가이드](https://nextjs.org/docs/deployment)
- [GitHub 기초 가이드](https://docs.github.com/en/get-started)

---

**만든 사람**: 특성화고 학생 개발자들을 위해 ❤️

*Last Updated: 2024년 2월 14일*
