import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import { Client, GatewayIntentBits, ChannelType, PermissionFlagsBits } from 'discord.js';

export class Discord implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Discord',
		name: 'discord',
		icon: 'file:discord.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Discord API - Full Bot Features',
		defaults: {
			name: 'Discord',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'discordApi',
				required: true,
			},
		],
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
						name: 'Channel',
						value: 'channel',
					},
					{
						name: 'Guild (Server)',
						value: 'guild',
					},
					{
						name: 'Member',
						value: 'member',
					},
					{
						name: 'Role',
						value: 'role',
					},
					{
						name: 'DM',
						value: 'dm',
					},
					{
						name: 'Webhook',
						value: 'webhook',
					},
					{
						name: 'Invite',
						value: 'invite',
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
						description: 'Edit a message',
						action: 'Edit a message',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a message',
						action: 'Delete a message',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a message',
						action: 'Get a message',
					},
					{
						name: 'React',
						value: 'react',
						description: 'Add reaction to a message',
						action: 'React to a message',
					},
					{
						name: 'Pin',
						value: 'pin',
						description: 'Pin a message',
						action: 'Pin a message',
					},
					{
						name: 'Unpin',
						value: 'unpin',
						description: 'Unpin a message',
						action: 'Unpin a message',
					},
				],
				default: 'send',
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
						name: 'Create',
						value: 'create',
						description: 'Create a channel',
						action: 'Create a channel',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a channel',
						action: 'Delete a channel',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get channel information',
						action: 'Get a channel',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update channel settings',
						action: 'Update a channel',
					},
					{
						name: 'List',
						value: 'list',
						description: 'List all channels in a guild',
						action: 'List channels',
					},
				],
				default: 'create',
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
						name: 'Get',
						value: 'get',
						description: 'Get guild information',
						action: 'Get guild info',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update guild settings',
						action: 'Update guild',
					},
					{
						name: 'List Bans',
						value: 'listBans',
						description: 'List banned users',
						action: 'List guild bans',
					},
					{
						name: 'Ban Member',
						value: 'banMember',
						description: 'Ban a member',
						action: 'Ban a member',
					},
					{
						name: 'Unban Member',
						value: 'unbanMember',
						description: 'Unban a member',
						action: 'Unban a member',
					},
				],
				default: 'get',
			},

			// Member Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['member'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get member information',
						action: 'Get a member',
					},
					{
						name: 'Kick',
						value: 'kick',
						description: 'Kick a member',
						action: 'Kick a member',
					},
					{
						name: 'List',
						value: 'list',
						description: 'List guild members',
						action: 'List members',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update member settings',
						action: 'Update a member',
					},
					{
						name: 'Add Role',
						value: 'addRole',
						description: 'Add role to member',
						action: 'Add role to member',
					},
					{
						name: 'Remove Role',
						value: 'removeRole',
						description: 'Remove role from member',
						action: 'Remove role from member',
					},
				],
				default: 'get',
			},

			// Role Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['role'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a role',
						action: 'Create a role',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a role',
						action: 'Delete a role',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get role information',
						action: 'Get a role',
					},
					{
						name: 'List',
						value: 'list',
						description: 'List all roles',
						action: 'List roles',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a role',
						action: 'Update a role',
					},
				],
				default: 'create',
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
						name: 'Send',
						value: 'send',
						description: 'Send a DM to a user',
						action: 'Send a DM',
					},
				],
				default: 'send',
			},

			// Webhook Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['webhook'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a webhook',
						action: 'Create a webhook',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a webhook',
						action: 'Delete a webhook',
					},
					{
						name: 'Send',
						value: 'send',
						description: 'Send a message via webhook',
						action: 'Send via webhook',
					},
				],
				default: 'create',
			},

			// Invite Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['invite'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create an invite',
						action: 'Create an invite',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete an invite',
						action: 'Delete an invite',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get invite information',
						action: 'Get an invite',
					},
					{
						name: 'List',
						value: 'list',
						description: 'List channel invites',
						action: 'List invites',
					},
				],
				default: 'create',
			},

			// Common Fields
			{
				displayName: 'Guild ID',
				name: 'guildId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['channel', 'guild', 'member', 'role', 'invite'],
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
						resource: ['message'],
					},
				},
				default: '',
				description: 'The ID of the channel',
			},

			// Message Fields
			{
				displayName: 'Message Content',
				name: 'content',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['message', 'dm'],
						operation: ['send'],
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
						operation: ['edit', 'delete', 'get', 'react', 'pin', 'unpin'],
					},
				},
				default: '',
				description: 'The ID of the message',
			},

			{
				displayName: 'User ID',
				name: 'userId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['dm', 'member'],
					},
				},
				default: '',
				description: 'The ID of the user',
			},

			// Channel Fields
			{
				displayName: 'Channel Name',
				name: 'channelName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['channel'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'Name of the channel to create',
			},

			{
				displayName: 'Channel Type',
				name: 'channelType',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['channel'],
						operation: ['create'],
					},
				},
				options: [
					{
						name: 'Text',
						value: 'text',
					},
					{
						name: 'Voice',
						value: 'voice',
					},
					{
						name: 'Category',
						value: 'category',
					},
					{
						name: 'Announcement',
						value: 'announcement',
					},
					{
						name: 'Stage',
						value: 'stage',
					},
					{
						name: 'Forum',
						value: 'forum',
					},
				],
				default: 'text',
				description: 'Type of channel to create',
			},

			// Role Fields
			{
				displayName: 'Role Name',
				name: 'roleName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['role'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'Name of the role',
			},

			{
				displayName: 'Role ID',
				name: 'roleId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['role', 'member'],
						operation: ['delete', 'get', 'update', 'addRole', 'removeRole'],
					},
				},
				default: '',
				description: 'The ID of the role',
			},

			{
				displayName: 'Color',
				name: 'color',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['role'],
						operation: ['create', 'update'],
					},
				},
				default: '#000000',
				description: 'Role color in hex format',
			},

			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				options: [
					{
						displayName: 'Embed',
						name: 'embed',
						type: 'json',
						default: '{}',
						description: 'Discord embed object (JSON)',
					},
					{
						displayName: 'TTS',
						name: 'tts',
						type: 'boolean',
						default: false,
						description: 'Whether the message should be spoken via text-to-speech',
					},
					{
						displayName: 'Reason',
						name: 'reason',
						type: 'string',
						default: '',
						description: 'Reason for the action (appears in audit log)',
					},
					{
						displayName: 'Delete Message Days',
						name: 'deleteMessageDays',
						type: 'number',
						default: 0,
						description: 'Number of days of messages to delete when banning (0-7)',
					},
					{
						displayName: 'Permissions',
						name: 'permissions',
						type: 'string',
						default: '',
						description: 'Permission bit string',
					},
					{
						displayName: 'Hoisted',
						name: 'hoist',
						type: 'boolean',
						default: false,
						description: 'Whether the role should be displayed separately',
					},
					{
						displayName: 'Mentionable',
						name: 'mentionable',
						type: 'boolean',
						default: false,
						description: 'Whether the role can be mentioned',
					},
					{
						displayName: 'Topic',
						name: 'topic',
						type: 'string',
						default: '',
						description: 'Channel topic',
					},
					{
						displayName: 'NSFW',
						name: 'nsfw',
						type: 'boolean',
						default: false,
						description: 'Whether the channel is NSFW',
					},
					{
						displayName: 'Bitrate',
						name: 'bitrate',
						type: 'number',
						default: 64000,
						description: 'Bitrate for voice channel',
					},
					{
						displayName: 'User Limit',
						name: 'userLimit',
						type: 'number',
						default: 0,
						description: 'User limit for voice channel (0 = unlimited)',
					},
					{
						displayName: 'Max Age',
						name: 'maxAge',
						type: 'number',
						default: 86400,
						description: 'Duration of invite in seconds (0 = forever)',
					},
					{
						displayName: 'Max Uses',
						name: 'maxUses',
						type: 'number',
						default: 0,
						description: 'Max number of invite uses (0 = unlimited)',
					},
					{
						displayName: 'Temporary',
						name: 'temporary',
						type: 'boolean',
						default: false,
						description: 'Whether invite grants temporary membership',
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
				GatewayIntentBits.DirectMessages,
				GatewayIntentBits.MessageContent,
			],
		});

		await client.login(botToken);

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
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;

						const messageOptions: any = { content };

						if (additionalFields.tts) {
							messageOptions.tts = additionalFields.tts;
						}

						if (additionalFields.embed) {
							try {
								messageOptions.embeds = [JSON.parse(additionalFields.embed)];
							} catch (error) {
								throw new NodeOperationError(this.getNode(), 'Invalid embed JSON');
							}
						}

						const message = await (channel as any).send(messageOptions);
						responseData = {
							id: message.id,
							content: message.content,
							channelId: message.channelId,
							createdTimestamp: message.createdTimestamp,
						};
					} else if (operation === 'edit') {
						const messageId = this.getNodeParameter('messageId', i) as string;
						const content = this.getNodeParameter('content', i) as string;

						const message = await channel.messages.fetch(messageId);
						const editedMessage = await message.edit(content);

						responseData = {
							id: editedMessage.id,
							content: editedMessage.content,
							editedTimestamp: editedMessage.editedTimestamp,
						};
					} else if (operation === 'delete') {
						const messageId = this.getNodeParameter('messageId', i) as string;
						const message = await channel.messages.fetch(messageId);
						await message.delete();

						responseData = { success: true, messageId };
					} else if (operation === 'get') {
						const messageId = this.getNodeParameter('messageId', i) as string;
						const message = await channel.messages.fetch(messageId);

						responseData = {
							id: message.id,
							content: message.content,
							author: {
								id: message.author.id,
								username: message.author.username,
								bot: message.author.bot,
							},
							channelId: message.channelId,
							createdTimestamp: message.createdTimestamp,
							editedTimestamp: message.editedTimestamp,
						};
					} else if (operation === 'react') {
						const messageId = this.getNodeParameter('messageId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;
						const emoji = additionalFields.emoji || '👍';

						const message = await channel.messages.fetch(messageId);
						await message.react(emoji);

						responseData = { success: true, messageId, emoji };
					} else if (operation === 'pin') {
						const messageId = this.getNodeParameter('messageId', i) as string;
						const message = await channel.messages.fetch(messageId);
						await message.pin();

						responseData = { success: true, messageId, pinned: true };
					} else if (operation === 'unpin') {
						const messageId = this.getNodeParameter('messageId', i) as string;
						const message = await channel.messages.fetch(messageId);
						await message.unpin();

						responseData = { success: true, messageId, pinned: false };
					}
				} else if (resource === 'channel') {
					const guildId = this.getNodeParameter('guildId', i) as string;
					const guild = await client.guilds.fetch(guildId);

					if (operation === 'create') {
						const channelName = this.getNodeParameter('channelName', i) as string;
						const channelType = this.getNodeParameter('channelType', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;

						const channelTypeMap: any = {
							text: ChannelType.GuildText,
							voice: ChannelType.GuildVoice,
							category: ChannelType.GuildCategory,
							announcement: ChannelType.GuildAnnouncement,
							stage: ChannelType.GuildStageVoice,
							forum: ChannelType.GuildForum,
						};

						const options: any = {
							name: channelName,
							type: channelTypeMap[channelType],
						};

						if (additionalFields.topic) options.topic = additionalFields.topic;
						if (additionalFields.nsfw) options.nsfw = additionalFields.nsfw;
						if (additionalFields.bitrate) options.bitrate = additionalFields.bitrate;
						if (additionalFields.userLimit) options.userLimit = additionalFields.userLimit;
						if (additionalFields.reason) options.reason = additionalFields.reason;

						const channel = await guild.channels.create(options);

						responseData = {
							id: channel.id,
							name: channel.name,
							type: channel.type,
						};
					} else if (operation === 'delete') {
						const channelId = this.getNodeParameter('channelId', i) as string;
						const channel = await guild.channels.fetch(channelId);

						if (!channel) {
							throw new NodeOperationError(this.getNode(), 'Channel not found');
						}

						await channel.delete();
						responseData = { success: true, channelId };
					} else if (operation === 'get') {
						const channelId = this.getNodeParameter('channelId', i) as string;
						const channel = await guild.channels.fetch(channelId);

						if (!channel) {
							throw new NodeOperationError(this.getNode(), 'Channel not found');
						}

						responseData = {
							id: channel.id,
							name: channel.name,
							type: channel.type,
							position: (channel as any).position,
						};
					} else if (operation === 'list') {
						const channels = await guild.channels.fetch();

						responseData = channels.map((channel) => ({
							id: channel?.id,
							name: channel?.name,
							type: channel?.type,
						}));
					}
				} else if (resource === 'guild') {
					const guildId = this.getNodeParameter('guildId', i) as string;
					const guild = await client.guilds.fetch(guildId);

					if (operation === 'get') {
						responseData = {
							id: guild.id,
							name: guild.name,
							description: guild.description,
							memberCount: guild.memberCount,
							ownerId: guild.ownerId,
							createdTimestamp: guild.createdTimestamp,
						};
					} else if (operation === 'banMember') {
						const userId = this.getNodeParameter('userId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;

						const options: any = {};
						if (additionalFields.reason) options.reason = additionalFields.reason;
						if (additionalFields.deleteMessageDays) {
							options.deleteMessageDays = additionalFields.deleteMessageDays;
						}

						await guild.members.ban(userId, options);
						responseData = { success: true, userId, banned: true };
					} else if (operation === 'unbanMember') {
						const userId = this.getNodeParameter('userId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;

						await guild.members.unban(userId, additionalFields.reason);
						responseData = { success: true, userId, banned: false };
					} else if (operation === 'listBans') {
						const bans = await guild.bans.fetch();

						responseData = Array.from(bans.values()).map((ban) => ({
							userId: ban.user.id,
							username: ban.user.username,
							reason: ban.reason,
						}));
					}
				} else if (resource === 'member') {
					const guildId = this.getNodeParameter('guildId', i) as string;
					const userId = this.getNodeParameter('userId', i) as string;
					const guild = await client.guilds.fetch(guildId);

					if (operation === 'get') {
						const member = await guild.members.fetch(userId);

						responseData = {
							id: member.id,
							username: member.user.username,
							nickname: member.nickname,
							joinedTimestamp: member.joinedTimestamp,
							roles: member.roles.cache.map((role) => ({
								id: role.id,
								name: role.name,
							})),
						};
					} else if (operation === 'kick') {
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;
						const member = await guild.members.fetch(userId);

						await member.kick(additionalFields.reason);
						responseData = { success: true, userId, kicked: true };
					} else if (operation === 'list') {
						const members = await guild.members.fetch();

						responseData = Array.from(members.values()).map((member) => ({
							id: member.id,
							username: member.user.username,
							nickname: member.nickname,
						}));
					} else if (operation === 'addRole') {
						const roleId = this.getNodeParameter('roleId', i) as string;
						const member = await guild.members.fetch(userId);

						await member.roles.add(roleId);
						responseData = { success: true, userId, roleId, added: true };
					} else if (operation === 'removeRole') {
						const roleId = this.getNodeParameter('roleId', i) as string;
						const member = await guild.members.fetch(userId);

						await member.roles.remove(roleId);
						responseData = { success: true, userId, roleId, removed: true };
					}
				} else if (resource === 'role') {
					const guildId = this.getNodeParameter('guildId', i) as string;
					const guild = await client.guilds.fetch(guildId);

					if (operation === 'create') {
						const roleName = this.getNodeParameter('roleName', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;

						const options: any = { name: roleName };
						if (additionalFields.color) {
							options.color = additionalFields.color;
						}
						if (additionalFields.hoist !== undefined) {
							options.hoist = additionalFields.hoist;
						}
						if (additionalFields.mentionable !== undefined) {
							options.mentionable = additionalFields.mentionable;
						}
						if (additionalFields.permissions) {
							options.permissions = additionalFields.permissions;
						}
						if (additionalFields.reason) {
							options.reason = additionalFields.reason;
						}

						const role = await guild.roles.create(options);

						responseData = {
							id: role.id,
							name: role.name,
							color: role.color,
							position: role.position,
						};
					} else if (operation === 'delete') {
						const roleId = this.getNodeParameter('roleId', i) as string;
						const role = await guild.roles.fetch(roleId);

						if (!role) {
							throw new NodeOperationError(this.getNode(), 'Role not found');
						}

						await role.delete();
						responseData = { success: true, roleId };
					} else if (operation === 'list') {
						const roles = await guild.roles.fetch();

						responseData = Array.from(roles.values()).map((role) => ({
							id: role.id,
							name: role.name,
							color: role.color,
							position: role.position,
						}));
					}
				} else if (resource === 'dm') {
					const userId = this.getNodeParameter('userId', i) as string;
					const content = this.getNodeParameter('content', i) as string;

					const user = await client.users.fetch(userId);
					const dmChannel = await user.createDM();
					const message = (await dmChannel.send(content)) as any;

					responseData = {
						id: message.id,
						content: message.content,
						userId: user.id,
						username: user.username,
					};
				} else if (resource === 'webhook') {
					const guildId = this.getNodeParameter('guildId', i) as string;
					const guild = await client.guilds.fetch(guildId);

					if (operation === 'create') {
						const channelId = this.getNodeParameter('channelId', i) as string;
						const channel = await guild.channels.fetch(channelId);

						if (!channel || !('createWebhook' in channel)) {
							throw new NodeOperationError(this.getNode(), 'Invalid channel for webhook');
						}

						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;
						const webhook = await (channel as any).createWebhook({
							name: additionalFields.webhookName || 'n8n-webhook',
							reason: additionalFields.reason,
						});

						responseData = {
							id: webhook.id,
							name: webhook.name,
							url: webhook.url,
							token: webhook.token,
						};
					}
				} else if (resource === 'invite') {
					const guildId = this.getNodeParameter('guildId', i) as string;
					const guild = await client.guilds.fetch(guildId);

					if (operation === 'create') {
						const channelId = this.getNodeParameter('channelId', i) as string;
						const channel = await guild.channels.fetch(channelId);

						if (!channel || !('createInvite' in channel)) {
							throw new NodeOperationError(this.getNode(), 'Invalid channel for invite');
						}

						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;

						const options: any = {};
						if (additionalFields.maxAge) options.maxAge = additionalFields.maxAge;
						if (additionalFields.maxUses) options.maxUses = additionalFields.maxUses;
						if (additionalFields.temporary !== undefined) {
							options.temporary = additionalFields.temporary;
						}
						if (additionalFields.reason) options.reason = additionalFields.reason;

						const invite = await (channel as any).createInvite(options);

						responseData = {
							code: invite.code,
							url: invite.url,
							maxAge: invite.maxAge,
							maxUses: invite.maxUses,
							temporary: invite.temporary,
						};
					} else if (operation === 'list') {
						const invites = await guild.invites.fetch();

						responseData = Array.from(invites.values()).map((invite) => ({
							code: invite.code,
							url: invite.url,
							uses: invite.uses,
							maxUses: invite.maxUses,
							inviter: invite.inviter?.username,
						}));
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
