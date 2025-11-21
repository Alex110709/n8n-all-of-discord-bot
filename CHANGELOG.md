# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
