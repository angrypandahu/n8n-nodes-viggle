import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import puppeteer from 'puppeteer';

// 创建自定义的 fetch 函数
const customFetch = async (
	url: string,
	options: {
		method: string;
		headers: {
			accept: string;
			"accept-language": string;
			authorization: any;
			"content-type": string;
			origin: string;
			referer: string;
			"sec-ch-ua": string;
			"sec-ch-ua-mobile": string;
			"sec-ch-ua-platform": string;
			"sec-fetch-dest": string;
			"sec-fetch-mode": string;
			"sec-fetch-site": string;
			s: any;
			t: any;
			u: any;
			"user-agent": string
		};
		body: {}
	},
) => {
	// 启动浏览器
	const browser = await puppeteer.launch({
		headless: true,
		args: ['--no-sandbox', '--disable-setuid-sandbox'],
	});

	try {
		// 创建新页面
		const page = await browser.newPage();

		// 设置请求头
		await page.setExtraHTTPHeaders({
			authorization: options.headers.authorization || '',
			s: options.headers.s || '',
			t: options.headers.t || '',
			u: options.headers.u || '',
			accept: 'application/json, text/plain, */*',
			'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
			'user-agent':
				'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
			origin: 'https://viggle.ai',
			referer: 'https://viggle.ai/',
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
			timeout: 30000,
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
			text: async () => responseText,
		} as unknown as Response;
	} catch (error) {
		console.error('Error:', error);
		throw error;
	} finally {
		// 关闭浏览器
		await browser.close();
	}
};

const customPost = async (
	url: string,
	options: {
		method: string;
		headers: {
			accept: string;
			"accept-language": string;
			authorization: any;
			"content-type": string;
			origin: string;
			referer: string;
			"sec-ch-ua": string;
			"sec-ch-ua-mobile": string;
			"sec-ch-ua-platform": string;
			"sec-fetch-dest": string;
			"sec-fetch-mode": string;
			"sec-fetch-site": string;
			s: any;
			t: any;
			u: any;
			"user-agent": string
		};
		body: {}
	},
) => {
	// 启动浏览器
	const browser = await puppeteer.launch({
		headless: true,
		args: ['--no-sandbox', '--disable-setuid-sandbox'],
	});

	try {
		// 创建新页面
		const page = await browser.newPage();

		// 设置请求头
		await page.setExtraHTTPHeaders({
			authorization: options.headers.authorization || '',
			s: options.headers.s || '',
			t: options.headers.t || '',
			u: options.headers.u || '',
			accept: 'application/json, text/plain, */*',
			'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
			'user-agent':
				'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
			origin: 'https://viggle.ai',
			referer: 'https://viggle.ai/',
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
			timeout: 30000,
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
			text: async () => responseText,
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
						name: 'Get Image List',
						value: 'getImageList',
						description: 'Get list of images from Viggle account',
						action: 'Get list of images from viggle account',
					},
					{
						name: 'Upload Image to Viggle',
						value: 'uploadImageToViggle',
						description: 'Upload Image to Viggle assert',
						action: 'Upload image to viggle assert',
					},
				],
				default: 'getImageList',
			},
			{
				displayName: 'Configuration',
				name: 'configuration',
				type: 'json',
				default:
					'{\n  "authorization": "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjAsImlkIjoiNWRiMzAxYjctNTAyYS00OTkxLThjMjMtNzgzNTg3M2ViYjQ0IiwidXNlcm5hbWUiOiIiLCJpc3N1ZXIiOiJ2aWdnbGUiLCJpc3N1ZWRfYXQiOiIyMDI1LTA0LTA5VDAxOjIxOjI3Ljk1NDM4MTU1MloiLCJleHBpcmVkX2F0IjoiMjAyNS0wNS0wOVQwMToyMToyNy45NTQzODE1NTJaIn0.NBAfZiQS-Rgr5vpJJFsqY7zw-Kn_j7ujPTl7pG9hrjrnmJHgzgIvebLJVGCZ1XvN5S-5RXfu9A654bqbExQXBvU4QMOlv8nMlP1dkgVl3JB58shwy4EAz5x3z7s1h2MtlHfU7Jxmgn0kEdEimcVFe5k6C_3PfbR8kmPSn--velvM0n3y2WKhBsjI_2T-XjFvMzAGj9tT0gcoEn9XpsxHFz5LbofNB5gznh3kh1EJ2_uuCK6H1cZdrcSbDQ68WjWhxJD6CafUM9FJkyIbrGDNHAX39eIqER-ZFy0614QsqEVBOPsI0ITengKhA17GJJtFSoY65n1DotWs7C__3X62NQ",\n  "s": "1e644c232b147203a35855245131c419",\n  "u": "c910c40d-c3ea-4e51-8f19-0c85d31a066c"\n ,"t": "1744266717312"\n}',
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
				displayName: 'Binary Property',
				name: 'binaryPropertyName',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['uploadImageToViggle'],
					},
				},
				default: 'data',
				required: true,
				description: 'Name of the binary property which contains the file data to be uploaded',
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
				const configuration = JSON.parse(this.getNodeParameter('configuration', i) as string);

				if (operation === 'getImageList') {
					const page = this.getNodeParameter('page', i) as number;
					const pageSize = this.getNodeParameter('pageSize', i) as number;

					try {
						const response = await customFetch(`https://viggle.ai/api/asset/image?page=${page}&pageSize=${pageSize}`, {
							method: 'GET',
							headers: {
								'accept': 'application/json, text/plain, */*',
								'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
								'authorization': configuration.authorization,
								'content-type': 'application/json',
								'origin': 'https://viggle.ai',
								'referer': 'https://viggle.ai/',
								'sec-ch-ua': '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
								'sec-ch-ua-mobile': '?0',
								'sec-ch-ua-platform': '"macOS"',
								'sec-fetch-dest': 'empty',
								'sec-fetch-mode': 'cors',
								'sec-fetch-site': 'same-origin',
								's': configuration.s,
								't': configuration.t,
								'u': configuration.u,
								'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36'
							},
							body: {}
						});

						const data = await response.json();
						returnData.push({
							json: data,
						});
					} catch (apiError) {
						console.error('API call failed:', apiError);
						throw new Error(`Viggle API call failed: ${apiError.message}`);
					}
				} else if (operation === 'uploadImageToViggle') {
					const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
					console.log('binaryPropertyName===', binaryPropertyName);

					// 获取二进制数据
					const item = items[i];
					console.log('item===', JSON.stringify(item, null, 2));
					if (!item) {
						throw new Error('Item is undefined');
					}
					const binaryData = item.binary?.data

					if (!binaryData) {
						throw new Error(`No binary data found for property "${binaryPropertyName}"`);
					}

					// 生成随机边界
					const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);

					// 将 base64 转换为二进制
					const fileBuffer = Buffer.from(binaryData.data, 'base64');

					// 构建 multipart/form-data 请求体
					const formDataParts = [
						`--${boundary}`,
						`Content-Disposition: form-data; name="file"; filename="${binaryData.fileName}"`,
						`Content-Type: ${binaryData.mimeType}`,
						'',
						fileBuffer,
						`--${boundary}--`,
						''
					].join('\r\n');

					// 设置请求头
					const headers = {
						'accept': 'application/json, text/plain, */*',
						'accept-language': 'zh-CN,zh;q=0.9,de;q=0.8,en;q=0.7',
						'authorization': configuration.authorization,
						'content-type': `multipart/form-data; boundary=${boundary}`,
						'origin': 'https://viggle.ai',
						'referer': 'https://viggle.ai/create-mix',
						'sec-ch-ua': '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
						'sec-ch-ua-mobile': '?0',
						'sec-ch-ua-platform': '"macOS"',
						'sec-fetch-dest': 'empty',
						'sec-fetch-mode': 'cors',
						'sec-fetch-site': 'same-origin',
						's': configuration.s,
						't': configuration.t,
						'u': configuration.u,
						'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36'
					};

					try {
						const response = await customPost('https://viggle.ai/api/asset/image', {
							method: 'POST',
							headers: headers,
							body: formDataParts
						});

						const data = await response.json();
						returnData.push({
							json: data,
						});
					} catch (apiError) {
						console.error('API call failed:', apiError);
						throw new Error(`Viggle API call failed: ${apiError.message}`);
					}
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
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
export default {
	nodeClass: Viggle
};
