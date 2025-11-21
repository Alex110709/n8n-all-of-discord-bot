# n8n-nodes-discord-all

[![npm version](https://badge.fury.io/js/n8n-nodes-discord-all.svg)](https://www.npmjs.com/package/n8n-nodes-discord-all)
[![npm downloads](https://img.shields.io/npm/dm/n8n-nodes-discord-all.svg)](https://www.npmjs.com/package/n8n-nodes-discord-all)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Discord](https://img.shields.io/badge/Discord-API-5865F2?logo=discord&logoColor=white)](https://discord.com/developers/docs/)
[![n8n](https://img.shields.io/badge/n8n-Community%20Node-FF6D5A)](https://www.npmjs.com/package/n8n-nodes-discord-all)

Complete Discord Bot integration for n8n with **all features** - DM, Mentions, Server Management, Roles, Advanced Tools and more!

## 🚀 Features

### 4 Powerful Nodes

1. **Discord Node** - All basic Discord operations

   - Send, edit, delete messages
   - DM users directly
   - Manage channels, roles, members
   - Server administration
   - Webhooks and invites

2. **Discord Trigger Node** - Real-time event listening

   - Message events (create, update, delete)
   - **🆕 DM received trigger**
   - **🆕 Bot mentioned trigger**
   - **🆕 User mentioned trigger**
   - **🆕 Role mentioned trigger**
   - Reactions, members, roles, channels
   - Voice state, typing events

3. **Discord Tools Node** - Advanced utilities

   - Search and fetch messages in bulk
   - Bulk delete (up to 100 messages)
   - User info and avatars
   - Channel statistics
   - Server analytics and audit logs
   - Custom emoji management

4. **Discord Advanced Node** - Premium features 🔥
   - **Analytics**: Message heatmaps, top contributors, engagement analysis
   - **Moderation**: Spam detection, duplicate finder, link scanner
   - **Backup**: Export messages, server structure, member lists
   - **Automation**: Bulk role assign, mass DM, channel cloning
   - **Insights**: Server health reports, role distribution

## 📦 Installation

```bash
npm install n8n-nodes-discord-all
```

### n8n Setup

Add to your n8n environment:

```bash
# Community nodes installation
n8n start

# Then in n8n UI:
# Settings → Community Nodes → Install
# Enter: n8n-nodes-discord-all
```

Or via environment variable:

```bash
export N8N_CUSTOM_EXTENSIONS="/path/to/node_modules/n8n-nodes-discord-all"
```

## 🎯 Quick Start

### 1. Setup Discord Bot

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to "Bot" section
4. Click "Add Bot"
5. Copy the bot token
6. Enable these **Privileged Gateway Intents**:
   - Message Content Intent ✅
   - Server Members Intent ✅
   - Presence Intent (optional)

### 2. Configure n8n Credentials

1. In n8n, go to Credentials
2. Create new "Discord API" credential
3. Paste your bot token
4. Save

### 3. Create Your First Workflow

#### Example: DM Auto-Responder

```
Discord Trigger (DM Received)
  ↓
Discord (Send DM)
  User ID: {{$json["userId"]}}
  Content: "Thanks for your message! We'll get back to you soon."
```

#### Example: Bot Mention Handler

```
Discord Trigger (Bot Mentioned)
  ↓
Code Node (Parse command)
  ↓
Discord (Send Message)
  Channel ID: {{$json["channelId"]}}
  Content: "Hello! How can I help you?"
```

## 📚 Documentation

- [Complete Usage Guide](./docs/README.md)
- [22 Practical Examples](./docs/EXAMPLES.md)
- [DM & Mentions Guide](./docs/DM_MENTIONS_GUIDE.md) - 12 examples
- [Discord Tools Guide](./docs/TOOLS_GUIDE.md) - Advanced utilities
- [Discord Advanced Guide](./docs/ADVANCED_GUIDE.md) - Analytics, moderation, backups 🔥

## 🎨 Use Cases

- **Customer Support Bot** - Auto-respond to DMs and mentions
- **Server Moderation** - Auto-delete spam, manage slowmode
- **Community Engagement** - Welcome messages, role assignment
- **Analytics & Reporting** - Track server growth, user activity
- **Content Monitoring** - Search messages, audit logs
- **Multi-language Support** - Auto-detect and respond in user's language

## 🔧 Available Operations

### Discord Node

- **Messages**: Send, edit, delete, pin, react
- **DM**: Send direct messages to users
- **Channels**: Create, delete, update, list
- **Roles**: Create, delete, update, assign
- **Members**: Get info, kick, ban, manage roles
- **Server**: Get info, manage bans
- **Webhooks**: Create, send messages
- **Invites**: Create, list, manage

### Discord Trigger Node

- Message Created / Deleted / Updated
- **DM Received** 🆕
- **Bot Mentioned** 🆕
- **User Mentioned** 🆕
- **Role Mentioned** 🆕
- Reaction Added / Removed
- Member Joined / Left / Updated
- Role/Channel Created / Deleted / Updated
- Guild Ban Add / Remove
- Voice State Update
- Typing Start

### Discord Tools Node

- **Messages**: Fetch bulk, search, get mentions, bulk delete
- **Users**: Get detailed info, avatars, status
- **Channels**: Get stats, active users, pins, set slowmode
- **Server**: Get statistics, online members, audit log
- **Emojis**: Create, delete, list custom emojis

### Discord Advanced Node 🔥

- **Analytics**: Heatmaps, top contributors, engagement, peak hours
- **Moderation**: Spam detection, duplicates, link scanner, mass mentions, inactive members
- **Backup**: Export messages/structure/members, create snapshots
- **Automation**: Bulk roles, bulk DM, clone channels
- **Insights**: Server health, role distribution

## 🔐 Required Permissions

### Bot Permissions

- Read Messages / View Channels
- Send Messages
- Manage Messages (for deletion)
- Manage Channels (for channel management)
- Manage Roles (for role management)
- Kick/Ban Members (for moderation)
- Read Message History

### Gateway Intents (Developer Portal)

- ✅ Message Content Intent (required)
- ✅ Server Members Intent (required)
- Presence Intent (optional, for status)

## 📖 Example Workflows

### Auto-Moderation System

```
Discord Trigger (Message Created)
  ↓
Code Node (Check for spam)
  ↓
IF Node (Is spam?)
  ↓ true
Discord Tools (Bulk Delete)
  ↓
Discord (Send Warning)
```

### User Activity Dashboard

```
Schedule Trigger (Daily)
  ↓
Discord Tools (Get Active Users)
  ↓
Code Node (Generate report)
  ↓
Discord (Send Embed Report)
```

### Ticket System

```
Discord Trigger (Reaction Added) → "🎫"
  ↓
Discord (Create Channel) - Private ticket channel
  ↓
Discord (Send Message) - "How can we help?"
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

MIT © [Your Name]

## 🐛 Issues

Found a bug? Have a feature request? Please [open an issue](https://github.com/yourusername/n8n-nodes-discord-all/issues).

## ⭐ Support

If you find this package helpful, please give it a star on GitHub!

## 🔗 Links

- [n8n Documentation](https://docs.n8n.io/)
- [Discord.js Documentation](https://discord.js.org/)
- [Discord Developer Portal](https://discord.com/developers/docs/)

## 📊 Version History

### v2.1.0 (2024-11-21) 🔥

- **NEW**: Discord Advanced Node with 15+ operations
- Analytics: Heatmaps, engagement analysis, peak hours
- Moderation: Spam detection, link scanner, inactive members
- Backup: Full server exports and snapshots
- Automation: Bulk operations for roles and DMs

### v2.0.0 (2024-11-21)

- Package renamed to `n8n-nodes-discord-all`
- Improved error handling

### v1.0.0 (2024)

- Initial release with 3 nodes
- Complete Discord bot functionality
- DM and mention triggers
- Advanced tools for analytics and management

---

Made with ❤️ for the n8n community
