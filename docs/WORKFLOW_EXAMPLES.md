# Discord Advanced - Workflow Examples

Complete workflow examples using Discord Advanced node features for analytics, moderation, backups, and automation.

## 📊 Analytics Workflows

### 1. Daily Server Activity Report

**Use Case**: Generate and send a daily activity report showing peak hours and top contributors.

```
Workflow:
Schedule Trigger (Daily at 9 AM)
  ↓
Discord Advanced (Peak Hours Analysis)
  Guild ID: 123456789
  Days to Analyze: 7
  ↓
Discord Advanced (Top Contributors)
  Guild ID: 123456789
  Channel ID: 987654321
  Limit: 10
  Time Period: 7
  ↓
Code Node (Format Report)
  ↓
Discord (Send Message with Embed)
  Channel ID: [report-channel-id]
  Embed: {
    title: "📊 Weekly Activity Report",
    fields: [
      { name: "Peak Hour", value: "{{peakHour}}" },
      { name: "Top Contributor", value: "{{topUser}}" }
    ]
  }
```

**Code Node Example**:

```javascript
const peakHours = $input.first().json;
const contributors = $input.last().json;

return {
	json: {
		peakHour: `${peakHours.peakHour}:00 (${peakHours.messageCount} messages)`,
		peakDay: peakHours.peakDay,
		topUser: contributors.topContributors[0].username,
		totalMessages: contributors.totalMessages,
	},
};
```

### 2. Channel Engagement Dashboard

**Use Case**: Track engagement metrics across multiple channels.

```
Workflow:
Schedule Trigger (Every 6 hours)
  ↓
Code Node (Define channels to monitor)
  Output: ["channel1", "channel2", "channel3"]
  ↓
Split In Batches (Process each channel)
  ↓
Discord Advanced (Engagement Analysis)
  Guild ID: 123456789
  Channel ID: {{$json["channelId"]}}
  Days: 1
  ↓
Discord Advanced (Message Heatmap)
  Guild ID: 123456789
  Channel ID: {{$json["channelId"]}}
  Days: 7
  ↓
Google Sheets (Append Row)
  Timestamp, Channel, Messages, Reactions, Peak Hour
```

### 3. User Engagement Tracker

**Use Case**: Identify and reward active community members.

```
Workflow:
Schedule Trigger (Weekly on Monday)
  ↓
Discord Advanced (Top Contributors)
  Guild ID: 123456789
  Limit: 20
  Time Period: 7
  Include Reactions: true
  ↓
IF Node (Check if >= 100 messages)
  ↓ true
Discord Advanced (Bulk Role Assign)
  Guild ID: 123456789
  Role ID: [active-member-role]
  User IDs: {{$json["topContributors"].map(u => u.userId)}}
  ↓
Discord (Send DM)
  User ID: {{$json["userId"]}}
  Content: "🎉 Thank you for being an active member! You've earned the Active Member role!"
```

## 🛡️ Moderation Workflows

### 4. Automated Spam Detection & Cleanup

**Use Case**: Detect spam patterns and automatically remove spam messages.

```
Workflow:
Schedule Trigger (Every 5 minutes)
  ↓
Discord Advanced (Spam Detection)
  Guild ID: 123456789
  Channel ID: 987654321
  Time Window: 5
  Message Threshold: 10
  Similarity Threshold: 0.8
  ↓
IF Node (Spam detected?)
  ↓ true
Discord Tools (Bulk Delete)
  Channel ID: 987654321
  Message IDs: {{$json["spamMessages"].map(m => m.id)}}
  ↓
Discord (Send Warning)
  Channel ID: 987654321
  Content: "⚠️ Spam detected and removed. User {{$json["userId"]}} has been warned."
  ↓
Discord (Send DM to User)
  User ID: {{$json["userId"]}}
  Content: "You've been warned for spamming. Please review our server rules."
```

### 5. Link Monitoring System

**Use Case**: Monitor and filter suspicious links in messages.

```
Workflow:
Schedule Trigger (Every 2 minutes)
  ↓
Discord Advanced (Link Scanner)
  Guild ID: 123456789
  Channels: ["general", "chat", "discussion"]
  Hours to Scan: 1
  ↓
IF Node (Suspicious links found?)
  ↓ true
HTTP Request (Check URL reputation)
  URL: https://safebrowsing.googleapis.com/v4/threatMatches:find
  Body: {{$json["links"]}}
  ↓
IF Node (Malicious link?)
  ↓ true
Discord Tools (Bulk Delete)
  Message IDs: {{$json["messageIds"]}}
  ↓
Discord (Ban Member)
  Guild ID: 123456789
  User ID: {{$json["userId"]}}
  Reason: "Posted malicious link"
  ↓
Discord (Send Alert)
  Channel ID: [mod-channel]
  Content: "🚨 Malicious link detected and removed!"
```

### 6. Inactive Member Cleanup

**Use Case**: Identify and remove inactive members to keep server active.

```
Workflow:
Schedule Trigger (Monthly on 1st)
  ↓
Discord Advanced (Inactive Members Scanner)
  Guild ID: 123456789
  Inactive Days: 90
  Min Role Check: true
  ↓
IF Node (Has inactive members?)
  ↓ true
Discord (Send DM to Each)
  User ID: {{$json["userId"]}}
  Content: "We noticed you haven't been active. We'll miss you! Reply to stay."
  ↓
Wait (7 days)
  ↓
Discord Advanced (Inactive Members Scanner)
  Guild ID: 123456789
  Inactive Days: 97
  ↓
Discord (Kick Member)
  Guild ID: 123456789
  User ID: {{$json["userId"]}}
  Reason: "Inactive for 90+ days"
  ↓
Discord (Log to channel)
  Channel ID: [mod-log]
  Content: "Removed {{count}} inactive members"
```

### 7. Mass Mention Protection

**Use Case**: Detect and prevent @everyone/@here abuse.

```
Workflow:
Discord Trigger (Message Created)
  ↓
Discord Advanced (Mass Mention Detector)
  Guild ID: 123456789
  Message ID: {{$json["id"]}}
  Threshold: 10
  ↓
IF Node (Exceeds threshold?)
  ↓ true
Discord (Delete Message)
  Channel ID: {{$json["channelId"]}}
  Message ID: {{$json["id"]}}
  ↓
Discord (Remove Role)
  Guild ID: 123456789
  User ID: {{$json["authorId"]}}
  Role ID: [mention-permission-role]
  ↓
Discord (Send Warning)
  Channel ID: {{$json["channelId"]}}
  Content: "{{$json["authorUsername"]}} attempted to mention too many users. Message removed."
```

### 8. Duplicate Content Filter

**Use Case**: Prevent duplicate message spam.

```
Workflow:
Schedule Trigger (Every 3 minutes)
  ↓
Discord Advanced (Duplicate Finder)
  Guild ID: 123456789
  Channel ID: 987654321
  Time Window: 10
  Min Duplicates: 3
  ↓
IF Node (Duplicates found?)
  ↓ true
Discord Tools (Bulk Delete)
  Message IDs: {{$json["duplicates"].slice(1).map(d => d.id)}}
  ↓
Discord (Send Message)
  Channel ID: 987654321
  Content: "🔄 Removed {{count}} duplicate messages"
```

## 💾 Backup Workflows

### 9. Automated Server Backup

**Use Case**: Regular server backups for disaster recovery.

```
Workflow:
Schedule Trigger (Daily at 2 AM)
  ↓
Discord Advanced (Create Snapshot)
  Guild ID: 123456789
  Include Messages: false
  ↓
Code Node (Add metadata)
  ↓
Google Drive (Upload File)
  Filename: backup-{{$now.format('YYYY-MM-DD')}}.json
  Content: {{$json}}
  ↓
Discord (Send Notification)
  Channel ID: [admin-channel]
  Content: "✅ Daily backup completed: {{fileSize}} KB"
  ↓
IF Node (Is first day of month?)
  ↓ true
Discord Advanced (Export Messages)
  Guild ID: 123456789
  Days: 30
  ↓
Google Drive (Upload)
  Filename: messages-{{$now.format('YYYY-MM')}}.json
```

### 10. Channel Message Archive

**Use Case**: Archive important channel history before deletion.

```
Workflow:
Webhook Trigger (Manual)
  Input: Channel ID to archive
  ↓
Discord Advanced (Export Messages)
  Guild ID: 123456789
  Channel ID: {{$json["channelId"]}}
  Days: 365
  Include Attachments: true
  ↓
Code Node (Format as HTML)
  ↓
Dropbox (Upload)
  Path: /archives/channel-{{$json["channelId"]}}.html
  ↓
Discord (Send Confirmation)
  Content: "📦 Archived {{messageCount}} messages to Dropbox"
```

### 11. Member Data Export (GDPR)

**Use Case**: Export user data for GDPR compliance.

```
Workflow:
Discord Trigger (DM Received)
  Filter: Content contains "export my data"
  ↓
Discord Advanced (Export Messages)
  Guild ID: 123456789
  User Filter: {{$json["userId"]}}
  Days: 365
  ↓
Discord Advanced (Export Members)
  Guild ID: 123456789
  Member IDs: [{{$json["userId"]}}]
  ↓
Code Node (Merge user data)
  ↓
Email (Send)
  To: [user email from database]
  Subject: "Your Discord Data Export"
  Attachments: user-data.json
  ↓
Discord (Send DM)
  User ID: {{$json["userId"]}}
  Content: "Your data export has been sent to your registered email."
```

## 🤖 Automation Workflows

### 12. Welcome Package System

**Use Case**: Auto-assign roles and send welcome messages to new members.

```
Workflow:
Discord Trigger (Member Joined)
  ↓
Wait (5 minutes) # Give them time to read rules
  ↓
Discord Advanced (Bulk Role Assign)
  Guild ID: 123456789
  User IDs: [{{$json["userId"]}}]
  Role IDs: ["verified", "member"]
  ↓
Discord (Send DM)
  User ID: {{$json["userId"]}}
  Embed: {
    title: "Welcome to our server!",
    description: "Here's everything you need to know...",
    fields: [...]
  }
  ↓
Discord (Send to welcome channel)
  Channel ID: [welcome-channel]
  Content: "👋 Welcome {{$json["username"]}}! You're member #{{memberCount}}!"
```

### 13. Role Assignment Based on Activity

**Use Case**: Automatically upgrade roles based on activity levels.

```
Workflow:
Schedule Trigger (Weekly)
  ↓
Discord Advanced (Top Contributors)
  Guild ID: 123456789
  Limit: 50
  Time Period: 7
  ↓
Code Node (Categorize by message count)
  Bronze: 10-49 messages
  Silver: 50-99 messages
  Gold: 100+ messages
  ↓
Split In Batches (Each category)
  ↓
Discord Advanced (Bulk Role Assign)
  Guild ID: 123456789
  Role ID: {{$json["roleId"]}}
  User IDs: {{$json["userIds"]}}
  ↓
Discord Advanced (Bulk DM)
  User IDs: {{$json["userIds"]}}
  Message: "🎉 You've earned the {{roleName}} role!"
```

### 14. Channel Template Cloner

**Use Case**: Quickly create new channels from templates.

```
Workflow:
Webhook Trigger
  Input: Template name, new channel name
  ↓
Discord (Get Template Channel)
  Channel ID: [template-channel-id]
  ↓
Discord Advanced (Clone Channel)
  Guild ID: 123456789
  Channel ID: {{$json["templateId"]}}
  New Name: {{$json["newName"]}}
  Clone Permissions: true
  Clone Settings: true
  ↓
Discord (Set Channel Topic)
  Channel ID: {{$json["newChannelId"]}}
  Topic: "Created from {{templateName}} on {{$now}}"
  ↓
Discord (Send Notification)
  Content: "✅ Created new channel: <#{{$json["newChannelId"]}}>"
```

### 15. Bulk Announcement System

**Use Case**: Send personalized announcements to multiple users.

```
Workflow:
Webhook Trigger
  Input: Announcement text, target role
  ↓
Discord (Get Role Members)
  Guild ID: 123456789
  Role ID: {{$json["roleId"]}}
  ↓
Code Node (Prepare personalized messages)
  ↓
Discord Advanced (Bulk DM)
  User IDs: {{$json["userIds"]}}
  Message Template: "Hi {{username}}, {{announcement}}"
  Delay: 2000
  ↓
Discord (Send Summary)
  Channel ID: [admin-channel]
  Content: "📢 Sent announcement to {{count}} users"
```

## 📈 Insights Workflows

### 16. Server Health Dashboard

**Use Case**: Monitor overall server health and engagement.

```
Workflow:
Schedule Trigger (Daily)
  ↓
Discord Advanced (Server Health Report)
  Guild ID: 123456789
  ↓
Code Node (Calculate health score)
  Score = (activeUsers / totalUsers) * 100
  ↓
IF Node (Health score < 50?)
  ↓ true
Discord (Alert Admins)
  Content: "⚠️ Server health declining: {{score}}%"
  ↓
Discord (Send Detailed Report)
  Channel ID: [analytics-channel]
  Embed: {
    title: "Server Health Report",
    color: "{{healthColor}}",
    fields: [
      { name: "Active Users", value: "{{activeUsers}}" },
      { name: "Total Members", value: "{{totalMembers}}" },
      { name: "Messages (7d)", value: "{{messageCount}}" },
      { name: "New Members", value: "{{newMembers}}" }
    ]
  }
```

### 17. Role Distribution Analysis

**Use Case**: Analyze role usage and member distribution.

```
Workflow:
Schedule Trigger (Weekly)
  ↓
Discord Advanced (Role Distribution)
  Guild ID: 123456789
  Include Empty Roles: false
  ↓
Code Node (Create charts data)
  ↓
HTTP Request (Chart API)
  Generate pie chart
  ↓
Discord (Send Analysis)
  Channel ID: [admin-channel]
  Embed: {
    title: "Role Distribution Report",
    image: "{{chartUrl}}",
    description: "Most common: {{topRole}} ({{count}} members)"
  }
```

### 18. Growth Tracking System

**Use Case**: Track server growth over time.

```
Workflow:
Schedule Trigger (Daily at midnight)
  ↓
Discord Advanced (Server Health Report)
  Guild ID: 123456789
  ↓
Airtable (Create Record)
  Table: Server Stats
  Fields: {
    Date: {{$now}},
    Members: {{totalMembers}},
    Online: {{onlineMembers}},
    Messages: {{messageCount}}
  }
  ↓
Code Node (Calculate week-over-week growth)
  ↓
Discord (Send Growth Report)
  Channel ID: [analytics-channel]
  Content: "📈 Growth: +{{newMembers}} members (+{{percentage}}%)"
```

## 🔄 Combined Workflows

### 19. Complete Moderation System

**Use Case**: Comprehensive auto-moderation with multiple checks.

```
Workflow:
Schedule Trigger (Every 5 minutes)
  ↓
[Run in Parallel]:

  Branch 1: Spam Detection
    Discord Advanced (Spam Detection)
    ↓
    IF (Spam found) → Delete & Warn

  Branch 2: Link Scanner
    Discord Advanced (Link Scanner)
    ↓
    IF (Bad links) → Delete & Ban

  Branch 3: Mass Mention
    Discord Advanced (Mass Mention Detector)
    ↓
    IF (Abuse) → Remove permissions

  Branch 4: Duplicates
    Discord Advanced (Duplicate Finder)
    ↓
    IF (Duplicates) → Bulk delete

↓ (Merge branches)
Discord (Send Mod Report)
  Summary of all actions taken
```

### 20. Data-Driven Community Management

**Use Case**: Use analytics to make community decisions.

```
Workflow:
Schedule Trigger (Monthly)
  ↓
Discord Advanced (Server Health Report)
  ↓
Discord Advanced (Peak Hours)
  ↓
Discord Advanced (Top Contributors)
  ↓
Discord Advanced (Role Distribution)
  ↓
Discord Advanced (Inactive Members)
  ↓
Code Node (Generate insights)
  - Best time for events
  - Users to promote
  - Roles to adjust
  - Members to engage
  ↓
Notion (Create Page)
  Title: "Monthly Community Report"
  Content: Full analysis
  ↓
Discord (Share Summary)
  Channel ID: [team-channel]
  Link to full report
```

## 💡 Pro Tips

### Performance Optimization

- Use rate limiting (2000ms delay) for bulk operations
- Limit message exports to necessary time periods
- Process large datasets in batches

### Error Handling

- Always enable "Continue On Fail"
- Add IF nodes to check for empty results
- Log all moderation actions

### Scheduling

- Stagger heavy operations
- Run analytics during off-peak hours
- Use appropriate intervals (don't over-fetch)

### Best Practices

- Always backup before bulk operations
- Test workflows on test servers first
- Monitor rate limits
- Keep audit logs

## 🎯 Use Case Matrix

| Use Case          | Nodes Used        | Frequency | Priority |
| ----------------- | ----------------- | --------- | -------- |
| Activity Reports  | Analytics + Tools | Daily     | Medium   |
| Spam Detection    | Moderation        | 5 min     | High     |
| Backups           | Backup            | Daily     | High     |
| Role Assignment   | Automation        | Weekly    | Medium   |
| Health Monitoring | Insights          | Daily     | Medium   |
| Link Scanning     | Moderation        | 2 min     | High     |
| Member Cleanup    | Moderation        | Monthly   | Low      |
| Data Export       | Backup            | On-demand | Low      |

---

For more details on each operation, see [ADVANCED_GUIDE.md](./ADVANCED_GUIDE.md)
