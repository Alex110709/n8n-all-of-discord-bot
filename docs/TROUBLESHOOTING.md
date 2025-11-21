# Troubleshooting Guide

Common issues and solutions for n8n-nodes-discord-all.

## 📋 Table of Contents

- [Connection Issues](#connection-issues)
- [Authentication Problems](#authentication-problems)
- [Permission Errors](#permission-errors)
- [Trigger Issues](#trigger-issues)
- [Rate Limiting](#rate-limiting)
- [Message Issues](#message-issues)
- [Advanced Node Issues](#advanced-node-issues)
- [General Debugging](#general-debugging)

---

## Connection Issues

### Bot is Not Connecting

**Symptoms:**

- "Discord client is not connected" error
- Workflow fails immediately
- No events received by triggers

**Solutions:**

1. **Check Bot Token:**

```
- Go to Discord Developer Portal
- Navigate to your application → Bot
- Regenerate token if needed
- Update credentials in n8n
```

2. **Verify Intents:**

```
Required Intents (in Developer Portal):
✅ Message Content Intent
✅ Server Members Intent
✅ Presence Intent (optional)
```

3. **Check Bot Invite:**

```
Make sure bot was invited with correct scopes:
- bot
- applications.commands (if using slash commands)
```

4. **Restart n8n:**

```bash
# Sometimes n8n needs restart after credential changes
n8n restart
```

### Intermittent Connection Drops

**Symptoms:**

- Bot works then stops
- "Connection lost" errors
- Triggers stop firing

**Solutions:**

1. **Check Internet Connection:**

   - Stable connection required
   - Check firewall/proxy settings

2. **Update Package:**

```bash
npm update n8n-nodes-discord-all
```

3. **Increase Timeout:**
   - In n8n settings, increase node timeout
   - Default is 2 minutes, try 5+ minutes for heavy operations

---

## Authentication Problems

### Invalid Token Error

**Error:** `An invalid token was provided`

**Solutions:**

1. **Token Format Check:**

```
Correct format: Bot [long string of characters]
❌ Wrong: Just the token string
✅ Correct: Bot NzkyNzE1NDk0MDI3MzY...
```

2. **Regenerate Token:**

   - Go to Developer Portal
   - Bot section
   - Click "Regenerate Token"
   - Update in n8n credentials immediately

3. **Check Token Permissions:**
   - Token must be for a Bot account
   - Not a user token
   - Not an OAuth token

### Privileged Intents Not Enabled

**Error:** `Privileged intent provided is not enabled or whitelisted`

**Solutions:**

1. **Enable in Developer Portal:**

```
Application → Bot → Privileged Gateway Intents:
✅ Presence Intent
✅ Server Members Intent
✅ Message Content Intent
```

2. **Save Changes:**
   - Click Save Changes
   - Wait 5-10 minutes for changes to propagate
   - Restart your n8n workflow

---

## Permission Errors

### Missing Permissions

**Error:** `Missing Permissions` or `DiscordAPIError: Missing Access`

**Solutions:**

1. **Check Bot Role Position:**

```
- Bot's role must be higher than roles it manages
- In Server Settings → Roles
- Drag bot role above target roles
```

2. **Grant Required Permissions:**

```
Basic Permissions:
✅ View Channels
✅ Send Messages
✅ Read Message History
✅ Add Reactions

Management Permissions:
✅ Manage Messages (for deletion)
✅ Manage Channels (for channel ops)
✅ Manage Roles (for role ops)
✅ Kick Members (for moderation)
✅ Ban Members (for moderation)
```

3. **Channel-Specific Permissions:**
   - Check permission overrides in channel settings
   - Bot needs explicit allow or role-based access

### Cannot Send Messages in Channel

**Error:** `Cannot send messages in this channel`

**Solutions:**

1. **Check Channel Permissions:**

```
Right-click channel → Edit Channel → Permissions
Ensure bot has "Send Messages" permission
```

2. **Verify Channel Type:**

   - News channels need "Send Messages in Threads"
   - Voice channels need special permissions
   - Stage channels need "Request to Speak"

3. **Check Server Verification:**
   - New servers have strict defaults
   - May need verification level adjustment

---

## Trigger Issues

### Trigger Not Firing

**Symptoms:**

- Workflow doesn't activate
- No events captured
- Test shows success but real events fail

**Solutions:**

1. **Activate Workflow:**

   - Workflow must be activated (toggle ON)
   - Save after making changes

2. **Check Event Filters:**

```javascript
// Too restrictive filters may block events
✅ Correct: Guild ID: 123456789
❌ Wrong: Guild ID: 123456789, User ID: 999 (too specific)
```

3. **Verify Intents for Event Type:**

```
Message Events → Message Content Intent
Member Events → Server Members Intent
Presence Events → Presence Intent
```

4. **Test with Simple Event:**

```
Start with "Message Created" with no filters
Gradually add filters to identify issue
```

### DM Trigger Not Working

**Error:** DMs not being received

**Solutions:**

1. **Enable DM Partials:**

```
In credentials, ensure these are enabled:
- Channel partial
- Message partial
```

2. **Check DM Permissions:**

   - User must share a server with bot
   - User privacy settings must allow DMs
   - Bot can't DM if blocked by user

3. **Test Direct:**

```
Send DM from your account to bot
Check n8n execution logs
Verify bot is online in shared server
```

### Mention Triggers Not Detecting

**Symptoms:**

- Bot mentioned but trigger doesn't fire
- User/role mentions not detected

**Solutions:**

1. **Mention Format:**

```
✅ Correct: <@BOT_ID> or @BotName
❌ Wrong: Bot text without actual mention
```

2. **Message Content Intent:**

   - Required for mention detection
   - Must be enabled in Developer Portal

3. **Check Filter Settings:**

```
Bot Mentioned:
- No Guild ID filter = all servers
- No Channel ID filter = all channels
- Test without filters first
```

---

## Rate Limiting

### Rate Limited Errors

**Error:** `You are being rate limited`

**Symptoms:**

- Operations slow down or fail
- "429 Too Many Requests" errors
- Operations work then stop

**Solutions:**

1. **Add Delays:**

```javascript
// In Code node before Discord operations
await new Promise((resolve) => setTimeout(resolve, 2000));
// Wait 2 seconds between operations
```

2. **Use Bulk Operations:**

```
❌ Wrong: Loop + Send DM (1 request per user)
✅ Correct: Discord Advanced → Bulk DM (batched)
```

3. **Reduce Frequency:**

```
Schedule Trigger:
❌ Every minute
✅ Every 5+ minutes
```

4. **Batch Processing:**

```
Split In Batches node:
- Batch size: 10
- Delay: 2000ms
```

### Global Rate Limit Hit

**Error:** `Global rate limit reached`

**Solutions:**

1. **This is Serious:**

   - Affects all API requests
   - Can last 10-60 minutes
   - Review all workflows immediately

2. **Immediate Actions:**

   - Pause all workflows temporarily
   - Identify the problematic workflow
   - Reduce request frequency

3. **Prevention:**
   - Never loop without delays
   - Use bulk operations
   - Schedule heavy operations during off-peak hours

---

## Message Issues

### Cannot Send Large Messages

**Error:** `Message content is too long`

**Solutions:**

1. **Message Limits:**

```
Regular message: 2000 characters
Embed description: 4096 characters
Total embed: 6000 characters
```

2. **Split Messages:**

```javascript
// In Code node
const message = 'very long message...';
const chunks = message.match(/.{1,1900}/g);
return chunks.map((chunk, i) => ({
	json: { content: chunk, index: i },
}));
```

3. **Use Embeds:**
   - Embeds allow more content
   - Better formatting
   - More structured

### Embeds Not Displaying

**Symptoms:**

- Message sends but no embed
- Embed appears empty
- Formatting broken

**Solutions:**

1. **Valid JSON:**

```json
{
	"title": "Title Here",
	"description": "Description here",
	"color": 5814783,
	"fields": [
		{
			"name": "Field Name",
			"value": "Field Value",
			"inline": false
		}
	]
}
```

2. **Check Permissions:**

   - Bot needs "Embed Links" permission
   - Check in server and channel settings

3. **Color Format:**

```javascript
// Colors must be decimal numbers
✅ Correct: 5814783 (decimal)
✅ Correct: 0x58B9FF (hex with 0x)
❌ Wrong: "#58B9FF" (CSS hex)
```

### File Upload Fails

**Error:** `Invalid Form Body` or `File too large`

**Solutions:**

1. **Size Limits:**

```
Regular servers: 8 MB
Boosted servers:
- Level 2: 50 MB
- Level 3: 100 MB
```

2. **File Format:**

```javascript
// Correct format
{
	files: [
		{
			attachment: buffer, // or URL or path
			name: 'filename.png',
		},
	];
}
```

3. **Check File Source:**
   - Ensure file exists
   - Check read permissions
   - Verify file isn't corrupted

---

## Advanced Node Issues

### Export/Backup Operations Slow

**Symptoms:**

- Export takes very long
- Timeouts on large exports
- Memory issues

**Solutions:**

1. **Limit Time Range:**

```
❌ Days: 365 (entire year)
✅ Days: 30 (one month at a time)
```

2. **Increase Timeout:**

   - In n8n settings
   - Set to 10+ minutes for large exports

3. **Exclude Attachments:**

```
For large channels:
- Include Attachments: false
- Reduces data size significantly
```

4. **Process in Chunks:**

```
Use multiple Export operations:
- Month 1: Days 0-30
- Month 2: Days 31-60
- Combine results afterward
```

### Analytics Operations Return Empty

**Symptoms:**

- Message Heatmap returns no data
- Top Contributors shows 0 users
- Engagement Analysis empty

**Solutions:**

1. **Check Time Range:**

```
- Days must be > 0
- Server must have activity in that period
- Try increasing days parameter
```

2. **Verify Channel Access:**

```
- Bot must have access to channel
- Channel must exist
- Messages must exist in timeframe
```

3. **Check Filters:**

```
- Guild ID correct?
- Channel ID correct?
- Bot can read message history?
```

### Moderation Operations Not Detecting

**Symptoms:**

- Spam Detection finds nothing
- Duplicate Finder returns empty
- Link Scanner shows no links

**Solutions:**

1. **Adjust Thresholds:**

```
Spam Detection:
❌ Threshold: 3 (too low, false positives)
✅ Threshold: 10-15 (more reliable)

Similarity:
❌ 0.95 (too strict)
✅ 0.7-0.8 (better balance)
```

2. **Increase Time Window:**

```
❌ Time Window: 1 minute (too short)
✅ Time Window: 5-10 minutes
```

3. **Check Recent Activity:**
   - Operations only scan recent messages
   - Increase hours/days to scan parameter

### Bulk Operations Fail Partially

**Symptoms:**

- Some users get DM, others don't
- Some roles assigned, others fail
- Inconsistent results

**Solutions:**

1. **Check Individual Permissions:**

```
Each user needs:
- Shared server with bot
- DMs enabled
- Not blocking bot
```

2. **Add Delay:**

```
Bulk DM delay:
❌ 0ms (too fast)
✅ 2000ms (2 seconds per user)
```

3. **Handle Errors Gracefully:**
   - Enable "Continue On Fail"
   - Check execution logs for specific failures
   - Some failures are expected (blocked users, etc.)

---

## General Debugging

### Enable Debug Logging

1. **n8n Execution Logs:**

```
In workflow execution:
- Click on each node
- View "Input" and "Output" data
- Check "Error" tab if failed
```

2. **Discord API Errors:**

```
Errors include:
- Error code (e.g., 50013)
- Error message
- Solution hints
```

3. **Common Error Codes:**

```
10003: Unknown Channel
10004: Unknown Guild
10008: Unknown Message
10011: Unknown Role
10013: Unknown User
50001: Missing Access
50013: Missing Permissions
```

### Test Workflow Step-by-Step

1. **Simplify Workflow:**

   - Remove all nodes except one operation
   - Test that operation alone
   - Gradually add back nodes

2. **Use Manual Execution:**

   - Click "Execute Workflow"
   - Watch each node execute
   - Check data flow between nodes

3. **Verify Data Format:**

```javascript
// Add Code node to inspect data
console.log(JSON.stringify($input.all(), null, 2));
return $input.all();
```

### Check Package Version

```bash
# Check installed version
npm list n8n-nodes-discord-all

# Update to latest
npm update n8n-nodes-discord-all

# Force reinstall
npm uninstall n8n-nodes-discord-all
npm install n8n-nodes-discord-all
```

### Clear n8n Cache

```bash
# Stop n8n
n8n stop

# Clear cache (location varies by installation)
rm -rf ~/.n8n/cache/*

# Restart n8n
n8n start
```

---

## Getting Help

### Before Asking for Help

1. **Gather Information:**

   - n8n version
   - Package version
   - Node.js version
   - Discord.js version
   - Exact error message
   - Workflow JSON (remove sensitive data)

2. **Try Common Solutions:**

   - Restart n8n
   - Verify credentials
   - Check permissions
   - Review error message carefully

3. **Search Existing Issues:**
   - GitHub issues
   - n8n community forum
   - Discord API documentation

### Where to Get Help

1. **GitHub Issues:**

   - Bug reports
   - Feature requests
   - Technical questions
   - Link: https://github.com/alex110709/n8n-nodes-discord-all/issues

2. **n8n Community:**

   - General n8n questions
   - Workflow help
   - Link: https://community.n8n.io/

3. **Discord API Docs:**
   - Discord-specific questions
   - API limitations
   - Link: https://discord.com/developers/docs/

### Reporting Bugs

Include:

- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Environment details
- Workflow JSON (sanitized)
- Error messages/screenshots

---

## Common Workflow Mistakes

### 1. Not Using Batches

```
❌ Wrong:
Loop through 100 users → Discord (Send DM)
= 100 separate API calls

✅ Correct:
Discord Advanced (Bulk DM)
= 1 batched operation
```

### 2. Forgetting Continue-On-Fail

```
❌ Wrong:
Loop users → Send DM
(One failure stops entire workflow)

✅ Correct:
Loop users → Send DM [Continue On Fail: true]
(Failures logged but workflow continues)
```

### 3. Missing Data Validation

```
❌ Wrong:
Direct use: {{$json["channelId"]}}

✅ Correct:
IF node: Check if channelId exists
Then use: {{$json["channelId"]}}
```

### 4. Ignoring Rate Limits

```
❌ Wrong:
Frequent triggers + Heavy operations = Rate limit

✅ Correct:
Appropriate intervals + Delays + Bulk operations
```

### 5. Not Testing Incrementally

```
❌ Wrong:
Build entire workflow → Test → All breaks

✅ Correct:
Add one node → Test → Add next → Test
```

---

## Performance Optimization

### Slow Workflows

1. **Reduce Data Transfer:**

   - Only fetch needed fields
   - Limit time ranges
   - Use filters to reduce results

2. **Parallel Processing:**

   - Use Split In Batches
   - Process independent operations in parallel
   - Merge results at end

3. **Cache Results:**
   - Store frequently accessed data
   - Use Set/Get node for caching
   - Reduce redundant API calls

### Memory Issues

1. **Process in Chunks:**

   - Don't load entire channel history at once
   - Use pagination
   - Process and discard

2. **Limit Concurrent Operations:**
   - Batch size: 10-50 items
   - Add delays between batches
   - Monitor system resources

---

## Quick Reference

### Checklist for New Workflows

- [ ] Bot token valid and up-to-date
- [ ] Required intents enabled
- [ ] Bot has necessary permissions
- [ ] Workflow is activated
- [ ] Test with simple case first
- [ ] Rate limiting considered
- [ ] Error handling added
- [ ] Continue-on-fail enabled where needed
- [ ] Data validation in place
- [ ] Tested in test server first

### Essential Permissions

```
Read Operations:
✅ View Channels
✅ Read Message History

Write Operations:
✅ Send Messages
✅ Embed Links
✅ Attach Files

Management:
✅ Manage Messages
✅ Manage Channels
✅ Manage Roles
✅ Kick Members
✅ Ban Members
```

### Rate Limit Guidelines

```
Message Send: 5/5s per channel
DM: 1/1s per user
Guild Operations: 5/5s
Bulk Delete: 1/1s
Global: ~50/s across all endpoints
```

---

For more help, see:

- [Complete Usage Guide](./README.md)
- [Examples](./EXAMPLES.md)
- [Advanced Guide](./ADVANCED_GUIDE.md)
- [GitHub Issues](https://github.com/alex110709/n8n-nodes-discord-all/issues)
