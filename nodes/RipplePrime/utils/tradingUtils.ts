/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Trading Utilities
 */

/**
 * Validate order parameters
 */
export function validateOrder(params: {
  symbol: string;
  side: string;
  quantity: number;
  price?: number;
  orderType: string;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!params.symbol || params.symbol.trim() === '') {
    errors.push('Symbol is required');
  }

  if (!['buy', 'sell'].includes(params.side)) {
    errors.push('Side must be "buy" or "sell"');
  }

  if (params.quantity <= 0) {
    errors.push('Quantity must be greater than 0');
  }

  if (params.orderType === 'limit' && (params.price === undefined || params.price <= 0)) {
    errors.push('Price is required for limit orders and must be greater than 0');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Calculate order value
 */
export function calculateOrderValue(quantity: number, price: number): number {
  return Math.round(quantity * price * 100) / 100;
}

/**
 * Calculate commission
 */
export function calculateCommission(
  orderValue: number,
  rate: number,
  minCommission = 0,
  maxCommission = Infinity,
): number {
  const commission = orderValue * rate;
  return Math.min(Math.max(commission, minCommission), maxCommission);
}

/**
 * Format currency amount
 */
export function formatCurrency(amount: number, currency = 'USD', decimals = 2): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}

/**
 * Parse quantity with support for lots
 */
export function parseQuantity(input: string | number, lotSize = 1): number {
  const value = typeof input === 'string' ? parseFloat(input) : input;
  return Math.round(value * lotSize * 100) / 100;
}

/**
 * Calculate P&L
 */
export function calculatePnL(
  entryPrice: number,
  currentPrice: number,
  quantity: number,
  side: 'buy' | 'sell',
): number {
  const priceDiff = currentPrice - entryPrice;
  const multiplier = side === 'buy' ? 1 : -1;
  return Math.round(priceDiff * quantity * multiplier * 100) / 100;
}

/**
 * Calculate percentage change
 */
export function calculatePercentageChange(oldValue: number, newValue: number): number {
  if (oldValue === 0) return 0;
  return Math.round(((newValue - oldValue) / oldValue) * 10000) / 100;
}

/**
 * Generate unique client order ID
 */
export function generateClientOrderId(prefix = 'ORD'): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}-${timestamp}-${random}`.toUpperCase();
}

/**
 * Validate FX currency pair
 */
export function validateCurrencyPair(pair: string): boolean {
  const regex = /^[A-Z]{3}\/[A-Z]{3}$/;
  return regex.test(pair);
}

/**
 * Parse FX currency pair
 */
export function parseCurrencyPair(pair: string): { base: string; quote: string } | null {
  if (!validateCurrencyPair(pair)) return null;
  const [base, quote] = pair.split('/');
  return { base, quote };
}

/**
 * Calculate FX pip value
 */
export function calculatePipValue(
  lotSize: number,
  pipSize = 0.0001,
  conversionRate = 1,
): number {
  return Math.round(lotSize * pipSize * conversionRate * 100) / 100;
}

/**
 * Round to tick size
 */
export function roundToTickSize(price: number, tickSize: number): number {
  return Math.round(price / tickSize) * tickSize;
}
