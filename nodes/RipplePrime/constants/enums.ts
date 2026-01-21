/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Ripple Prime Enumerations and Types
 */

export const ORDER_TYPES = [
  { name: 'Market', value: 'market' },
  { name: 'Limit', value: 'limit' },
  { name: 'Stop', value: 'stop' },
  { name: 'Stop Limit', value: 'stop_limit' },
  { name: 'Trailing Stop', value: 'trailing_stop' },
  { name: 'Fill or Kill', value: 'fok' },
  { name: 'Immediate or Cancel', value: 'ioc' },
  { name: 'Good Till Cancel', value: 'gtc' },
  { name: 'Good Till Date', value: 'gtd' },
  { name: 'TWAP', value: 'twap' },
  { name: 'VWAP', value: 'vwap' },
  { name: 'Iceberg', value: 'iceberg' },
] as const;

export const ORDER_SIDES = [
  { name: 'Buy', value: 'buy' },
  { name: 'Sell', value: 'sell' },
] as const;

export const ORDER_STATUSES = [
  { name: 'Pending', value: 'pending' },
  { name: 'Open', value: 'open' },
  { name: 'Partially Filled', value: 'partially_filled' },
  { name: 'Filled', value: 'filled' },
  { name: 'Cancelled', value: 'cancelled' },
  { name: 'Rejected', value: 'rejected' },
  { name: 'Expired', value: 'expired' },
] as const;

export const ASSET_CLASSES = [
  { name: 'Equity', value: 'equity' },
  { name: 'FX', value: 'fx' },
  { name: 'Crypto', value: 'crypto' },
  { name: 'Fixed Income', value: 'fixed_income' },
  { name: 'Derivatives', value: 'derivatives' },
  { name: 'Commodities', value: 'commodities' },
] as const;

export const COLLATERAL_TYPES = [
  { name: 'BUIDL (BlackRock)', value: 'buidl' },
  { name: 'RLUSD (Ripple)', value: 'rlusd' },
  { name: 'Cash', value: 'cash' },
  { name: 'US Treasuries', value: 'us_treasury' },
  { name: 'Equity', value: 'equity' },
  { name: 'Crypto', value: 'crypto' },
  { name: 'Corporate Bonds', value: 'corporate_bonds' },
  { name: 'Money Market', value: 'money_market' },
] as const;

export const CURRENCIES = [
  { name: 'USD', value: 'USD' },
  { name: 'EUR', value: 'EUR' },
  { name: 'GBP', value: 'GBP' },
  { name: 'JPY', value: 'JPY' },
  { name: 'CHF', value: 'CHF' },
  { name: 'CAD', value: 'CAD' },
  { name: 'AUD', value: 'AUD' },
  { name: 'NZD', value: 'NZD' },
  { name: 'HKD', value: 'HKD' },
  { name: 'SGD', value: 'SGD' },
] as const;

export const CRYPTO_ASSETS = [
  { name: 'Bitcoin (BTC)', value: 'BTC' },
  { name: 'Ethereum (ETH)', value: 'ETH' },
  { name: 'XRP', value: 'XRP' },
  { name: 'Solana (SOL)', value: 'SOL' },
  { name: 'USDC', value: 'USDC' },
  { name: 'USDT', value: 'USDT' },
  { name: 'RLUSD', value: 'RLUSD' },
] as const;

export const TRANSFER_TYPES = [
  { name: 'Internal', value: 'internal' },
  { name: 'External', value: 'external' },
  { name: 'Wire', value: 'wire' },
  { name: 'ACH', value: 'ach' },
  { name: 'SWIFT', value: 'swift' },
  { name: 'SEPA', value: 'sepa' },
  { name: 'Blockchain', value: 'blockchain' },
] as const;

export const TRANSFER_STATUSES = [
  { name: 'Pending', value: 'pending' },
  { name: 'Processing', value: 'processing' },
  { name: 'Completed', value: 'completed' },
  { name: 'Failed', value: 'failed' },
  { name: 'Cancelled', value: 'cancelled' },
] as const;

export const REPORT_TYPES = [
  { name: 'Daily Activity', value: 'daily_activity' },
  { name: 'Monthly Statement', value: 'monthly_statement' },
  { name: 'Trade Confirmation', value: 'trade_confirmation' },
  { name: 'Position Summary', value: 'position_summary' },
  { name: 'Risk Report', value: 'risk_report' },
  { name: 'Margin Report', value: 'margin_report' },
  { name: 'Fee Summary', value: 'fee_summary' },
  { name: 'Settlement Report', value: 'settlement_report' },
  { name: 'Compliance Report', value: 'compliance_report' },
  { name: 'Tax Report', value: 'tax_report' },
] as const;

export const REPORT_FORMATS = [
  { name: 'PDF', value: 'pdf' },
  { name: 'CSV', value: 'csv' },
  { name: 'Excel', value: 'xlsx' },
  { name: 'JSON', value: 'json' },
  { name: 'XML', value: 'xml' },
] as const;

export const WEBHOOK_EVENTS = [
  { name: 'Balance Update', value: 'balance.update' },
  { name: 'Trade Executed', value: 'trade.executed' },
  { name: 'Order Filled', value: 'order.filled' },
  { name: 'Order Cancelled', value: 'order.cancelled' },
  { name: 'Order Rejected', value: 'order.rejected' },
  { name: 'Position Update', value: 'position.update' },
  { name: 'Margin Call', value: 'margin.call' },
  { name: 'Risk Alert', value: 'risk.alert' },
  { name: 'Settlement Complete', value: 'settlement.complete' },
  { name: 'Settlement Failed', value: 'settlement.failed' },
  { name: 'Transfer Complete', value: 'transfer.complete' },
  { name: 'Transfer Failed', value: 'transfer.failed' },
] as const;

export const FX_TENOR = [
  { name: 'Spot (T+2)', value: 'spot' },
  { name: 'Tom Next (T+1)', value: 'tom' },
  { name: 'Overnight', value: 'on' },
  { name: '1 Week', value: '1W' },
  { name: '2 Weeks', value: '2W' },
  { name: '1 Month', value: '1M' },
  { name: '2 Months', value: '2M' },
  { name: '3 Months', value: '3M' },
  { name: '6 Months', value: '6M' },
  { name: '9 Months', value: '9M' },
  { name: '1 Year', value: '1Y' },
  { name: '2 Years', value: '2Y' },
] as const;

export const OPTION_TYPES = [
  { name: 'Call', value: 'call' },
  { name: 'Put', value: 'put' },
] as const;

export const OPTION_STYLES = [
  { name: 'European', value: 'european' },
  { name: 'American', value: 'american' },
] as const;

export interface BitemporalQuery {
  asOf?: string;
  asAt?: string;
}

export interface PaginationParams {
  limit?: number;
  offset?: number;
  cursor?: string;
}

export interface DateRangeParams {
  startDate?: string;
  endDate?: string;
}
