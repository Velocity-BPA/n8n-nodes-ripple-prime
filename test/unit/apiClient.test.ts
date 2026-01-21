/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  generateSignature,
  getBaseUrl,
  replacePathParams,
} from '../../nodes/RipplePrime/transport/apiClient';
import { BASE_URLS } from '../../nodes/RipplePrime/constants/endpoints';

describe('API Client Utilities', () => {
  describe('generateSignature', () => {
    it('should generate consistent HMAC signature', () => {
      const signature1 = generateSignature(
        'test-secret',
        '2024-01-15T00:00:00Z',
        'GET',
        '/v1/accounts/123/balances',
      );
      const signature2 = generateSignature(
        'test-secret',
        '2024-01-15T00:00:00Z',
        'GET',
        '/v1/accounts/123/balances',
      );
      expect(signature1).toBe(signature2);
    });

    it('should generate different signatures for different timestamps', () => {
      const signature1 = generateSignature(
        'test-secret',
        '2024-01-15T00:00:00Z',
        'GET',
        '/v1/accounts/123/balances',
      );
      const signature2 = generateSignature(
        'test-secret',
        '2024-01-15T00:00:01Z',
        'GET',
        '/v1/accounts/123/balances',
      );
      expect(signature1).not.toBe(signature2);
    });

    it('should generate different signatures for different methods', () => {
      const signature1 = generateSignature(
        'test-secret',
        '2024-01-15T00:00:00Z',
        'GET',
        '/v1/accounts/123/balances',
      );
      const signature2 = generateSignature(
        'test-secret',
        '2024-01-15T00:00:00Z',
        'POST',
        '/v1/accounts/123/balances',
      );
      expect(signature1).not.toBe(signature2);
    });

    it('should include body in signature for POST requests', () => {
      const signatureWithoutBody = generateSignature(
        'test-secret',
        '2024-01-15T00:00:00Z',
        'POST',
        '/v1/orders',
      );
      const signatureWithBody = generateSignature(
        'test-secret',
        '2024-01-15T00:00:00Z',
        'POST',
        '/v1/orders',
        '{"symbol":"BTC/USD"}',
      );
      expect(signatureWithoutBody).not.toBe(signatureWithBody);
    });

    it('should produce hex string', () => {
      const signature = generateSignature(
        'test-secret',
        '2024-01-15T00:00:00Z',
        'GET',
        '/v1/status',
      );
      expect(signature).toMatch(/^[0-9a-f]+$/);
      expect(signature).toHaveLength(64); // SHA-256 produces 64 hex characters
    });
  });

  describe('getBaseUrl', () => {
    it('should return production URL for production environment', () => {
      expect(getBaseUrl('production')).toBe(BASE_URLS.production);
    });

    it('should return sandbox URL for sandbox environment', () => {
      expect(getBaseUrl('sandbox')).toBe(BASE_URLS.sandbox);
    });

    it('should return sandbox URL for unknown environment', () => {
      expect(getBaseUrl('unknown')).toBe(BASE_URLS.sandbox);
    });
  });

  describe('replacePathParams', () => {
    it('should replace single path parameter', () => {
      const result = replacePathParams(
        '/v1/accounts/{accountId}/balances',
        { accountId: 'ACC-123' },
      );
      expect(result).toBe('/v1/accounts/ACC-123/balances');
    });

    it('should replace multiple path parameters', () => {
      const result = replacePathParams(
        '/v1/accounts/{accountId}/orders/{orderId}',
        { accountId: 'ACC-123', orderId: 'ORD-456' },
      );
      expect(result).toBe('/v1/accounts/ACC-123/orders/ORD-456');
    });

    it('should URL encode parameter values', () => {
      const result = replacePathParams(
        '/v1/accounts/{accountId}',
        { accountId: 'ACC/123' },
      );
      expect(result).toBe('/v1/accounts/ACC%2F123');
    });

    it('should handle empty params object', () => {
      const result = replacePathParams('/v1/status', {});
      expect(result).toBe('/v1/status');
    });
  });
});
