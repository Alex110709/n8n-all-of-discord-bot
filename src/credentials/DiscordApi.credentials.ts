import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class DiscordApi implements ICredentialType {
	name = 'discordApi';
	displayName = 'Discord API';
	documentationUrl = 'https://discord.com/developers/docs/intro';
	properties: INodeProperties[] = [
		{
			displayName: 'Bot Token',
			name: 'botToken',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Discord Bot Token from Discord Developer Portal',
		},
		{
			displayName: 'Application ID',
			name: 'applicationId',
			type: 'string',
			default: '',
			description: 'Discord Application/Client ID (optional, for some operations)',
		},
	];
}
