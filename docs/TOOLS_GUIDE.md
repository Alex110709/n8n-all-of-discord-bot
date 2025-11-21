# Discord Tools 노드 가이드

Discord Tools 노드는 Discord API의 고급 기능과 유틸리티를 제공합니다. 메시지 검색, 사용자 정보 조회, 채널 통계 등 다양한 도구를 사용할 수 있습니다.

## 📋 목차

1. [메시지 도구](#메시지-도구)
2. [사용자 도구](#사용자-도구)
3. [채널 도구](#채널-도구)
4. [서버 도구](#서버-도구)
5. [이모지 도구](#이모지-도구)
6. [실용 예제](#실용-예제)

---

## 메시지 도구

### 1. Fetch Messages (메시지 가져오기)

채널에서 여러 메시지를 한 번에 가져옵니다.

**설정:**
```
Node: Discord Tools
Resource: Message
Operation: Fetch Messages
Channel ID: YOUR_CHANNEL_ID
Limit: 50
Additional Options:
  - Include Bots: false
  - Before Message ID: (선택)
  - After Message ID: (선택)
```

**출력 예시:**
```json
[
  {
    "id": "123456789",
    "content": "메시지 내용",
    "author": {
      "id": "987654321",
      "username": "사용자이름",
      "bot": false
    },
    "channelId": "...",
    "guildId": "...",
    "createdTimestamp": 1704067200000,
    "attachments": [...],
    "embeds": [...],
    "reactions": [...]
  }
]
```

### 2. Search Messages (메시지 검색)

특정 텍스트를 포함하는 메시지를 검색합니다.

**설정:**
```
Node: Discord Tools
Resource: Message
Operation: Search Messages
Channel ID: YOUR_CHANNEL_ID
Search Text: "검색어"
Limit: 50
Additional Options:
  - Case Sensitive: false
  - Exact Match: false
  - Include Bots: false
```

**사용 예제:**
```
1. Discord Tools (Search Messages)
   - Search Text: "버그"
   
2. Code Node - 결과 분석
   ```javascript
   return {
     totalFound: $input.all().length,
     messages: $input.all().map(item => ({
       content: item.json.content,
       author: item.json.author.username,
       timestamp: item.json.createdTimestamp
     }))
   };
   ```

3. Discord (Send Message) - 결과 전송
   - Content: "검색 결과: {{$json["totalFound"]}}개의 메시지를 찾았습니다."
```

### 3. Get Mentions (멘션 가져오기)

특정 사용자를 멘션한 모든 메시지를 가져옵니다.

**설정:**
```
Node: Discord Tools
Resource: Message
Operation: Get Mentions
Channel ID: YOUR_CHANNEL_ID
Mentioned User ID: 123456789
Limit: 50
```

**사용 예제 - 멘션 알림 시스템:**
```
1. Schedule Trigger (매 1시간)

2. Discord Tools (Get Mentions)
   - Mentioned User ID: VIP_USER_ID
   - Limit: 10

3. IF Node
   - Condition: {{$json.length > 0}}

4. Discord (Send DM) - True 경로
   - User ID: VIP_USER_ID
   - Content: "최근 1시간 동안 {{$json.length}}개의 멘션이 있었습니다."
```

### 4. Bulk Delete (대량 삭제)

여러 메시지를 한 번에 삭제합니다 (최대 100개, 2주 이내 메시지만).

**설정:**
```
Node: Discord Tools
Resource: Message
Operation: Bulk Delete
Channel ID: YOUR_CHANNEL_ID
Message IDs: "123456789,987654321,456789123"
```

**사용 예제 - 스팸 정리:**
```
1. Discord Trigger (Message Created)
   - Filters > Message Contains: "스팸"

2. Set Node - 메시지 ID 수집
   - Key: spamMessages
   - Value: {{$json["id"]}}
   - Action: Append

3. Wait (10초)

4. Code Node - ID 리스트 생성
   ```javascript
   const spamIds = $('Set Node').all().map(item => item.json.id);
   return { messageIds: spamIds.join(',') };
   ```

5. Discord Tools (Bulk Delete)
   - Message IDs: {{$json["messageIds"]}}
```

### 5. Get Message History (메시지 히스토리)

상세한 메시지 히스토리를 가져옵니다.

**설정:**
```
Node: Discord Tools
Resource: Message
Operation: Get Message History
Channel ID: YOUR_CHANNEL_ID
Limit: 100
```

---

## 사용자 도구

### 1. Get User Info (사용자 정보)

사용자의 상세 정보를 가져옵니다.

**설정:**
```
Node: Discord Tools
Resource: User
Operation: Get User Info
User ID: 123456789
```

**출력 예시:**
```json
{
  "id": "123456789",
  "username": "사용자이름",
  "discriminator": "1234",
  "displayName": "표시이름",
  "bot": false,
  "system": false,
  "avatar": "...",
  "avatarURL": "https://cdn.discordapp.com/avatars/...",
  "banner": "...",
  "accentColor": 5814783,
  "createdTimestamp": 1234567890000,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### 2. Get Avatar (아바타 가져오기)

사용자의 아바타 URL을 가져옵니다.

**설정:**
```
Node: Discord Tools
Resource: User
Operation: Get Avatar
User ID: 123456789
```

**사용 예제 - 프로필 카드:**
```
1. Discord Trigger (Message Created)
   - Filters > Message Starts With: "!프로필"

2. Code Node - 사용자 ID 추출
   ```javascript
   const userId = $json.content.split(' ')[1] || $json.userId;
   return { userId };
   ```

3. Discord Tools (Get User Info)
   - User ID: {{$json["userId"]}}

4. Discord (Send Message)
   - Embed:
   ```json
   {
     "title": "{{$json["username"]}}의 프로필",
     "thumbnail": {
       "url": "{{$json["avatarURL"]}}"
     },
     "fields": [
       {
         "name": "사용자 ID",
         "value": "{{$json["id"]}}",
         "inline": true
       },
       {
         "name": "계정 생성일",
         "value": "{{$json["createdAt"]}}",
         "inline": true
       }
     ],
     "color": {{$json["accentColor"]}}
   }
   ```
```

### 3. Get User Status (상태 가져오기)

사용자의 온라인 상태와 활동을 가져옵니다.

**설정:**
```
Node: Discord Tools
Resource: User
Operation: Get Status
User ID: 123456789
```

**참고:** Presence Intent가 활성화되어 있어야 합니다.

### 4. Check Permissions (권한 확인)

특정 채널에서 사용자의 권한을 확인합니다.

---

## 채널 도구

### 1. Get Messages Count (메시지 개수)

채널의 메시지 개수를 확인합니다.

**설정:**
```
Node: Discord Tools
Resource: Channel
Operation: Get Messages Count
Channel ID: YOUR_CHANNEL_ID
```

### 2. Get Active Users (활성 사용자)

채널에서 활발하게 활동하는 사용자 목록을 가져옵니다.

**설정:**
```
Node: Discord Tools
Resource: Channel
Operation: Get Active Users
Channel ID: YOUR_CHANNEL_ID
```

**출력 예시:**
```json
[
  {
    "id": "123456789",
    "username": "매우활동적인사용자",
    "bot": false,
    "messageCount": 45
  },
  {
    "id": "987654321",
    "username": "활동적인사용자",
    "bot": false,
    "messageCount": 32
  }
]
```

**사용 예제 - 주간 활동 보고서:**
```
1. Schedule Trigger (매주 일요일)

2. Discord Tools (Get Active Users)
   - Channel ID: YOUR_CHANNEL_ID

3. Code Node - Top 10 추출
   ```javascript
   const top10 = $input.all()
     .slice(0, 10)
     .map((item, index) => ({
       rank: index + 1,
       username: item.json.username,
       messageCount: item.json.messageCount
     }));
   
   return { users: top10 };
   ```

4. Discord (Send Message)
   - Embed with leaderboard
```

### 3. Get Pins (고정 메시지)

채널에 고정된 모든 메시지를 가져옵니다.

**설정:**
```
Node: Discord Tools
Resource: Channel
Operation: Get Pins
Channel ID: YOUR_CHANNEL_ID
```

### 4. Set Slowmode (슬로우모드 설정)

채널의 슬로우모드를 설정합니다.

**설정:**
```
Node: Discord Tools
Resource: Channel
Operation: Set Slowmode
Channel ID: YOUR_CHANNEL_ID
Slowmode Duration: 10 (초)
```

**사용 예제 - 자동 슬로우모드:**
```
1. Discord Trigger (Message Created)

2. Code Node - 메시지 속도 계산
   ```javascript
   const recentMessages = $('Discord Trigger').all().slice(-10);
   const timeSpan = 60000; // 1분
   const messagesPerMinute = recentMessages.length;
   
   return {
     messagesPerMinute,
     shouldSlowdown: messagesPerMinute > 20
   };
   ```

3. IF Node
   - Condition: {{$json["shouldSlowdown"]}} equals true

4. Discord Tools (Set Slowmode) - True 경로
   - Slowmode Duration: 5

5. Discord (Send Message)
   - Content: "⚠️ 메시지가 너무 빠릅니다. 5초 슬로우모드가 활성화되었습니다."
```

### 5. Get Webhooks (웹훅 목록)

채널의 모든 웹훅을 가져옵니다.

**설정:**
```
Node: Discord Tools
Resource: Channel
Operation: Get Webhooks
Channel ID: YOUR_CHANNEL_ID
```

---

## 서버 도구

### 1. Get Statistics (서버 통계)

서버의 상세 통계를 가져옵니다.

**설정:**
```
Node: Discord Tools
Resource: Guild
Operation: Get Statistics
Guild ID: YOUR_GUILD_ID
```

**출력 예시:**
```json
{
  "id": "123456789",
  "name": "내 서버",
  "description": "서버 설명",
  "ownerId": "987654321",
  "memberCount": 1234,
  "createdTimestamp": 1234567890000,
  "channels": {
    "total": 50,
    "text": 30,
    "voice": 15,
    "category": 5
  },
  "roles": {
    "total": 20
  },
  "emojis": {
    "total": 50
  },
  "verificationLevel": 2,
  "premiumTier": 1,
  "premiumSubscriptionCount": 5
}
```

**사용 예제 - 서버 상태 대시보드:**
```
1. Schedule Trigger (매일 오전 9시)

2. Discord Tools (Get Statistics)
   - Guild ID: YOUR_GUILD_ID

3. Discord (Send Message)
   - Embed:
   ```json
   {
     "title": "📊 일일 서버 통계",
     "color": 3447003,
     "fields": [
       {
         "name": "총 멤버",
         "value": "{{$json["memberCount"]}}명",
         "inline": true
       },
       {
         "name": "채널",
         "value": "{{$json["channels"]["total"]}}개",
         "inline": true
       },
       {
         "name": "역할",
         "value": "{{$json["roles"]["total"]}}개",
         "inline": true
       },
       {
         "name": "부스트 레벨",
         "value": "레벨 {{$json["premiumTier"]}}",
         "inline": true
       }
     ]
   }
   ```
```

### 2. Get Online Members (온라인 멤버)

온라인 상태인 멤버 수를 확인합니다.

**설정:**
```
Node: Discord Tools
Resource: Guild
Operation: Get Online Members
Guild ID: YOUR_GUILD_ID
```

**참고:** Presence Intent가 활성화되어 있어야 합니다.

### 3. Get Audit Log (감사 로그)

서버의 감사 로그를 가져옵니다.

**설정:**
```
Node: Discord Tools
Resource: Guild
Operation: Get Audit Log
Guild ID: YOUR_GUILD_ID
Additional Options:
  - Audit Log Limit: 50
```

**사용 예제 - 관리자 활동 모니터링:**
```
1. Schedule Trigger (매 시간)

2. Discord Tools (Get Audit Log)
   - Guild ID: YOUR_GUILD_ID
   - Audit Log Limit: 10

3. Code Node - 중요 이벤트 필터링
   ```javascript
   const importantActions = [
     'MEMBER_BAN_ADD',
     'MEMBER_KICK',
     'CHANNEL_DELETE',
     'ROLE_DELETE'
   ];
   
   const important = $input.all().filter(item => 
     importantActions.includes(item.json.actionType)
   );
   
   return important;
   ```

4. IF Node
   - Condition: {{$json.length > 0}}

5. Discord (Send Message) - True 경로
   - Content: "⚠️ 중요한 관리자 활동이 감지되었습니다!"
```

### 4. Get Emojis (이모지 목록)

서버의 모든 커스텀 이모지를 가져옵니다.

**설정:**
```
Node: Discord Tools
Resource: Guild
Operation: Get Emojis
Guild ID: YOUR_GUILD_ID
```

---

## 이모지 도구

### 1. Create Emoji (이모지 생성)

새로운 커스텀 이모지를 생성합니다.

**설정:**
```
Node: Discord Tools
Resource: Emoji
Operation: Create Emoji
Guild ID: YOUR_GUILD_ID
Emoji Name: "my_emoji"
Emoji Image URL: "https://example.com/emoji.png"
```

### 2. Delete Emoji (이모지 삭제)

커스텀 이모지를 삭제합니다.

**설정:**
```
Node: Discord Tools
Resource: Emoji
Operation: Delete Emoji
Guild ID: YOUR_GUILD_ID
Emoji ID: 123456789
```

### 3. List Emojis (이모지 목록)

모든 커스텀 이모지를 나열합니다.

**설정:**
```
Node: Discord Tools
Resource: Emoji
Operation: List Emojis
Guild ID: YOUR_GUILD_ID
```

**사용 예제 - 이모지 통계:**
```
1. Discord Trigger (Message Created)
   - Filters > Message Contains: "!이모지통계"

2. Discord Tools (List Emojis)
   - Guild ID: {{$json["guildId"]}}

3. Code Node - 통계 계산
   ```javascript
   const emojis = $input.all();
   return {
     total: emojis.length,
     animated: emojis.filter(e => e.json.animated).length,
     static: emojis.filter(e => !e.json.animated).length
   };
   ```

4. Discord (Send Message)
   - Content: "이모지 통계\n총: {{$json["total"]}}개\n애니메이션: {{$json["animated"]}}개\n정적: {{$json["static"]}}개"
```

---

## 실용 예제

### 예제 1: 콘텐츠 조정 시스템

특정 키워드를 포함한 메시지를 자동으로 검색하고 삭제합니다.

```
1. Schedule Trigger (매 10분)

2. Discord Tools (Search Messages)
   - Channel ID: MONITORED_CHANNEL_ID
   - Search Text: "금지어"
   - Limit: 100

3. IF Node
   - Condition: {{$json.length > 0}}

4. Code Node - 메시지 ID 추출
   ```javascript
   const messageIds = $input.all()
     .map(item => item.json.id)
     .join(',');
   return { messageIds };
   ```

5. Discord Tools (Bulk Delete) - True 경로
   - Message IDs: {{$json["messageIds"]}}

6. Discord (Send Message) - 로그 채널
   - Content: "🛡️ {{$node["Code Node"].json["messageIds"].split(',').length}}개의 부적절한 메시지를 삭제했습니다."
```

### 예제 2: 사용자 참여도 분석

채널별 사용자 활동을 분석하고 보고서를 생성합니다.

```
1. Schedule Trigger (매주 일요일 오후 6시)

2. Code Node - 채널 목록 생성
   ```javascript
   const channels = [
     { id: "CHANNEL_1_ID", name: "일반" },
     { id: "CHANNEL_2_ID", name: "공지" },
     { id: "CHANNEL_3_ID", name: "질문" }
   ];
   return channels;
   ```

3. Discord Tools (Get Active Users) - Run Once for Each Item
   - Channel ID: {{$json["id"]}}

4. Code Node - 데이터 집계
   ```javascript
   const allData = $input.all();
   
   // 채널별 활동 분석
   const report = allData.map(item => ({
     channel: item.json.channelName,
     topUser: item.json[0]?.username || 'N/A',
     topUserMessages: item.json[0]?.messageCount || 0,
     totalActiveUsers: item.json.length
   }));
   
   return { report };
   ```

5. Discord (Send Message)
   - Embed with weekly report
```

### 예제 3: 멘션 통계 수집

특정 사용자가 얼마나 자주 멘션되는지 추적합니다.

```
1. Schedule Trigger (매일 자정)

2. Discord Tools (Get Mentions)
   - Channel ID: YOUR_CHANNEL_ID
   - Mentioned User ID: TARGET_USER_ID
   - Limit: 100

3. Code Node - 일일 통계
   ```javascript
   const mentions = $input.all();
   const today = new Date().toISOString().split('T')[0];
   
   const mentioners = {};
   mentions.forEach(item => {
     const author = item.json.author.username;
     mentioners[author] = (mentioners[author] || 0) + 1;
   });
   
   return {
     date: today,
     totalMentions: mentions.length,
     uniqueMentioners: Object.keys(mentioners).length,
     topMentioner: Object.entries(mentioners)
       .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'
   };
   ```

4. Google Sheets (Append Row)
   - Sheet: "Mention_Stats"
   - Data: {{$json}}
```

### 예제 4: 서버 성장 추적

서버 통계를 시간별로 추적합니다.

```
1. Schedule Trigger (매 시간)

2. Discord Tools (Get Statistics)
   - Guild ID: YOUR_GUILD_ID

3. Code Node - 타임스탬프 추가
   ```javascript
   return {
     timestamp: new Date().toISOString(),
     memberCount: $json.memberCount,
     channelCount: $json.channels.total,
     roleCount: $json.roles.total,
     boostLevel: $json.premiumTier
   };
   ```

4. PostgreSQL (Insert)
   - Table: server_stats
   - Data: {{$json}}

5. IF Node - 성장 체크 (멤버 수가 100의 배수)
   - Condition: {{$json["memberCount"] % 100 === 0}}

6. Discord (Send Message) - True 경로
   - Content: "🎉 축하합니다! 서버 멤버가 {{$json["memberCount"]}}명이 되었습니다!"
```

### 예제 5: 이모지 사용 통계

메시지에서 이모지 사용 패턴을 분석합니다.

```
1. Discord Trigger (Message Created)

2. Code Node - 이모지 추출
   ```javascript
   const content = $json.content;
   const emojiRegex = /<a?:\w+:\d+>/g;
   const customEmojis = content.match(emojiRegex) || [];
   
   if (customEmojis.length === 0) return null;
   
   return {
     userId: $json.userId,
     channelId: $json.channelId,
     emojis: customEmojis,
     timestamp: $json.createdTimestamp
   };
   ```

3. MongoDB (Insert)
   - Collection: emoji_usage
   - Document: {{$json}}
```

---

## 권한 요구사항

각 기능별 필요한 Discord 권한:

### 메시지 도구
- `READ_MESSAGE_HISTORY` - 메시지 가져오기, 검색
- `MANAGE_MESSAGES` - 대량 삭제

### 사용자 도구
- 기본 권한만 필요
- `PRESENCE_INTENT` (선택) - 상태 정보

### 채널 도구
- `VIEW_CHANNEL` - 채널 정보 조회
- `MANAGE_CHANNELS` - 슬로우모드 설정
- `MANAGE_WEBHOOKS` - 웹훅 조회

### 서버 도구
- `VIEW_AUDIT_LOG` - 감사 로그 조회
- `MANAGE_EMOJIS_AND_STICKERS` - 이모지 관리

---

## 성능 최적화 팁

### 1. 페이지네이션 사용
```javascript
// 대량의 메시지를 가져올 때
let lastId = null;
const allMessages = [];

for (let i = 0; i < 5; i++) {
  const messages = await fetchMessages({
    limit: 100,
    before: lastId
  });
  
  allMessages.push(...messages);
  lastId = messages[messages.length - 1].id;
}
```

### 2. 캐싱
자주 조회하는 데이터는 n8n의 Static Data나 외부 캐시를 사용하세요.

### 3. 배치 처리
여러 채널의 데이터를 수집할 때는 배치로 처리하세요.

### 4. Rate Limiting 준수
Discord API는 초당 50개의 요청으로 제한됩니다. Wait 노드를 사용하여 조절하세요.

---

Discord Tools를 활용하여 강력한 Discord 자동화 시스템을 구축하세요!
