/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  validateOrder,
  calculateOrderValue,
  calculateCommission,
  formatCurrency,
  parseQuantity,
  calculatePnL,
  calculatePercentageChange,
  generateClientOrderId,
  validateCurrencyPair,
  parseCurrencyPair,
  calculatePipValue,
  roundToTickSize,
} from '../../nodes/RipplePrime/utils/tradingUtils';

describe('Trading Utilities', () => {
  describe('validateOrder', () => {
    it('should validate a valid limit order', () => {
      const result = validateOrder({
        symbol: 'BTC/USD',
        side: 'buy',
        quantity: 1,
        price: 45000,
        orderType: 'limit',
      });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate a valid market order', () => {
      const result = validateOrder({
        symbol: 'ETH/USD',
        side: 'sell',
        quantity: 10,
        orderType: 'market',
      });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject order with missing symbol', () => {
      const result = validateOrder({
        symbol: '',
        side: 'buy',
        quantity: 1,
        price: 100,
        orderType: 'limit',
      });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Symbol is required');
    });

    it('should reject order with invalid side', () => {
      const result = validateOrder({
        symbol: 'BTC/USD',
        side: 'hold',
        quantity: 1,
        price: 100,
        orderType: 'limit',
      });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Side must be "buy" or "sell"');
    });

    it('should reject order with zero quantity', () => {
      const result = validateOrder({
        symbol: 'BTC/USD',
        side: 'buy',
        quantity: 0,
        price: 100,
        orderType: 'limit',
      });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Quantity must be greater than 0');
    });

    it('should reject limit order without price', () => {
      const result = validateOrder({
        symbol: 'BTC/USD',
        side: 'buy',
        quantity: 1,
        orderType: 'limit',
      });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Price is required for limit orders and must be greater than 0');
    });
  });

  describe('calculateOrderValue', () => {
    it('should calculate order value correctly', () => {
      expect(calculateOrderValue(10, 100)).toBe(1000);
      expect(calculateOrderValue(1.5, 45000)).toBe(67500);
      expect(calculateOrderValue(0.001, 50000)).toBe(50);
    });

    it('should round to 2 decimal places', () => {
      expect(calculateOrderValue(1, 99.999)).toBe(100);
      expect(calculateOrderValue(3, 33.333)).toBe(100);
    });
  });

  describe('calculateCommission', () => {
    it('should calculate commission correctly', () => {
      expect(calculateCommission(10000, 0.001)).toBe(10);
      expect(calculateCommission(50000, 0.0005)).toBe(25);
    });

    it('should apply minimum commission', () => {
      expect(calculateCommission(100, 0.001, 5)).toBe(5);
    });

    it('should apply maximum commission', () => {
      expect(calculateCommission(1000000, 0.01, 0, 100)).toBe(100);
    });
  });

  describe('formatCurrency', () => {
    it('should format USD correctly', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
      expect(formatCurrency(1000000)).toBe('$1,000,000.00');
    });

    it('should format other currencies', () => {
      expect(formatCurrency(1234.56, 'EUR')).toBe('€1,234.56');
      expect(formatCurrency(1234.56, 'GBP')).toBe('£1,234.56');
    });

    it('should handle custom decimal places', () => {
      expect(formatCurrency(1234.5678, 'USD', 4)).toBe('$1,234.5678');
    });
  });

  describe('parseQuantity', () => {
    it('should parse numeric quantity', () => {
      expect(parseQuantity(10)).toBe(10);
      expect(parseQuantity(1.5)).toBe(1.5);
    });

    it('should parse string quantity', () => {
      expect(parseQuantity('10')).toBe(10);
      expect(parseQuantity('1.5')).toBe(1.5);
    });

    it('should apply lot size', () => {
      expect(parseQuantity(1, 100)).toBe(100);
      expect(parseQuantity(2.5, 100)).toBe(250);
    });
  });

  describe('calculatePnL', () => {
    it('should calculate profit for long position', () => {
      expect(calculatePnL(100, 110, 10, 'buy')).toBe(100);
      expect(calculatePnL(45000, 50000, 1, 'buy')).toBe(5000);
    });

    it('should calculate loss for long position', () => {
      expect(calculatePnL(100, 90, 10, 'buy')).toBe(-100);
    });

    it('should calculate profit for short position', () => {
      expect(calculatePnL(100, 90, 10, 'sell')).toBe(100);
    });

    it('should calculate loss for short position', () => {
      expect(calculatePnL(100, 110, 10, 'sell')).toBe(-100);
    });
  });

  describe('calculatePercentageChange', () => {
    it('should calculate positive change', () => {
      expect(calculatePercentageChange(100, 110)).toBe(10);
      expect(calculatePercentageChange(50, 75)).toBe(50);
    });

    it('should calculate negative change', () => {
      expect(calculatePercentageChange(100, 90)).toBe(-10);
      expect(calculatePercentageChange(100, 50)).toBe(-50);
    });

    it('should handle zero old value', () => {
      expect(calculatePercentageChange(0, 100)).toBe(0);
    });
  });

  describe('generateClientOrderId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateClientOrderId();
      const id2 = generateClientOrderId();
      expect(id1).not.toBe(id2);
    });

    it('should use custom prefix', () => {
      const id = generateClientOrderId('TEST');
      expect(id.startsWith('TEST-')).toBe(true);
    });

    it('should be uppercase', () => {
      const id = generateClientOrderId();
      expect(id).toBe(id.toUpperCase());
    });
  });

  describe('validateCurrencyPair', () => {
    it('should validate correct pairs', () => {
      expect(validateCurrencyPair('EUR/USD')).toBe(true);
      expect(validateCurrencyPair('GBP/JPY')).toBe(true);
      expect(validateCurrencyPair('USD/CHF')).toBe(true);
    });

    it('should reject invalid pairs', () => {
      expect(validateCurrencyPair('EURUSD')).toBe(false);
      expect(validateCurrencyPair('EUR-USD')).toBe(false);
      expect(validateCurrencyPair('EU/USD')).toBe(false);
      expect(validateCurrencyPair('EUR/US')).toBe(false);
    });
  });

  describe('parseCurrencyPair', () => {
    it('should parse valid pairs', () => {
      expect(parseCurrencyPair('EUR/USD')).toEqual({ base: 'EUR', quote: 'USD' });
      expect(parseCurrencyPair('GBP/JPY')).toEqual({ base: 'GBP', quote: 'JPY' });
    });

    it('should return null for invalid pairs', () => {
      expect(parseCurrencyPair('EURUSD')).toBeNull();
      expect(parseCurrencyPair('invalid')).toBeNull();
    });
  });

  describe('calculatePipValue', () => {
    it('should calculate pip value for standard lot', () => {
      expect(calculatePipValue(100000, 0.0001, 1)).toBe(10);
    });

    it('should calculate pip value for mini lot', () => {
      expect(calculatePipValue(10000, 0.0001, 1)).toBe(1);
    });

    it('should apply conversion rate', () => {
      expect(calculatePipValue(100000, 0.0001, 0.85)).toBe(8.5);
    });
  });

  describe('roundToTickSize', () => {
    it('should round to tick size', () => {
      expect(roundToTickSize(100.123, 0.01)).toBe(100.12);
      expect(roundToTickSize(100.126, 0.01)).toBe(100.13);
      expect(roundToTickSize(100.5, 0.25)).toBe(100.5);
      expect(roundToTickSize(100.6, 0.25)).toBe(100.5);
      expect(roundToTickSize(100.7, 0.25)).toBe(100.75);
    });
  });
});
