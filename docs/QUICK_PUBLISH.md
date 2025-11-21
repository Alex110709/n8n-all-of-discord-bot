# 🚀 빠른 NPM 퍼블리시 가이드

## ✅ 준비 완료 상태

- [x] 빌드 성공 (dist/ 폴더 생성됨)
- [x] 3개 노드 구현 완료
- [x] 문서 작성 완료
- [x] package.json 설정 완료
- [x] LICENSE 파일 포함

## 📝 퍼블리시 전 마지막 체크

### 1. package.json 개인 정보 업데이트

`package.json` 파일을 열고 다음 정보를 수정하세요:

```json
{
  "author": {
    "name": "Your Name",        // ← 실제 이름으로 변경
    "email": "your.email@example.com"  // ← 실제 이메일로 변경
  },
  "homepage": "https://github.com/yourusername/n8n-nodes-discord-all#readme",  // ← GitHub 사용자명으로 변경
  "repository": {
    "type": "git",
    "url": "git+https://github.com/yourusername/n8n-nodes-discord-all.git"  // ← GitHub 사용자명으로 변경
  },
  "bugs": {
    "url": "https://github.com/yourusername/n8n-nodes-discord-all/issues"  // ← GitHub 사용자명으로 변경
  }
}
```

### 2. (선택사항) GitHub 저장소 생성 및 푸시

```bash
# GitHub에서 저장소 생성 후:
git init
git add .
git commit -m "Initial commit: Complete Discord bot integration for n8n"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/n8n-nodes-discord-all.git
git push -u origin main
```

## 🚀 NPM 퍼블리시

### 단계별 명령어

```bash
# 1. 프로젝트 디렉토리로 이동
cd /Users/yuchan/Desktop/n8n-all-of-discord-bot

# 2. npm 로그인 (처음 한 번만)
npm login
# Username, Password, Email 입력
# 2FA 코드 입력 (설정한 경우)

# 3. 최종 빌드 확인
npm run build

# 4. 퍼블리시
npm publish --access public
```

### 예상 출력

```
npm notice
npm notice 📦  n8n-nodes-discord-all@1.0.0
npm notice === Tarball Contents ===
npm notice LICENSE
npm notice README.md
npm notice dist/
npm notice docs/
npm notice package.json
npm notice === Tarball Details ===
npm notice name:          n8n-nodes-discord-all
npm notice version:       1.0.0
npm notice package size:  35.2 kB
npm notice unpacked size: 196.7 kB
npm notice total files:   16
npm notice
+ n8n-nodes-discord-all@1.0.0
```

## ✅ 퍼블리시 확인

### 1. npm 웹사이트 확인

```
https://www.npmjs.com/package/n8n-nodes-discord-all
```

### 2. 설치 테스트

```bash
# 새 디렉토리에서 테스트
mkdir ~/test-discord-node
cd ~/test-discord-node
npm install n8n-nodes-discord-all
```

### 3. n8n에서 테스트

```bash
# n8n 실행
npx n8n

# 브라우저에서 http://localhost:5678 접속
# Settings → Community Nodes → Install
# 패키지명 입력: n8n-nodes-discord-all
```

## 🎉 완료!

축하합니다! 패키지가 성공적으로 퍼블리시되었습니다.

이제 전 세계 n8n 사용자들이 당신의 Discord 노드를 사용할 수 있습니다!

## 📊 통계 확인

- npm 페이지: `https://www.npmjs.com/package/n8n-nodes-discord-all`
- 다운로드 통계: `https://npm-stat.com/charts.html?package=n8n-nodes-discord-all`
- GitHub 스타: `https://github.com/YOUR_USERNAME/n8n-nodes-discord-all`

## 🔄 업데이트 퍼블리시

새 버전을 릴리스할 때:

```bash
# 코드 수정 후

# 버전 업데이트 (패치/마이너/메이저)
npm version patch    # 1.0.0 → 1.0.1 (버그 수정)
npm version minor    # 1.0.0 → 1.1.0 (새 기능)
npm version major    # 1.0.0 → 2.0.0 (Breaking changes)

# 퍼블리시
npm publish
```

## ⚠️ 문제 해결

### "Package name too similar"

패키지 이름이 이미 사용 중입니다. package.json에서 이름 변경:

```json
{
  "name": "n8n-nodes-discord-all-yourname"
}
```

### "You must be logged in"

```bash
npm login
```

### "prepublishOnly script failed"

빌드 에러를 확인하고 수정:

```bash
npm run build
npm run lint
```

## 📚 추가 문서

- [상세 퍼블리시 가이드](./NPM_PUBLISH_GUIDE.md)
- [사용 가이드](./README.md)
- [예제 모음](./EXAMPLES.md)
- [DM & 멘션 가이드](./DM_MENTIONS_GUIDE.md)
- [Tools 가이드](./TOOLS_GUIDE.md)

---

궁금한 점이 있으면 이슈를 열어주세요!
