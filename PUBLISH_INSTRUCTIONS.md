# 🚀 NPM 퍼블리시 단계별 가이드

## ✅ 현재 상태: 퍼블리시 준비 완료!

모든 파일이 준비되었습니다. 이제 npm에 업로드만 하면 됩니다.

---

## 📝 퍼블리시 전 필수 작업

### 1️⃣ package.json 수정

다음 정보를 **실제 정보**로 변경하세요:

```json
{
	"author": {
		"name": "Your Name", // ← 실제 이름
		"email": "your.email@example.com" // ← 실제 이메일
	},
	"homepage": "https://github.com/yourusername/n8n-nodes-discord-all#readme",
	"repository": {
		"type": "git",
		"url": "git+https://github.com/yourusername/n8n-nodes-discord-all.git"
	},
	"bugs": {
		"url": "https://github.com/yourusername/n8n-nodes-discord-all/issues"
	}
}
```

**주의:** `yourusername`을 실제 GitHub 사용자명으로 변경하세요.

---

## 🔐 NPM 계정 준비

### npm 계정이 없다면:

1. https://www.npmjs.com/signup 방문
2. 회원가입 (무료)
3. 이메일 인증

### 터미널에서 로그인:

```bash
npm login
```

입력 정보:

```
Username: [npm 사용자명]
Password: [npm 비밀번호]
Email: [이메일]
2FA Code: [2단계 인증 코드 (설정한 경우)]
```

---

## 🚀 퍼블리시 실행

### 단계별 명령어:

```bash
# 1. 프로젝트 디렉토리로 이동
cd /Users/yuchan/Desktop/n8n-all-of-discord-bot

# 2. 최종 빌드 확인 (선택사항)
npm run build

# 3. 패키지 내용 미리보기 (선택사항)
npm pack --dry-run

# 4. 퍼블리시!
npm publish --access public
```

### 예상 출력:

```
npm notice
npm notice 📦  n8n-nodes-discord-all@1.0.0
npm notice === Tarball Details ===
npm notice name:          n8n-nodes-discord-all
npm notice version:       1.0.0
npm notice filename:      n8n-nodes-discord-all-1.0.0.tgz
npm notice package size:  36.8 kB
npm notice unpacked size: 203.1 kB
npm notice shasum:        48aafe0e16757fd5f66733eff97ff5bf1ee92e04
npm notice integrity:     sha512-AXbNmJYb3Hlpk[...]obAXyGUuyxKIw==
npm notice total files:   20
npm notice
+ n8n-nodes-discord-all@1.0.0
```

✅ **성공!** 이 메시지가 보이면 퍼블리시 완료입니다!

---

## 🔍 퍼블리시 확인

### 1. npm 웹사이트 확인

```
https://www.npmjs.com/package/n8n-nodes-discord-all
```

5-10분 정도 후 패키지 페이지가 나타납니다.

### 2. 설치 테스트

```bash
# 다른 디렉토리에서 테스트
mkdir ~/test-npm-install
cd ~/test-npm-install
npm install n8n-nodes-discord-all
```

### 3. n8n에서 테스트

```bash
# n8n 실행
npx n8n

# 브라우저: http://localhost:5678
# Settings → Community Nodes → Install
# 입력: n8n-nodes-discord-all
```

---

## ⚠️ 자주 발생하는 오류

### "You must be logged in to publish packages"

```bash
npm login
```

### "Package name too similar to existing packages"

패키지 이름이 이미 사용 중입니다.

**해결:** package.json에서 이름 변경

```json
{
	"name": "n8n-nodes-discord-all-yourname"
}
```

### "prepublishOnly script failed"

빌드 에러입니다.

**해결:**

```bash
npm run build
npm run lint
```

에러 메시지를 확인하고 수정하세요.

### "403 Forbidden"

권한 문제입니다.

**해결:**

```bash
npm publish --access public
```

### "402 Payment Required"

스코프 패키지는 유료입니다.

**해결:** 스코프 제거 (`@username/package-name` → `package-name`)

---

## 🔄 업데이트 퍼블리시

새 버전을 릴리스할 때:

```bash
# 코드 수정 후...

# 버전 업데이트
npm version patch   # 1.0.0 → 1.0.1 (버그 수정)
npm version minor   # 1.0.0 → 1.1.0 (새 기능)
npm version major   # 1.0.0 → 2.0.0 (Breaking changes)

# 퍼블리시
npm publish
```

---

## 🧪 로컬 테스트

npm에 퍼블리시하기 전에 로컬에서 테스트하려면:

```bash
# 1. 로컬 패키지 생성
cd /Users/yuchan/Desktop/n8n-all-of-discord-bot
npm pack

# n8n-nodes-discord-all-1.0.0.tgz 파일 생성됨

# 2. 다른 프로젝트에서 설치
cd ~/your-test-project
npm install /Users/yuchan/Desktop/n8n-all-of-discord-bot/n8n-nodes-discord-all-1.0.0.tgz

# 3. n8n에서 테스트
N8N_CUSTOM_EXTENSIONS="./node_modules/n8n-nodes-discord-all" npx n8n
```

---

## 📊 성공 후 홍보

### npm README 배지 추가

README.md에 추가:

```markdown
[![npm version](https://badge.fury.io/js/n8n-nodes-discord-all.svg)](https://badge.fury.io/js/n8n-nodes-discord-all)
[![npm downloads](https://img.shields.io/npm/dm/n8n-nodes-discord-all.svg)](https://www.npmjs.com/package/n8n-nodes-discord-all)
```

### GitHub에 푸시

```bash
git add .
git commit -m "feat: Complete Discord bot integration for n8n v1.0.0"
git tag v1.0.0
git push origin main --tags
```

### n8n 커뮤니티에 공유

- n8n Community Forum: https://community.n8n.io/
- Discord: https://discord.gg/n8n
- Reddit: r/n8n

---

## 📞 도움이 필요하신가요?

### npm 공식 문서

- https://docs.npmjs.com/cli/v9/commands/npm-publish

### n8n 커뮤니티 노드 가이드

- https://docs.n8n.io/integrations/creating-nodes/

### 문제가 있나요?

- npm 문제: https://npm.community/
- n8n 문제: https://community.n8n.io/

---

## 🎉 축하합니다!

퍼블리시가 완료되면 전 세계 n8n 사용자들이 당신의 Discord 노드를 사용할 수 있습니다!

```bash
npm install n8n-nodes-discord-all
```

### 다음 단계:

1. ⭐ GitHub에 스타 받기
2. 📝 사용자 피드백 수집
3. 🔄 정기적인 업데이트
4. 📊 다운로드 통계 확인

행운을 빕니다! 🚀
