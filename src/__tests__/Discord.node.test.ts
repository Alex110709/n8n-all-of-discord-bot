import { Discord } from '../nodes/Discord/Discord.node';

describe('Discord Node', () => {
	let discordNode: Discord;

	beforeEach(() => {
		discordNode = new Discord();
	});

	describe('Node Properties', () => {
		it('should have correct displayName', () => {
			expect(discordNode.description.displayName).toBe('Discord');
		});

		it('should have correct name', () => {
			expect(discordNode.description.name).toBe('discord');
		});

		it('should have main input and output', () => {
			expect(discordNode.description.inputs).toEqual(['main']);
			expect(discordNode.description.outputs).toEqual(['main']);
		});

		it('should require discordApi credentials', () => {
			expect(discordNode.description.credentials).toEqual([
				{
					name: 'discordApi',
					required: true,
				},
			]);
		});
	});

	describe('Resources', () => {
		it('should include message resource', () => {
			const resourceProperty = discordNode.description.properties.find(
				(p: any) => p.name === 'resource',
			);
			const resources = resourceProperty?.options?.map((o: any) => o.value);
			expect(resources).toContain('message');
		});

		it('should include channel resource', () => {
			const resourceProperty = discordNode.description.properties.find(
				(p: any) => p.name === 'resource',
			);
			const resources = resourceProperty?.options?.map((o: any) => o.value);
			expect(resources).toContain('channel');
		});

		it('should include thread resource', () => {
			const resourceProperty = discordNode.description.properties.find(
				(p: any) => p.name === 'resource',
			);
			const resources = resourceProperty?.options?.map((o: any) => o.value);
			expect(resources).toContain('thread');
		});

		it('should include reaction resource', () => {
			const resourceProperty = discordNode.description.properties.find(
				(p: any) => p.name === 'resource',
			);
			const resources = resourceProperty?.options?.map((o: any) => o.value);
			expect(resources).toContain('reaction');
		});

		it('should include voice resource', () => {
			const resourceProperty = discordNode.description.properties.find(
				(p: any) => p.name === 'resource',
			);
			const resources = resourceProperty?.options?.map((o: any) => o.value);
			expect(resources).toContain('voice');
		});
	});

	describe('Message Operations', () => {
		it('should include send operation', () => {
			const operationProperty = discordNode.description.properties.find(
				(p: any) => p.name === 'operation' && p.displayOptions?.show?.resource?.includes('message'),
			);
			const operations = operationProperty?.options?.map((o: any) => o.value);
			expect(operations).toContain('send');
		});

		it('should include edit operation', () => {
			const operationProperty = discordNode.description.properties.find(
				(p: any) => p.name === 'operation' && p.displayOptions?.show?.resource?.includes('message'),
			);
			const operations = operationProperty?.options?.map((o: any) => o.value);
			expect(operations).toContain('edit');
		});

		it('should include delete operation', () => {
			const operationProperty = discordNode.description.properties.find(
				(p: any) => p.name === 'operation' && p.displayOptions?.show?.resource?.includes('message'),
			);
			const operations = operationProperty?.options?.map((o: any) => o.value);
			expect(operations).toContain('delete');
		});
	});

	describe('Thread Operations', () => {
		it('should include create operation', () => {
			const operationProperty = discordNode.description.properties.find(
				(p: any) => p.name === 'operation' && p.displayOptions?.show?.resource?.includes('thread'),
			);
			const operations = operationProperty?.options?.map((o: any) => o.value);
			expect(operations).toContain('create');
		});

		it('should include join operation', () => {
			const operationProperty = discordNode.description.properties.find(
				(p: any) => p.name === 'operation' && p.displayOptions?.show?.resource?.includes('thread'),
			);
			const operations = operationProperty?.options?.map((o: any) => o.value);
			expect(operations).toContain('join');
		});

		it('should include archive operation', () => {
			const operationProperty = discordNode.description.properties.find(
				(p: any) => p.name === 'operation' && p.displayOptions?.show?.resource?.includes('thread'),
			);
			const operations = operationProperty?.options?.map((o: any) => o.value);
			expect(operations).toContain('archive');
		});
	});

	describe('Reaction Operations', () => {
		it('should include add operation', () => {
			const operationProperty = discordNode.description.properties.find(
				(p: any) =>
					p.name === 'operation' && p.displayOptions?.show?.resource?.includes('reaction'),
			);
			const operations = operationProperty?.options?.map((o: any) => o.value);
			expect(operations).toContain('add');
		});

		it('should include remove operation', () => {
			const operationProperty = discordNode.description.properties.find(
				(p: any) =>
					p.name === 'operation' && p.displayOptions?.show?.resource?.includes('reaction'),
			);
			const operations = operationProperty?.options?.map((o: any) => o.value);
			expect(operations).toContain('remove');
		});
	});

	describe('Voice Operations', () => {
		it('should include moveMember operation', () => {
			const operationProperty = discordNode.description.properties.find(
				(p: any) => p.name === 'operation' && p.displayOptions?.show?.resource?.includes('voice'),
			);
			const operations = operationProperty?.options?.map((o: any) => o.value);
			expect(operations).toContain('moveMember');
		});

		it('should include muteMember operation', () => {
			const operationProperty = discordNode.description.properties.find(
				(p: any) => p.name === 'operation' && p.displayOptions?.show?.resource?.includes('voice'),
			);
			const operations = operationProperty?.options?.map((o: any) => o.value);
			expect(operations).toContain('muteMember');
		});
	});

	describe('Embed and Attachment Support', () => {
		it('should have embedJson parameter for message send', () => {
			const embedProperty = discordNode.description.properties.find(
				(p: any) =>
					p.name === 'embedJson' &&
					p.displayOptions?.show?.resource?.includes('message') &&
					p.displayOptions?.show?.operation?.includes('send'),
			);
			expect(embedProperty).toBeDefined();
			expect(embedProperty?.type).toBe('string');
		});

		it('should have attachmentType parameter for message send', () => {
			const attachmentProperty = discordNode.description.properties.find(
				(p: any) =>
					p.name === 'attachmentType' &&
					p.displayOptions?.show?.resource?.includes('message') &&
					p.displayOptions?.show?.operation?.includes('send'),
			);
			expect(attachmentProperty).toBeDefined();
			expect(attachmentProperty?.type).toBe('options');
		});

		it('should have binaryProperty parameter when attachmentType is binary', () => {
			const binaryProperty = discordNode.description.properties.find(
				(p: any) =>
					p.name === 'binaryProperty' && p.displayOptions?.show?.attachmentType?.includes('binary'),
			);
			expect(binaryProperty).toBeDefined();
		});

		it('should have fileUrl parameter when attachmentType is url', () => {
			const urlProperty = discordNode.description.properties.find(
				(p: any) => p.name === 'fileUrl' && p.displayOptions?.show?.attachmentType?.includes('url'),
			);
			expect(urlProperty).toBeDefined();
		});
	});
});
