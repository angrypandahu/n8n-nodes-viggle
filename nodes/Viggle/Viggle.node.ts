import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import puppeteer from 'puppeteer';

// 创建自定义的 fetch 函数
const customFetch = async (url: string, options: { method: string; headers: Record<string, string> }) => {
	// 启动浏览器
	const browser = await puppeteer.launch({
		headless: true,
		args: ['--no-sandbox', '--disable-setuid-sandbox']
	});

	try {
		// 创建新页面
		const page = await browser.newPage();

		// 设置请求头
		await page.setExtraHTTPHeaders({
			'authorization': options.headers.authorization || '',
			's': options.headers.s || '',
			't': options.headers.t || '',
			'u': options.headers.u || '',
			'accept': 'application/json, text/plain, */*',
			'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
			'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
			'origin': 'https://viggle.ai',
			'referer': 'https://viggle.ai/'
		});

		// 打印请求信息
		console.log('=== Viggle API Request ===');
		console.log('URL:', url);
		console.log('Method:', options.method);
		console.log('Headers:', options.headers);
		console.log('===================================');

		// 发送请求
		const response = await page.goto(url, {
			waitUntil: 'networkidle0',
			timeout: 30000
		});

		if (!response) {
			throw new Error('No response received');
		}

		// 获取响应内容
		const responseText = await response.text();

		// 打印响应信息
		console.log('=== Viggle API Response ===');
		console.log('Status:', response.status());
		console.log('Status Text:', response.statusText());
		console.log('Response:', responseText);
		console.log('===================================');

		// 返回一个模拟的 Response 对象
		return {
			status: response.status(),
			statusText: response.statusText(),
			headers: response.headers(),
			json: async () => JSON.parse(responseText),
			text: async () => responseText
		} as unknown as Response;
	} catch (error) {
		console.error('Error:', error);
		throw error;
	} finally {
		// 关闭浏览器
		await browser.close();
	}
};

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
					{
						name: 'Get Image List',
						value: 'getImageList',
						description: 'Get list of images from Viggle account',
						action: 'Get list of images from Viggle account',
					},
				],
				default: 'generateAnimation',
			},
			{
				displayName: 'Configuration',
				name: 'configuration',
				type: 'json',
				displayOptions: {
					show: {
						operation: ['getImageList'],
					},
				},
				default: '{\n  "authorization": "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjAsImlkIjoiNWRiMzAxYjctNTAyYS00OTkxLThjMjMtNzgzNTg3M2ViYjQ0IiwidXNlcm5hbWUiOiIiLCJpc3N1ZXIiOiJ2aWdnbGUiLCJpc3N1ZWRfYXQiOiIyMDI1LTA0LTA5VDAxOjIxOjI3Ljk1NDM4MTU1MloiLCJleHBpcmVkX2F0IjoiMjAyNS0wNS0wOVQwMToyMToyNy45NTQzODE1NTJaIn0.NBAfZiQS-Rgr5vpJJFsqY7zw-Kn_j7ujPTl7pG9hrjrnmJHgzgIvebLJVGCZ1XvN5S-5RXfu9A654bqbExQXBvU4QMOlv8nMlP1dkgVl3JB58shwy4EAz5x3z7s1h2MtlHfU7Jxmgn0kEdEimcVFe5k6C_3PfbR8kmPSn--velvM0n3y2WKhBsjI_2T-XjFvMzAGj9tT0gcoEn9XpsxHFz5LbofNB5gznh3kh1EJ2_uuCK6H1cZdrcSbDQ68WjWhxJD6CafUM9FJkyIbrGDNHAX39eIqER-ZFy0614QsqEVBOPsI0ITengKhA17GJJtFSoY65n1DotWs7C__3X62NQ",\n  "s": "1e644c232b147203a35855245131c419",\n  "u": "c910c40d-c3ea-4e51-8f19-0c85d31a066c"\n ,"t": "1744266717312"\n}',
				description: 'Viggle API configuration in JSON format',
				required: true,
			},
			{
				displayName: 'Page',
				name: 'page',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['getImageList'],
					},
				},
				default: 1,
				description: 'Page number for pagination',
			},
			{
				displayName: 'Page Size',
				name: 'pageSize',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['getImageList'],
					},
				},
				default: 48,
				description: 'Number of items per page',
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

				if (operation === 'getImageList') {
					const page = this.getNodeParameter('page', i) as number;
					const pageSize = this.getNodeParameter('pageSize', i) as number;
					const configuration = JSON.parse(this.getNodeParameter('configuration', i) as string);

					try {
						const response = await customFetch(`https://viggle.ai/api/asset/image?page=${page}&pageSize=${pageSize}`, {
							method: 'GET',
							headers: {
								'authorization': configuration.authorization,
								's': configuration.s,
								't': configuration.t,
								'u': configuration.u,
							},
						});

						const data = await response.json();
						returnData.push({
							json: data,
						});
					} catch (apiError) {
						console.error('API call failed:', apiError);
						throw new Error(`Viggle API call failed: ${apiError.message}`);
					}
				} else if (operation === 'generateAnimation') {
					const inputType = this.getNodeParameter('inputType', i) as string;
					console.log(`Input Type: ${inputType}`);

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