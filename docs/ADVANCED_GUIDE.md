# Discord Advanced 노드 완벽 가이드

Discord Advanced 노드는 고급 분석, 자동 조정, 백업, 자동화 기능을 제공합니다.

## 📋 목차

1. [Analytics (분석)](#analytics-분석)
2. [Moderation (조정)](#moderation-조정)
3. [Backup (백업)](#backup-백업)
4. [Automation (자동화)](#automation-자동화)
5. [Insights (인사이트)](#insights-인사이트)
6. [실용 예제](#실용-예제)

---

## Analytics (분석)

서버 활동을 심층 분석하고 통계를 생성합니다.

### 1. Message Activity Heatmap (메시지 활동 히트맵)

**설명**: 시간대별/요일별 메시지 활동 패턴을 시각화합니다.

**설정:**

```
Resource: Analytics
Operation: Message Activity Heatmap
Guild ID: YOUR_GUILD_ID
Channel ID: YOUR_CHANNEL_ID
Time Range: 7 (days)
```

**출력 예시:**

```json
{
  "channelId": "123456789",
  "timeRange": 7,
  "totalMessages": 543,
  "heatmap": {
    "Monday": {
      "0": 5, "1": 2, ..., "23": 12
    },
    "Tuesday": { ... }
  },
  "hourlyDistribution": {
    "0": 45, "1": 23, ..., "23": 67
  },
  "dailyDistribution": {
    "2024-01-01": 78,
    "2024-01-02": 92
  },
  "peakHour": "14",
  "peakDay": "2024-01-03"
}
```

**활용:**

- 최적의 공지 시간 결정
- 커뮤니티 활동 패턴 파악
- 모더레이터 배치 스케줄링

---

### 2. Top Contributors (주요 기여자)

**설명**: 가장 활발한 멤버들을 식별합니다.

**설정:**

```
Resource: Analytics
Operation: Top Contributors
Guild ID: YOUR_GUILD_ID
Time Range: 7
```

**출력 예시:**

```json
{
  "guildId": "123456789",
  "timeRange": 7,
  "topContributors": [
    {
      "userId": "111222333",
      "username": "ActiveUser123",
      "messageCount": 234,
      "channelCount": 8,
      "channels": ["general", "announcements", ...]
    }
  ],
  "totalAnalyzed": 156
}
```

**활용:**

- 활성 멤버 보상 프로그램
- 모더레이터 후보 선정
- 커뮤니티 리더 식별

---

### 3. Channel Engagement Analysis (채널 참여도 분석)

**설명**: 각 채널의 참여도를 비교 분석합니다.

**설정:**

```
Resource: Analytics
Operation: Channel Engagement Analysis
Guild ID: YOUR_GUILD_ID
```

**출력 예시:**

```json
{
  "guildId": "123456789",
  "totalChannels": 15,
  "channels": [
    {
      "channelId": "...",
      "channelName": "general",
      "messageCount": 543,
      "uniqueUsers": 89,
      "reactionCount": 234,
      "engagementScore": 216.5
    }
  ],
  "mostEngaged": { "channelName": "general", ... },
  "leastEngaged": { "channelName": "off-topic", ... }
}
```

**활용:**

- 활성 채널 vs 비활성 채널 식별
- 채널 구조 최적화
- 리소스 재배치 결정

---

### 4. Peak Activity Times (피크 활동 시간)

**설명**: 서버 전체의 피크 활동 시간을 분석합니다.

**설정:**

```
Resource: Analytics
Operation: Peak Activity Times
Guild ID: YOUR_GUILD_ID
```

**출력 예시:**

```json
{
  "guildId": "123456789",
  "peakHour": "14:00 (234 messages)",
  "peakDay": "Friday (1234 messages)",
  "hourlyDistribution": {
    "0": 45, "1": 23, ..., "23": 156
  },
  "dailyDistribution": {
    "Monday": 234,
    "Tuesday": 345,
    ...
  }
}
```

**활용:**

- 이벤트 스케줄링
- 공지사항 타이밍 최적화
- 스태프 배치 계획

---

### 5. Emoji Usage Statistics (이모지 사용 통계)

**설명**: 서버 내 이모지 및 리액션 사용 패턴을 분석합니다.

**활용:**

- 인기 이모지 파악
- 커스텀 이모지 효과 측정
- 감정 분석 데이터

---

## Moderation (조정)

자동 조정 도구로 서버를 안전하게 유지합니다.

### 1. Detect Spam Messages (스팸 메시지 감지)

**설명**: 반복되는 스팸 메시지를 자동으로 감지합니다.

**설정:**

```
Resource: Moderation
Operation: Detect Spam Messages
Guild ID: YOUR_GUILD_ID
Channel ID: YOUR_CHANNEL_ID
Additional Options:
  - Spam Threshold: 5
```

**출력 예시:**

```json
{
	"channelId": "123456789",
	"totalMessages": 100,
	"spamGroups": 3,
	"spamMessages": [
		{
			"content": "CHECK OUT THIS LINK!!!",
			"count": 8,
			"messages": [
				{
					"id": "...",
					"author": "Spammer1",
					"authorId": "...",
					"timestamp": 1704067200000
				}
			],
			"authors": ["Spammer1", "Spammer2"]
		}
	],
	"threshold": 5
}
```

**워크플로우 예제:**

```
1. Discord Advanced (Detect Spam)
   ↓
2. IF Node (spamGroups > 0)
   ↓
3. Discord Tools (Bulk Delete)
   - Message IDs: {{$json["spamMessages"][0]["messages"].map(m => m.id)}}
   ↓
4. Discord (Send Message)
   - Content: "⚠️ 스팸 메시지 {{$json["spamGroups"]}}개 그룹이 삭제되었습니다."
```

---

### 2. Find Duplicate Messages (중복 메시지 찾기)

**설명**: 정확히 동일한 내용의 중복 메시지를 찾습니다.

**출력 예시:**

```json
{
	"channelId": "123456789",
	"totalMessages": 100,
	"duplicateCount": 5,
	"duplicates": [
		{
			"original": {
				"id": "...",
				"author": "User1",
				"timestamp": 1704067200000
			},
			"duplicate": {
				"id": "...",
				"author": "User1",
				"timestamp": 1704067260000
			},
			"content": "Same message content"
		}
	]
}
```

**활용:**

- 실수로 중복 전송된 메시지 정리
- 봇 오작동 감지
- 스팸 패턴 식별

---

### 3. Scan for Links (링크 스캔)

**설명**: 메시지 내 모든 URL을 추출하고 분석합니다.

**출력 예시:**

```json
{
	"channelId": "123456789",
	"totalMessages": 100,
	"messagesWithLinks": 23,
	"totalLinks": 34,
	"uniqueDomains": 12,
	"domains": ["youtube.com", "twitter.com", "suspicious-site.xyz"],
	"messages": [
		{
			"messageId": "...",
			"author": "User1",
			"links": ["https://youtube.com/watch?v=..."],
			"linkCount": 1,
			"timestamp": 1704067200000
		}
	]
}
```

**워크플로우 예제 - 의심스러운 링크 차단:**

````
1. Discord Advanced (Scan Links)
   ↓
2. Code Node - 블랙리스트 체크
   ```javascript
   const blacklist = ['bit.ly', 'tinyurl.com', 'suspicious.com'];
   const suspicious = $json.messages.filter(msg =>
     msg.links.some(link =>
       blacklist.some(domain => link.includes(domain))
     )
   );
   return { suspicious, count: suspicious.length };
````

↓ 3. IF Node (count > 0)
↓ 4. Discord Tools (Bulk Delete)
↓ 5. Discord (Send Alert)

````

---

### 4. Mass Mention Detection (대량 멘션 감지)

**설명**: 3명 이상을 멘션한 메시지를 감지합니다.

**출력 예시:**
```json
{
  "channelId": "123456789",
  "totalMessages": 100,
  "massMentionCount": 4,
  "messages": [
    {
      "messageId": "...",
      "author": "User1",
      "content": "@user1 @user2 @user3 Check this out!",
      "userMentions": 3,
      "roleMentions": 0,
      "totalMentions": 3,
      "mentionsEveryone": false,
      "timestamp": 1704067200000
    }
  ]
}
````

**활용:**

- 스팸 멘션 방지
- 어뷰징 감지
- 중요 공지 추적

---

### 5. Inactive Member Scan (비활성 멤버 스캔)

**설명**: 오랫동안 활동하지 않은 멤버를 찾습니다.

**설정:**

```
Resource: Moderation
Operation: Inactive Member Scan
Guild ID: YOUR_GUILD_ID
Additional Options:
  - Inactive Days: 30
```

**출력 예시:**

```json
{
	"guildId": "123456789",
	"inactiveDays": 30,
	"totalMembers": 500,
	"inactiveCount": 87,
	"inactiveMembers": [
		{
			"userId": "...",
			"username": "InactiveUser",
			"nickname": null,
			"joinedAt": 1680000000000,
			"daysSinceJoin": 180,
			"roles": ["Member"]
		}
	]
}
```

**워크플로우 예제 - 비활성 멤버 정리:**

```
1. Schedule Trigger (매월 1일)
   ↓
2. Discord Advanced (Inactive Member Scan)
   - Inactive Days: 60
   ↓
3. Code Node - DM 메시지 준비
   ↓
4. Discord (Mass DM)
   - "60일 동안 활동이 없었습니다. 7일 내 활동이 없으면 킥됩니다."
   ↓
5. Wait (7일)
   ↓
6. Discord Advanced (Inactive Member Scan)
   - Inactive Days: 67
   ↓
7. Discord (Kick Members)
```

---

## Backup (백업)

서버 데이터를 안전하게 백업합니다.

### 1. Export Channel Messages (채널 메시지 내보내기)

**설명**: 채널의 모든 메시지를 내보냅니다.

**설정:**

```
Resource: Backup
Operation: Export Channel Messages
Guild ID: YOUR_GUILD_ID
Channel ID: YOUR_CHANNEL_ID
Export Format: JSON
```

**출력 예시:**

```json
{
	"channelId": "123456789",
	"channelName": "general",
	"exportFormat": "json",
	"messageCount": 543,
	"exportedAt": "2024-01-01T00:00:00.000Z",
	"messages": [
		{
			"id": "...",
			"author": "User1",
			"authorId": "...",
			"content": "Message content",
			"timestamp": "2024-01-01T00:00:00.000Z",
			"attachments": [
				{
					"name": "image.png",
					"url": "https://...",
					"type": "image/png"
				}
			],
			"embeds": 0,
			"reactions": 3
		}
	]
}
```

**활용:**

- 법적 기록 보관
- 채널 히스토리 아카이브
- 데이터 마이그레이션

---

### 2. Export Server Structure (서버 구조 내보내기)

**설명**: 채널, 역할 등 서버 전체 구조를 내보냅니다.

**출력 예시:**

```json
{
	"guildId": "123456789",
	"guildName": "My Server",
	"exportedAt": "2024-01-01T00:00:00.000Z",
	"channels": [
		{
			"id": "...",
			"name": "general",
			"type": 0,
			"position": 0,
			"parentId": null
		}
	],
	"roles": [
		{
			"id": "...",
			"name": "Admin",
			"color": 16711680,
			"position": 5,
			"permissions": ["ADMINISTRATOR"]
		}
	]
}
```

**활용:**

- 서버 템플릿 생성
- 재구축을 위한 백업
- 구조 분석 및 최적화

---

### 3. Create Snapshot (스냅샷 생성)

**설명**: 서버 전체 상태의 스냅샷을 생성합니다.

**출력 예시:**

```json
{
  "guildId": "123456789",
  "guildName": "My Server",
  "snapshotAt": "2024-01-01T00:00:00.000Z",
  "memberCount": 500,
  "channels": {
    "total": 25,
    "list": [...]
  },
  "roles": {
    "total": 15,
    "list": [...]
  },
  "members": {
    "total": 500,
    "bots": 23,
    "humans": 477
  }
}
```

**워크플로우 예제 - 자동 백업:**

````
1. Schedule Trigger (매일 자정)
   ↓
2. Discord Advanced (Create Snapshot)
   ↓
3. Code Node - 날짜 추가
   ```javascript
   return {
     ...json,
     backupDate: new Date().toISOString().split('T')[0]
   };
````

↓ 4. Google Drive (Upload File)

- Filename: "discord-backup-{{$json["backupDate"]}}.json"
- Content: {{JSON.stringify($json)}}

```

---

## Automation (자동화)

반복 작업을 자동화합니다.

### 1. Bulk Role Assignment (대량 역할 할당)

**설명**: 여러 사용자에게 동시에 역할을 할당합니다.

**설정:**
```

Resource: Automation
Operation: Bulk Role Assignment
Guild ID: YOUR_GUILD_ID
User IDs: "123456789,987654321,456789123"
Role ID: ROLE_ID

````

**출력 예시:**
```json
{
  "guildId": "123456789",
  "roleId": "...",
  "totalUsers": 3,
  "successful": 3,
  "failed": 0,
  "results": [
    {
      "userId": "123456789",
      "username": "User1",
      "success": true
    }
  ]
}
````

**활용:**

- 이벤트 참가자 역할 부여
- 신규 멤버 온보딩
- 계층 재구조화

---

### 2. Mass DM Users (대량 DM 전송)

**설명**: 여러 사용자에게 동시에 DM을 전송합니다.

**설정:**

```
Resource: Automation
Operation: Mass DM Users
User IDs: "123456789,987654321"
Message Content: "중요한 공지사항입니다."
```

**⚠️ 주의:**

- Discord Rate Limit 준수
- 스팸으로 신고될 수 있음
- 중요한 공지에만 사용

**활용:**

- 개인 맞춤 알림
- 당첨자 통보
- 긴급 공지

---

## Insights (인사이트)

서버의 건강 상태와 트렌드를 파악합니다.

### 1. Server Health Report (서버 건강 보고서)

**설명**: 서버 전반적인 건강 상태를 종합 분석합니다.

**출력 예시:**

```json
{
	"guildId": "123456789",
	"guildName": "My Server",
	"reportDate": "2024-01-01T00:00:00.000Z",
	"members": {
		"total": 500,
		"online": 123,
		"bots": 23,
		"humans": 477,
		"onlinePercentage": "24.60%"
	},
	"channels": {
		"total": 25,
		"text": 15,
		"voice": 8,
		"categories": 2
	},
	"roles": {
		"total": 15,
		"withMembers": 12
	},
	"serverAge": {
		"days": 365,
		"created": "2023-01-01T00:00:00.000Z"
	},
	"verificationLevel": 2,
	"premiumTier": 1,
	"boostCount": 5
}
```

**활용:**

- 정기 서버 점검
- 성장 추적
- 문제 조기 발견

---

### 2. Role Distribution (역할 분포)

**설명**: 서버 내 역할 분포를 분석합니다.

**출력 예시:**

```json
{
	"guildId": "123456789",
	"totalRoles": 15,
	"totalMembers": 500,
	"roles": [
		{
			"roleId": "...",
			"roleName": "Member",
			"color": 0,
			"memberCount": 450,
			"percentage": "90.00%",
			"position": 1
		}
	],
	"mostPopular": {
		"roleName": "Member",
		"memberCount": 450
	}
}
```

**활용:**

- 역할 시스템 평가
- 권한 분포 최적화
- 계층 구조 분석

---

## 실용 예제

### 예제 1: 완전 자동화된 조정 시스템

```
1. Schedule Trigger (매 1시간)
   ↓
2. Discord Advanced (Detect Spam)
   ↓
3. IF Node (spamGroups > 0)
   ↓ TRUE
4. Discord Tools (Bulk Delete)
   ↓
5. Discord Advanced (Scan Links)
   ↓
6. Code Node - 블랙리스트 체크
   ↓
7. IF Node (suspicious > 0)
   ↓ TRUE
8. Discord (Ban Members)
   ↓
9. Discord (Send Alert)
   - Content: "🛡️ {{$json["count"]}}명의 스팸머가 차단되었습니다."
```

---

### 예제 2: 주간 서버 보고서

````
1. Schedule Trigger (매주 일요일 오후 6시)
   ↓
2. Parallel Execution:
   - Discord Advanced (Top Contributors)
   - Discord Advanced (Channel Engagement)
   - Discord Advanced (Server Health Report)
   - Discord Advanced (Peak Activity Times)
   ↓
3. Code Node - 보고서 통합
   ```javascript
   return {
     weekEnding: new Date().toISOString().split('T')[0],
     topContributors: $node["Discord Advanced"].json["topContributors"].slice(0, 5),
     mostEngagedChannel: $node["Discord Advanced 1"].json["mostEngaged"],
     serverHealth: $node["Discord Advanced 2"].json,
     peakActivity: $node["Discord Advanced 3"].json
   };
````

↓ 4. Discord (Send Message) - 임베드 보고서

```json
{
  "title": "📊 주간 서버 보고서",
  "fields": [
    {
      "name": "Top 기여자",
      "value": "{{$json["topContributors"].map(u => u.username).join(', ')}}"
    },
    {
      "name": "가장 활발한 채널",
      "value": "{{$json["mostEngagedChannel"]["channelName"]}}"
    },
    {
      "name": "온라인률",
      "value": "{{$json["serverHealth"]["members"]["onlinePercentage"]}}"
    }
  ],
  "color": 3447003
}
```

```

---

### 예제 3: 자동 백업 시스템

```

1. Schedule Trigger (매일 자정)
   ↓
2. Discord Advanced (Create Snapshot)
   ↓
3. Discord Advanced (Export Server Structure)
   ↓
4. Code Node - 데이터 병합 및 압축
   ↓
5. Google Drive (Upload)
   - Folder: "Discord Backups"
   - Filename: "backup-{{new Date().toISOString().split('T')[0]}}.json"
     ↓
6. IF Node - 7일 이상 된 백업 삭제
   ↓
7. Discord (Send DM to Admin)
   - Content: "✅ 일일 백업 완료"

```

---

## 🎯 성능 최적화 팁

### 1. Rate Limiting
- 대량 작업 시 Wait 노드 사용
- 배치 크기 제한 (최대 100개)

### 2. 메모리 관리
- 대용량 데이터는 스트리밍 처리
- 불필요한 데이터 필터링

### 3. 병렬 처리
- 독립적인 작업은 병렬 실행
- Switch 노드로 분기

---

## 🔒 보안 고려사항

1. **개인정보 보호**
   - 민감한 데이터 암호화
   - 백업 파일 접근 제한

2. **권한 관리**
   - 최소 권한 원칙
   - 정기적인 감사 로그 확인

3. **자동화 제한**
   - 스팸 방지 딜레이
   - 작업 횟수 제한

---

이 고급 도구들로 Discord 서버를 전문적으로 관리하세요! 🚀
```
