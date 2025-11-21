# NPM 퍼블리시 가이드

이 가이드는 n8n-nodes-discord-all 패키지를 npm에 퍼블리시하는 방법을 설명합니다.

## 📋 준비사항

### 1. npm 계정 생성

npm 계정이 없다면:

```bash
# 회원가입
npm adduser
# 또는
npm login
```

[npmjs.com](https://www.npmjs.com/)에서 계정을 만들 수도 있습니다.

### 2. 패키지 이름 확인

```bash
# 패키지 이름이 사용 가능한지 확인
npm search n8n-nodes-discord-all
```

만약 이미 사용 중이라면 package.json에서 이름을 변경하세요:

```json
{
  "name": "n8n-nodes-discord-all-yourname",
  "version": "1.0.0"
}
```

### 3. GitHub 저장소 생성 (권장)

1. GitHub에서 새 저장소 생성
2. package.json의 URL 업데이트:

```json
{
  "homepage": "https://github.com/YOUR_USERNAME/n8n-nodes-discord-all#readme",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/YOUR_USERNAME/n8n-nodes-discord-all.git"
  },
  "bugs": {
    "url": "https://github.com/YOUR_USERNAME/n8n-nodes-discord-all/issues"
  }
}
```

3. 코드 푸시:

```bash
git init
git add .
git commit -m "Initial commit: Complete Discord bot integration for n8n"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/n8n-nodes-discord-all.git
git push -u origin main
```

## 🔧 퍼블리시 전 체크리스트

### 1. package.json 업데이트

```json
{
  "name": "n8n-nodes-discord-all",
  "version": "1.0.0",
  "author": {
    "name": "Your Name",
    "email": "your.email@example.com"
  }
}
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 린트 검사

```bash
npm run lint
# 또는 자동 수정
npm run lintfix
```

### 4. 빌드 테스트

```bash
npm run build
```

빌드가 성공하면 `dist/` 폴더에 다음 파일들이 생성됩니다:
- `credentials/DiscordApi.credentials.js`
- `nodes/Discord/Discord.node.js`
- `nodes/DiscordTrigger/DiscordTrigger.node.js`
- `nodes/DiscordTools/DiscordTools.node.js`

### 5. 빌드 결과 확인

```bash
# 생성된 파일 확인
ls -la dist/

# 파일 트리 확인
tree dist/
```

### 6. 패키지 내용 확인

```bash
# 퍼블리시될 파일 목록 확인
npm pack --dry-run
```

다음이 포함되어야 합니다:
- ✅ dist/
- ✅ docs/
- ✅ LICENSE
- ✅ README.md
- ✅ package.json

다음은 **제외**되어야 합니다:
- ❌ src/
- ❌ node_modules/
- ❌ .git/
- ❌ *.ts (TypeScript 소스)

## 🚀 NPM 퍼블리시

### 방법 1: 직접 퍼블리시

```bash
# 1. npm 로그인
npm login

# 2. 버전 확인
npm version

# 3. 퍼블리시 (빌드와 린트 자동 실행)
npm publish

# 공개 패키지로 명시적 퍼블리시
npm publish --access public
```

### 방법 2: 테스트 후 퍼블리시

```bash
# 1. 로컬 테스트 패키지 생성
npm pack

# n8n-nodes-discord-all-1.0.0.tgz 파일 생성됨

# 2. 다른 프로젝트에서 테스트
cd /path/to/test-project
npm install /path/to/n8n-nodes-discord-all-1.0.0.tgz

# 3. 테스트 성공 후 퍼블리시
cd /path/to/n8n-nodes-discord-all
npm publish
```

### 방법 3: 버전 업데이트와 함께 퍼블리시

```bash
# Patch 버전 증가 (1.0.0 -> 1.0.1)
npm version patch

# Minor 버전 증가 (1.0.0 -> 1.1.0)
npm version minor

# Major 버전 증가 (1.0.0 -> 2.0.0)
npm version major

# 그리고 퍼블리시
npm publish
```

## 📦 퍼블리시 후 확인

### 1. npm 웹사이트 확인

```
https://www.npmjs.com/package/n8n-nodes-discord-all
```

### 2. 설치 테스트

```bash
# 새로운 디렉토리에서 테스트
mkdir test-install
cd test-install
npm init -y
npm install n8n-nodes-discord-all

# 설치 확인
ls node_modules/n8n-nodes-discord-all/
```

### 3. n8n에서 테스트

```bash
# n8n 설치 (없는 경우)
npm install -g n8n

# n8n 실행
N8N_CUSTOM_EXTENSIONS="./node_modules/n8n-nodes-discord-all" n8n start

# 또는 n8n Community Nodes에서 설치
# Settings → Community Nodes → Install
# Enter: n8n-nodes-discord-all
```

## 🔄 업데이트 퍼블리시

### 새 버전 릴리스

```bash
# 1. 변경사항 커밋
git add .
git commit -m "feat: Add new features"

# 2. CHANGELOG.md 업데이트
# [새 버전 정보 추가]

# 3. 버전 업데이트
npm version patch  # 또는 minor, major

# 4. GitHub에 푸시
git push origin main
git push --tags

# 5. npm에 퍼블리시
npm publish
```

### 버전 규칙 (Semantic Versioning)

- **Patch (1.0.0 → 1.0.1)**: 버그 수정
- **Minor (1.0.0 → 1.1.0)**: 새 기능 추가 (하위 호환)
- **Major (1.0.0 → 2.0.0)**: Breaking changes

## ⚠️ 문제 해결

### 에러: "Package name too similar to existing packages"

package.json에서 이름 변경:
```json
{
  "name": "n8n-nodes-discord-all-yourname"
}
```

### 에러: "You must be logged in to publish packages"

```bash
npm login
```

### 에러: "This package has been marked as private"

package.json에서 확인:
```json
{
  "private": false  // 또는 이 줄 제거
}
```

### 에러: "prepublishOnly script failed"

빌드 또는 린트 에러 확인:
```bash
npm run build
npm run lint
```

### 파일이 누락됨

package.json의 `files` 필드 확인:
```json
{
  "files": [
    "dist",
    "docs",
    "LICENSE",
    "README.md"
  ]
}
```

### 빌드 파일이 포함되지 않음

.npmignore 확인 - dist/ 폴더가 제외되지 않았는지 확인

## 📝 베스트 프랙티스

### 1. 항상 README.md 업데이트

- 새 기능 추가 시
- API 변경 시
- 예제 추가 시

### 2. CHANGELOG.md 유지

모든 변경사항을 문서화하세요.

### 3. 버전 태그 사용

```bash
git tag v1.0.0
git push --tags
```

### 4. GitHub Release 생성

GitHub에서 Release 노트 작성으로 사용자에게 변경사항 알림

### 5. 테스트 자동화

GitHub Actions로 CI/CD 설정:

```yaml
# .github/workflows/publish.yml
name: Publish to npm
on:
  release:
    types: [created]
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm run build
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## 🎯 npm 키워드 최적화

package.json의 keywords는 검색 가능성을 높입니다:

```json
{
  "keywords": [
    "n8n-community-node-package",
    "n8n",
    "discord",
    "discord-bot",
    "discord-api",
    "discord-dm",
    "discord-mentions",
    "discord-tools",
    "automation",
    "workflow",
    "chatbot",
    "community-management"
  ]
}
```

## 📊 패키지 통계 확인

- npm 다운로드: `https://npm-stat.com/charts.html?package=n8n-nodes-discord-all`
- npm trends: `https://www.npmtrends.com/n8n-nodes-discord-all`
- Unpkg CDN: `https://unpkg.com/n8n-nodes-discord-all/`

## 🔒 보안

### npm 2FA 활성화

```bash
npm profile enable-2fa auth-and-writes
```

### Access Token 사용

CI/CD를 위한 토큰 생성:
```bash
npm token create
```

## ✅ 최종 체크리스트

퍼블리시 전:

- [ ] package.json 정보 확인 (name, version, author)
- [ ] README.md 작성 완료
- [ ] LICENSE 파일 포함
- [ ] CHANGELOG.md 작성
- [ ] .npmignore 설정
- [ ] GitHub 저장소 생성 및 푸시
- [ ] `npm install` 성공
- [ ] `npm run build` 성공
- [ ] `npm run lint` 성공
- [ ] `npm pack --dry-run` 확인
- [ ] npm 로그인 완료
- [ ] 패키지 이름 중복 확인

모든 확인 후:

```bash
npm publish --access public
```

## 🎉 성공!

축하합니다! 패키지가 성공적으로 퍼블리시되었습니다.

이제 전 세계 n8n 사용자들이 당신의 Discord 노드를 사용할 수 있습니다!

```bash
npm install n8n-nodes-discord-all
```

---

궁금한 점이 있으면 이슈를 열어주세요:
https://github.com/YOUR_USERNAME/n8n-nodes-discord-all/issues
