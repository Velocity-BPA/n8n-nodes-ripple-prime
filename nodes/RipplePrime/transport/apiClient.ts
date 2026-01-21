/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IExecuteFunctions,
  ILoadOptionsFunctions,
  IHttpRequestMethods,
  IRequestOptions,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
import * as crypto from 'crypto';
import { BASE_URLS } from '../constants/endpoints';

export interface RequestParams {
  method: IHttpRequestMethods;
  endpoint: string;
  body?: object;
  query?: Record<string, string | number | boolean | undefined>;
  headers?: Record<string, string>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
    nextCursor?: string;
  };
}

/**
 * Generate HMAC signature for API requests
 */
export function generateSignature(
  secret: string,
  timestamp: string,
  method: string,
  path: string,
  body?: string,
): string {
  const message = `${timestamp}${method.toUpperCase()}${path}${body || ''}`;
  return crypto.createHmac('sha256', secret).update(message).digest('hex');
}

/**
 * Get base URL based on environment
 */
export function getBaseUrl(environment: string): string {
  return environment === 'production' ? BASE_URLS.production : BASE_URLS.sandbox;
}

/**
 * Make an authenticated API request
 */
export async function makeApiRequest(
  this: IExecuteFunctions | ILoadOptionsFunctions,
  params: RequestParams,
): Promise<any> {
  const credentials = await this.getCredentials('ripplePrimeApi');

  const environment = credentials.environment as string;
  const baseUrl = getBaseUrl(environment);
  const timestamp = new Date().toISOString();

  // Build query string
  const queryString = params.query
    ? '?' +
      Object.entries(params.query)
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
        .join('&')
    : '';

  const fullPath = params.endpoint + queryString;
  const bodyString = params.body ? JSON.stringify(params.body) : undefined;

  // Generate signature
  const signature = generateSignature(
    credentials.apiSecret as string,
    timestamp,
    params.method,
    fullPath,
    bodyString,
  );

  const options: IRequestOptions = {
    method: params.method,
    uri: `${baseUrl}${params.endpoint}`,
    qs: params.query,
    body: params.body,
    json: true,
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': credentials.apiKey as string,
      'X-Timestamp': timestamp,
      'X-Signature': signature,
      ...params.headers,
    },
  };

  try {
    return await this.helpers.request(options);
  } catch (error: any) {
    throw new NodeApiError(this.getNode(), error, {
      message: error.message,
      description: error.description || 'API request failed',
    });
  }
}

/**
 * Make a paginated API request
 */
export async function makePaginatedRequest<T>(
  this: IExecuteFunctions | ILoadOptionsFunctions,
  params: RequestParams,
  limit = 100,
): Promise<PaginatedResponse<T>> {
  const query = {
    ...params.query,
    limit,
  };

  const response = await makeApiRequest.call(this, {
    ...params,
    query,
  });

  return {
    data: response.data || response,
    pagination: {
      total: response.total || response.data?.length || 0,
      limit,
      offset: response.offset || 0,
      hasMore: response.hasMore || false,
      nextCursor: response.nextCursor,
    },
  };
}

/**
 * Replace path parameters in endpoint
 */
export function replacePathParams(
  endpoint: string,
  params: Record<string, string>,
): string {
  let result = endpoint;
  for (const [key, value] of Object.entries(params)) {
    result = result.replace(`{${key}}`, encodeURIComponent(value));
  }
  return result;
}
