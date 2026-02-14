# 🔐 GitHub 푸시 가이드

## Personal Access Token 생성

1. https://github.com/settings/tokens/new 접속
2. 설정:
   - **Note**: `Job Navigator`
   - **Expiration**: `90 days`
   - **Scopes**: ✅ repo (전체)
3. **Generate token** 클릭
4. 토큰 복사 (예: `ghp_xxxxxxxxxxxx`)

## 푸시 명령어

**방법 1: Token을 URL에 포함**
```bash
git remote set-url origin https://YOUR_TOKEN@github.com/maximy01/job-navigator.git
git push -u origin main
```

**방법 2: 수동 입력**
```bash
git push -u origin main
# Username: maximy01
# Password: YOUR_TOKEN
```

## 확인

푸시 성공 후:
- https://github.com/maximy01/job-navigator 확인
- 31개 파일이 모두 업로드되었는지 확인

## Vercel 배포

1. https://vercel.com 로그인
2. Import Project → GitHub → job-navigator 선택
3. Deploy 클릭
4. 2-3분 후 배포 완료!

---

**주의**: Token은 비밀번호처럼 안전하게 보관하세요!
