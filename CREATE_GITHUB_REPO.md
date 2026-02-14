# 📝 GitHub 저장소 생성 가이드

## Step 1: 저장소 생성 페이지 열기

**링크**: https://github.com/new

## Step 2: 정보 입력

### Repository name (필수)
```
job-navigator
```

### Description (선택)
```
특성화고 학생을 위한 3년 취업 로드맵 관리 플랫폼 | Next.js 14 + TypeScript + Supabase
```

### 공개 설정
- ✅ **Public** (무료 배포를 위해 필수)
- ❌ Private (선택 가능하지만 Vercel 무료 배포 불가)

### 초기화 옵션 (⚠️ 중요!)
- ❌ **Add a README file** - 체크 해제
- ❌ **Add .gitignore** - 체크 해제
- ❌ **Choose a license** - None 선택

> 💡 **왜 체크를 해제하나요?**
> 이미 로컬에 파일들이 있으므로, GitHub에서 새로 생성하면 충돌이 발생합니다.

## Step 3: 생성 버튼 클릭

**"Create repository"** 버튼을 클릭합니다.

## Step 4: 생성 확인

저장소가 생성되면 다음과 같은 화면이 나타납니다:

```
Quick setup — if you've done this kind of thing before

...or push an existing repository from the command line

git remote add origin https://github.com/maximy01/job-navigator.git
git branch -M main
git push -u origin main
```

## Step 5: 푸시 준비 완료!

이제 다음 명령어를 실행할 준비가 되었습니다:

```bash
cd C:\Users\doubl\Documents\vibecodingexercise\carrerroadmap
git push -u origin main
```

---

## ✅ 체크리스트

푸시 전에 확인하세요:

- [ ] GitHub 계정에 로그인되어 있음
- [ ] job-navigator 저장소가 생성됨
- [ ] 저장소가 Public으로 설정됨
- [ ] README, .gitignore 옵션이 모두 체크 해제됨

---

## 🔐 인증 문제가 있다면?

### Personal Access Token 사용

1. **토큰 생성**: https://github.com/settings/tokens/new
   - Note: `Job Navigator`
   - Expiration: `90 days`
   - Scopes: ✅ repo (전체)

2. **토큰 복사** (예: `ghp_xxxxxxxxxxxx`)

3. **명령어 실행**:
   ```bash
   git remote set-url origin https://YOUR_TOKEN@github.com/maximy01/job-navigator.git
   git push -u origin main
   ```

---

**저장소 생성 후 알려주세요!**
