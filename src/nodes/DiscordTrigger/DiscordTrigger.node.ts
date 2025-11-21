import {
	ITriggerFunctions,
	INodeType,
	INodeTypeDescription,
	ITriggerResponse,
	IDataObject,
} from 'n8n-workflow';

import { Client, GatewayIntentBits, Events, Partials } from 'discord.js';

export class DiscordTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Discord Trigger',
		name: 'discordTrigger',
		icon: 'file:discord.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description: 'Listen to Discord events',
		defaults: {
			name: 'Discord Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'discordApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				options: [
					{
						name: 'Message Created',
						value: 'messageCreate',
						description: 'Triggered when a message is created',
					},
					{
						name: 'DM Received',
						value: 'dmReceived',
						description: 'Triggered when a DM is received',
					},
					{
						name: 'Bot Mentioned',
						value: 'botMentioned',
						description: 'Triggered when the bot is mentioned',
					},
					{
						name: 'User Mentioned',
						value: 'userMentioned',
						description: 'Triggered when specific user(s) are mentioned',
					},
					{
						name: 'Role Mentioned',
						value: 'roleMentioned',
						description: 'Triggered when specific role(s) are mentioned',
					},
					{
						name: 'Message Deleted',
						value: 'messageDelete',
						description: 'Triggered when a message is deleted',
					},
					{
						name: 'Message Updated',
						value: 'messageUpdate',
						description: 'Triggered when a message is updated',
					},
					{
						name: 'Reaction Added',
						value: 'messageReactionAdd',
						description: 'Triggered when a reaction is added to a message',
					},
					{
						name: 'Reaction Removed',
						value: 'messageReactionRemove',
						description: 'Triggered when a reaction is removed from a message',
					},
					{
						name: 'Member Joined',
						value: 'guildMemberAdd',
						description: 'Triggered when a member joins a guild',
					},
					{
						name: 'Member Left',
						value: 'guildMemberRemove',
						description: 'Triggered when a member leaves a guild',
					},
					{
						name: 'Member Updated',
						value: 'guildMemberUpdate',
						description: 'Triggered when a guild member changes',
					},
					{
						name: 'Role Created',
						value: 'roleCreate',
						description: 'Triggered when a role is created',
					},
					{
						name: 'Role Deleted',
						value: 'roleDelete',
						description: 'Triggered when a role is deleted',
					},
					{
						name: 'Role Updated',
						value: 'roleUpdate',
						description: 'Triggered when a role is updated',
					},
					{
						name: 'Channel Created',
						value: 'channelCreate',
						description: 'Triggered when a channel is created',
					},
					{
						name: 'Channel Deleted',
						value: 'channelDelete',
						description: 'Triggered when a channel is deleted',
					},
					{
						name: 'Channel Updated',
						value: 'channelUpdate',
						description: 'Triggered when a channel is updated',
					},
					{
						name: 'Guild Ban Add',
						value: 'guildBanAdd',
						description: 'Triggered when a member is banned',
					},
					{
						name: 'Guild Ban Remove',
						value: 'guildBanRemove',
						description: 'Triggered when a member is unbanned',
					},
					{
						name: 'Interaction Created',
						value: 'interactionCreate',
						description: 'Triggered when an interaction is created',
					},
					{
						name: 'Voice State Update',
						value: 'voiceStateUpdate',
						description: 'Triggered when a user voice state changes',
					},
					{
						name: 'Typing Start',
						value: 'typingStart',
						description: 'Triggered when a user starts typing',
					},
				],
				default: 'messageCreate',
				required: true,
			},
			{
				displayName: 'Mention User IDs',
				name: 'mentionUserIds',
				type: 'string',
				displayOptions: {
					show: {
						event: ['userMentioned'],
					},
				},
				default: '',
				description: 'Comma-separated list of user IDs to watch for mentions',
				placeholder: '123456789,987654321',
			},
			{
				displayName: 'Mention Role IDs',
				name: 'mentionRoleIds',
				type: 'string',
				displayOptions: {
					show: {
						event: ['roleMentioned'],
					},
				},
				default: '',
				description: 'Comma-separated list of role IDs to watch for mentions',
				placeholder: '123456789,987654321',
			},
			{
				displayName: 'Filters',
				name: 'filters',
				type: 'collection',
				placeholder: 'Add Filter',
				default: {},
				options: [
					{
						displayName: 'Guild ID',
						name: 'guildId',
						type: 'string',
						default: '',
						description: 'Only trigger for specific guild',
					},
					{
						displayName: 'Channel ID',
						name: 'channelId',
						type: 'string',
						default: '',
						description: 'Only trigger for specific channel',
					},
					{
						displayName: 'User ID',
						name: 'userId',
						type: 'string',
						default: '',
						description: 'Only trigger for specific user',
					},
					{
						displayName: 'Ignore Bots',
						name: 'ignoreBots',
						type: 'boolean',
						default: true,
						description: 'Whether to ignore bot messages',
					},
					{
						displayName: 'Message Contains',
						name: 'messageContains',
						type: 'string',
						default: '',
						description: 'Only trigger if message contains this text',
					},
					{
						displayName: 'Message Starts With',
						name: 'messageStartsWith',
						type: 'string',
						default: '',
						description: 'Only trigger if message starts with this text (e.g., "!" for commands)',
					},
					{
						displayName: 'DM Only From Users',
						name: 'dmOnlyFromUsers',
						type: 'string',
						default: '',
						description: 'Comma-separated user IDs to receive DMs from (empty = all users)',
						placeholder: '123456789,987654321',
					},
				],
			},
		],
	};

	async trigger(this: ITriggerFunctions): Promise<ITriggerResponse> {
		const credentials = await this.getCredentials('discordApi');
		const botToken = credentials.botToken as string;

		const event = this.getNodeParameter('event') as string;
		const filters = this.getNodeParameter('filters', {}) as IDataObject;
		
		let mentionUserIds: string[] = [];
		let mentionRoleIds: string[] = [];
		
		if (event === 'userMentioned') {
			const userIdsParam = this.getNodeParameter('mentionUserIds', '') as string;
			mentionUserIds = userIdsParam.split(',').map(id => id.trim()).filter(id => id);
		}
		
		if (event === 'roleMentioned') {
			const roleIdsParam = this.getNodeParameter('mentionRoleIds', '') as string;
			mentionRoleIds = roleIdsParam.split(',').map(id => id.trim()).filter(id => id);
		}

		const client = new Client({
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.GuildMembers,
				GatewayIntentBits.GuildBans,
				GatewayIntentBits.GuildVoiceStates,
				GatewayIntentBits.GuildMessageReactions,
				GatewayIntentBits.DirectMessages,
				GatewayIntentBits.MessageContent,
				GatewayIntentBits.GuildMessageTyping,
				GatewayIntentBits.DirectMessageTyping,
			],
			partials: [
				Partials.Channel, // Required for DMs
				Partials.Message,
			],
		});

		await client.login(botToken);

		const manualTriggerFunction = async () => {
			await new Promise((resolve) => {
				client.once(Events.ClientReady, resolve);
			});

			this.emit([
				this.helpers.returnJsonArray([
					{
						event: 'trigger',
						note: 'This is a test trigger. Real events will appear when they occur.',
					},
				]),
			]);
		};

		const shouldTrigger = (data: any): boolean => {
			// Apply filters
			if (filters.guildId && data.guildId !== filters.guildId) {
				return false;
			}

			if (filters.channelId && data.channelId !== filters.channelId) {
				return false;
			}

			if (filters.userId && data.userId !== filters.userId) {
				return false;
			}

			if (filters.ignoreBots && data.authorBot) {
				return false;
			}

			if (filters.messageContains && data.content) {
				if (!data.content.includes(filters.messageContains as string)) {
					return false;
				}
			}

			if (filters.messageStartsWith && data.content) {
				if (!data.content.startsWith(filters.messageStartsWith as string)) {
					return false;
				}
			}
			
			// DM specific filters
			if (filters.dmOnlyFromUsers && data.isDM) {
				const allowedUsers = (filters.dmOnlyFromUsers as string)
					.split(',')
					.map(id => id.trim())
					.filter(id => id);
				
				if (allowedUsers.length > 0 && !allowedUsers.includes(data.userId)) {
					return false;
				}
			}

			return true;
		};

		// Set up event listener based on selected event
		if (event === 'messageCreate') {
			client.on(Events.MessageCreate, (message) => {
				const data = {
					id: message.id,
					content: message.content,
					channelId: message.channelId,
					guildId: message.guildId,
					userId: message.author.id,
					authorBot: message.author.bot,
					username: message.author.username,
					createdTimestamp: message.createdTimestamp,
					isDM: !message.guildId,
					channelType: message.channel.type,
					attachments: Array.from(message.attachments.values()).map((att) => ({
						id: att.id,
						url: att.url,
						name: att.name,
					})),
					mentions: message.mentions.users.map((user) => ({
						id: user.id,
						username: user.username,
					})),
					mentionedRoles: message.mentions.roles.map((role) => ({
						id: role.id,
						name: role.name,
					})),
					mentionsBot: message.mentions.users.has(client.user?.id || ''),
				};

				if (shouldTrigger(data)) {
					this.emit([this.helpers.returnJsonArray([data])]);
				}
			});
		} else if (event === 'dmReceived') {
			client.on(Events.MessageCreate, (message) => {
				// Only trigger for DMs (no guild)
				if (message.guildId) return;
				
				const data = {
					id: message.id,
					content: message.content,
					channelId: message.channelId,
					userId: message.author.id,
					authorBot: message.author.bot,
					username: message.author.username,
					discriminator: message.author.discriminator,
					avatarURL: message.author.displayAvatarURL(),
					createdTimestamp: message.createdTimestamp,
					isDM: true,
					channelType: message.channel.type,
					attachments: Array.from(message.attachments.values()).map((att) => ({
						id: att.id,
						url: att.url,
						name: att.name,
						size: att.size,
						contentType: att.contentType,
					})),
				};

				if (shouldTrigger(data)) {
					this.emit([this.helpers.returnJsonArray([data])]);
				}
			});
		} else if (event === 'botMentioned') {
			client.on(Events.MessageCreate, (message) => {
				// Check if bot is mentioned
				if (!message.mentions.users.has(client.user?.id || '')) return;
				
				const data = {
					id: message.id,
					content: message.content,
					channelId: message.channelId,
					guildId: message.guildId,
					userId: message.author.id,
					authorBot: message.author.bot,
					username: message.author.username,
					createdTimestamp: message.createdTimestamp,
					isDM: !message.guildId,
					channelType: message.channel.type,
					mentionsBot: true,
					attachments: Array.from(message.attachments.values()).map((att) => ({
						id: att.id,
						url: att.url,
						name: att.name,
					})),
				};

				if (shouldTrigger(data)) {
					this.emit([this.helpers.returnJsonArray([data])]);
				}
			});
		} else if (event === 'userMentioned') {
			client.on(Events.MessageCreate, (message) => {
				// Check if any of the specified users are mentioned
				const mentionedUserIds = Array.from(message.mentions.users.keys());
				const hasMentionedUser = mentionUserIds.some(userId => 
					mentionedUserIds.includes(userId)
				);
				
				if (!hasMentionedUser) return;
				
				const data = {
					id: message.id,
					content: message.content,
					channelId: message.channelId,
					guildId: message.guildId,
					userId: message.author.id,
					authorBot: message.author.bot,
					username: message.author.username,
					createdTimestamp: message.createdTimestamp,
					isDM: !message.guildId,
					channelType: message.channel.type,
					mentionedUsers: message.mentions.users.map((user) => ({
						id: user.id,
						username: user.username,
					})),
					targetMentionedUsers: message.mentions.users
						.filter(user => mentionUserIds.includes(user.id))
						.map(user => ({
							id: user.id,
							username: user.username,
						})),
					attachments: Array.from(message.attachments.values()).map((att) => ({
						id: att.id,
						url: att.url,
						name: att.name,
					})),
				};

				if (shouldTrigger(data)) {
					this.emit([this.helpers.returnJsonArray([data])]);
				}
			});
		} else if (event === 'roleMentioned') {
			client.on(Events.MessageCreate, (message) => {
				// Check if any of the specified roles are mentioned
				const mentionedRoleIds = Array.from(message.mentions.roles.keys());
				const hasMentionedRole = mentionRoleIds.some(roleId => 
					mentionedRoleIds.includes(roleId)
				);
				
				if (!hasMentionedRole) return;
				
				const data = {
					id: message.id,
					content: message.content,
					channelId: message.channelId,
					guildId: message.guildId,
					userId: message.author.id,
					authorBot: message.author.bot,
					username: message.author.username,
					createdTimestamp: message.createdTimestamp,
					isDM: !message.guildId,
					channelType: message.channel.type,
					mentionedRoles: message.mentions.roles.map((role) => ({
						id: role.id,
						name: role.name,
					})),
					targetMentionedRoles: message.mentions.roles
						.filter(role => mentionRoleIds.includes(role.id))
						.map(role => ({
							id: role.id,
							name: role.name,
						})),
					attachments: Array.from(message.attachments.values()).map((att) => ({
						id: att.id,
						url: att.url,
						name: att.name,
					})),
				};

				if (shouldTrigger(data)) {
					this.emit([this.helpers.returnJsonArray([data])]);
				}
			});
		} else if (event === 'messageDelete') {
			client.on(Events.MessageDelete, (message) => {
				const data = {
					id: message.id,
					content: message.content,
					channelId: message.channelId,
					guildId: message.guildId,
					userId: message.author?.id,
					authorBot: message.author?.bot,
				};

				if (shouldTrigger(data)) {
					this.emit([this.helpers.returnJsonArray([data])]);
				}
			});
		} else if (event === 'messageUpdate') {
			client.on(Events.MessageUpdate, (oldMessage, newMessage) => {
				const data = {
					id: newMessage.id,
					oldContent: oldMessage.content,
					newContent: newMessage.content,
					channelId: newMessage.channelId,
					guildId: newMessage.guildId,
					userId: newMessage.author?.id,
					authorBot: newMessage.author?.bot,
					editedTimestamp: newMessage.editedTimestamp,
				};

				if (shouldTrigger(data)) {
					this.emit([this.helpers.returnJsonArray([data])]);
				}
			});
		} else if (event === 'messageReactionAdd') {
			client.on(Events.MessageReactionAdd, async (reaction, user) => {
				const data = {
					messageId: reaction.message.id,
					channelId: reaction.message.channelId,
					guildId: reaction.message.guildId,
					userId: user.id,
					authorBot: user.bot,
					emoji: reaction.emoji.name,
					emojiId: reaction.emoji.id,
				};

				if (shouldTrigger(data)) {
					this.emit([this.helpers.returnJsonArray([data])]);
				}
			});
		} else if (event === 'messageReactionRemove') {
			client.on(Events.MessageReactionRemove, async (reaction, user) => {
				const data = {
					messageId: reaction.message.id,
					channelId: reaction.message.channelId,
					guildId: reaction.message.guildId,
					userId: user.id,
					authorBot: user.bot,
					emoji: reaction.emoji.name,
					emojiId: reaction.emoji.id,
				};

				if (shouldTrigger(data)) {
					this.emit([this.helpers.returnJsonArray([data])]);
				}
			});
		} else if (event === 'guildMemberAdd') {
			client.on(Events.GuildMemberAdd, (member) => {
				const data = {
					userId: member.id,
					username: member.user.username,
					guildId: member.guild.id,
					guildName: member.guild.name,
					joinedTimestamp: member.joinedTimestamp,
					authorBot: member.user.bot,
				};

				if (shouldTrigger(data)) {
					this.emit([this.helpers.returnJsonArray([data])]);
				}
			});
		} else if (event === 'guildMemberRemove') {
			client.on(Events.GuildMemberRemove, (member) => {
				const data = {
					userId: member.id,
					username: member.user.username,
					guildId: member.guild.id,
					guildName: member.guild.name,
					authorBot: member.user.bot,
				};

				if (shouldTrigger(data)) {
					this.emit([this.helpers.returnJsonArray([data])]);
				}
			});
		} else if (event === 'guildMemberUpdate') {
			client.on(Events.GuildMemberUpdate, (oldMember, newMember) => {
				const data = {
					userId: newMember.id,
					username: newMember.user.username,
					guildId: newMember.guild.id,
					oldNickname: oldMember.nickname,
					newNickname: newMember.nickname,
					oldRoles: oldMember.roles.cache.map((r) => ({ id: r.id, name: r.name })),
					newRoles: newMember.roles.cache.map((r) => ({ id: r.id, name: r.name })),
					authorBot: newMember.user.bot,
				};

				if (shouldTrigger(data)) {
					this.emit([this.helpers.returnJsonArray([data])]);
				}
			});
		} else if (event === 'roleCreate') {
			client.on(Events.GuildRoleCreate, (role) => {
				const data = {
					roleId: role.id,
					roleName: role.name,
					guildId: role.guild.id,
					color: role.color,
					permissions: role.permissions.toArray(),
				};

				if (shouldTrigger(data)) {
					this.emit([this.helpers.returnJsonArray([data])]);
				}
			});
		} else if (event === 'roleDelete') {
			client.on(Events.GuildRoleDelete, (role) => {
				const data = {
					roleId: role.id,
					roleName: role.name,
					guildId: role.guild.id,
				};

				if (shouldTrigger(data)) {
					this.emit([this.helpers.returnJsonArray([data])]);
				}
			});
		} else if (event === 'roleUpdate') {
			client.on(Events.GuildRoleUpdate, (oldRole, newRole) => {
				const data = {
					roleId: newRole.id,
					oldName: oldRole.name,
					newName: newRole.name,
					guildId: newRole.guild.id,
					oldColor: oldRole.color,
					newColor: newRole.color,
					oldPermissions: oldRole.permissions.toArray(),
					newPermissions: newRole.permissions.toArray(),
				};

				if (shouldTrigger(data)) {
					this.emit([this.helpers.returnJsonArray([data])]);
				}
			});
		} else if (event === 'channelCreate') {
			client.on(Events.ChannelCreate, (channel) => {
				const data = {
					channelId: channel.id,
					channelName: 'name' in channel ? channel.name : undefined,
					channelType: channel.type,
					guildId: 'guildId' in channel ? channel.guildId : undefined,
				};

				if (shouldTrigger(data)) {
					this.emit([this.helpers.returnJsonArray([data])]);
				}
			});
		} else if (event === 'channelDelete') {
			client.on(Events.ChannelDelete, (channel) => {
				const data = {
					channelId: channel.id,
					channelName: 'name' in channel ? channel.name : undefined,
					channelType: channel.type,
					guildId: 'guildId' in channel ? channel.guildId : undefined,
				};

				if (shouldTrigger(data)) {
					this.emit([this.helpers.returnJsonArray([data])]);
				}
			});
		} else if (event === 'channelUpdate') {
			client.on(Events.ChannelUpdate, (oldChannel, newChannel) => {
				const data = {
					channelId: newChannel.id,
					oldName: 'name' in oldChannel ? oldChannel.name : undefined,
					newName: 'name' in newChannel ? newChannel.name : undefined,
					channelType: newChannel.type,
					guildId: 'guildId' in newChannel ? newChannel.guildId : undefined,
				};

				if (shouldTrigger(data)) {
					this.emit([this.helpers.returnJsonArray([data])]);
				}
			});
		} else if (event === 'guildBanAdd') {
			client.on(Events.GuildBanAdd, (ban) => {
				const data = {
					userId: ban.user.id,
					username: ban.user.username,
					guildId: ban.guild.id,
					reason: ban.reason,
					authorBot: ban.user.bot,
				};

				if (shouldTrigger(data)) {
					this.emit([this.helpers.returnJsonArray([data])]);
				}
			});
		} else if (event === 'guildBanRemove') {
			client.on(Events.GuildBanRemove, (ban) => {
				const data = {
					userId: ban.user.id,
					username: ban.user.username,
					guildId: ban.guild.id,
					authorBot: ban.user.bot,
				};

				if (shouldTrigger(data)) {
					this.emit([this.helpers.returnJsonArray([data])]);
				}
			});
		} else if (event === 'interactionCreate') {
			client.on(Events.InteractionCreate, (interaction) => {
				const data = {
					interactionId: interaction.id,
					interactionType: interaction.type,
					userId: interaction.user.id,
					username: interaction.user.username,
					guildId: interaction.guildId,
					channelId: interaction.channelId,
					authorBot: interaction.user.bot,
				};

				if (shouldTrigger(data)) {
					this.emit([this.helpers.returnJsonArray([data])]);
				}
			});
		} else if (event === 'voiceStateUpdate') {
			client.on(Events.VoiceStateUpdate, (oldState, newState) => {
				const data = {
					userId: newState.id,
					guildId: newState.guild.id,
					oldChannelId: oldState.channelId,
					newChannelId: newState.channelId,
					muted: newState.mute,
					deafened: newState.deaf,
					selfMuted: newState.selfMute,
					selfDeafened: newState.selfDeaf,
				};

				if (shouldTrigger(data)) {
					this.emit([this.helpers.returnJsonArray([data])]);
				}
			});
		} else if (event === 'typingStart') {
			client.on(Events.TypingStart, (typing) => {
				const data = {
					userId: typing.user.id,
					username: typing.user.username,
					channelId: typing.channel.id,
					guildId: typing.guild?.id,
					startedTimestamp: typing.startedTimestamp,
					authorBot: typing.user.bot,
				};

				if (shouldTrigger(data)) {
					this.emit([this.helpers.returnJsonArray([data])]);
				}
			});
		}

		const closeFunction = async () => {
			await client.destroy();
		};

		return {
			closeFunction,
			manualTriggerFunction,
		};
	}
}
