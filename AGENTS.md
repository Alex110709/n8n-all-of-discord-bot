# Agent Guidelines for n8n-nodes-discord-all

## Build & Test Commands

- **Build**: `npm run build` - Compiles TypeScript + builds icons with gulp
- **Dev**: `npm run dev` - TypeScript watch mode
- **Lint**: `npm run lint` - Check code style
- **Lint**: `npm run lintfix` - Auto-fix linting issues
- **Format**: `npm run format` - Format with Prettier
- **Test**: `npm test` - Run all Jest tests
- **Test**: `npm run test:watch` - Watch mode for tests
- **Test**: `npm run test:coverage` - Generate coverage report
- **Single Test**: `npm test -- src/__tests__/SpecificTest.test.ts`
- **Single Test**: `npm test -- --testNamePattern="pattern"` - Run tests matching name pattern
- **Pre-publish**: `npm run prepublishOnly` - Build + lint (required before npm publish)

## Code Style

### Formatting (Prettier)

- **Indentation**: Tabs (width 2)
- **Quotes**: Single quotes
- **Semicolons**: Required
- **Width**: 100 characters max
- **Trailing commas**: All (objects, arrays, functions)
- **Config**: `.prettierrc.js` - Auto-format on save recommended

### Imports

- **Group by**: n8n-workflow → discord.js → local modules
- **Alphabetically sorted** within each group
- **Example**:
  ```typescript
  import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
  import { Client, GatewayIntentBits } from 'discord.js';
  import { DiscordApi } from './credentials/DiscordApi.credentials';
  ```

### TypeScript

- **Strict mode**: Enabled (tsconfig.json)
- **Interfaces**: Use n8n interfaces (IExecuteFunctions, INodeTypeDescription, ITriggerFunctions, ICredentialType)
- **Types**: Explicit types preferred over `any` (but `@typescript-eslint/no-explicit-any` is off)
- **Exports**: Named exports for classes, avoid default exports

### Naming Conventions

- **Variables/Functions**: camelCase (`const botToken`, `async sendMessage()`)
- **Classes/Interfaces**: PascalCase (`class Discord implements INodeType`)
- **Constants**: UPPER_SNAKE_CASE (`const MAX_RETRIES = 3`)
- **File Names**: PascalCase for classes (`Discord.node.ts`, `DiscordTrigger.node.ts`)
- **Test Files**: `*.test.ts` in `src/__tests__/`

### Error Handling

- **Always use**: `NodeOperationError` from 'n8n-workflow'
- **Pattern**: `throw new NodeOperationError(this.getNode(), 'Descriptive message')`
- **Try-catch**: Wrap operations in try-catch blocks, re-throw with NodeOperationError
- **Example**:
  ```typescript
  try {
  	const channel = await client.channels.fetch(channelId);
  	if (!channel) {
  		throw new NodeOperationError(this.getNode(), 'Channel not found');
  	}
  } catch (error) {
  	throw new NodeOperationError(this.getNode(), `Failed to fetch channel: ${error.message}`);
  }
  ```

### Node Structure (n8n Patterns)

#### Node Description

```typescript
export class Discord implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Discord',
		name: 'discord',
		icon: 'file:discord.svg',
		group: ['transform'], // or ['trigger'] for trigger nodes
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Node description',
		defaults: { name: 'Discord' },
		inputs: ['main'], // empty array [] for trigger nodes
		outputs: ['main'],
		credentials: [{ name: 'discordApi', required: true }],
		properties: [
			/* properties array */
		],
	};
}
```

#### Properties Structure

- **Resource first**: Resource dropdown (message, channel, member, etc.)
- **Operation second**: Operation dropdown based on resource
- **Use `displayOptions`**: Show/hide fields based on resource/operation
- **Type safety**: Define displayOptions with explicit arrays
- **Example**:
  ```typescript
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    displayOptions: {
      show: { resource: ['message'] }
    },
    options: [ /* operations */ ]
  }
  ```

#### Execute Method Pattern

```typescript
async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const items = this.getInputData();
  const returnData: INodeExecutionData[] = [];

  // 1. Get credentials
  const credentials = await this.getCredentials('discordApi');
  const botToken = credentials.botToken as string;

  // 2. Initialize client
  const client = new Client({ intents: [/* intents */] });
  await client.login(botToken);

  try {
    // 3. Process items
    for (let i = 0; i < items.length; i++) {
      const resource = this.getNodeParameter('resource', i) as string;
      const operation = this.getNodeParameter('operation', i) as string;

      // 4. Execute operation
      const responseData = /* perform Discord API call */;

      // 5. Build output
      const executionData = this.helpers.constructExecutionMetaData(
        this.helpers.returnJsonArray(responseData),
        { itemData: { item: i } }
      );
      returnData.push(...executionData);
    }
  } finally {
    // 6. Cleanup
    await client.destroy();
  }

  return [returnData];
}
```

#### Trigger Method Pattern

```typescript
async trigger(this: ITriggerFunctions): Promise<ITriggerResponse> {
  const credentials = await this.getCredentials('discordApi');
  const botToken = credentials.botToken as string;

  const client = new Client({ intents: [/* intents */] });
  await client.login(botToken);

  const event = this.getNodeParameter('event', 0) as string;

  // Set up event listener
  client.on(Events.MessageCreate, async (message) => {
    this.emit([[{ json: { /* event data */ } }]]);
  });

  // Return manual trigger function
  async function manualTriggerFunction() {
    await client.destroy();
  }

  return { manualTriggerFunction };
}
```

### Parameter Access

- **Basic**: `this.getNodeParameter('fieldName', index)`
- **With default**: `this.getNodeParameter('fieldName', index, defaultValue)`
- **Type assertion**: `this.getNodeParameter('channelId', 0) as string`
- **Nested**: `this.getNodeParameter('additionalFields', 0, {}) as any`

### Client Configuration

- **Gateway Intents**: Always include required intents (MessageContent, GuildMembers, etc.)
- **Partials**: Use Partials.Channel, Partials.Message for uncached entities
- **Cleanup**: Always call `client.destroy()` in finally block or manualTriggerFunction

### Testing

- **Framework**: Jest with ts-jest
- **Location**: `src/__tests__/`
- **Structure**: `describe` → `beforeEach` → `it` blocks
- **Test subjects**: Node description, properties, execute methods
- **Pattern**:

  ```typescript
  import { Discord } from '../nodes/Discord/Discord.node';

  describe('Discord Node', () => {
  	let discordNode: Discord;

  	beforeEach(() => {
  		discordNode = new Discord();
  	});

  	it('should have correct displayName', () => {
  		expect(discordNode.description.displayName).toBe('Discord');
  	});
  });
  ```

## Architecture

### Node Types

- **Discord.node.ts**: Basic operations (message, channel, member, role, thread, etc.)
- **DiscordTrigger.node.ts**: Event listening (messageCreate, dmReceived, reactions, etc.)
- **DiscordTools.node.ts**: AI Agent Tool (advanced utilities, analytics, moderation)
- **DiscordAdvanced.node.ts**: Analytics and moderation operations

### File Structure

```
src/
  credentials/
    DiscordApi.credentials.ts
  nodes/
    Discord/
      Discord.node.ts
      discord.svg
    DiscordTrigger/
      DiscordTrigger.node.ts
      discord.svg
    DiscordTools/
      DiscordTools.node.ts
      discord.svg
    DiscordAdvanced/
      DiscordAdvanced.node.ts
      discord.svg
  __tests__/
    Discord.node.test.ts
```

### Build Output

- **dist/**: Compiled JavaScript output
- **Icons**: SVG files copied from src/nodes/\*/discord.svg
- **Entry points**: Must match package.json n8n.nodes paths

### Discord.js Usage

- **Version**: ^14.14.1
- **Client**: Always create fresh client per execute/trigger call
- **Fetch methods**: Use `.fetch()` for uncached entities
- **Type guards**: Use `isTextBased()`, `isThread()` etc. for channel types
- **Rate limiting**: Discord.js handles rate limiting automatically

## Best Practices

1. **Always destroy Discord client** after use to prevent memory leaks
2. **Use displayOptions** to hide irrelevant parameters based on resource/operation
3. **Provide default values** for optional parameters in getNodeParameter
4. **Validate inputs** before Discord API calls, throw NodeOperationError on validation failures
5. **Return minimal response data** - only what's needed by users (avoid returning full Discord objects)
6. **Support both embeds and attachments** in message operations
7. **Handle binary data** with `this.helpers.getBinaryDataBuffer()` for file uploads
8. **Use descriptive error messages** that help users troubleshoot issues
9. **Keep execute methods focused** - extract complex logic into helper functions if needed
10. **Test node description** before testing execute methods - catch UI/UX issues early

## Common Patterns

### Binary File Upload

```typescript
const binaryProperty = this.getNodeParameter('binaryProperty', i) as string;
const binaryData = items[i].binary?.[binaryProperty];
const buffer = await this.helpers.getBinaryDataBuffer(i, binaryProperty);
messageOptions.files = [{ attachment: buffer, name: fileName }];
```

### JSON Embed Handling

```typescript
const embedJson = this.getNodeParameter('embedJson', i, '') as string;
if (embedJson) {
	try {
		messageOptions.embeds = [JSON.parse(embedJson)];
	} catch (error) {
		throw new NodeOperationError(this.getNode(), 'Invalid embed JSON');
	}
}
```

### Channel Type Guards

```typescript
const channel = await client.channels.fetch(channelId);
if (!channel || !channel.isTextBased()) {
	throw new NodeOperationError(this.getNode(), 'Invalid channel type');
}
```

### Error Recovery in Loops

```typescript
for (let i = 0; i < items.length; i++) {
	try {
		// ... process item
	} catch (error) {
		if (this.continueOnFail()) {
			returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
			continue;
		}
		throw error;
	}
}
```
