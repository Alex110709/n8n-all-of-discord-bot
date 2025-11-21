# Discord DM 및 멘션 트리거 가이드

이 가이드는 n8n Discord 커스텀 노드의 DM(다이렉트 메시지) 및 멘션 트리거 기능에 대한 상세한 사용법을 제공합니다.

## 📋 목차

1. [DM 트리거](#dm-트리거)
2. [봇 멘션 트리거](#봇-멘션-트리거)
3. [사용자 멘션 트리거](#사용자-멘션-트리거)
4. [역할 멘션 트리거](#역할-멘션-트리거)
5. [실용 예제](#실용-예제)
6. [보안 및 모범 사례](#보안-및-모범-사례)

---

## DM 트리거

### 기본 설정

DM 수신 시 자동으로 트리거되는 워크플로우를 만들 수 있습니다.

**설정:**
```
Node: Discord Trigger
Event: DM Received
Filters:
  - Ignore Bots: true (봇 메시지 무시)
```

### 출력 데이터 구조

```json
{
  "id": "1234567890123456789",
  "content": "안녕하세요!",
  "channelId": "9876543210987654321",
  "userId": "1111111111111111111",
  "authorBot": false,
  "username": "사용자이름",
  "discriminator": "1234",
  "avatarURL": "https://cdn.discordapp.com/avatars/...",
  "createdTimestamp": 1704067200000,
  "isDM": true,
  "channelType": 1,
  "attachments": [
    {
      "id": "...",
      "url": "...",
      "name": "image.png",
      "size": 123456,
      "contentType": "image/png"
    }
  ]
}
```

### 예제 1: DM 자동 응답 봇

```
1. Discord Trigger (DM Received)
   - Ignore Bots: true

2. Discord (Send DM)
   - User ID: {{$json["userId"]}}
   - Content: "{{$json["username"]}}님, 메시지 감사합니다! 곧 답변드리겠습니다."
```

### 예제 2: 특정 사용자만 DM 수신

```
1. Discord Trigger (DM Received)
   - Filters > DM Only From Users: "123456789,987654321"
   - Ignore Bots: true

2. Discord (Send DM)
   - User ID: {{$json["userId"]}}
   - Content: "인증된 사용자 메시지를 받았습니다."
```

### 예제 3: DM 내용 로깅

```
1. Discord Trigger (DM Received)

2. Code Node - 데이터 포맷팅
   ```javascript
   const now = new Date($json.createdTimestamp);
   return {
     timestamp: now.toISOString(),
     userId: $json.userId,
     username: $json.username,
     message: $json.content,
     hasAttachments: $json.attachments.length > 0
   };
   ```

3. Google Sheets (Append Row)
   - Sheet: "DM_Logs"
   - Values: {{$json}}
```

---

## 봇 멘션 트리거

봇이 메시지에서 멘션되었을 때 트리거됩니다.

### 기본 설정

```
Node: Discord Trigger
Event: Bot Mentioned
Filters:
  - Ignore Bots: true
```

### 출력 데이터 구조

```json
{
  "id": "1234567890123456789",
  "content": "<@BOT_ID> 안녕하세요!",
  "channelId": "9876543210987654321",
  "guildId": "1111111111111111111",
  "userId": "2222222222222222222",
  "authorBot": false,
  "username": "사용자이름",
  "createdTimestamp": 1704067200000,
  "isDM": false,
  "channelType": 0,
  "mentionsBot": true,
  "attachments": []
}
```

### 예제 4: 봇 호출 응답

```
1. Discord Trigger (Bot Mentioned)
   - Ignore Bots: true

2. Code Node - 명령어 파싱
   ```javascript
   const content = $json.content.replace(/<@!?\d+>/, '').trim();
   const words = content.split(' ');
   const command = words[0]?.toLowerCase() || '';
   
   return {
     ...$json,
     command,
     args: words.slice(1)
   };
   ```

3. Switch Node - 명령어 분기
   - Case 1: {{$json["command"]}} equals "help"
   - Case 2: {{$json["command"]}} equals "ping"
   - Case 3: {{$json["command"]}} equals "info"

4a. Discord (Send Message) - Help
    - Channel ID: {{$json["channelId"]}}
    - Content: "사용 가능한 명령어: help, ping, info"

4b. Discord (Send Message) - Ping
    - Channel ID: {{$json["channelId"]}}
    - Content: "🏓 Pong!"

4c. Discord (Send Message) - Info
    - Channel ID: {{$json["channelId"]}}
    - Content: "봇 정보: n8n Discord Bot v1.0"
```

### 예제 5: 봇 멘션 DM 응답

```
1. Discord Trigger (Bot Mentioned)
   - Filters > Guild ID: YOUR_GUILD_ID

2. Discord (Send DM)
   - User ID: {{$json["userId"]}}
   - Content: "{{$json["username"]}}님, 저를 불러주셨나요? DM으로 자세히 말씀해주세요!"
```

---

## 사용자 멘션 트리거

특정 사용자가 멘션되었을 때 트리거됩니다.

### 기본 설정

```
Node: Discord Trigger
Event: User Mentioned
Mention User IDs: "123456789,987654321"
Filters:
  - Ignore Bots: true
```

### 출력 데이터 구조

```json
{
  "id": "1234567890123456789",
  "content": "<@123456789> 확인 부탁드립니다.",
  "channelId": "9876543210987654321",
  "guildId": "1111111111111111111",
  "userId": "2222222222222222222",
  "authorBot": false,
  "username": "멘션한사람",
  "createdTimestamp": 1704067200000,
  "isDM": false,
  "channelType": 0,
  "mentionedUsers": [
    {
      "id": "123456789",
      "username": "멘션된사용자"
    }
  ],
  "targetMentionedUsers": [
    {
      "id": "123456789",
      "username": "멘션된사용자"
    }
  ],
  "attachments": []
}
```

### 예제 6: VIP 사용자 멘션 알림

```
1. Discord Trigger (User Mentioned)
   - Mention User IDs: "VIP_USER_ID_1,VIP_USER_ID_2"

2. Discord (Send Message) - 알림 채널
   - Channel ID: ALERT_CHANNEL_ID
   - Embed:
   ```json
   {
     "title": "🔔 VIP 사용자 멘션 알림",
     "description": "VIP 사용자가 멘션되었습니다.",
     "color": 15844367,
     "fields": [
       {
         "name": "멘션한 사용자",
         "value": "<@{{$json["userId"]}}>",
         "inline": true
       },
       {
         "name": "멘션된 사용자",
         "value": "{{$json["targetMentionedUsers"].map(u => '<@' + u.id + '>').join(', ')}}",
         "inline": true
       },
       {
         "name": "채널",
         "value": "<#{{$json["channelId"]}}>",
         "inline": true
       },
       {
         "name": "메시지",
         "value": "{{$json["content"]}}",
         "inline": false
       }
     ]
   }
   ```

3. Discord (Send DM) - VIP에게 DM
   - User ID: {{$json["targetMentionedUsers"][0]["id"]}}
   - Content: "{{$json["username"]}}님이 메시지에서 당신을 멘션했습니다!\n채널: <#{{$json["channelId"]}}>"
```

### 예제 7: 관리자 멘션 시 티켓 생성

```
1. Discord Trigger (User Mentioned)
   - Mention User IDs: "ADMIN_ID_1,ADMIN_ID_2"
   - Filters > Channel ID: SUPPORT_CHANNEL_ID

2. Discord (Create Channel)
   - Guild ID: {{$json["guildId"]}}
   - Channel Name: "ticket-{{$json["userId"]}}"
   - Channel Type: Text
   - Additional Fields > Topic: "Support ticket for {{$json["username"]}}"

3. Discord (Send Message) - 티켓 채널
   - Channel ID: {{$json["id"]}} (새로 생성된 채널)
   - Content: "<@{{$node["Discord Trigger"].json["userId"]}}> 티켓이 생성되었습니다. 관리자가 곧 응답할 것입니다."

4. Discord (Send Message) - 원본 채널
   - Channel ID: {{$node["Discord Trigger"].json["channelId"]}}
   - Content: "티켓이 생성되었습니다: <#{{$node["Discord"].json["id"]}}>"
```

---

## 역할 멘션 트리거

특정 역할이 멘션되었을 때 트리거됩니다.

### 기본 설정

```
Node: Discord Trigger
Event: Role Mentioned
Mention Role IDs: "123456789,987654321"
Filters:
  - Ignore Bots: true
```

### 출력 데이터 구조

```json
{
  "id": "1234567890123456789",
  "content": "<@&123456789> 공지사항입니다.",
  "channelId": "9876543210987654321",
  "guildId": "1111111111111111111",
  "userId": "2222222222222222222",
  "authorBot": false,
  "username": "공지자",
  "createdTimestamp": 1704067200000,
  "isDM": false,
  "channelType": 0,
  "mentionedRoles": [
    {
      "id": "123456789",
      "name": "Moderator"
    }
  ],
  "targetMentionedRoles": [
    {
      "id": "123456789",
      "name": "Moderator"
    }
  ],
  "attachments": []
}
```

### 예제 8: 모더레이터 역할 멘션 로깅

```
1. Discord Trigger (Role Mentioned)
   - Mention Role IDs: "MODERATOR_ROLE_ID"

2. Discord (Send Message) - 로그 채널
   - Channel ID: MOD_LOG_CHANNEL_ID
   - Embed:
   ```json
   {
     "title": "📋 모더레이터 멘션 로그",
     "color": 3447003,
     "fields": [
       {
         "name": "멘션한 사용자",
         "value": "{{$json["username"]}} (<@{{$json["userId"]}}>)",
         "inline": true
       },
       {
         "name": "채널",
         "value": "<#{{$json["channelId"]}}>",
         "inline": true
       },
       {
         "name": "시간",
         "value": "<t:{{Math.floor($json["createdTimestamp"] / 1000)}}:F>",
         "inline": true
       },
       {
         "name": "메시지",
         "value": "{{$json["content"]}}",
         "inline": false
       }
     ]
   }
   ```
```

### 예제 9: 긴급 역할 멘션 알림

```
1. Discord Trigger (Role Mentioned)
   - Mention Role IDs: "EMERGENCY_ROLE_ID"

2. HTTP Request - 외부 알림 서비스 (선택사항)
   - Method: POST
   - URL: https://your-alert-service.com/alert
   - Body:
   ```json
   {
     "type": "discord_emergency",
     "user": "{{$json["username"]}}",
     "message": "{{$json["content"]}}",
     "channel": "{{$json["channelId"]}}"
   }
   ```

3. Discord (Send Message) - 긴급 채널
   - Channel ID: EMERGENCY_CHANNEL_ID
   - Content: "@everyone 🚨 긴급 상황 발생!\n사용자: {{$json["username"]}}\n메시지: {{$json["content"]}}\n링크: https://discord.com/channels/{{$json["guildId"]}}/{{$json["channelId"]}}/{{$json["id"]}}"
```

---

## 실용 예제

### 예제 10: 고객 지원 봇 (DM + 멘션)

**시나리오**: 사용자가 DM을 보내거나 봇을 멘션하면 지원 티켓 생성

```
워크플로우 1 - DM 지원
1. Discord Trigger (DM Received)
   - Ignore Bots: true

2. Code Node - 티켓 ID 생성
   ```javascript
   return {
     ...$json,
     ticketId: 'DM-' + Date.now()
   };
   ```

3. HTTP Request - 티켓 시스템 API
   - Method: POST
   - URL: https://your-ticketing-system.com/api/tickets
   - Body: {{$json}}

4. Discord (Send DM)
   - User ID: {{$json["userId"]}}
   - Content: "지원 티켓이 생성되었습니다 (ID: {{$json["ticketId"]}}). 곧 답변드리겠습니다!"

워크플로우 2 - 채널 내 봇 멘션 지원
1. Discord Trigger (Bot Mentioned)
   - Ignore Bots: true

2. IF Node - 지원 키워드 체크
   - Condition: {{$json["content"].toLowerCase().includes("지원") || $json["content"].toLowerCase().includes("도움")}}

3. Discord (Send Message) - True 경로
   - Channel ID: {{$json["channelId"]}}
   - Content: "<@{{$json["userId"]}}> DM으로 자세한 내용을 보내주시면 더 빠르게 도와드릴 수 있습니다!"
```

### 예제 11: 다국어 자동 응답 봇

```
1. Discord Trigger (DM Received)
   - Ignore Bots: true

2. Code Node - 언어 감지
   ```javascript
   const content = $json.content.toLowerCase();
   let language = 'en';
   
   if (content.includes('안녕') || content.includes('감사')) {
     language = 'ko';
   } else if (content.includes('こんにち') || content.includes('ありがとう')) {
     language = 'ja';
   } else if (content.includes('你好') || content.includes('谢谢')) {
     language = 'zh';
   }
   
   const responses = {
     en: "Hello! How can I help you?",
     ko: "안녕하세요! 무엇을 도와드릴까요?",
     ja: "こんにちは！何かお手伝いできますか？",
     zh: "你好！我能帮你什么？"
   };
   
   return {
     ...$json,
     language,
     response: responses[language]
   };
   ```

3. Discord (Send DM)
   - User ID: {{$json["userId"]}}
   - Content: {{$json["response"]}}
```

### 예제 12: 멘션 기반 할 일 관리

```
1. Discord Trigger (User Mentioned)
   - Mention User IDs: "YOUR_USER_ID"

2. Code Node - 할 일 파싱
   ```javascript
   const content = $json.content;
   const todoMatch = content.match(/할일[:\s]+(.*)/i);
   
   if (todoMatch) {
     return {
       ...$json,
       isTodo: true,
       todoContent: todoMatch[1].trim(),
       assignedBy: $json.username
     };
   }
   
   return { ...$json, isTodo: false };
   ```

3. IF Node
   - Condition: {{$json["isTodo"]}} equals true

4. Notion (Create Page) - True 경로
   - Database: "할 일"
   - Properties:
     - Title: {{$json["todoContent"]}}
     - Assigned By: {{$json["assignedBy"]}}
     - Discord Link: https://discord.com/channels/...

5. Discord (Send Message)
   - Channel ID: {{$json["channelId"]}}
   - Content: "✅ 할 일이 추가되었습니다: {{$json["todoContent"]}}"
```

---

## 보안 및 모범 사례

### 1. 봇 필터링
항상 `Ignore Bots: true` 설정을 사용하여 봇 루프를 방지하세요.

```
Filters:
  - Ignore Bots: true
```

### 2. 사용자 화이트리스트
중요한 명령어는 특정 사용자만 사용할 수 있도록 제한하세요.

```
1. Discord Trigger (Bot Mentioned)

2. IF Node - 권한 체크
   - Condition: {{["ADMIN_ID_1", "ADMIN_ID_2"].includes($json["userId"])}}

3a. Execute Command - True 경로
3b. Send Error - False 경로
```

### 3. Rate Limiting
DM 스팸을 방지하기 위해 rate limiting을 구현하세요.

```javascript
// Code Node
const userId = $json.userId;
const lastMessageTime = $getWorkflowStaticData('global')[userId] || 0;
const now = Date.now();
const cooldown = 60000; // 1분

if (now - lastMessageTime < cooldown) {
  return { ...json, rateLimited: true };
}

$getWorkflowStaticData('global')[userId] = now;
return { ...$json, rateLimited: false };
```

### 4. 민감한 정보 보호
DM에서 받은 개인 정보는 암호화하거나 안전하게 처리하세요.

### 5. 에러 핸들링
항상 에러 처리를 추가하세요.

```
Settings > Error Workflow
또는
Try-Catch 패턴 사용
```

### 6. 로깅
중요한 이벤트는 로그를 남기세요.

```
1. Discord Trigger
2. Discord Action
3. Google Sheets/Database - 로그 저장
```

---

## 필수 Discord 설정

### Privileged Gateway Intents

Discord Developer Portal에서 다음 Intents를 활성화해야 합니다:

1. **MESSAGE CONTENT INTENT** ✅ (필수)
   - 메시지 내용 읽기 위해 필요

2. **SERVER MEMBERS INTENT** ✅
   - 멤버 정보 조회 위해 필요

3. **PRESENCE INTENT** (선택)
   - 사용자 온라인 상태 확인 시 필요

### Bot Permissions

최소 권한:
- Read Messages/View Channels
- Send Messages
- Read Message History

DM 기능:
- 별도 권한 불필요 (봇이 서버에 있으면 DM 가능)

---

## 문제 해결

### DM을 받지 못할 때

1. **Partials 확인**: 코드에서 Partials.Channel이 활성화되어 있는지 확인
2. **사용자 개인정보 설정**: 사용자가 DM을 차단했을 수 있음
3. **Intents 확인**: MESSAGE CONTENT INTENT가 활성화되어 있는지 확인

### 멘션이 트리거되지 않을 때

1. **User ID 확인**: 올바른 사용자/역할 ID를 입력했는지 확인
2. **Message Content Intent**: 반드시 활성화되어 있어야 함
3. **봇 권한**: 채널을 읽을 권한이 있는지 확인

---

이 가이드를 통해 Discord DM 및 멘션 트리거를 효과적으로 활용할 수 있습니다!
