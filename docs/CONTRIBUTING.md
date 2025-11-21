# Contributing to n8n-nodes-discord-all

Thank you for considering contributing to n8n-nodes-discord-all! We welcome contributions from the community.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

This project and everyone participating in it is governed by respect and professionalism. Please be kind and courteous to others.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/n8n-nodes-discord-all.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test thoroughly
6. Submit a pull request

## Development Setup

### Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn
- n8n (for testing)
- Discord bot token (for testing)

### Installation

```bash
# Clone the repository
git clone https://github.com/alex110709/n8n-nodes-discord-all.git
cd n8n-nodes-discord-all

# Install dependencies
npm install

# Build the project
npm run build

# Run in watch mode during development
npm run dev
```

### Link to n8n for Testing

```bash
# In this project directory
npm link

# In your n8n installation directory
npm link n8n-nodes-discord-all

# Restart n8n
n8n start
```

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- Clear and descriptive title
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Environment details (n8n version, Node.js version, OS)
- Discord bot configuration (intents, permissions)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- Clear and descriptive title
- Detailed description of the proposed functionality
- Use cases and examples
- Why this enhancement would be useful
- Which node it affects or if it requires a new node

### Your First Code Contribution

Unsure where to begin? Look for issues labeled:

- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `documentation` - Documentation improvements

## Pull Request Process

### Before Submitting

1. **Test thoroughly** in n8n with a real Discord bot
2. **Run linter**: `npm run lint` or `npm run lintfix`
3. **Build successfully**: `npm run build`
4. **Update documentation** if adding/changing features
5. **Add/update tests** if applicable
6. **Follow coding standards** (see below)

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated
- [ ] All tests pass
- [ ] Tested in n8n environment
- [ ] Tested with Discord bot

### PR Description

Your PR should include:

1. **Summary**: What changes were made and why
2. **Type of change**: Bug fix, new feature, breaking change, etc.
3. **Affected nodes**: Which nodes are impacted
4. **Testing**: How you tested the changes
5. **Screenshots**: If UI changes are involved
6. **Related issues**: Link to related issues using "Fixes #123"

### Review Process

1. Maintainers will review your PR
2. Changes may be requested
3. Once approved, your PR will be merged
4. Your contribution will be included in the next release

## Coding Standards

### TypeScript

- Use TypeScript for all code
- Enable strict mode
- Avoid `any` type when possible
- Use proper type definitions

### Code Style

```typescript
// Use async/await instead of promises
async function fetchData() {
	const result = await someAsyncOperation();
	return result;
}

// Proper error handling
try {
	await riskyOperation();
} catch (error) {
	throw new NodeOperationError(this.getNode(), `Error message: ${error.message}`);
}

// Use descriptive variable names
const channelId = this.getNodeParameter('channelId', i) as string;
const messageContent = this.getNodeParameter('content', i) as string;
```

### Node Development Guidelines

#### Property Definitions

```typescript
{
  displayName: 'Clear and Descriptive Name',
  name: 'camelCaseName',
  type: 'string',
  default: '',
  required: true,
  description: 'Detailed description of what this property does',
  placeholder: 'Example: 123456789',
}
```

#### Error Handling

```typescript
if (!client || !client.isReady()) {
	throw new NodeOperationError(
		this.getNode(),
		'Discord client is not connected. Please check your credentials.',
	);
}

try {
	// Operation
} catch (error) {
	if (this.continueOnFail()) {
		returnData.push({ json: { error: error.message } });
		continue;
	}
	throw new NodeOperationError(this.getNode(), error.message);
}
```

#### Rate Limiting

```typescript
// Always respect Discord rate limits
await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second delay
```

### File Structure

```
src/
├── nodes/
│   ├── NodeName/
│   │   ├── NodeName.node.ts       # Node logic
│   │   └── nodeName.svg           # Node icon
│   └── ...
├── credentials/
│   └── DiscordApi.credentials.ts  # Shared credentials
└── ...
```

## Testing

### Manual Testing

1. Build the package: `npm run build`
2. Link to n8n: `npm link` then link in n8n
3. Create test workflows in n8n
4. Test with a real Discord bot
5. Verify all operations work as expected
6. Test error cases
7. Test with continue-on-fail enabled

### Test Checklist

- [ ] All operations execute successfully
- [ ] Error messages are clear and helpful
- [ ] Continue-on-fail works correctly
- [ ] Rate limiting is respected
- [ ] Large datasets are handled properly
- [ ] Permissions are checked appropriately
- [ ] Discord API changes are handled

## Documentation

### When to Update Documentation

- Adding new node
- Adding new operation
- Changing existing functionality
- Fixing bugs that affect usage
- Adding examples

### Documentation Files

- `README.md` - Main package documentation
- `docs/README.md` - Complete usage guide
- `docs/EXAMPLES.md` - Workflow examples
- `docs/DM_MENTIONS_GUIDE.md` - DM and mentions guide
- `docs/TOOLS_GUIDE.md` - Discord Tools guide
- `docs/ADVANCED_GUIDE.md` - Discord Advanced guide
- `CHANGELOG.md` - Version history

### Documentation Style

```markdown
## Operation Name

**Description**: Brief description of what this operation does.

**Parameters**:

- `paramName` (type, required/optional): Description
- `anotherParam` (type, required/optional): Description

**Example**:
\`\`\`json
{
"paramName": "value",
"anotherParam": "value"
}
\`\`\`

**Returns**:
\`\`\`json
{
"field": "value"
}
\`\`\`

**Notes**:

- Important note 1
- Important note 2
```

## Node-Specific Guidelines

### Discord Node

- Basic operations only
- Follow Discord.js API patterns
- Handle all response types

### Discord Trigger Node

- Efficient event filtering
- Proper webhook management
- Clean client connections

### Discord Tools Node

- Bulk operations efficiency
- Rate limit awareness
- Comprehensive data retrieval

### Discord Advanced Node

- Complex analysis operations
- Performance optimization critical
- Large dataset handling
- Export functionality

## Release Process

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Run `npm run build`
4. Run `npm run lint`
5. Test in n8n environment
6. Commit changes
7. Create git tag
8. Push to npm: `npm publish`
9. Create GitHub release

## Questions?

- Open an issue with `question` label
- Check existing documentation
- Review Discord.js documentation
- Review n8n node development docs

## Recognition

Contributors will be recognized in:

- CHANGELOG.md
- GitHub contributors page
- Release notes

Thank you for contributing! 🎉
