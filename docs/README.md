# n8n Discord Bot - Complete Integration

Discord 봇의 모든 기능을 사용할 수 있는 완전한 n8n 커스텀 노드입니다.

## 주요 기능

### 🎯 지원하는 리소스

#### Discord 노드 (기본 작업)

1. **Message (메시지)**
   - 메시지 전송, 수정, 삭제
   - 메시지 조회, 리액션 추가
   - 메시지 고정/고정 해제

2. **DM (다이렉트 메시지)**
   - 특정 사용자에게 개인 메시지 전송

3. **Channel (채널)**
   - 채널 생성, 삭제, 수정
   - 채널 정보 조회
   - 채널 목록 조회
   - 지원 채널 타입: Text, Voice, Category, Announcement, Stage, Forum

4. **Guild (서버)**
   - 서버 정보 조회 및 수정
   - 멤버 밴/언밴
   - 밴 목록 조회

5. **Member (멤버)**
   - 멤버 정보 조회
   - 멤버 킥
   - 멤버 목록 조회
   - 역할 추가/제거

6. **Role (역할)**
   - 역할 생성, 삭제, 수정
   - 역할 정보 조회
   - 역할 목록 조회
   - 권한, 색상, 호이스트 등 설정

7. **Webhook (웹훅)**
   - 웹훅 생성
   - 웹훅을 통한 메시지 전송

8. **Invite (초대)**
   - 초대 링크 생성
   - 초대 정보 조회
   - 초대 목록 조회
   - 최대 사용 횟수, 유효 기간 등 설정

#### Discord Tools 노드 (고급 유틸리티) 🆕

1. **Message Tools**
   - 메시지 일괄 가져오기
   - 메시지 검색 (텍스트 기반)
   - 멘션 메시지 조회
   - 대량 삭제 (최대 100개)
   - 상세 메시지 히스토리

2. **User Tools**
   - 사용자 상세 정보
   - 아바타/프로필 조회
   - 온라인 상태 확인
   - 권한 확인

3. **Channel Tools**
   - 메시지 개수 조회
   - 활성 사용자 목록
   - 고정 메시지 조회
   - 슬로우모드 설정
   - 웹훅 목록

4. **Guild Tools**
   - 서버 통계 (채널, 역할, 멤버 수 등)
   - 온라인 멤버 수
   - 감사 로그 조회
   - 커스텀 이모지 목록

5. **Emoji Tools**
   - 이모지 생성
   - 이모지 삭제
   - 이모지 목록 조회

### ⚡ Discord Trigger Node

실시간으로 Discord 이벤트를 수신하는 트리거 노드:

- **메시지 이벤트**: 메시지 생성, 삭제, 수정
- **DM 이벤트**: 다이렉트 메시지 수신 🆕
- **멘션 이벤트**: 봇 멘션, 특정 사용자 멘션, 역할 멘션 🆕
- **리액션 이벤트**: 리액션 추가, 제거
- **멤버 이벤트**: 멤버 가입, 퇴장, 정보 변경
- **역할 이벤트**: 역할 생성, 삭제, 수정
- **채널 이벤트**: 채널 생성, 삭제, 수정
- **밴 이벤트**: 멤버 밴, 언밴
- **상호작용 이벤트**: 슬래시 커맨드, 버튼 클릭 등
- **음성 이벤트**: 음성 채널 입장/퇴장, 음소거 등
- **타이핑 이벤트**: 사용자 타이핑 시작

#### 필터 옵션
- 특정 서버(Guild ID)
- 특정 채널(Channel ID)
- 특정 사용자(User ID)
- 봇 무시 옵션
- 메시지 내용 포함 여부
- 메시지 시작 문자열 (커맨드 필터링)
- DM 발신자 제한 (특정 사용자로부터만 DM 수신) 🆕
- 멘션 대상 지정 (특정 사용자/역할 멘션만 감지) 🆕

## 설치 방법

### 1. 패키지 설치

```bash
npm install n8n-nodes-discord-all
```

### 2. n8n에 패키지 등록

n8n 환경 변수에 커스텀 노드를 추가:

```bash
export N8N_CUSTOM_EXTENSIONS="/path/to/n8n-nodes-discord-all"
```

또는 n8n 설정 파일에 추가.

### 3. Discord Bot 생성

1. [Discord Developer Portal](https://discord.com/developers/applications)에 접속
2. "New Application" 클릭하여 새 애플리케이션 생성
3. 좌측 메뉴에서 "Bot" 선택
4. "Add Bot" 클릭
5. "Reset Token" 버튼을 클릭하여 봇 토큰 복사 (안전하게 보관!)
6. "Privileged Gateway Intents" 섹션에서 다음 활성화:
   - Presence Intent
   - Server Members Intent
   - Message Content Intent

### 4. Bot 초대

1. 좌측 메뉴에서 "OAuth2" > "URL Generator" 선택
2. Scopes에서 "bot" 선택
3. Bot Permissions에서 필요한 권한 선택:
   - Send Messages
   - Manage Messages
   - Manage Channels
   - Manage Roles
   - Kick Members
   - Ban Members
   - Read Message History
   - Add Reactions
   - 기타 필요한 권한들
4. 생성된 URL로 봇을 서버에 초대

## 사용법

### Credentials 설정

1. n8n에서 "Credentials" > "New" 클릭
2. "Discord API" 선택
3. Bot Token 입력 (Discord Developer Portal에서 복사한 토큰)
4. Application ID 입력 (선택사항)

### 메시지 전송 예제

```
Node: Discord
Resource: Message
Operation: Send
Channel ID: 1234567890123456789
Message Content: "Hello from n8n!"
```

### 임베드 메시지 전송

Additional Fields > Embed에 JSON 입력:

```json
{
  "title": "임베드 제목",
  "description": "임베드 설명",
  "color": 5814783,
  "fields": [
    {
      "name": "필드 1",
      "value": "값 1",
      "inline": true
    }
  ],
  "footer": {
    "text": "푸터 텍스트"
  }
}
```

### 채널 생성 예제

```
Node: Discord
Resource: Channel
Operation: Create
Guild ID: 1234567890123456789
Channel Name: "새-채널"
Channel Type: Text
Additional Fields:
  - Topic: "채널 주제"
  - NSFW: false
```

### 역할 생성 예제

```
Node: Discord
Resource: Role
Operation: Create
Guild ID: 1234567890123456789
Role Name: "VIP"
Color: "#FFD700"
Additional Fields:
  - Hoisted: true
  - Mentionable: true
```

### DM 전송 예제

```
Node: Discord
Resource: DM
Operation: Send
User ID: 1234567890123456789
Message Content: "개인 메시지입니다!"
```

### Discord Trigger 사용 예제

#### 1. 커맨드 봇 (메시지 트리거)
```
Node: Discord Trigger
Event: Message Created
Filters:
  - Guild ID: 1234567890123456789
  - Channel ID: 9876543210987654321
  - Ignore Bots: true
  - Message Starts With: "!"
```

#### 2. DM 자동 응답 봇 🆕
```
Node: Discord Trigger
Event: DM Received
Filters:
  - Ignore Bots: true
  - DM Only From Users: 123456789,987654321 (선택사항)
```

#### 3. 봇 멘션 감지 🆕
```
Node: Discord Trigger
Event: Bot Mentioned
Filters:
  - Guild ID: 1234567890123456789
  - Ignore Bots: true
```

#### 4. 특정 사용자 멘션 감지 🆕
```
Node: Discord Trigger
Event: User Mentioned
Mention User IDs: 123456789,987654321
Filters:
  - Ignore Bots: true
```

#### 5. 역할 멘션 감지 (예: @Moderator) 🆕
```
Node: Discord Trigger
Event: Role Mentioned
Mention Role IDs: 123456789,987654321
Filters:
  - Guild ID: 1234567890123456789
```

## 권한 요구사항

각 기능별 필요한 Discord 권한:

- **메시지**: `SEND_MESSAGES`, `READ_MESSAGE_HISTORY`
- **메시지 관리**: `MANAGE_MESSAGES`
- **채널 관리**: `MANAGE_CHANNELS`
- **역할 관리**: `MANAGE_ROLES`
- **멤버 킥**: `KICK_MEMBERS`
- **멤버 밴**: `BAN_MEMBERS`
- **웹훅 관리**: `MANAGE_WEBHOOKS`

## ID 찾는 방법

Discord에서 개발자 모드를 활성화하면 ID를 쉽게 복사할 수 있습니다:

1. Discord 설정 > 고급 > 개발자 모드 활성화
2. 원하는 항목(서버, 채널, 사용자 등) 우클릭
3. "ID 복사" 선택

## 예제 워크플로우

### 1. 환영 메시지 자동화

```
Discord Trigger (Member Joined)
  ↓
Discord (Send DM)
  Message: "{{$json["username"]}}님, 서버에 오신 것을 환영합니다!"
```

### 2. 커맨드 봇

```
Discord Trigger (Message Created, starts with "!")
  ↓
IF Node (메시지 내용 분석)
  ↓
Discord (Send Message) - 응답 전송
```

### 3. 멤버 역할 자동 할당

```
Discord Trigger (Member Joined)
  ↓
Discord (Add Role)
  Guild ID: {{$json["guildId"]}}
  User ID: {{$json["userId"]}}
  Role ID: "1234567890123456789"
```

### 4. 메시지 로깅

```
Discord Trigger (Message Created)
  ↓
Google Sheets (Append Row)
  - 시간: {{$json["createdTimestamp"]}}
  - 사용자: {{$json["username"]}}
  - 내용: {{$json["content"]}}
```

## 문제 해결

### Bot이 메시지를 보내지 못함
- 채널에 봇의 메시지 전송 권한이 있는지 확인
- Bot Token이 올바른지 확인

### Trigger가 작동하지 않음
- Privileged Gateway Intents가 활성화되어 있는지 확인
- Bot Token이 올바른지 확인
- n8n이 실행 중인지 확인

### 권한 오류
- Discord Developer Portal에서 봇에게 필요한 권한을 부여했는지 확인
- 서버에서 봇의 역할 권한을 확인

## 개발 및 기여

### 로컬 개발

```bash
# 의존성 설치
npm install

# 개발 모드 (파일 감시)
npm run dev

# 빌드
npm run build

# 린트
npm run lint

# 포맷팅
npm run format
```

## 라이선스

MIT

## 지원

이슈나 질문이 있으시면 GitHub Issues에 등록해주세요.

## 업데이트 로그

### v1.0.0
- 초기 릴리스
- 모든 주요 Discord 기능 지원
- Discord Trigger 노드 추가
- 완전한 필터링 옵션
