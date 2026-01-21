/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { ICredentialType, INodeProperties } from 'n8n-workflow';

export class RipplePrimeWebSocket implements ICredentialType {
  name = 'ripplePrimeWebSocket';
  displayName = 'Ripple Prime WebSocket';
  documentationUrl = 'https://docs.ripple.com/prime/websocket';

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
        { name: 'API Key', value: 'apiKey' },
        { name: 'JWT Token', value: 'jwt' },
        { name: 'OAuth 2.0', value: 'oauth2' },
      ],
      default: 'apiKey',
      description: 'Select the authentication method for WebSocket',
    },
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      displayOptions: {
        show: { authMethod: ['apiKey'] },
      },
      description: 'Your API key for WebSocket authentication',
    },
    {
      displayName: 'API Secret',
      name: 'apiSecret',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      displayOptions: {
        show: { authMethod: ['apiKey'] },
      },
      description: 'Your API secret for signing',
    },
    {
      displayName: 'JWT Token',
      name: 'jwtToken',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      displayOptions: {
        show: { authMethod: ['jwt'] },
      },
      description: 'JWT token for authentication',
    },
    {
      displayName: 'Default Subscription Topics',
      name: 'defaultTopics',
      type: 'multiOptions',
      options: [
        { name: 'Account Balances', value: 'account.balances' },
        { name: 'Account Positions', value: 'account.positions' },
        { name: 'Order Updates', value: 'orders.updates' },
        { name: 'Trade Executions', value: 'trades.executions' },
        { name: 'Risk Alerts', value: 'risk.alerts' },
        { name: 'Market Data', value: 'market.data' },
        { name: 'Settlement Events', value: 'settlement.events' },
      ],
      default: ['account.balances', 'orders.updates'],
      description: 'Default topics to subscribe to on connect',
    },
    {
      displayName: 'Keep-Alive Interval (seconds)',
      name: 'keepAliveInterval',
      type: 'number',
      default: 30,
      description: 'Interval for WebSocket ping/pong keep-alive',
    },
    {
      displayName: 'Auto-Reconnect',
      name: 'autoReconnect',
      type: 'boolean',
      default: true,
      description: 'Whether to automatically reconnect on connection loss',
    },
    {
      displayName: 'Reconnect Interval (seconds)',
      name: 'reconnectInterval',
      type: 'number',
      default: 5,
      displayOptions: {
        show: { autoReconnect: [true] },
      },
      description: 'Seconds to wait before attempting reconnection',
    },
    {
      displayName: 'Max Reconnect Attempts',
      name: 'maxReconnectAttempts',
      type: 'number',
      default: 10,
      displayOptions: {
        show: { autoReconnect: [true] },
      },
      description: 'Maximum number of reconnection attempts (0 for unlimited)',
    },
  ];
}
