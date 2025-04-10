import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

export class Viggle implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Viggle',
		name: 'viggle',
		icon: 'file:viggle.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Interact with Viggle API',
		defaults: {
			name: 'Viggle',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Generate Animation',
						value: 'generateAnimation',
						description: 'Generate animation from text or image',
						action: 'Generate animation from text or image',
					},
				],
				default: 'generateAnimation',
			},
			{
				displayName: 'Input Type',
				name: 'inputType',
				type: 'options',
				displayOptions: {
					show: {
						operation: ['generateAnimation'],
					},
				},
				options: [
					{
						name: 'Text',
						value: 'text',
					},
					{
						name: 'Image',
						value: 'image',
					},
				],
				default: 'text',
			},
			{
				displayName: 'Text Input',
				name: 'textInput',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['generateAnimation'],
						inputType: ['text'],
					},
				},
				default: '',
				description: 'Text description for animation generation',
				required: true,
			},
			{
				displayName: 'Image Input',
				name: 'imageInput',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['generateAnimation'],
						inputType: ['image'],
					},
				},
				default: '',
				description: 'Base64 encoded image for animation generation',
				required: true,
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		console.log('Starting Viggle node execution...');

		for (let i = 0; i < items.length; i++) {
			try {
				console.log(`Processing item ${i + 1} of ${items.length}`);
				
				const operation = this.getNodeParameter('operation', i) as string;
				console.log(`Operation: ${operation}`);
				
				const inputType = this.getNodeParameter('inputType', i) as string;
				console.log(`Input Type: ${inputType}`);

				if (operation === 'generateAnimation') {
					let input;
					if (inputType === 'text') {
						input = this.getNodeParameter('textInput', i) as string;
						if (!input.trim()) {
							throw new Error('Text input cannot be empty');
						}
						console.log('Text input received:', input);
					} else {
						input = this.getNodeParameter('imageInput', i) as string;
						if (!input.trim()) {
							throw new Error('Image input cannot be empty');
						}
						if (!input.startsWith('data:image')) {
							throw new Error('Invalid image format. Must be base64 encoded image data');
						}
						console.log('Image input received (length):', input.length);
					}

					try {
						// TODO: Implement actual Viggle API call here
						console.log('Making API call to Viggle...');
						const result = {
							status: 'success',
							message: 'Animation generation started',
							input_type: inputType,
							input_length: input.length,
							timestamp: new Date().toISOString(),
						};

						console.log('API call successful:', result);
						returnData.push({
							json: result,
						});
					} catch (apiError) {
						console.error('API call failed:', apiError);
						throw new Error(`Viggle API call failed: ${apiError.message}`);
					}
				}
			} catch (error) {
				console.error(`Error processing item ${i + 1}:`, error);
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
							item_index: i,
							timestamp: new Date().toISOString(),
						},
					});
					continue;
				}
				throw error;
			}
		}

		console.log('Viggle node execution completed');
		return [returnData];
	}
}

// 添加默认导出
export default { nodeClass: Viggle }; 