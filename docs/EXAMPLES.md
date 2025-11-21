# Discord Bot n8n - 예제 모음

## 목차
1. [기본 메시지 작업](#기본-메시지-작업)
2. [고급 메시지 기능](#고급-메시지-기능)
3. [서버 관리](#서버-관리)
4. [자동화 워크플로우](#자동화-워크플로우)
5. [트리거 기반 봇](#트리거-기반-봇)

---

## 기본 메시지 작업

### 1. 간단한 메시지 전송

**설정:**
- Node: Discord
- Resource: Message
- Operation: Send
- Channel ID: `YOUR_CHANNEL_ID`
- Content: "안녕하세요! n8n에서 보낸 메시지입니다."

### 2. 임베드 메시지 전송

**설정:**
- Node: Discord
- Resource: Message
- Operation: Send
- Channel ID: `YOUR_CHANNEL_ID`
- Content: "임베드 메시지입니다"
- Additional Fields > Embed:

```json
{
  "title": "📢 공지사항",
  "description": "중요한 공지사항입니다.",
  "color": 3447003,
  "fields": [
    {
      "name": "날짜",
      "value": "2024-01-01",
      "inline": true
    },
    {
      "name": "작성자",
      "value": "관리자",
      "inline": true
    }
  ],
  "thumbnail": {
    "url": "https://example.com/image.png"
  },
  "footer": {
    "text": "n8n Bot • 2024"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 3. 메시지 수정

**워크플로우:**
```
1. Discord (Send Message) - 메시지 전송
2. Wait (5초 대기)
3. Discord (Edit Message) - 메시지 수정
   - Message ID: {{$json["id"]}} (이전 노드에서 받은 ID)
   - Content: "수정된 메시지입니다"
```

### 4. 메시지에 리액션 추가

**워크플로우:**
```
1. Discord (Send Message)
2. Discord (React)
   - Message ID: {{$json["id"]}}
   - Additional Fields > Emoji: "👍"
```

---

## 고급 메시지 기능

### 5. 다중 채널 동시 메시지 전송

**워크플로우:**
```
1. Code Node - 채널 ID 배열 생성
   ```javascript
   return [
     { channelId: "123456789" },
     { channelId: "987654321" },
     { channelId: "456789123" }
   ];
   ```

2. Discord (Send Message) - Run Once for Each Item 활성화
   - Channel ID: {{$json["channelId"]}}
   - Content: "전체 공지사항"
```

### 6. 조건부 메시지 전송

**워크플로우:**
```
1. HTTP Request - 외부 API 호출
2. IF Node
   - Condition: {{$json["status"]}} equals "success"
3a. Discord (Send Message) - True 경로
    - Content: "✅ 작업이 성공했습니다"
3b. Discord (Send Message) - False 경로
    - Content: "❌ 작업이 실패했습니다"
```

### 7. 메시지 로깅 시스템

**워크플로우:**
```
1. Discord Trigger (Message Created)
2. Google Sheets (Append Row)
   - Timestamp: {{$json["createdTimestamp"]}}
   - User: {{$json["username"]}}
   - Channel: {{$json["channelId"]}}
   - Message: {{$json["content"]}}
```

---

## 서버 관리

### 8. 새 채널 자동 생성

**워크플로우:**
```
1. Schedule Trigger (매주 월요일)
2. Discord (Create Channel)
   - Guild ID: YOUR_GUILD_ID
   - Channel Name: "주간-회의-{{new Date().toISOString().split('T')[0]}}"
   - Channel Type: Text
   - Additional Fields:
     - Topic: "이번 주 회의 채널"
```

### 9. 역할 기반 채널 접근 제어

**워크플로우:**
```
1. Discord Trigger (Member Updated)
2. IF Node - 특정 역할 추가 확인
   - {{$json["newRoles"].some(r => r.id === "ROLE_ID")}}
3. Discord (Create Channel)
   - Private channel for VIP role
4. Discord (Send DM)
   - User ID: {{$json["userId"]}}
   - Content: "VIP 전용 채널이 생성되었습니다!"
```

### 10. 자동 역할 할당

**워크플로우:**
```
1. Discord Trigger (Member Joined)
2. Wait (5초)
3. Discord (Add Role)
   - Guild ID: {{$json["guildId"]}}
   - User ID: {{$json["userId"]}}
   - Role ID: "NEW_MEMBER_ROLE_ID"
4. Discord (Send DM)
   - User ID: {{$json["userId"]}}
   - Content: "환영합니다! 신규 멤버 역할이 부여되었습니다."
```

---

## 자동화 워크플로우

### 11. RSS Feed → Discord 알림

**워크플로우:**
```
1. RSS Read (매 1시간)
   - URL: https://example.com/feed
2. Discord (Send Message)
   - Channel ID: YOUR_CHANNEL_ID
   - Content: "📰 새 글: {{$json["title"]}}\n{{$json["link"]}}"
```

### 12. GitHub Webhook → Discord 알림

**워크플로우:**
```
1. Webhook Trigger
2. Switch Node - 이벤트 타입별 분기
   - Case 1: Push
   - Case 2: Pull Request
   - Case 3: Issue
3. Discord (Send Message)
   - Embed with GitHub event details
```

**임베드 예제 (Push 이벤트):**
```json
{
  "title": "🔨 Push to {{$json["repository"]["name"]}}",
  "description": "{{$json["commits"][0]["message"]}}",
  "color": 7506394,
  "author": {
    "name": "{{$json["pusher"]["name"]}}",
    "icon_url": "{{$json["sender"]["avatar_url"]}}"
  },
  "url": "{{$json["compare"]}}"
}
```

### 13. 정기 서버 상태 보고

**워크플로우:**
```
1. Schedule Trigger (매일 오전 9시)
2. HTTP Request - 서버 상태 체크
3. Code Node - 데이터 포맷팅
4. Discord (Send Message)
   - Embed with server statistics
```

### 14. 키워드 알림 시스템

**워크플로우:**
```
1. Discord Trigger (Message Created)
   - Filters > Message Contains: "중요"
2. Discord (Send Message) - 관리자 채널
   - Channel ID: ADMIN_CHANNEL_ID
   - Content: "⚠️ 중요 키워드 감지\n사용자: {{$json["username"]}}\n메시지: {{$json["content"]}}"
```

---

## 트리거 기반 봇

### 15. 커맨드 봇 (Prefix: !)

**워크플로우:**
```
1. Discord Trigger (Message Created)
   - Filters > Message Starts With: "!"
   
2. Switch Node - 커맨드 파싱
   - Case 1: {{$json["content"]}} startsWith "!ping"
   - Case 2: {{$json["content"]}} startsWith "!help"
   - Case 3: {{$json["content"]}} startsWith "!time"

3a. Discord (Send Message) - !ping 응답
    - Channel ID: {{$json["channelId"]}}
    - Content: "🏓 Pong!"

3b. Discord (Send Message) - !help 응답
    - Content: "도움말:\n!ping - 봇 응답 테스트\n!help - 도움말 표시\n!time - 현재 시각"

3c. Code Node + Discord (Send Message) - !time 응답
    - Content: "🕐 현재 시각: {{new Date().toLocaleString('ko-KR')}}"
```

### 16. 자동 조정 봇 (Auto-Moderation)

**워크플로우:**
```
1. Discord Trigger (Message Created)
   - Filters > Ignore Bots: true

2. IF Node - 금지어 검사
   - Condition: {{$json["content"].toLowerCase().includes("금지어")}}

3. Discord (Delete Message) - True 경로
   - Channel ID: {{$json["channelId"]}}
   - Message ID: {{$json["id"]}}

4. Discord (Send Message) - 경고 메시지
   - Content: "{{$json["username"]}}님, 부적절한 언어 사용이 감지되었습니다."

5. HTTP Request - 로그 서버에 기록
```

### 17. 투표 시스템

**워크플로우:**
```
1. Discord Trigger (Message Created)
   - Filters > Message Starts With: "!투표"

2. Code Node - 투표 내용 파싱
   ```javascript
   const content = $json.content.replace('!투표 ', '');
   return { 
     question: content,
     messageId: $json.id,
     channelId: $json.channelId
   };
   ```

3. Discord (Send Message)
   - Content: "📊 투표: {{$json["question"]}}"

4. Multiple Discord (React) nodes
   - Emoji: "👍", "👎", "🤷"
```

### 18. 레벨링 시스템

**워크플로우:**
```
1. Discord Trigger (Message Created)
   - Filters > Ignore Bots: true

2. Code Node - XP 계산
   ```javascript
   const userId = $json.userId;
   const xpGain = Math.floor(Math.random() * 10) + 5;
   
   // Database에서 현재 XP 조회 (실제로는 DB 노드 사용)
   return {
     userId,
     xpGain,
     channelId: $json.channelId
   };
   ```

3. MySQL/PostgreSQL - XP 업데이트

4. IF Node - 레벨업 체크

5. Discord (Send Message) - 레벨업 축하
   - Content: "🎉 축하합니다! 레벨업했습니다!"
```

### 19. 환영 & 퇴장 알림

**워크플로우:**
```
// 환영 메시지
1. Discord Trigger (Member Joined)
2. Discord (Send Message)
   - Channel ID: WELCOME_CHANNEL_ID
   - Embed:
   ```json
   {
     "title": "새로운 멤버가 도착했습니다! 🎉",
     "description": "<@{{$json["userId"]}}>님, 환영합니다!",
     "color": 3066993,
     "thumbnail": {
       "url": "user_avatar_url"
     }
   }
   ```

// 퇴장 메시지
1. Discord Trigger (Member Left)
2. Discord (Send Message)
   - Channel ID: LOG_CHANNEL_ID
   - Content: "{{$json["username"]}}님이 서버를 떠났습니다. 👋"
```

### 20. 역할 리액션 시스템

**워크플로우:**
```
1. Discord Trigger (Reaction Added)
   - Filters > Message ID: ROLE_MESSAGE_ID

2. Switch Node - 이모지별 역할 매핑
   - Case 1: {{$json["emoji"]}} equals "🎮" → Gamer Role
   - Case 2: {{$json["emoji"]}} equals "🎨" → Artist Role
   - Case 3: {{$json["emoji"]}} equals "💻" → Developer Role

3. Discord (Add Role)
   - Guild ID: {{$json["guildId"]}}
   - User ID: {{$json["userId"]}}
   - Role ID: (각 케이스별 역할 ID)

4. Discord (Send DM)
   - Content: "역할이 부여되었습니다!"
```

---

## 고급 활용

### 21. 티켓 시스템

**초기 설정 메시지:**
```
Discord (Send Message)
- Content: "지원이 필요하신가요? 🎫 리액션을 클릭하세요!"
```

**워크플로우:**
```
1. Discord Trigger (Reaction Added)
2. Discord (Create Channel)
   - Name: "ticket-{{$json["userId"]}}"
   - Type: Text
   - Private: true
3. Discord (Send Message) - 새 티켓 채널
   - Content: "<@{{$json["userId"]}}> 무엇을 도와드릴까요?"
```

### 22. 서버 백업 자동화

**워크플로우:**
```
1. Schedule Trigger (매일 자정)
2. Discord (List Channels)
3. Discord (List Roles)
4. Discord (List Members)
5. Code Node - 데이터 병합
6. Google Drive - JSON 파일 저장
7. Discord (Send Message) - 관리자에게 알림
```

---

## 실용적인 팁

### 메시지 포맷팅

Discord는 Markdown을 지원합니다:

```
**굵게**
*기울임*
__밑줄__
~~취소선~~
`인라인 코드`
```블록 코드```
> 인용
```

### 임베드 색상 코드

```javascript
// 일반적인 색상
const colors = {
  success: 3066993,  // Green
  error: 15158332,   // Red
  warning: 15844367, // Yellow
  info: 3447003,     // Blue
  purple: 10181046
};
```

### 성능 최적화

1. **배치 처리**: 여러 작업을 한 번에 처리
2. **캐싱**: 자주 사용하는 데이터는 캐시
3. **Rate Limiting**: Discord API 제한 준수 (50 requests/second)
4. **에러 핸들링**: 항상 에러 처리 로직 추가

---

이 예제들을 기반으로 자신만의 Discord 봇을 만들어보세요!
