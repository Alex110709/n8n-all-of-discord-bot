import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import { Client, GatewayIntentBits, Partials } from 'discord.js';

export class DiscordAdvanced implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Discord Advanced',
		name: 'discordAdvanced',
		icon: 'file:discord.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Advanced Discord tools - Analytics, Moderation, Backup, and Automation',
		defaults: {
			name: 'Discord Advanced',
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
			categories: ['Communication', 'Data & Storage'],
			subcategories: {
				Communication: ['Messaging', 'Social Media'],
				'Data & Storage': ['Analytics', 'Backup'],
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
						name: 'Analytics',
						value: 'analytics',
						description: 'Advanced analytics and statistics',
					},
					{
						name: 'Moderation',
						value: 'moderation',
						description: 'Automated moderation tools',
					},
					{
						name: 'Backup',
						value: 'backup',
						description: 'Backup and export utilities',
					},
					{
						name: 'Automation',
						value: 'automation',
						description: 'Automation and bulk operations',
					},
					{
						name: 'Insights',
						value: 'insights',
						description: 'Server insights and reports',
					},
				],
				default: 'analytics',
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
						name: 'User Growth Tracking',
						value: 'userGrowth',
						description: 'Track server member growth over time',
						action: 'Track user growth',
					},
					{
						name: 'Channel Engagement Analysis',
						value: 'channelEngagement',
						description: 'Analyze engagement across channels',
						action: 'Analyze channel engagement',
					},
					{
						name: 'Top Contributors',
						value: 'topContributors',
						description: 'Find most active contributors',
						action: 'Get top contributors',
					},
					{
						name: 'Message Sentiment Analysis',
						value: 'sentimentAnalysis',
						description: 'Analyze message sentiment trends',
						action: 'Analyze sentiment',
					},
					{
						name: 'Emoji Usage Statistics',
						value: 'emojiStats',
						description: 'Track emoji and reaction usage',
						action: 'Get emoji statistics',
					},
					{
						name: 'Peak Activity Times',
						value: 'peakTimes',
						description: 'Identify peak activity hours',
						action: 'Get peak activity times',
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
					{
						name: 'Check User Warnings',
						value: 'checkWarnings',
						description: 'Check user warning history',
						action: 'Check warnings',
					},
					{
						name: 'Auto-Moderation Report',
						value: 'autoModReport',
						description: 'Generate auto-moderation report',
						action: 'Generate mod report',
					},
					{
						name: 'Scan for Links',
						value: 'scanLinks',
						description: 'Scan messages for URLs',
						action: 'Scan for links',
					},
					{
						name: 'Mass Mention Detection',
						value: 'detectMassMention',
						description: 'Detect messages with mass mentions',
						action: 'Detect mass mentions',
					},
					{
						name: 'Inactive Member Scan',
						value: 'inactiveScan',
						description: 'Find inactive members',
						action: 'Scan inactive members',
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
					{
						name: 'Export Server Structure',
						value: 'exportStructure',
						description: 'Export complete server structure',
						action: 'Export server structure',
					},
					{
						name: 'Export Member List',
						value: 'exportMembers',
						description: 'Export all member information',
						action: 'Export members',
					},
					{
						name: 'Export Role Configuration',
						value: 'exportRoles',
						description: 'Export all roles and permissions',
						action: 'Export roles',
					},
					{
						name: 'Export Emojis',
						value: 'exportEmojis',
						description: 'Export all custom emojis',
						action: 'Export emojis',
					},
					{
						name: 'Create Snapshot',
						value: 'createSnapshot',
						description: 'Create complete server snapshot',
						action: 'Create snapshot',
					},
				],
				default: 'exportMessages',
			},

			// Automation Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['automation'],
					},
				},
				options: [
					{
						name: 'Bulk Role Assignment',
						value: 'bulkRoleAssign',
						description: 'Assign roles to multiple users',
						action: 'Bulk assign roles',
					},
					{
						name: 'Mass DM Users',
						value: 'massDM',
						description: 'Send DM to multiple users',
						action: 'Mass DM users',
					},
					{
						name: 'Channel Clone',
						value: 'cloneChannel',
						description: 'Clone a channel with all settings',
						action: 'Clone channel',
					},
					{
						name: 'Bulk Nickname Update',
						value: 'bulkNickname',
						description: 'Update nicknames for multiple users',
						action: 'Bulk update nicknames',
					},
					{
						name: 'Auto-React Messages',
						value: 'autoReact',
						description: 'Auto-react to messages matching criteria',
						action: 'Auto-react',
					},
					{
						name: 'Scheduled Announcements',
						value: 'scheduledAnnounce',
						description: 'Schedule announcements',
						action: 'Schedule announcement',
					},
				],
				default: 'bulkRoleAssign',
			},

			// Insights Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['insights'],
					},
				},
				options: [
					{
						name: 'Server Health Report',
						value: 'healthReport',
						description: 'Generate comprehensive server health report',
						action: 'Generate health report',
					},
					{
						name: 'Retention Analysis',
						value: 'retentionAnalysis',
						description: 'Analyze member retention rates',
						action: 'Analyze retention',
					},
					{
						name: 'Content Breakdown',
						value: 'contentBreakdown',
						description: 'Analyze content types (text, images, links)',
						action: 'Analyze content',
					},
					{
						name: 'Voice Activity Report',
						value: 'voiceActivity',
						description: 'Analyze voice channel usage',
						action: 'Analyze voice activity',
					},
					{
						name: 'Invite Performance',
						value: 'invitePerformance',
						description: 'Track invite link performance',
						action: 'Track invites',
					},
					{
						name: 'Role Distribution',
						value: 'roleDistribution',
						description: 'Analyze role distribution',
						action: 'Analyze roles',
					},
				],
				default: 'healthReport',
			},

			// Common Fields
			{
				displayName: 'Guild ID',
				name: 'guildId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['analytics', 'moderation', 'backup', 'automation', 'insights'],
					},
				},
				default: '',
				description: 'The ID of the Discord server (guild)',
			},

			{
				displayName: 'Channel ID',
				name: 'channelId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['analytics', 'moderation', 'backup'],
						operation: [
							'messageHeatmap',
							'channelEngagement',
							'detectSpam',
							'findDuplicates',
							'scanLinks',
							'exportMessages',
							'cloneChannel',
						],
					},
				},
				default: '',
				description: 'The ID of the channel',
			},

			{
				displayName: 'Time Range (Days)',
				name: 'timeRange',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['analytics', 'moderation', 'insights'],
					},
				},
				default: 7,
				description: 'Number of days to analyze (1-30)',
			},

			{
				displayName: 'User IDs',
				name: 'userIds',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['automation'],
						operation: ['bulkRoleAssign', 'massDM', 'bulkNickname'],
					},
				},
				default: '',
				description: 'Comma-separated list of user IDs',
				placeholder: '123456789,987654321',
			},

			{
				displayName: 'Role ID',
				name: 'roleId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['automation'],
						operation: ['bulkRoleAssign'],
					},
				},
				default: '',
				description: 'Role ID to assign',
			},

			{
				displayName: 'Message Content',
				name: 'messageContent',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				displayOptions: {
					show: {
						resource: ['automation'],
						operation: ['massDM', 'scheduledAnnounce'],
					},
				},
				default: '',
				description: 'Message to send',
			},

			{
				displayName: 'Export Format',
				name: 'exportFormat',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['backup'],
					},
				},
				options: [
					{
						name: 'JSON',
						value: 'json',
					},
					{
						name: 'CSV',
						value: 'csv',
					},
					{
						name: 'HTML',
						value: 'html',
					},
				],
				default: 'json',
				description: 'Format for exported data',
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
						description: 'Whether to include bot activity',
					},
					{
						displayName: 'Minimum Messages',
						name: 'minMessages',
						type: 'number',
						default: 5,
						description: 'Minimum messages for analysis',
					},
					{
						displayName: 'Include Attachments',
						name: 'includeAttachments',
						type: 'boolean',
						default: true,
						description: 'Whether to include attachment data',
					},
					{
						displayName: 'Spam Threshold',
						name: 'spamThreshold',
						type: 'number',
						default: 5,
						description: 'Number of similar messages to flag as spam',
					},
					{
						displayName: 'Inactive Days',
						name: 'inactiveDays',
						type: 'number',
						default: 30,
						description: 'Days of inactivity to flag users',
					},
					{
						displayName: 'Max Limit',
						name: 'maxLimit',
						type: 'number',
						default: 1000,
						description: 'Maximum items to process',
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
				GatewayIntentBits.MessageContent,
				GatewayIntentBits.GuildVoiceStates,
				GatewayIntentBits.GuildInvites,
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
				const guildId = this.getNodeParameter('guildId', i) as string;

				let responseData: any;

				const guild = await client.guilds.fetch(guildId);

				if (resource === 'analytics') {
					const timeRange = this.getNodeParameter('timeRange', i, 7) as number;
					const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as any;

					if (operation === 'messageHeatmap') {
						const channelId = this.getNodeParameter('channelId', i) as string;
						const channel = await guild.channels.fetch(channelId);

						if (!channel || !channel.isTextBased()) {
							throw new NodeOperationError(this.getNode(), 'Channel not found or not text-based');
						}

						// Fetch messages from the last N days
						const messages = await channel.messages.fetch({ limit: 100 });
						const cutoffDate = Date.now() - timeRange * 24 * 60 * 60 * 1000;

						const heatmap: any = {};
						const hourly: any = {};
						const daily: any = {};

						messages.forEach((msg: any) => {
							if (msg.createdTimestamp < cutoffDate) return;
							if (!additionalOptions.includeBots && msg.author.bot) return;

							const date = new Date(msg.createdTimestamp);
							const hour = date.getHours();
							const day = date.toISOString().split('T')[0];
							const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });

							hourly[hour] = (hourly[hour] || 0) + 1;
							daily[day] = (daily[day] || 0) + 1;
							if (!heatmap[dayOfWeek]) heatmap[dayOfWeek] = {};
							heatmap[dayOfWeek][hour] = (heatmap[dayOfWeek][hour] || 0) + 1;
						});

						responseData = {
							channelId,
							timeRange,
							totalMessages: messages.size,
							heatmap,
							hourlyDistribution: hourly,
							dailyDistribution: daily,
							peakHour:
								Object.entries(hourly).sort(([, a]: any, [, b]: any) => b - a)[0]?.[0] || 'N/A',
							peakDay:
								Object.entries(daily).sort(([, a]: any, [, b]: any) => b - a)[0]?.[0] || 'N/A',
						};
					} else if (operation === 'topContributors') {
						const members = await guild.members.fetch();
						const channels = await guild.channels.fetch();

						const userStats: any = {};

						for (const [, channel] of channels) {
							if (!channel || !channel.isTextBased()) continue;

							try {
								const messages = await (channel as any).messages.fetch({ limit: 100 });

								messages.forEach((msg: any) => {
									if (!additionalOptions.includeBots && msg.author.bot) return;

									const userId = msg.author.id;
									if (!userStats[userId]) {
										userStats[userId] = {
											userId,
											username: msg.author.username,
											messageCount: 0,
											channels: new Set(),
										};
									}
									userStats[userId].messageCount++;
									userStats[userId].channels.add(channel.name);
								});
							} catch (error) {
								// Skip channels we can't access
								continue;
							}
						}

						const topUsers = Object.values(userStats)
							.map((user: any) => ({
								...user,
								channelCount: user.channels.size,
								channels: Array.from(user.channels),
							}))
							.sort((a: any, b: any) => b.messageCount - a.messageCount)
							.slice(0, 10);

						responseData = {
							guildId,
							timeRange,
							topContributors: topUsers,
							totalAnalyzed: Object.keys(userStats).length,
						};
					} else if (operation === 'channelEngagement') {
						const channels = await guild.channels.fetch();
						const channelStats: any = [];

						for (const [, channel] of channels) {
							if (!channel || !channel.isTextBased()) continue;

							try {
								const messages = await (channel as any).messages.fetch({ limit: 100 });
								const uniqueUsers = new Set();
								let reactionCount = 0;

								messages.forEach((msg: any) => {
									uniqueUsers.add(msg.author.id);
									reactionCount += msg.reactions.cache.size;
								});

								channelStats.push({
									channelId: channel.id,
									channelName: channel.name,
									messageCount: messages.size,
									uniqueUsers: uniqueUsers.size,
									reactionCount,
									engagementScore: (messages.size + reactionCount + uniqueUsers.size * 2) / 4,
								});
							} catch (error) {
								continue;
							}
						}

						channelStats.sort((a: any, b: any) => b.engagementScore - a.engagementScore);

						responseData = {
							guildId,
							totalChannels: channelStats.length,
							channels: channelStats,
							mostEngaged: channelStats[0],
							leastEngaged: channelStats[channelStats.length - 1],
						};
					} else if (operation === 'peakTimes') {
						const channels = await guild.channels.fetch();
						const timeStats: any = { hourly: {}, daily: {} };

						for (const [, channel] of channels) {
							if (!channel || !channel.isTextBased()) continue;

							try {
								const messages = await (channel as any).messages.fetch({ limit: 100 });

								messages.forEach((msg: any) => {
									if (!additionalOptions.includeBots && msg.author.bot) return;

									const date = new Date(msg.createdTimestamp);
									const hour = date.getHours();
									const dayOfWeek = date.getDay();

									timeStats.hourly[hour] = (timeStats.hourly[hour] || 0) + 1;
									timeStats.daily[dayOfWeek] = (timeStats.daily[dayOfWeek] || 0) + 1;
								});
							} catch (error) {
								continue;
							}
						}

						const dayNames = [
							'Sunday',
							'Monday',
							'Tuesday',
							'Wednesday',
							'Thursday',
							'Friday',
							'Saturday',
						];
						const peakHour = Object.entries(timeStats.hourly).sort(
							([, a]: any, [, b]: any) => b - a,
						)[0];
						const peakDay = Object.entries(timeStats.daily).sort(
							([, a]: any, [, b]: any) => b - a,
						)[0];

						responseData = {
							guildId,
							peakHour: peakHour ? `${peakHour[0]}:00 (${peakHour[1]} messages)` : 'N/A',
							peakDay: peakDay
								? `${dayNames[parseInt(peakDay[0])]} (${peakDay[1]} messages)`
								: 'N/A',
							hourlyDistribution: timeStats.hourly,
							dailyDistribution: Object.fromEntries(
								Object.entries(timeStats.daily).map(([day, count]) => [
									dayNames[parseInt(day)],
									count,
								]),
							),
						};
					}
				} else if (resource === 'moderation') {
					const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as any;
					const spamThreshold = additionalOptions.spamThreshold || 5;

					if (operation === 'detectSpam') {
						const channelId = this.getNodeParameter('channelId', i) as string;
						const channel = await guild.channels.fetch(channelId);

						if (!channel || !channel.isTextBased()) {
							throw new NodeOperationError(this.getNode(), 'Channel not found or not text-based');
						}

						const messages = await channel.messages.fetch({ limit: 100 });
						const messageGroups: any = {};
						const spamMessages: any = [];

						messages.forEach((msg: any) => {
							const content = msg.content.toLowerCase().trim();
							if (!content) return;

							if (!messageGroups[content]) {
								messageGroups[content] = [];
							}
							messageGroups[content].push({
								id: msg.id,
								author: msg.author.username,
								authorId: msg.author.id,
								timestamp: msg.createdTimestamp,
							});
						});

						Object.entries(messageGroups).forEach(([content, msgs]: any) => {
							if (msgs.length >= spamThreshold) {
								spamMessages.push({
									content,
									count: msgs.length,
									messages: msgs,
									authors: [...new Set(msgs.map((m: any) => m.author))],
								});
							}
						});

						responseData = {
							channelId,
							totalMessages: messages.size,
							spamGroups: spamMessages.length,
							spamMessages: spamMessages.sort((a: any, b: any) => b.count - a.count),
							threshold: spamThreshold,
						};
					} else if (operation === 'findDuplicates') {
						const channelId = this.getNodeParameter('channelId', i) as string;
						const channel = await guild.channels.fetch(channelId);

						if (!channel || !channel.isTextBased()) {
							throw new NodeOperationError(this.getNode(), 'Channel not found or not text-based');
						}

						const messages = await channel.messages.fetch({ limit: 100 });
						const duplicates: any = [];
						const seen = new Map();

						messages.forEach((msg: any) => {
							const content = msg.content.trim();
							if (!content) return;

							if (seen.has(content)) {
								const existing = seen.get(content);
								duplicates.push({
									original: existing,
									duplicate: {
										id: msg.id,
										author: msg.author.username,
										authorId: msg.author.id,
										timestamp: msg.createdTimestamp,
									},
									content,
								});
							} else {
								seen.set(content, {
									id: msg.id,
									author: msg.author.username,
									authorId: msg.author.id,
									timestamp: msg.createdTimestamp,
								});
							}
						});

						responseData = {
							channelId,
							totalMessages: messages.size,
							duplicateCount: duplicates.length,
							duplicates,
						};
					} else if (operation === 'scanLinks') {
						const channelId = this.getNodeParameter('channelId', i) as string;
						const channel = await guild.channels.fetch(channelId);

						if (!channel || !channel.isTextBased()) {
							throw new NodeOperationError(this.getNode(), 'Channel not found or not text-based');
						}

						const messages = await channel.messages.fetch({ limit: 100 });
						const urlRegex = /(https?:\/\/[^\s]+)/g;
						const linksFound: any = [];

						messages.forEach((msg: any) => {
							const urls = msg.content.match(urlRegex);
							if (urls) {
								linksFound.push({
									messageId: msg.id,
									author: msg.author.username,
									authorId: msg.author.id,
									links: urls,
									linkCount: urls.length,
									timestamp: msg.createdTimestamp,
								});
							}
						});

						const allUrls = linksFound.flatMap((m: any) => m.links);
						const uniqueDomains = [
							...new Set(
								allUrls.map((url: string) => {
									try {
										return new URL(url).hostname;
									} catch {
										return 'invalid';
									}
								}),
							),
						];

						responseData = {
							channelId,
							totalMessages: messages.size,
							messagesWithLinks: linksFound.length,
							totalLinks: allUrls.length,
							uniqueDomains: uniqueDomains.length,
							domains: uniqueDomains,
							messages: linksFound,
						};
					} else if (operation === 'detectMassMention') {
						const channelId = this.getNodeParameter('channelId', i) as string;
						const channel = await guild.channels.fetch(channelId);

						if (!channel || !channel.isTextBased()) {
							throw new NodeOperationError(this.getNode(), 'Channel not found or not text-based');
						}

						const messages = await channel.messages.fetch({ limit: 100 });
						const massMentions: any = [];

						messages.forEach((msg: any) => {
							const mentionCount = msg.mentions.users.size + msg.mentions.roles.size;
							if (mentionCount >= 3) {
								massMentions.push({
									messageId: msg.id,
									author: msg.author.username,
									authorId: msg.author.id,
									content: msg.content.substring(0, 100),
									userMentions: msg.mentions.users.size,
									roleMentions: msg.mentions.roles.size,
									totalMentions: mentionCount,
									mentionsEveryone: msg.mentionEveryone,
									timestamp: msg.createdTimestamp,
								});
							}
						});

						responseData = {
							channelId,
							totalMessages: messages.size,
							massMentionCount: massMentions.length,
							messages: massMentions.sort((a: any, b: any) => b.totalMentions - a.totalMentions),
						};
					} else if (operation === 'inactiveScan') {
						const inactiveDays = additionalOptions.inactiveDays || 30;
						const members = await guild.members.fetch();
						const cutoffDate = Date.now() - inactiveDays * 24 * 60 * 60 * 1000;
						const inactiveMembers: any = [];

						members.forEach((member: any) => {
							if (member.user.bot && !additionalOptions.includeBots) return;

							// Check if member has any recent activity
							const joinedRecently = member.joinedTimestamp > cutoffDate;
							if (!joinedRecently) {
								inactiveMembers.push({
									userId: member.id,
									username: member.user.username,
									nickname: member.nickname,
									joinedAt: member.joinedTimestamp,
									daysSinceJoin: Math.floor(
										(Date.now() - member.joinedTimestamp) / (24 * 60 * 60 * 1000),
									),
									roles: member.roles.cache.map((r: any) => r.name),
								});
							}
						});

						responseData = {
							guildId,
							inactiveDays,
							totalMembers: members.size,
							inactiveCount: inactiveMembers.length,
							inactiveMembers: inactiveMembers.slice(0, additionalOptions.maxLimit || 1000),
						};
					}
				} else if (resource === 'backup') {
					const exportFormat = this.getNodeParameter('exportFormat', i) as string;

					if (operation === 'exportMessages') {
						const channelId = this.getNodeParameter('channelId', i) as string;
						const channel = await guild.channels.fetch(channelId);

						if (!channel || !channel.isTextBased()) {
							throw new NodeOperationError(this.getNode(), 'Channel not found or not text-based');
						}

						const messages = await channel.messages.fetch({ limit: 100 });
						const exportData = Array.from(messages.values()).map((msg: any) => ({
							id: msg.id,
							author: msg.author.username,
							authorId: msg.author.id,
							content: msg.content,
							timestamp: new Date(msg.createdTimestamp).toISOString(),
							attachments: Array.from(msg.attachments.values()).map((att: any) => ({
								name: att.name,
								url: att.url,
								type: att.contentType,
							})),
							embeds: msg.embeds.length,
							reactions: msg.reactions.cache.size,
						}));

						responseData = {
							channelId,
							channelName: channel.name,
							exportFormat,
							messageCount: exportData.length,
							exportedAt: new Date().toISOString(),
							messages: exportData,
						};
					} else if (operation === 'exportStructure') {
						const channels = await guild.channels.fetch();
						const roles = await guild.roles.fetch();

						const structure = {
							guildId: guild.id,
							guildName: guild.name,
							exportedAt: new Date().toISOString(),
							channels: Array.from(channels.values()).map((ch: any) => ({
								id: ch?.id,
								name: ch?.name,
								type: ch?.type,
								position: ch?.position || 0,
								parentId: ch?.parentId,
							})),
							roles: Array.from(roles.values()).map((role: any) => ({
								id: role.id,
								name: role.name,
								color: role.color,
								position: role.position,
								permissions: role.permissions.toArray(),
							})),
						};

						responseData = structure;
					} else if (operation === 'exportMembers') {
						const members = await guild.members.fetch();

						const memberData = Array.from(members.values()).map((member: any) => ({
							userId: member.id,
							username: member.user.username,
							discriminator: member.user.discriminator,
							nickname: member.nickname,
							joinedAt: new Date(member.joinedTimestamp).toISOString(),
							roles: member.roles.cache.map((r: any) => r.name),
							isBot: member.user.bot,
						}));

						responseData = {
							guildId: guild.id,
							guildName: guild.name,
							exportFormat,
							memberCount: memberData.length,
							exportedAt: new Date().toISOString(),
							members: memberData,
						};
					} else if (operation === 'createSnapshot') {
						const channels = await guild.channels.fetch();
						const roles = await guild.roles.fetch();
						const members = await guild.members.fetch();

						const snapshot = {
							guildId: guild.id,
							guildName: guild.name,
							description: guild.description,
							memberCount: guild.memberCount,
							createdAt: guild.createdAt.toISOString(),
							snapshotAt: new Date().toISOString(),
							channels: {
								total: channels.size,
								list: Array.from(channels.values()).map((ch: any) => ({
									id: ch?.id,
									name: ch?.name,
									type: ch?.type,
								})),
							},
							roles: {
								total: roles.size,
								list: Array.from(roles.values()).map((r: any) => ({
									id: r.id,
									name: r.name,
									color: r.color,
								})),
							},
							members: {
								total: members.size,
								bots: members.filter((m: any) => m.user.bot).size,
								humans: members.filter((m: any) => !m.user.bot).size,
							},
						};

						responseData = snapshot;
					}
				} else if (resource === 'automation') {
					if (operation === 'bulkRoleAssign') {
						const userIds = this.getNodeParameter('userIds', i) as string;
						const roleId = this.getNodeParameter('roleId', i) as string;
						const ids = userIds.split(',').map((id) => id.trim());

						const results: any = [];

						for (const userId of ids) {
							try {
								const member = await guild.members.fetch(userId);
								await member.roles.add(roleId);
								results.push({
									userId,
									username: member.user.username,
									success: true,
								});
							} catch (error: any) {
								results.push({
									userId,
									success: false,
									error: error.message,
								});
							}
						}

						responseData = {
							guildId,
							roleId,
							totalUsers: ids.length,
							successful: results.filter((r: any) => r.success).length,
							failed: results.filter((r: any) => !r.success).length,
							results,
						};
					} else if (operation === 'massDM') {
						const userIds = this.getNodeParameter('userIds', i) as string;
						const messageContent = this.getNodeParameter('messageContent', i) as string;
						const ids = userIds.split(',').map((id) => id.trim());

						const results: any = [];

						for (const userId of ids) {
							try {
								const user = await client.users.fetch(userId);
								const dmChannel = await user.createDM();
								await dmChannel.send(messageContent);
								results.push({
									userId,
									username: user.username,
									success: true,
								});
							} catch (error: any) {
								results.push({
									userId,
									success: false,
									error: error.message,
								});
							}
						}

						responseData = {
							totalUsers: ids.length,
							successful: results.filter((r: any) => r.success).length,
							failed: results.filter((r: any) => !r.success).length,
							results,
						};
					}
				} else if (resource === 'insights') {
					if (operation === 'healthReport') {
						const members = await guild.members.fetch();
						const channels = await guild.channels.fetch();
						const roles = await guild.roles.fetch();

						const onlineMembers = members.filter(
							(m: any) => m.presence?.status && m.presence.status !== 'offline',
						).size;
						const bots = members.filter((m: any) => m.user.bot).size;
						const textChannels = channels.filter((c: any) => c?.type === 0).size;
						const voiceChannels = channels.filter((c: any) => c?.type === 2).size;

						const healthReport = {
							guildId: guild.id,
							guildName: guild.name,
							reportDate: new Date().toISOString(),
							members: {
								total: guild.memberCount,
								online: onlineMembers,
								bots,
								humans: guild.memberCount - bots,
								onlinePercentage: ((onlineMembers / guild.memberCount) * 100).toFixed(2) + '%',
							},
							channels: {
								total: channels.size,
								text: textChannels,
								voice: voiceChannels,
								categories: channels.filter((c: any) => c?.type === 4).size,
							},
							roles: {
								total: roles.size,
								withMembers: roles.filter((r: any) => r.members.size > 0).size,
							},
							serverAge: {
								days: Math.floor((Date.now() - guild.createdTimestamp) / (24 * 60 * 60 * 1000)),
								created: guild.createdAt.toISOString(),
							},
							verificationLevel: guild.verificationLevel,
							premiumTier: guild.premiumTier,
							boostCount: guild.premiumSubscriptionCount || 0,
						};

						responseData = healthReport;
					} else if (operation === 'roleDistribution') {
						const roles = await guild.roles.fetch();
						const totalMembers = guild.memberCount;

						const roleStats = Array.from(roles.values())
							.map((role: any) => ({
								roleId: role.id,
								roleName: role.name,
								color: role.color,
								memberCount: role.members.size,
								percentage: ((role.members.size / totalMembers) * 100).toFixed(2) + '%',
								position: role.position,
							}))
							.sort((a, b) => b.memberCount - a.memberCount);

						responseData = {
							guildId: guild.id,
							totalRoles: roles.size,
							totalMembers,
							roles: roleStats,
							mostPopular: roleStats[0],
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
