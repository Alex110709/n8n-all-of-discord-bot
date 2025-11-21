import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import { Client, GatewayIntentBits, Partials, ChannelType, TextChannel } from 'discord.js';

export class DiscordTools implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Discord Tools',
		name: 'discordTools',
		icon: 'file:discord.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Discord utility tools - Message fetching, user info, and more',
		defaults: {
			name: 'Discord Tools',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'discordApi',
				required: true,
			},
		],
		usableAsTool: true,
		codex: {
			categories: ['Communication'],
			subcategories: {
				Communication: ['Messaging', 'Social Media'],
			},
			resources: {
				primaryDocumentation: [
					{
						url: 'https://discord.com/developers/docs/intro',
					},
				],
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Message',
						value: 'message',
					},
					{
						name: 'DM',
						value: 'dm',
						description: 'Direct message operations',
					},
					{
						name: 'User',
						value: 'user',
					},
					{
						name: 'Channel',
						value: 'channel',
					},
					{
						name: 'Guild',
						value: 'guild',
					},
					{
						name: 'Emoji',
						value: 'emoji',
					},
					{
						name: 'Analytics',
						value: 'analytics',
						description: 'Advanced analytics and statistics',
					},
					{
						name: 'Moderation',
						value: 'moderation',
						description: 'Moderation and safety tools',
					},
					{
						name: 'Backup',
						value: 'backup',
						description: 'Backup and export tools',
					},
				],
				default: 'message',
			},

			// Message Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['message'],
					},
				},
				options: [
					{
						name: 'Send',
						value: 'send',
						description: 'Send a message to a channel',
						action: 'Send a message',
					},
					{
						name: 'Edit',
						value: 'edit',
						description: 'Edit an existing message',
						action: 'Edit a message',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a message',
						action: 'Delete a message',
					},
					{
						name: 'Fetch Messages',
						value: 'fetchMessages',
						description: 'Fetch multiple messages from a channel',
						action: 'Fetch messages',
					},
					{
						name: 'Search Messages',
						value: 'searchMessages',
						description: 'Search for messages containing specific text',
						action: 'Search messages',
					},
					{
						name: 'Get Mentions',
						value: 'getMentions',
						description: 'Get all messages mentioning a user',
						action: 'Get mentions',
					},
					{
						name: 'Bulk Delete',
						value: 'bulkDelete',
						description: 'Delete multiple messages at once',
						action: 'Bulk delete messages',
					},
					{
						name: 'Get Message History',
						value: 'getHistory',
						description: 'Get message history with filters',
						action: 'Get message history',
					},
				],
				default: 'send',
			},

			// DM Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['dm'],
					},
				},
				options: [
					{
						name: 'Send DM',
						value: 'sendDM',
						description: 'Send a direct message to a user',
						action: 'Send DM',
					},
				],
				default: 'sendDM',
			},

			// User Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['user'],
					},
				},
				options: [
					{
						name: 'Get User Info',
						value: 'getUserInfo',
						description: 'Get detailed user information',
						action: 'Get user info',
					},
					{
						name: 'Get Avatar',
						value: 'getAvatar',
						description: 'Get user avatar URL',
						action: 'Get avatar',
					},
					{
						name: 'Get User Status',
						value: 'getStatus',
						description: 'Get user presence status',
						action: 'Get status',
					},
					{
						name: 'Check Permissions',
						value: 'checkPermissions',
						description: 'Check user permissions in a channel',
						action: 'Check permissions',
					},
				],
				default: 'getUserInfo',
			},

			// Channel Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['channel'],
					},
				},
				options: [
					{
						name: 'Get Messages Count',
						value: 'getMessageCount',
						description: 'Count messages in a channel',
						action: 'Get message count',
					},
					{
						name: 'Get Active Users',
						value: 'getActiveUsers',
						description: 'Get list of active users in channel',
						action: 'Get active users',
					},
					{
						name: 'Get Pins',
						value: 'getPins',
						description: 'Get pinned messages',
						action: 'Get pinned messages',
					},
					{
						name: 'Set Slowmode',
						value: 'setSlowmode',
						description: 'Set channel slowmode',
						action: 'Set slowmode',
					},
					{
						name: 'Get Webhooks',
						value: 'getWebhooks',
						description: 'Get all webhooks in channel',
						action: 'Get webhooks',
					},
				],
				default: 'getMessageCount',
			},

			// Guild Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['guild'],
					},
				},
				options: [
					{
						name: 'Get Statistics',
						value: 'getStatistics',
						description: 'Get guild statistics',
						action: 'Get statistics',
					},
					{
						name: 'Get Online Members',
						value: 'getOnlineMembers',
						description: 'Get count of online members',
						action: 'Get online members',
					},
					{
						name: 'Get Audit Log',
						value: 'getAuditLog',
						description: 'Get guild audit log',
						action: 'Get audit log',
					},
					{
						name: 'Get Emojis',
						value: 'getEmojis',
						description: 'Get all custom emojis',
						action: 'Get emojis',
					},
				],
				default: 'getStatistics',
			},

			// Emoji Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['emoji'],
					},
				},
				options: [
					{
						name: 'Create Emoji',
						value: 'createEmoji',
						description: 'Create a custom emoji',
						action: 'Create emoji',
					},
					{
						name: 'Delete Emoji',
						value: 'deleteEmoji',
						description: 'Delete a custom emoji',
						action: 'Delete emoji',
					},
					{
						name: 'List Emojis',
						value: 'listEmojis',
						description: 'List all custom emojis',
						action: 'List emojis',
					},
				],
				default: 'listEmojis',
			},

			// Analytics Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['analytics'],
					},
				},
				options: [
					{
						name: 'Message Activity Heatmap',
						value: 'messageHeatmap',
						description: 'Analyze message activity by hour/day',
						action: 'Get message heatmap',
					},
					{
						name: 'Top Contributors',
						value: 'topContributors',
						description: 'Find most active contributors',
						action: 'Get top contributors',
					},
				],
				default: 'messageHeatmap',
			},

			// Moderation Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['moderation'],
					},
				},
				options: [
					{
						name: 'Detect Spam Messages',
						value: 'detectSpam',
						description: 'Identify potential spam messages',
						action: 'Detect spam',
					},
					{
						name: 'Find Duplicate Messages',
						value: 'findDuplicates',
						description: 'Find duplicate/repeated messages',
						action: 'Find duplicates',
					},
				],
				default: 'detectSpam',
			},

			// Backup Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['backup'],
					},
				},
				options: [
					{
						name: 'Export Channel Messages',
						value: 'exportMessages',
						description: 'Export all messages from a channel',
						action: 'Export messages',
					},
				],
				default: 'exportMessages',
			},

			// Common Fields
			{
				displayName: 'Guild ID',
				name: 'guildId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['guild', 'emoji', 'analytics', 'moderation', 'backup'],
					},
				},
				default: '',
				description: 'The ID of the Discord server (guild)',
			},

			{
				displayName: 'Channel ID',
				name: 'channelId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['message', 'channel', 'analytics', 'moderation', 'backup'],
					},
				},
				default: '',
				description: 'The ID of the channel',
			},

			{
				displayName: 'User ID',
				name: 'userId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['user', 'dm'],
					},
				},
				default: '',
				description: 'The ID of the user',
			},

			{
				displayName: 'Message Content',
				name: 'content',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['message', 'dm'],
						operation: ['send', 'sendDM', 'edit'],
					},
				},
				default: '',
				description: 'The message content to send',
			},

			{
				displayName: 'Message ID',
				name: 'messageId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['message'],
						operation: ['edit', 'delete'],
					},
				},
				default: '',
				description: 'The ID of the message',
			},

			// Message specific fields
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['message'],
						operation: ['fetchMessages', 'searchMessages', 'getMentions', 'getHistory'],
					},
				},
				default: 50,
				description: 'Number of messages to fetch (max 100)',
			},

			{
				displayName: 'Search Text',
				name: 'searchText',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['message'],
						operation: ['searchMessages'],
					},
				},
				default: '',
				description: 'Text to search for in messages',
			},

			{
				displayName: 'Mentioned User ID',
				name: 'mentionedUserId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['message'],
						operation: ['getMentions'],
					},
				},
				default: '',
				description: 'User ID to find mentions of',
			},

			{
				displayName: 'Message IDs',
				name: 'messageIds',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['message'],
						operation: ['bulkDelete'],
					},
				},
				default: '',
				description: 'Comma-separated message IDs to delete',
				placeholder: '123456789,987654321',
			},

			{
				displayName: 'Slowmode Duration (seconds)',
				name: 'slowmodeDuration',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['channel'],
						operation: ['setSlowmode'],
					},
				},
				default: 0,
				description: 'Slowmode duration in seconds (0 to disable)',
			},

			{
				displayName: 'Emoji Name',
				name: 'emojiName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['emoji'],
						operation: ['createEmoji'],
					},
				},
				default: '',
				description: 'Name of the emoji',
			},

			{
				displayName: 'Emoji Image URL',
				name: 'emojiImageUrl',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['emoji'],
						operation: ['createEmoji'],
					},
				},
				default: '',
				description: 'URL of the emoji image',
			},

			{
				displayName: 'Emoji ID',
				name: 'emojiId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['emoji'],
						operation: ['deleteEmoji'],
					},
				},
				default: '',
				description: 'ID of the emoji to delete',
			},

			{
				displayName: 'Additional Options',
				name: 'additionalOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Include Bots',
						name: 'includeBots',
						type: 'boolean',
						default: false,
						description: 'Whether to include bot messages',
					},
					{
						displayName: 'Before Message ID',
						name: 'before',
						type: 'string',
						default: '',
						description: 'Get messages before this message ID',
					},
					{
						displayName: 'After Message ID',
						name: 'after',
						type: 'string',
						default: '',
						description: 'Get messages after this message ID',
					},
					{
						displayName: 'Case Sensitive',
						name: 'caseSensitive',
						type: 'boolean',
						default: false,
						description: 'Whether search should be case sensitive',
					},
					{
						displayName: 'Exact Match',
						name: 'exactMatch',
						type: 'boolean',
						default: false,
						description: 'Whether to match exact text only',
					},
					{
						displayName: 'Audit Log Type',
						name: 'auditLogType',
						type: 'string',
						default: '',
						description: 'Filter audit log by action type',
					},
					{
						displayName: 'Audit Log Limit',
						name: 'auditLogLimit',
						type: 'number',
						default: 50,
						description: 'Number of audit log entries to fetch',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const credentials = await this.getCredentials('discordApi');
		const botToken = credentials.botToken as string;

		const client = new Client({
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.GuildMembers,
				GatewayIntentBits.GuildPresences,
				GatewayIntentBits.DirectMessages,
				GatewayIntentBits.MessageContent,
				GatewayIntentBits.GuildEmojisAndStickers,
			],
			partials: [Partials.Channel, Partials.Message],
		});

		await client.login(botToken);

		// Wait for client to be ready
		await new Promise((resolve) => {
			if (client.isReady()) {
				resolve(true);
			} else {
				client.once('ready', resolve);
			}
		});

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;

				let responseData: any;

				if (resource === 'message') {
					const channelId = this.getNodeParameter('channelId', i) as string;
					const channel = await client.channels.fetch(channelId);

					if (!channel || !channel.isTextBased()) {
						throw new NodeOperationError(this.getNode(), 'Channel not found or not text-based');
					}

					if (operation === 'send') {
						const content = this.getNodeParameter('content', i) as string;
						const textChannel = channel as TextChannel;
						const message = await textChannel.send(content);

						responseData = {
							id: message.id,
							content: message.content,
							channelId: message.channelId,
							createdTimestamp: message.createdTimestamp,
							author: {
								id: message.author.id,
								username: message.author.username,
							},
						};
					} else if (operation === 'edit') {
						const messageId = this.getNodeParameter('messageId', i) as string;
						const content = this.getNodeParameter('content', i) as string;
						const textChannel = channel as TextChannel;
						const message = await textChannel.messages.fetch(messageId);
						const edited = await message.edit(content);

						responseData = {
							id: edited.id,
							content: edited.content,
							channelId: edited.channelId,
							editedTimestamp: edited.editedTimestamp,
						};
					} else if (operation === 'delete') {
						const messageId = this.getNodeParameter('messageId', i) as string;
						const textChannel = channel as TextChannel;
						const message = await textChannel.messages.fetch(messageId);
						await message.delete();

						responseData = {
							success: true,
							messageId: messageId,
							deleted: true,
						};
					} else if (operation === 'fetchMessages') {
						const limit = this.getNodeParameter('limit', i, 50) as number;
						const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as any;

						const options: any = { limit: Math.min(limit, 100) };
						if (additionalOptions.before) options.before = additionalOptions.before;
						if (additionalOptions.after) options.after = additionalOptions.after;

						const messages = await channel.messages.fetch(options);

						responseData = Array.from((messages as any).values())
							.filter((msg: any) => additionalOptions.includeBots || !msg.author.bot)
							.map((msg: any) => ({
								id: msg.id,
								content: msg.content,
								author: {
									id: msg.author.id,
									username: msg.author.username,
									bot: msg.author.bot,
								},
								channelId: msg.channelId,
								guildId: msg.guildId,
								createdTimestamp: msg.createdTimestamp,
								attachments: Array.from(msg.attachments.values()).map((att: any) => ({
									id: att.id,
									url: att.url,
									name: att.name,
								})),
								embeds: msg.embeds.map((embed: any) => embed.toJSON()),
								reactions: msg.reactions.cache.map((reaction: any) => ({
									emoji: reaction.emoji.name,
									count: reaction.count,
								})),
							}));
					} else if (operation === 'searchMessages') {
						const limit = this.getNodeParameter('limit', i, 50) as number;
						const searchText = this.getNodeParameter('searchText', i) as string;
						const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as any;

						const messages = await channel.messages.fetch({ limit: Math.min(limit, 100) });

						const filtered = Array.from(messages.values()).filter((msg) => {
							if (!additionalOptions.includeBots && msg.author.bot) return false;

							const content = additionalOptions.caseSensitive
								? msg.content
								: msg.content.toLowerCase();
							const search = additionalOptions.caseSensitive
								? searchText
								: searchText.toLowerCase();

							if (additionalOptions.exactMatch) {
								return content === search;
							}
							return content.includes(search);
						});

						responseData = filtered.map((msg) => ({
							id: msg.id,
							content: msg.content,
							author: {
								id: msg.author.id,
								username: msg.author.username,
								bot: msg.author.bot,
							},
							channelId: msg.channelId,
							createdTimestamp: msg.createdTimestamp,
						}));
					} else if (operation === 'getMentions') {
						const limit = this.getNodeParameter('limit', i, 50) as number;
						const mentionedUserId = this.getNodeParameter('mentionedUserId', i) as string;

						const messages = await channel.messages.fetch({ limit: Math.min(limit, 100) });

						const mentionedMessages = Array.from(messages.values()).filter((msg) =>
							msg.mentions.users.has(mentionedUserId),
						);

						responseData = mentionedMessages.map((msg) => ({
							id: msg.id,
							content: msg.content,
							author: {
								id: msg.author.id,
								username: msg.author.username,
							},
							channelId: msg.channelId,
							createdTimestamp: msg.createdTimestamp,
							mentionedUsers: Array.from(msg.mentions.users.values()).map((user) => ({
								id: user.id,
								username: user.username,
							})),
						}));
					} else if (operation === 'bulkDelete') {
						const messageIds = this.getNodeParameter('messageIds', i) as string;
						const ids = messageIds.split(',').map((id) => id.trim());

						if (ids.length > 100) {
							throw new NodeOperationError(
								this.getNode(),
								'Cannot delete more than 100 messages at once',
							);
						}

						const textChannel = channel as TextChannel;
						const deleted = await textChannel.bulkDelete(ids, true);

						responseData = {
							success: true,
							deletedCount: deleted.size,
							deletedIds: Array.from(deleted.keys()),
						};
					} else if (operation === 'getHistory') {
						const limit = this.getNodeParameter('limit', i, 50) as number;
						const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as any;

						const messages = await channel.messages.fetch({ limit: Math.min(limit, 100) });

						const history = Array.from(messages.values())
							.filter((msg) => additionalOptions.includeBots || !msg.author.bot)
							.map((msg) => ({
								id: msg.id,
								content: msg.content,
								author: {
									id: msg.author.id,
									username: msg.author.username,
									displayName: msg.author.displayName,
									bot: msg.author.bot,
								},
								channelId: msg.channelId,
								createdTimestamp: msg.createdTimestamp,
								editedTimestamp: msg.editedTimestamp,
								pinned: msg.pinned,
								mentionEveryone: (msg as any).mentionEveryone,
								attachments: Array.from(msg.attachments.values()).map((att) => ({
									id: att.id,
									url: att.url,
									name: att.name,
									size: att.size,
								})),
							}));

						responseData = history;
					}
				} else if (resource === 'user') {
					const userId = this.getNodeParameter('userId', i) as string;
					const user = await client.users.fetch(userId);

					if (operation === 'getUserInfo') {
						responseData = {
							id: user.id,
							username: user.username,
							discriminator: user.discriminator,
							displayName: user.displayName,
							bot: user.bot,
							system: user.system,
							avatar: user.avatar,
							avatarURL: user.displayAvatarURL({ size: 1024 }),
							banner: user.banner,
							accentColor: user.accentColor,
							createdTimestamp: user.createdTimestamp,
							createdAt: user.createdAt.toISOString(),
						};
					} else if (operation === 'getAvatar') {
						responseData = {
							userId: user.id,
							username: user.username,
							avatarURL: user.displayAvatarURL({ size: 4096 }),
							defaultAvatarURL: user.defaultAvatarURL,
							avatar: user.avatar,
						};
					} else if (operation === 'getStatus') {
						// Note: Requires presence intent
						const userWithPresence = user as any;
						responseData = {
							userId: user.id,
							username: user.username,
							presence: userWithPresence.presence
								? {
										status: userWithPresence.presence.status,
										activities: userWithPresence.presence.activities.map((activity: any) => ({
											name: activity.name,
											type: activity.type,
											details: activity.details,
											state: activity.state,
										})),
								}
								: null,
						};
					}
				} else if (resource === 'dm') {
					const userId = this.getNodeParameter('userId', i) as string;
					const user = await client.users.fetch(userId);

					if (!user) {
						throw new NodeOperationError(this.getNode(), 'User not found');
					}

					if (operation === 'sendDM') {
						const content = this.getNodeParameter('content', i) as string;
						const dmChannel = await user.createDM();
						const message = await dmChannel.send(content);

						responseData = {
							id: message.id,
							content: message.content,
							channelId: message.channelId,
							createdTimestamp: message.createdTimestamp,
							recipient: {
								id: user.id,
								username: user.username,
							},
						};
					}
				} else if (resource === 'channel') {
					const channelId = this.getNodeParameter('channelId', i) as string;
					const channel = await client.channels.fetch(channelId);

					if (!channel) {
						throw new NodeOperationError(this.getNode(), 'Channel not found');
					}

					if (operation === 'getMessageCount') {
						if (!channel.isTextBased()) {
							throw new NodeOperationError(this.getNode(), 'Channel is not text-based');
						}

						const messages = await channel.messages.fetch({ limit: 100 });

						responseData = {
							channelId: channel.id,
							channelName: 'name' in channel ? channel.name : undefined,
							messageCount: messages.size,
							note: 'Limited to last 100 messages due to API restrictions',
						};
					} else if (operation === 'getPins') {
						if (!channel.isTextBased()) {
							throw new NodeOperationError(this.getNode(), 'Channel is not text-based');
						}

						const pins = await channel.messages.fetchPinned();

						responseData = Array.from(pins.values()).map((msg) => ({
							id: msg.id,
							content: msg.content,
							author: {
								id: msg.author.id,
								username: msg.author.username,
							},
							createdTimestamp: msg.createdTimestamp,
							url: msg.url,
						}));
					} else if (operation === 'setSlowmode') {
						const slowmodeDuration = this.getNodeParameter('slowmodeDuration', i) as number;

						if (channel.type !== ChannelType.GuildText) {
							throw new NodeOperationError(this.getNode(), 'Slowmode only works on text channels');
						}

						const textChannel = channel as TextChannel;
						await textChannel.setRateLimitPerUser(slowmodeDuration);

						responseData = {
							success: true,
							channelId: channel.id,
							slowmodeDuration,
						};
					} else if (operation === 'getWebhooks') {
						if (!('fetchWebhooks' in channel)) {
							throw new NodeOperationError(this.getNode(), 'Channel does not support webhooks');
						}

						const webhooks = await (channel as any).fetchWebhooks();

						responseData = Array.from(webhooks.values()).map((webhook: any) => ({
							id: webhook.id,
							name: webhook.name,
							avatar: webhook.avatar,
							channelId: webhook.channelId,
							guildId: webhook.guildId,
							owner: webhook.owner
								? {
										id: webhook.owner.id,
										username: webhook.owner.username,
								}
								: null,
							token: webhook.token,
							url: webhook.url,
						}));
					} else if (operation === 'getActiveUsers') {
						if (!channel.isTextBased()) {
							throw new NodeOperationError(this.getNode(), 'Channel is not text-based');
						}

						const messages = await channel.messages.fetch({ limit: 100 });
						const userMap = new Map();

						messages.forEach((msg) => {
							const userId = msg.author.id;
							if (!userMap.has(userId)) {
								userMap.set(userId, {
									id: msg.author.id,
									username: msg.author.username,
									bot: msg.author.bot,
									messageCount: 0,
								});
							}
							userMap.get(userId).messageCount++;
						});

						responseData = Array.from(userMap.values()).sort(
							(a, b) => b.messageCount - a.messageCount,
						);
					}
				} else if (resource === 'guild') {
					const guildId = this.getNodeParameter('guildId', i) as string;
					const guild = await client.guilds.fetch(guildId);

					if (operation === 'getStatistics') {
						const channels = await guild.channels.fetch();
						const roles = await guild.roles.fetch();
						const emojis = await guild.emojis.fetch();

						responseData = {
							id: guild.id,
							name: guild.name,
							description: guild.description,
							ownerId: guild.ownerId,
							memberCount: guild.memberCount,
							createdTimestamp: guild.createdTimestamp,
							channels: {
								total: channels.size,
								text: channels.filter((c) => c?.type === ChannelType.GuildText).size,
								voice: channels.filter((c) => c?.type === ChannelType.GuildVoice).size,
								category: channels.filter((c) => c?.type === ChannelType.GuildCategory).size,
							},
							roles: {
								total: roles.size,
							},
							emojis: {
								total: emojis.size,
							},
							verificationLevel: guild.verificationLevel,
							premiumTier: guild.premiumTier,
							premiumSubscriptionCount: guild.premiumSubscriptionCount,
						};
					} else if (operation === 'getOnlineMembers') {
						const members = await guild.members.fetch();
						const onlineMembers = members.filter(
							(member) => member.presence?.status && member.presence.status !== 'offline',
						);

						responseData = {
							guildId: guild.id,
							totalMembers: members.size,
							onlineCount: onlineMembers.size,
							offlineCount: members.size - onlineMembers.size,
							statusBreakdown: {
								online: members.filter((m) => m.presence?.status === 'online').size,
								idle: members.filter((m) => m.presence?.status === 'idle').size,
								dnd: members.filter((m) => m.presence?.status === 'dnd').size,
							},
						};
					} else if (operation === 'getAuditLog') {
						const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as any;
						const limit = additionalOptions.auditLogLimit || 50;

						const auditLogs = await guild.fetchAuditLogs({ limit });

						responseData = auditLogs.entries.map((entry) => ({
							id: entry.id,
							action: entry.action,
							actionType: entry.actionType,
							targetId: entry.targetId,
							executorId: entry.executorId,
							executor: entry.executor
								? {
										id: entry.executor.id,
										username: entry.executor.username,
								}
								: null,
							reason: entry.reason,
							createdTimestamp: entry.createdTimestamp,
							changes: entry.changes,
						}));
					} else if (operation === 'getEmojis') {
						const emojis = await guild.emojis.fetch();

						responseData = Array.from(emojis.values()).map((emoji) => ({
							id: emoji.id,
							name: emoji.name,
							animated: emoji.animated,
							url: emoji.url,
							managed: emoji.managed,
							available: emoji.available,
							requireColons: emoji.requiresColons,
						}));
					}
				} else if (resource === 'emoji') {
					const guildId = this.getNodeParameter('guildId', i) as string;
					const guild = await client.guilds.fetch(guildId);

					if (operation === 'createEmoji') {
						const emojiName = this.getNodeParameter('emojiName', i) as string;
						const emojiImageUrl = this.getNodeParameter('emojiImageUrl', i) as string;

						const emoji = await guild.emojis.create({
							attachment: emojiImageUrl,
							name: emojiName,
						});

						responseData = {
							id: emoji.id,
							name: emoji.name,
							animated: emoji.animated,
							url: emoji.url,
							identifier: emoji.identifier,
						};
					} else if (operation === 'deleteEmoji') {
						const emojiId = this.getNodeParameter('emojiId', i) as string;
						const emoji = await guild.emojis.fetch(emojiId);

						if (!emoji) {
							throw new NodeOperationError(this.getNode(), 'Emoji not found');
						}

						await emoji.delete();

						responseData = {
							success: true,
							emojiId,
							emojiName: emoji.name,
						};
					} else if (operation === 'listEmojis') {
						const emojis = await guild.emojis.fetch();

						responseData = Array.from(emojis.values()).map((emoji) => ({
							id: emoji.id,
							name: emoji.name,
							animated: emoji.animated,
							url: emoji.url,
							identifier: emoji.identifier,
							managed: emoji.managed,
							available: emoji.available,
						}));
					}
				} else if (resource === 'analytics') {
					const guildId = this.getNodeParameter('guildId', i) as string;
					const channelId = this.getNodeParameter('channelId', i) as string;
					const channel = await client.channels.fetch(channelId);

					if (!channel || !channel.isTextBased()) {
						throw new NodeOperationError(this.getNode(), 'Channel not found or not text-based');
					}

					if (operation === 'messageHeatmap') {
						const messages = await channel.messages.fetch({ limit: 100 });
						const heatmap: any = {};

						messages.forEach((msg) => {
							const hour = new Date(msg.createdTimestamp).getHours();
							heatmap[hour] = (heatmap[hour] || 0) + 1;
						});

						responseData = {
							channelId,
							guildId,
							heatmap,
							totalMessages: messages.size,
						};
					} else if (operation === 'topContributors') {
						const messages = await channel.messages.fetch({ limit: 100 });
						const contributors: any = {};

						messages.forEach((msg) => {
							if (!msg.author.bot) {
								const userId = msg.author.id;
								contributors[userId] = contributors[userId] || {
									id: userId,
									username: msg.author.username,
									count: 0,
								};
								contributors[userId].count++;
							}
						});

						responseData = Object.values(contributors).sort((a: any, b: any) => b.count - a.count);
					}
				} else if (resource === 'moderation') {
					const guildId = this.getNodeParameter('guildId', i) as string;
					const channelId = this.getNodeParameter('channelId', i) as string;
					const channel = await client.channels.fetch(channelId);

					if (!channel || !channel.isTextBased()) {
						throw new NodeOperationError(this.getNode(), 'Channel not found or not text-based');
					}

					if (operation === 'detectSpam') {
						const messages = await channel.messages.fetch({ limit: 100 });
						const spam: any[] = [];

						messages.forEach((msg) => {
							if (msg.content.length > 500 || msg.content.split('\n').length > 20) {
								spam.push({
									id: msg.id,
									content: msg.content.substring(0, 100),
									author: {
										id: msg.author.id,
										username: msg.author.username,
									},
									reason: 'Long message or many lines',
								});
							}
						});

						responseData = spam;
					} else if (operation === 'findDuplicates') {
						const messages = await channel.messages.fetch({ limit: 100 });
						const contentMap: any = {};
						const duplicates: any[] = [];

						messages.forEach((msg) => {
							const content = msg.content.trim();
							if (content) {
								if (contentMap[content]) {
									duplicates.push({
										id: msg.id,
										content,
										author: {
											id: msg.author.id,
											username: msg.author.username,
										},
										original: contentMap[content],
									});
								} else {
									contentMap[content] = {
										id: msg.id,
										author: {
											id: msg.author.id,
											username: msg.author.username,
										},
									};
								}
							}
						});

						responseData = duplicates;
					}
				} else if (resource === 'backup') {
					const guildId = this.getNodeParameter('guildId', i) as string;
					const channelId = this.getNodeParameter('channelId', i) as string;
					const channel = await client.channels.fetch(channelId);

					if (!channel || !channel.isTextBased()) {
						throw new NodeOperationError(this.getNode(), 'Channel not found or not text-based');
					}

					if (operation === 'exportMessages') {
						const messages = await channel.messages.fetch({ limit: 100 });

						responseData = {
							channelId,
							guildId,
							exportedAt: new Date().toISOString(),
							totalMessages: messages.size,
							messages: Array.from(messages.values()).map((msg) => ({
								id: msg.id,
								content: msg.content,
								author: {
									id: msg.author.id,
									username: msg.author.username,
								},
								createdTimestamp: msg.createdTimestamp,
								createdAt: new Date(msg.createdTimestamp).toISOString(),
								attachments: Array.from(msg.attachments.values()).map((att) => ({
									id: att.id,
									url: att.url,
									name: att.name,
								})),
							})),
						};
					}
				}

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData),
					{ itemData: { item: i } },
				);

				returnData.push(...executionData);
			} catch (error: any) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
						},
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		await client.destroy();

		return [returnData];
	}
}
