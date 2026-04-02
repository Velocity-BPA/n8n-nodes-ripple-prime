import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class RipplePrimeApi implements ICredentialType {
	name = 'ripplePrimeApi';
	displayName = 'Ripple Prime API';
	documentationUrl = 'https://docs.rippleprime.com/api';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'API key for institutional account access. Obtained upon account approval.',
		},
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.rippleprime.com/v1',
			required: true,
			description: 'Base URL for the Ripple Prime API',
		},
	];
}