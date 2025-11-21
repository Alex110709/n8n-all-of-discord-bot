# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
