/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  ITriggerFunctions,
  INodeType,
  INodeTypeDescription,
  ITriggerResponse,
} from 'n8n-workflow';
import WebSocket from 'ws';
import * as crypto from 'crypto';
import { WS_URLS } from './constants/endpoints';

export class RipplePrimeTrigger implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Ripple Prime Trigger',
    name: 'ripplePrimeTrigger',
    icon: 'file:ripplePrime.svg',
    group: ['trigger'],
    version: 1,
    subtitle: '={{$parameter["events"].join(", ")}}',
    description: 'Listen for real-time events from Ripple Prime via WebSocket',
    defaults: {
      name: 'Ripple Prime Trigger',
    },
    inputs: [],
    outputs: ['main'],
    credentials: [
      {
        name: 'ripplePrimeWebSocket',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Events',
        name: 'events',
        type: 'multiOptions',
        required: true,
        options: [
          // Balance Events
          { name: 'Balance Update', value: 'balance.update' },
          { name: 'Balance Alert', value: 'balance.alert' },
          // Trade Events
          { name: 'Trade Executed', value: 'trade.executed' },
          { name: 'Trade Confirmed', value: 'trade.confirmed' },
          { name: 'Trade Settled', value: 'trade.settled' },
          { name: 'Trade Failed', value: 'trade.failed' },
          // Order Events
          { name: 'Order Created', value: 'order.created' },
          { name: 'Order Filled', value: 'order.filled' },
          { name: 'Order Partially Filled', value: 'order.partial' },
          { name: 'Order Cancelled', value: 'order.cancelled' },
          { name: 'Order Rejected', value: 'order.rejected' },
          // Position Events
          { name: 'Position Opened', value: 'position.opened' },
          { name: 'Position Updated', value: 'position.updated' },
          { name: 'Position Closed', value: 'position.closed' },
          { name: 'Position Liquidated', value: 'position.liquidated' },
          // Risk Events
          { name: 'Margin Call', value: 'risk.margincall' },
          { name: 'Risk Alert', value: 'risk.alert' },
          { name: 'Limit Breach', value: 'risk.limitbreach' },
          { name: 'Exposure Alert', value: 'risk.exposure' },
          // Settlement Events
          { name: 'Settlement Pending', value: 'settlement.pending' },
          { name: 'Settlement Complete', value: 'settlement.complete' },
          { name: 'Settlement Failed', value: 'settlement.failed' },
          // Collateral Events
          { name: 'Collateral Received', value: 'collateral.received' },
          { name: 'Collateral Released', value: 'collateral.released' },
          { name: 'Collateral Call', value: 'collateral.call' },
          // Market Data Events
          { name: 'Price Update', value: 'market.price' },
          { name: 'Market Status', value: 'market.status' },
          // FX Events
          { name: 'FX Quote', value: 'fx.quote' },
          { name: 'FX Execution', value: 'fx.execution' },
          // Compliance Events
          { name: 'Compliance Alert', value: 'compliance.alert' },
          { name: 'AML Alert', value: 'compliance.aml' },
          // System Events
          { name: 'System Status', value: 'system.status' },
          { name: 'API Maintenance', value: 'system.maintenance' },
        ],
        default: ['trade.executed', 'order.filled'],
        description: 'Events to subscribe to',
      },
      {
        displayName: 'Filter by Account',
        name: 'filterByAccount',
        type: 'boolean',
        default: false,
        description: 'Whether to filter events by specific account ID',
      },
      {
        displayName: 'Account ID',
        name: 'accountId',
        type: 'string',
        default: '',
        displayOptions: {
          show: {
            filterByAccount: [true],
          },
        },
        description: 'Filter events for this account only',
      },
      {
        displayName: 'Filter by Symbol',
        name: 'filterBySymbol',
        type: 'boolean',
        default: false,
        description: 'Whether to filter events by specific symbol',
      },
      {
        displayName: 'Symbol',
        name: 'symbol',
        type: 'string',
        default: '',
        displayOptions: {
          show: {
            filterBySymbol: [true],
          },
        },
        description: 'Filter events for this symbol only (e.g., BTC/USD)',
      },
      {
        displayName: 'Options',
        name: 'options',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        options: [
          {
            displayName: 'Include Heartbeats',
            name: 'includeHeartbeats',
            type: 'boolean',
            default: false,
            description: 'Whether to include WebSocket heartbeat messages in output',
          },
          {
            displayName: 'Reconnect on Error',
            name: 'reconnectOnError',
            type: 'boolean',
            default: true,
            description: 'Whether to automatically reconnect on connection errors',
          },
          {
            displayName: 'Max Reconnect Attempts',
            name: 'maxReconnectAttempts',
            type: 'number',
            default: 5,
            description: 'Maximum number of reconnection attempts',
          },
          {
            displayName: 'Reconnect Interval (ms)',
            name: 'reconnectInterval',
            type: 'number',
            default: 5000,
            description: 'Time between reconnection attempts in milliseconds',
          },
        ],
      },
    ],
  };

  async trigger(this: ITriggerFunctions): Promise<ITriggerResponse> {
    const credentials = await this.getCredentials('ripplePrimeWebSocket');
    const events = this.getNodeParameter('events') as string[];
    const filterByAccount = this.getNodeParameter('filterByAccount') as boolean;
    const accountId = this.getNodeParameter('accountId', '') as string;
    const filterBySymbol = this.getNodeParameter('filterBySymbol') as boolean;
    const symbol = this.getNodeParameter('symbol', '') as string;
    const options = this.getNodeParameter('options', {}) as {
      includeHeartbeats?: boolean;
      reconnectOnError?: boolean;
      maxReconnectAttempts?: number;
      reconnectInterval?: number;
    };

    const environment = credentials.environment as string;
    const wsUrl = environment === 'production' ? WS_URLS.production : WS_URLS.sandbox;

    let ws: WebSocket | null = null;
    let reconnectAttempts = 0;
    let isClosing = false;

    const generateAuthMessage = (): string => {
      const timestamp = Date.now().toString();
      const message = `${timestamp}${credentials.apiKey}`;
      const signature = crypto
        .createHmac('sha256', credentials.apiSecret as string)
        .update(message)
        .digest('hex');

      return JSON.stringify({
        type: 'auth',
        apiKey: credentials.apiKey,
        timestamp,
        signature,
      });
    };

    const generateSubscribeMessage = (): string => {
      const subscriptions: any = {
        type: 'subscribe',
        channels: events,
      };

      if (filterByAccount && accountId) {
        subscriptions.accountId = accountId;
      }

      if (filterBySymbol && symbol) {
        subscriptions.symbol = symbol;
      }

      return JSON.stringify(subscriptions);
    };

    const connect = (): void => {
      ws = new WebSocket(wsUrl);

      ws.on('open', () => {
        reconnectAttempts = 0;
        // Authenticate
        ws?.send(generateAuthMessage());
      });

      ws.on('message', (data: WebSocket.Data) => {
        try {
          const message = JSON.parse(data.toString());

          // Handle authentication response
          if (message.type === 'auth_response') {
            if (message.status === 'success') {
              // Subscribe to events after successful auth
              ws?.send(generateSubscribeMessage());
            }
            return;
          }

          // Handle subscription confirmation
          if (message.type === 'subscribed') {
            return;
          }

          // Handle heartbeat
          if (message.type === 'heartbeat') {
            if (options.includeHeartbeats) {
              this.emit([this.helpers.returnJsonArray([message])]);
            }
            // Send pong response
            ws?.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
            return;
          }

          // Filter by account if specified
          if (filterByAccount && accountId && message.accountId !== accountId) {
            return;
          }

          // Filter by symbol if specified
          if (filterBySymbol && symbol && message.symbol !== symbol) {
            return;
          }

          // Check if event type is in our subscribed events
          if (events.includes(message.type) || events.some((e) => message.type?.startsWith(e))) {
            this.emit([
              this.helpers.returnJsonArray([
                {
                  event: message.type,
                  timestamp: message.timestamp || new Date().toISOString(),
                  data: message.data || message,
                  raw: message,
                },
              ]),
            ]);
          }
        } catch (error) {
          // Non-JSON message, emit as raw
          this.emit([
            this.helpers.returnJsonArray([
              {
                event: 'raw',
                data: data.toString(),
                timestamp: new Date().toISOString(),
              },
            ]),
          ]);
        }
      });

      ws.on('error', (error: Error) => {
        if (!isClosing) {
          this.emit([
            this.helpers.returnJsonArray([
              {
                event: 'error',
                error: error.message,
                timestamp: new Date().toISOString(),
              },
            ]),
          ]);
        }
      });

      ws.on('close', () => {
        if (!isClosing && options.reconnectOnError !== false) {
          const maxAttempts = options.maxReconnectAttempts || 5;
          const interval = options.reconnectInterval || 5000;

          if (reconnectAttempts < maxAttempts) {
            reconnectAttempts++;
            setTimeout(connect, interval);
          }
        }
      });
    };

    // Start connection
    connect();

    // Return cleanup function
    const closeFunction = async (): Promise<void> => {
      isClosing = true;
      if (ws) {
        // Unsubscribe before closing
        ws.send(
          JSON.stringify({
            type: 'unsubscribe',
            channels: events,
          }),
        );
        ws.close();
      }
    };

    return {
      closeFunction,
    };
  }
}
