# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.3] - 2024-11-22

### Added - Guild ID Requirement & Better Error Messages

**DiscordTools Node - All Channel Operations:**

- ✅ **Added Guild ID parameter** - Now required for all channel-related operations
  - Better context for API calls
  - Validates channel belongs to correct server
  - Prevents cross-server confusion

**Enhanced Error Messages:**

- ✅ **Channel not found errors** - Now show both Guild ID and Channel ID
- ✅ **Invalid channel type** - Clear message when channel is voice/category instead of text
- ✅ **Channel mismatch** - Warns if channel doesn't belong to specified server
- ✅ **Better debugging** - All errors include specific IDs to help troubleshoot

**Before:**

```
Error: "Channel not found or not text-based"
```

**After:**

```
Error: "Channel not found: Unable to fetch channel with ID '123456'
in server '789012'. Please verify both IDs are correct and the bot
has access to this channel."
```

**Affected Resources:**

- Message operations
- Channel operations
- Analytics operations
- Moderation operations
- Backup operations

**Benefits:**

- 🎯 Clear error messages with context
- 🔍 Easy to identify which ID is wrong
- ✅ Guild validation prevents mistakes
- 📊 Better user experience

## [3.0.2] - 2024-11-22

### Improved - Better Empty Results Handling

**DiscordTools Node - Message Operations:**

- ✅ **Enhanced `getHistory`** - Now returns informative message when channel has no messages
- ✅ **Enhanced `fetchMessages`** - Clear feedback when no messages are available
- ✅ **Enhanced `searchMessages`** - Helpful info when search returns no results
- ✅ **Enhanced `getMentions`** - Clear message when no mentions found

**Before:**

- Empty channel → Empty array `[]` (confusing)
- No search results → Empty array `[]` (unclear)

**After:**

- Empty channel → Returns:
  ```json
  {
  	"channelId": "123...",
  	"channelName": "general",
  	"messageCount": 0,
  	"messages": [],
  	"info": "No messages found in this channel"
  }
  ```

**Benefits:**

- 🎯 Clear user feedback when channels are empty
- 📊 Provides context (channel name, count, etc.)
- ✅ No more "workflow did not return a response" errors
- 🔍 Better debugging experience

## [3.0.1] - 2024-11-22

### Fixed

- **Critical Bug Fix**: Fixed "Operation not implemented" error in DiscordTools node
  - Changed `responseData` initialization from error object to undefined
  - This was causing all operations to potentially return error messages
  - Affects all DiscordTools operations including `getHistory`, `send`, `sendDM`, etc.
  - Now properly validates if operation was implemented and returns correct data

### Technical Details

The issue was in `DiscordTools.node.ts` where `responseData` was initialized as:

```typescript
let responseData: any = { error: 'Operation not implemented' };
```

This caused the validation check `if (!responseData)` to pass (since object is truthy),
but the error object would be returned to workflows. Fixed by changing to:

```typescript
let responseData: any;
```

Now if an operation doesn't set responseData, it properly throws an error instead of
silently returning an error object.

## [3.0.0] - 2024-11-21

### 🎉 Major Release - Full Feature Expansion

### Added - New Discord Features

**Discord Node (Main Node):**

- ✅ **Thread Operations** - Complete thread management
  - Create threads (from message or standalone)
  - Join/Leave threads
  - Archive/Unarchive threads
  - Delete threads
  - Get thread members
  - Auto-archive duration configuration
- ✅ **Reaction Operations** - Message reactions
  - Add reactions to messages
  - Remove reactions
  - Remove all reactions
  - Get users who reacted
- ✅ **Voice Channel Operations** - Voice management
  - Move members between voice channels
  - Disconnect members from voice
  - Mute/Unmute members (server-side)
  - Deafen/Undeafen members (server-side)
- ✅ **Embed & Attachment Support** - Rich media in Discord node
  - Send embeds (JSON format)
  - Binary file attachments
  - URL file attachments
  - Custom file names

**Testing Infrastructure:**

- ✅ **Jest test suite** - Automated testing
  - 23 comprehensive tests covering all new features
  - Test coverage for node properties, resources, and operations
  - CI-ready test framework
  - Test scripts: `npm test`, `npm run test:watch`, `npm run test:coverage`

### Changed

- **Discord Node** - Now supports threads, reactions, voice operations
- **Discord Node** - Embed/attachment support added (matching DiscordTools)
- Package description updated to include new features

### Developer Experience

- Added automated tests with Jest
- Added test:watch and test:coverage scripts
- Better code quality assurance
- Comprehensive feature coverage testing

### Breaking Changes

- None - All changes are backwards compatible

### Summary

Version 3.0.0 is a major feature release:

- 🧵 **Threads**: Full thread lifecycle management
- 😄 **Reactions**: Complete reaction system
- 🔊 **Voice**: Voice channel member management
- 🎨 **Rich Media**: Embeds & attachments in Discord node
- ✅ **Tests**: 23 automated tests for quality assurance

All Discord nodes now have comprehensive feature coverage!

## [2.5.0] - 2024-11-21

### Added - Rich Media Support 🎨

**DiscordTools (AI Agent Tool):**

- ✅ **Embed support** - Send rich embedded messages with JSON format
- ✅ **Binary file attachments** - Send files from n8n binary data
- ✅ **URL file attachments** - Send files from URLs
- ✅ Works with both `send` and `sendDM` operations

**Features:**

- Attachment Type selector: None, Binary Data, URL
- Binary Property field for n8n binary data
- File URL field for remote files
- Custom file name support
- Embed JSON editor with syntax highlighting

**Example Embed:**

```json
{
	"title": "Hello",
	"description": "World",
	"color": 3447003,
	"fields": [{ "name": "Field", "value": "Value" }]
}
```

AI agents can now send:

- 📝 Text messages
- 🎨 Rich embeds
- 🖼️ Images (binary or URL)
- 📎 Files (binary or URL)

## [2.4.0] - 2024-11-21

### REVERTED - All Nodes Restored

- **Restored Discord node** - All basic Discord operations available again
- **Restored DiscordAdvanced node** - Analytics, moderation, backup features available
- **All 4 nodes now available**: Discord, DiscordTools, DiscordAdvanced, DiscordTrigger

### Tool Configuration

- **DiscordTools**: AI Agent Tool (usableAsTool = true) ✅
- **Discord**: Regular n8n node (not usable as tool)
- **DiscordAdvanced**: Regular n8n node (not usable as tool)
- **DiscordTrigger**: Event trigger node

AI Agents should use **DiscordTools** for all operations.
Regular workflows can use any node.

## [2.3.1] - 2024-11-21

### Fixed

- Improved error handling in DiscordTools execute method
- Better error messages when operations are not implemented
- Added validation to ensure responseData is set before returning
- Fixed code formatting issues (mixed spaces and tabs)

## [2.3.0] - 2024-11-21

### BREAKING CHANGES

- **Removed Discord node** - All functionality moved to DiscordTools
- **Removed DiscordAdvanced node** - All functionality moved to DiscordTools
- Package now contains only 2 nodes: **DiscordTools** and **DiscordTrigger**

### Changed

- **DiscordTools** is now the single, unified AI Agent Tool for all Discord operations
- Simplified architecture: 2 nodes instead of 4
- Better AI agent integration with consolidated operations

### Benefits

- ✅ Simpler package structure
- ✅ Single tool for AI agents to learn and use
- ✅ All Discord operations in one place
- ✅ Reduced confusion between similar nodes
- ✅ Smaller package size

## [2.2.0] - 2024-11-21

### Major Changes

- **DiscordTools is now the unified AI Agent Tool** 🤖
  - All Discord operations consolidated into DiscordTools for AI agent use
  - Only DiscordTools has `usableAsTool: true` enabled

### Added to DiscordTools

**Message Operations:**

- Send Message - Send messages to any channel
- Edit Message - Edit existing messages
- Delete Message - Delete messages

**DM Operations:**

- Send DM - Send direct messages to users

**Analytics Operations:**

- Message Activity Heatmap - Analyze message patterns by hour
- Top Contributors - Find most active users

**Moderation Operations:**

- Detect Spam - Identify potential spam messages
- Find Duplicates - Find duplicate/repeated messages

**Backup Operations:**

- Export Messages - Export channel messages with metadata

### Summary

DiscordTools now provides all essential Discord operations for AI agents:

- ✅ Send messages & DMs
- ✅ Fetch & search messages
- ✅ User information
- ✅ Channel management
- ✅ Analytics & insights
- ✅ Moderation tools
- ✅ Data export

Discord and DiscordAdvanced nodes remain for traditional n8n workflows.

## [2.1.2] - 2024-11-21

### Changed

- **Discord**: Enabled as AI Agent Tool with `usableAsTool: true`
- **Discord**: Added codex metadata for AI agent integration (send message, send DM, etc.)
- **DiscordAdvanced**: Enabled as AI Agent Tool with `usableAsTool: true`
- **DiscordAdvanced**: Added codex metadata for analytics, moderation, and backup operations

### Summary

All Discord nodes (Discord, DiscordTools, DiscordAdvanced) are now usable as AI Agent Tools in n8n workflows. AI agents can now:

- Send messages and DMs (Discord node)
- Fetch messages and user info (DiscordTools node)
- Perform analytics and moderation (DiscordAdvanced node)

## [2.1.1] - 2024-11-21

### Changed

- **DiscordTools**: Enabled as AI Agent Tool with `usableAsTool: true`
- **DiscordTools**: Added codex metadata for better AI agent integration
- **DiscordTools**: Removed duplicate analytics, moderation, backup resources (use DiscordAdvanced for these)
- Fixed code formatting issues (mixed spaces and tabs)

### Added

- **AGENTS.md**: Added agent guidelines for AI coding assistants

## [2.1.0] - 2024-11-21

### Added

#### Discord Advanced Node 🆕

- **Analytics Operations**:
  - Message Heatmap - Visualize message distribution by hour and day
  - Top Contributors - Identify most active users in channels
  - Engagement Analysis - Analyze reactions, replies, and interactions
  - Peak Hours - Determine optimal posting times
- **Moderation Operations**:
  - Spam Detection - Identify and flag potential spam patterns
  - Duplicate Finder - Find duplicate messages in channels
  - Link Scanner - Scan and filter messages with external links
  - Mass Mention Detector - Detect messages mentioning many users
  - Inactive Members Scanner - Find users who haven't been active
- **Backup Operations**:
  - Export Messages - Save message history to JSON with full metadata
  - Export Server Structure - Backup channels, roles, and configuration
  - Export Members - Export member list with roles and join dates
  - Create Snapshot - Complete server backup (structure + members)
- **Automation Operations**:
  - Bulk Role Assign - Assign roles to multiple users efficiently
  - Bulk DM - Send personalized DMs to multiple users
  - Clone Channel - Duplicate channel with permissions and settings
- **Insights Operations**:
  - Server Health Report - Comprehensive server statistics and health metrics
  - Role Distribution - Analyze role usage and member distribution

### Documentation

- Added ADVANCED_GUIDE.md with detailed Discord Advanced node documentation
- 15+ code examples for each operation category
- Performance considerations and rate limiting guidelines
- Backup best practices and use cases

## [2.0.0] - 2024-11-21

### Changed

- Package renamed from `n8n-nodes-discord-complete` to `n8n-nodes-discord-all`
- Updated all documentation and branding
- Improved error handling across all nodes

## [Unreleased]

### Planned

- Slash command support
- Button and select menu interactions
- Thread management
- Stage channel support
- Forum channel support
- Sticker management
- Enhanced embed builder UI
- Message scheduling
- AI-powered sentiment analysis
- Real-time moderation dashboard

---

## Notes

This is the initial release of n8n-nodes-discord-all, providing comprehensive Discord bot functionality for n8n workflows.

For more information, see the [README](README.md) and [documentation](docs/).
