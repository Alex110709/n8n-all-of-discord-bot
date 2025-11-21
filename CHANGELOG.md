# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-01

### Added

#### Discord Node
- Message operations: send, edit, delete, get, react, pin, unpin
- DM (Direct Message) sending to users
- Channel management: create, delete, update, list
- Guild/Server operations: get info, ban/unban members, list bans
- Member management: get info, kick, list, add/remove roles
- Role management: create, delete, update, list
- Webhook operations: create, delete, send
- Invite management: create, delete, get, list

#### Discord Trigger Node
- Message events: created, deleted, updated
- **DM Received trigger** - Listen for direct messages
- **Bot Mentioned trigger** - Detect when bot is mentioned
- **User Mentioned trigger** - Track mentions of specific users
- **Role Mentioned trigger** - Track mentions of specific roles
- Reaction events: added, removed
- Member events: joined, left, updated
- Role events: created, deleted, updated
- Channel events: created, deleted, updated
- Guild ban events: add, remove
- Interaction events
- Voice state updates
- Typing start events
- Advanced filtering options:
  - Guild/Channel/User ID filters
  - Bot message filtering
  - Message content filters (contains, starts with)
  - DM sender whitelist
  - Mention target specification

#### Discord Tools Node
- **Message Tools**:
  - Fetch messages in bulk (up to 100)
  - Search messages by text content
  - Get messages mentioning specific users
  - Bulk delete messages (up to 100)
  - Get detailed message history
- **User Tools**:
  - Get detailed user information
  - Fetch user avatars (high resolution)
  - Check user online status and presence
  - Verify user permissions
- **Channel Tools**:
  - Count messages in channels
  - Get list of active users with message counts
  - Fetch pinned messages
  - Set channel slowmode
  - List channel webhooks
- **Guild Tools**:
  - Get comprehensive server statistics
  - Count online members
  - Fetch audit logs with filtering
  - List custom emojis
- **Emoji Tools**:
  - Create custom emojis
  - Delete custom emojis
  - List all custom emojis

### Documentation
- Complete usage guide (README.md)
- 22 practical workflow examples
- DM and mentions guide with 12 examples
- Discord Tools guide with 5 advanced examples
- Installation and setup instructions
- Permission requirements guide
- Troubleshooting section

### Features
- Support for all Discord.js 14.x features
- Proper error handling and continue-on-fail support
- TypeScript support with full type definitions
- Embed message support
- File attachment support
- Rate limiting compliance
- DM channel support with Partials
- Rich filtering and search capabilities
- Bulk operations for efficiency
- Comprehensive audit logging
- Custom emoji management

### Technical
- Built with discord.js v14.14.1
- TypeScript 5.0.4
- n8n-workflow compatible
- ESLint and Prettier configured
- Gulp build system for assets
- Proper n8n node structure

### Security
- Bot token secure storage via credentials
- Permission checks before operations
- Rate limiting awareness
- Audit log support for compliance

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
- Auto-moderation rules
- Advanced analytics dashboard

---

## Notes

This is the initial release of n8n-nodes-discord-all, providing comprehensive Discord bot functionality for n8n workflows.

For more information, see the [README](README.md) and [documentation](docs/).
