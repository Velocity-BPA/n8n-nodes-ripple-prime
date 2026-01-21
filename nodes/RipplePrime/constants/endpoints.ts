/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Ripple Prime API Endpoints
 */

export const BASE_URLS = {
  production: 'https://api.ripple.com/prime',
  sandbox: 'https://sandbox.api.ripple.com/prime',
} as const;

export const WS_URLS = {
  production: 'wss://ws.ripple.com/prime',
  sandbox: 'wss://sandbox.ws.ripple.com/prime',
} as const;

export const ENDPOINTS = {
  // Health & Status
  HEALTH: '/v1/health',
  STATUS: '/v1/status',

  // Account Activity
  ACCOUNT: {
    BALANCES: '/v1/accounts/{accountId}/balances',
    TRADES: '/v1/accounts/{accountId}/trades',
    POSITIONS: '/v1/accounts/{accountId}/positions',
    FEES: '/v1/accounts/{accountId}/fees',
    SETTLEMENTS: '/v1/accounts/{accountId}/settlements',
    STATEMENTS: '/v1/accounts/{accountId}/statements',
    SNAPSHOT: '/v1/accounts/{accountId}/snapshot',
  },

  // Risk Metrics
  RISK: {
    CREDIT_UTILIZATION: '/v1/risk/credit-utilization',
    CREDIT_LIMITS: '/v1/risk/credit-limits',
    MARGIN: '/v1/risk/margin',
    EXPOSURE: '/v1/risk/exposure',
    COUNTERPARTY: '/v1/risk/counterparty',
    VAR: '/v1/risk/var',
    STRESS_TEST: '/v1/risk/stress-test',
    ALERTS: '/v1/risk/alerts',
  },

  // Treasury
  TREASURY: {
    TRANSFERS: '/v1/treasury/transfers',
    TRANSFER_STATUS: '/v1/treasury/transfers/{transferId}',
    SWEEPS: '/v1/treasury/sweeps',
    COLLATERAL: '/v1/treasury/collateral',
    COLLATERAL_OPTIMIZE: '/v1/treasury/collateral/optimize',
    FUNDING: '/v1/treasury/funding',
    MARGIN_CALLS: '/v1/treasury/margin-calls',
  },

  // Trading
  TRADING: {
    ORDERS: '/v1/trading/orders',
    ORDER: '/v1/trading/orders/{orderId}',
    FILLS: '/v1/trading/fills',
    EXECUTIONS: '/v1/trading/executions',
    RFQ: '/v1/trading/rfq',
    CONFIRMATIONS: '/v1/trading/confirmations',
    ALLOCATIONS: '/v1/trading/allocations',
  },

  // FX Trading
  FX: {
    QUOTE: '/v1/fx/quote',
    SPOT: '/v1/fx/spot',
    FORWARD: '/v1/fx/forward',
    SWAP: '/v1/fx/swap',
    NDF: '/v1/fx/ndf',
    POSITIONS: '/v1/fx/positions',
    SETTLEMENTS: '/v1/fx/settlements',
    BLOTTER: '/v1/fx/blotter',
    ROLL: '/v1/fx/roll',
  },

  // Digital Assets
  DIGITAL_ASSETS: {
    BALANCES: '/v1/digital-assets/balances',
    ORDERS: '/v1/digital-assets/orders',
    MARKETS: '/v1/digital-assets/markets',
    QUOTE: '/v1/digital-assets/quote',
    POSITIONS: '/v1/digital-assets/positions',
    WITHDRAWALS: '/v1/digital-assets/withdrawals',
    DEPOSITS: '/v1/digital-assets/deposits',
    WALLETS: '/v1/digital-assets/wallets',
    STAKING: '/v1/digital-assets/staking',
  },

  // Derivatives
  DERIVATIVES: {
    FUTURES: '/v1/derivatives/futures',
    OPTIONS: '/v1/derivatives/options',
    POSITIONS: '/v1/derivatives/positions',
    MARGIN: '/v1/derivatives/margin',
    EXERCISE: '/v1/derivatives/exercise',
    EXPIRY: '/v1/derivatives/expiry',
    GREEKS: '/v1/derivatives/greeks',
    SETTLEMENTS: '/v1/derivatives/settlements',
  },

  // Fixed Income
  FIXED_INCOME: {
    BONDS: '/v1/fixed-income/bonds',
    REPO: '/v1/fixed-income/repo',
    LENDING: '/v1/fixed-income/lending',
    YIELDS: '/v1/fixed-income/yields',
    POSITIONS: '/v1/fixed-income/positions',
    SETTLEMENTS: '/v1/fixed-income/settlements',
    COUPONS: '/v1/fixed-income/coupons',
    MATURITIES: '/v1/fixed-income/maturities',
  },

  // Prime Brokerage
  PRIME: {
    SERVICES: '/v1/prime/services',
    FINANCING: '/v1/prime/financing',
    LOCATE: '/v1/prime/locate',
    BORROW: '/v1/prime/borrow',
    CUSTODY: '/v1/prime/custody',
    CLEARING: '/v1/prime/clearing',
    REPORTING: '/v1/prime/reporting',
    AGREEMENT: '/v1/prime/agreement',
  },

  // Route28
  ROUTE28: {
    POSITIONS: '/v1/route28/positions',
    SWAPS: '/v1/route28/swaps',
    MARGIN: '/v1/route28/margin',
    COLLATERAL: '/v1/route28/collateral',
    PNL: '/v1/route28/pnl',
    REBALANCE: '/v1/route28/rebalance',
    FUNDING: '/v1/route28/funding',
    TERMINATION: '/v1/route28/termination',
  },

  // Collateral
  COLLATERAL: {
    POSITIONS: '/v1/collateral/positions',
    MOVEMENTS: '/v1/collateral/movements',
    HAIRCUTS: '/v1/collateral/haircuts',
    VALUATIONS: '/v1/collateral/valuations',
    ELIGIBLE: '/v1/collateral/eligible',
    SUBSTITUTION: '/v1/collateral/substitution',
    OPTIMIZATION: '/v1/collateral/optimization',
    DISPUTES: '/v1/collateral/disputes',
  },

  // Settlement
  SETTLEMENT: {
    INSTRUCTIONS: '/v1/settlement/instructions',
    PENDING: '/v1/settlement/pending',
    HISTORY: '/v1/settlement/history',
    NETTING: '/v1/settlement/netting',
    FAILS: '/v1/settlement/fails',
    SSI: '/v1/settlement/ssi',
    RECONCILIATION: '/v1/settlement/reconciliation',
    CONFIRMATION: '/v1/settlement/confirmation',
  },

  // Reporting
  REPORTING: {
    STANDARD: '/v1/reporting/standard',
    CUSTOM: '/v1/reporting/custom',
    SCHEDULE: '/v1/reporting/schedule',
    HISTORY: '/v1/reporting/history',
    TEMPLATES: '/v1/reporting/templates',
    EXPORT: '/v1/reporting/export',
    BITEMPORAL: '/v1/reporting/bitemporal',
    ANALYTICS: '/v1/reporting/analytics',
  },

  // Counterparty
  COUNTERPARTY: {
    LIST: '/v1/counterparty',
    DETAILS: '/v1/counterparty/{counterpartyId}',
    LIMITS: '/v1/counterparty/{counterpartyId}/limits',
    AGREEMENTS: '/v1/counterparty/{counterpartyId}/agreements',
    EXPOSURE: '/v1/counterparty/{counterpartyId}/exposure',
    NETTING: '/v1/counterparty/{counterpartyId}/netting',
    CREDIT: '/v1/counterparty/{counterpartyId}/credit',
    ONBOARDING: '/v1/counterparty/onboarding',
  },

  // Exchange
  EXCHANGE: {
    LIST: '/v1/exchange',
    STATUS: '/v1/exchange/{exchangeId}/status',
    BALANCES: '/v1/exchange/{exchangeId}/balances',
    TRANSFER_TO: '/v1/exchange/{exchangeId}/transfer/to',
    TRANSFER_FROM: '/v1/exchange/{exchangeId}/transfer/from',
    SUPPORTED: '/v1/exchange/supported',
    FEES: '/v1/exchange/{exchangeId}/fees',
    MARKETS: '/v1/exchange/{exchangeId}/markets',
  },

  // Compliance
  COMPLIANCE: {
    STATUS: '/v1/compliance/status',
    SURVEILLANCE: '/v1/compliance/surveillance',
    AML: '/v1/compliance/aml',
    REGULATORY: '/v1/compliance/regulatory',
    AUDIT: '/v1/compliance/audit',
    SOC2: '/v1/compliance/soc2',
    KYC: '/v1/compliance/kyc',
    SANCTIONS: '/v1/compliance/sanctions',
  },

  // Webhook
  WEBHOOK: {
    LIST: '/v1/webhooks',
    CREATE: '/v1/webhooks',
    GET: '/v1/webhooks/{webhookId}',
    UPDATE: '/v1/webhooks/{webhookId}',
    DELETE: '/v1/webhooks/{webhookId}',
    EVENTS: '/v1/webhooks/events',
    TEST: '/v1/webhooks/{webhookId}/test',
    LOGS: '/v1/webhooks/{webhookId}/logs',
  },

  // Utility
  UTILITY: {
    API_STATUS: '/v1/utility/status',
    ASSETS: '/v1/utility/assets',
    MARKETS: '/v1/utility/markets',
    TRADING_HOURS: '/v1/utility/trading-hours',
    HOLIDAYS: '/v1/utility/holidays',
    FEE_SCHEDULE: '/v1/utility/fee-schedule',
    RATE_LIMITS: '/v1/utility/rate-limits',
    VERSION: '/v1/utility/version',
    PING: '/v1/utility/ping',
    TIME: '/v1/utility/time',
  },
} as const;
