/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class RipplePrimeApi implements ICredentialType {
  name = 'ripplePrimeApi';
  displayName = 'Ripple Prime API';
  documentationUrl = 'https://docs.ripple.com/prime';

  properties: INodeProperties[] = [
    {
      displayName: 'Environment',
      name: 'environment',
      type: 'options',
      options: [
        { name: 'Production', value: 'production' },
        { name: 'Sandbox', value: 'sandbox' },
      ],
      default: 'sandbox',
      description: 'Select the environment to connect to',
    },
    {
      displayName: 'Authentication Method',
      name: 'authMethod',
      type: 'options',
      options: [
        { name: 'API Key + Secret', value: 'apiKey' },
        { name: 'OAuth 2.0', value: 'oauth2' },
        { name: 'mTLS', value: 'mtls' },
      ],
      default: 'apiKey',
      description: 'Select the authentication method',
    },
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      required: true,
      displayOptions: {
        show: { authMethod: ['apiKey'] },
      },
      description: 'Your Ripple Prime API key',
    },
    {
      displayName: 'API Secret',
      name: 'apiSecret',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      required: true,
      displayOptions: {
        show: { authMethod: ['apiKey'] },
      },
      description: 'Your Ripple Prime API secret for HMAC signing',
    },
    {
      displayName: 'OAuth Client ID',
      name: 'oauthClientId',
      type: 'string',
      default: '',
      displayOptions: {
        show: { authMethod: ['oauth2'] },
      },
      description: 'OAuth 2.0 client ID',
    },
    {
      displayName: 'OAuth Client Secret',
      name: 'oauthClientSecret',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      displayOptions: {
        show: { authMethod: ['oauth2'] },
      },
      description: 'OAuth 2.0 client secret',
    },
    {
      displayName: 'Client Certificate',
      name: 'clientCert',
      type: 'string',
      typeOptions: { rows: 5 },
      default: '',
      displayOptions: {
        show: { authMethod: ['mtls'] },
      },
      description: 'PEM-encoded client certificate for mTLS',
    },
    {
      displayName: 'Client Private Key',
      name: 'clientKey',
      type: 'string',
      typeOptions: { password: true, rows: 5 },
      default: '',
      displayOptions: {
        show: { authMethod: ['mtls'] },
      },
      description: 'PEM-encoded private key for mTLS',
    },
    {
      displayName: 'Account ID',
      name: 'accountId',
      type: 'string',
      default: '',
      description: 'Default account ID for operations',
    },
    {
      displayName: 'Organization ID',
      name: 'organizationId',
      type: 'string',
      default: '',
      description: 'Your organization ID',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        'X-API-Key': '={{$credentials.apiKey}}',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: '={{$credentials.environment === "production" ? "https://api.ripple.com/prime" : "https://sandbox.api.ripple.com/prime"}}',
      url: '/v1/health',
      method: 'GET',
    },
  };
}
