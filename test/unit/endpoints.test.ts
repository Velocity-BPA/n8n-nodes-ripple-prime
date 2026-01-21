/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { BASE_URLS, WS_URLS, ENDPOINTS } from '../../nodes/RipplePrime/constants/endpoints';

describe('Endpoints Constants', () => {
  describe('BASE_URLS', () => {
    it('should have production URL', () => {
      expect(BASE_URLS.production).toBeDefined();
      expect(BASE_URLS.production).toContain('api.ripple.com');
    });

    it('should have sandbox URL', () => {
      expect(BASE_URLS.sandbox).toBeDefined();
      expect(BASE_URLS.sandbox).toContain('sandbox');
    });
  });

  describe('WS_URLS', () => {
    it('should have WebSocket production URL', () => {
      expect(WS_URLS.production).toBeDefined();
      expect(WS_URLS.production).toMatch(/^wss:\/\//);
    });

    it('should have WebSocket sandbox URL', () => {
      expect(WS_URLS.sandbox).toBeDefined();
      expect(WS_URLS.sandbox).toMatch(/^wss:\/\//);
      expect(WS_URLS.sandbox).toContain('sandbox');
    });
  });

  describe('ENDPOINTS', () => {
    it('should have health endpoint', () => {
      expect(ENDPOINTS.HEALTH).toBe('/v1/health');
    });

    it('should have account endpoints', () => {
      expect(ENDPOINTS.ACCOUNT).toBeDefined();
      expect(ENDPOINTS.ACCOUNT.BALANCES).toContain('balances');
      expect(ENDPOINTS.ACCOUNT.TRADES).toContain('trades');
      expect(ENDPOINTS.ACCOUNT.POSITIONS).toContain('positions');
    });

    it('should have risk endpoints', () => {
      expect(ENDPOINTS.RISK).toBeDefined();
      expect(ENDPOINTS.RISK.MARGIN).toContain('margin');
      expect(ENDPOINTS.RISK.VAR).toContain('var');
    });

    it('should have trading endpoints', () => {
      expect(ENDPOINTS.TRADING).toBeDefined();
      expect(ENDPOINTS.TRADING.ORDERS).toContain('orders');
      expect(ENDPOINTS.TRADING.FILLS).toContain('fills');
    });

    it('should have FX endpoints', () => {
      expect(ENDPOINTS.FX).toBeDefined();
      expect(ENDPOINTS.FX.SPOT).toContain('spot');
      expect(ENDPOINTS.FX.FORWARD).toContain('forward');
    });

    it('should have digital assets endpoints', () => {
      expect(ENDPOINTS.DIGITAL_ASSETS).toBeDefined();
      expect(ENDPOINTS.DIGITAL_ASSETS.BALANCES).toContain('balances');
      expect(ENDPOINTS.DIGITAL_ASSETS.STAKING).toContain('staking');
    });

    it('should have derivatives endpoints', () => {
      expect(ENDPOINTS.DERIVATIVES).toBeDefined();
      expect(ENDPOINTS.DERIVATIVES.FUTURES).toContain('futures');
      expect(ENDPOINTS.DERIVATIVES.OPTIONS).toContain('options');
    });

    it('should have fixed income endpoints', () => {
      expect(ENDPOINTS.FIXED_INCOME).toBeDefined();
      expect(ENDPOINTS.FIXED_INCOME.BONDS).toContain('bonds');
      expect(ENDPOINTS.FIXED_INCOME.REPO).toContain('repo');
    });

    it('should have prime brokerage endpoints', () => {
      expect(ENDPOINTS.PRIME).toBeDefined();
      expect(ENDPOINTS.PRIME.SERVICES).toContain('services');
      expect(ENDPOINTS.PRIME.CUSTODY).toContain('custody');
    });

    it('should have Route28 endpoints', () => {
      expect(ENDPOINTS.ROUTE28).toBeDefined();
      expect(ENDPOINTS.ROUTE28.SWAPS).toContain('swaps');
      expect(ENDPOINTS.ROUTE28.PNL).toContain('pnl');
    });

    it('should have collateral endpoints', () => {
      expect(ENDPOINTS.COLLATERAL).toBeDefined();
      expect(ENDPOINTS.COLLATERAL.POSITIONS).toContain('positions');
      expect(ENDPOINTS.COLLATERAL.HAIRCUTS).toContain('haircuts');
    });

    it('should have settlement endpoints', () => {
      expect(ENDPOINTS.SETTLEMENT).toBeDefined();
      expect(ENDPOINTS.SETTLEMENT.NETTING).toContain('netting');
      expect(ENDPOINTS.SETTLEMENT.SSI).toContain('ssi');
    });

    it('should have reporting endpoints', () => {
      expect(ENDPOINTS.REPORTING).toBeDefined();
      expect(ENDPOINTS.REPORTING.BITEMPORAL).toContain('bitemporal');
    });

    it('should have compliance endpoints', () => {
      expect(ENDPOINTS.COMPLIANCE).toBeDefined();
      expect(ENDPOINTS.COMPLIANCE.AML).toContain('aml');
      expect(ENDPOINTS.COMPLIANCE.SANCTIONS).toContain('sanctions');
    });

    it('should have webhook endpoints', () => {
      expect(ENDPOINTS.WEBHOOK).toBeDefined();
      expect(ENDPOINTS.WEBHOOK.LIST).toContain('webhooks');
      expect(ENDPOINTS.WEBHOOK.EVENTS).toContain('events');
    });

    it('should have utility endpoints', () => {
      expect(ENDPOINTS.UTILITY).toBeDefined();
      expect(ENDPOINTS.UTILITY.PING).toContain('ping');
      expect(ENDPOINTS.UTILITY.TIME).toContain('time');
    });

    it('should use path parameters with curly braces', () => {
      expect(ENDPOINTS.ACCOUNT.BALANCES).toContain('{accountId}');
      expect(ENDPOINTS.WEBHOOK.GET).toContain('{webhookId}');
      expect(ENDPOINTS.COUNTERPARTY.DETAILS).toContain('{counterpartyId}');
    });
  });
});
