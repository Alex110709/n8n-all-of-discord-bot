# Agent Guidelines for n8n-nodes-discord-all

## Build & Test Commands

- **Build**: `npm run build` (compiles TypeScript + builds icons with gulp)
- **Dev**: `npm run dev` (watch mode)
- **Lint**: `npm run lint` (check) / `npm run lintfix` (auto-fix)
- **Format**: `npm run format` (Prettier)
- **Pre-publish**: `npm run prepublishOnly` (build + lint)
- No test suite configured - manual testing required with n8n

## Code Style

- **Formatting**: Prettier with tabs (width 2), semicolons, single quotes, 100 char width
- **Imports**: Group by: n8n-workflow → discord.js → local, alphabetically sorted
- **Types**: TypeScript strict mode enabled, use n8n interfaces (IExecuteFunctions, INodeTypeDescription, etc.)
- **Naming**: camelCase for variables/functions, PascalCase for classes/interfaces
- **Error Handling**: Use NodeOperationError from n8n-workflow for all errors
- **Node Structure**: Follow n8n node patterns - resource → operation → parameters
- **Async**: All execute methods are async, use proper error handling with try-catch
- **Credentials**: Access via IExecuteFunctions.getCredentials('discordApi')

## Architecture

- **Nodes**: Discord.node.ts (basic), DiscordTrigger.node.ts (events), DiscordTools.node.ts (utilities), DiscordAdvanced.node.ts (analytics)
- **Output**: Compiled to dist/, must match n8n package.json node references
- **Icons**: SVG files must be co-located with node files, built via gulp
