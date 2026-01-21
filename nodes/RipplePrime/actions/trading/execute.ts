/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { makeApiRequest, replacePathParams } from '../../transport/apiClient';
import { ENDPOINTS } from '../../constants/endpoints';
import { generateClientOrderId, validateOrder } from '../../utils/tradingUtils';

export async function executeTrading(
  this: IExecuteFunctions,
  i: number,
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', i) as string;
  const additionalFields = this.getNodeParameter('additionalFields', i, {}) as Record<string, any>;

  let response: any;

  switch (operation) {
    case 'createOrder': {
      const validation = validateOrder({
        symbol: additionalFields.symbol,
        side: additionalFields.side,
        quantity: additionalFields.quantity,
        price: additionalFields.price,
        orderType: additionalFields.orderType,
      });
      if (!validation.valid) {
        throw new Error(`Order validation failed: ${validation.errors.join(', ')}`);
      }
      response = await makeApiRequest.call(this, {
        method: 'POST',
        endpoint: ENDPOINTS.TRADING.ORDERS,
        body: {
          clientOrderId: generateClientOrderId(),
          symbol: additionalFields.symbol,
          side: additionalFields.side,
          orderType: additionalFields.orderType,
          quantity: additionalFields.quantity,
          price: additionalFields.price,
          timeInForce: additionalFields.timeInForce || 'gtc',
        },
      });
      break;
    }
    case 'cancelOrder': {
      const orderId = additionalFields.orderId as string;
      const endpoint = replacePathParams(ENDPOINTS.TRADING.ORDER, { orderId });
      response = await makeApiRequest.call(this, { method: 'DELETE', endpoint });
      break;
    }
    case 'modifyOrder': {
      const orderId = additionalFields.orderId as string;
      const endpoint = replacePathParams(ENDPOINTS.TRADING.ORDER, { orderId });
      response = await makeApiRequest.call(this, {
        method: 'PATCH',
        endpoint,
        body: {
          quantity: additionalFields.quantity,
          price: additionalFields.price,
        },
      });
      break;
    }
    case 'getOrderStatus': {
      const orderId = additionalFields.orderId as string;
      const endpoint = replacePathParams(ENDPOINTS.TRADING.ORDER, { orderId });
      response = await makeApiRequest.call(this, { method: 'GET', endpoint });
      break;
    }
    case 'getFills':
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.TRADING.FILLS,
        query: {
          symbol: additionalFields.symbol,
          startDate: additionalFields.startDate,
          endDate: additionalFields.endDate,
          limit: additionalFields.limit,
        },
      });
      break;
    case 'getExecutions':
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.TRADING.EXECUTIONS,
        query: {
          orderId: additionalFields.orderId,
          symbol: additionalFields.symbol,
          startDate: additionalFields.startDate,
          endDate: additionalFields.endDate,
        },
      });
      break;
    case 'requestQuote':
      response = await makeApiRequest.call(this, {
        method: 'POST',
        endpoint: ENDPOINTS.TRADING.RFQ,
        body: {
          symbol: additionalFields.symbol,
          side: additionalFields.side,
          quantity: additionalFields.quantity,
        },
      });
      break;
    case 'getTradeConfirmations':
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.TRADING.CONFIRMATIONS,
        query: {
          startDate: additionalFields.startDate,
          endDate: additionalFields.endDate,
        },
      });
      break;
    case 'allocateTrade':
      response = await makeApiRequest.call(this, {
        method: 'POST',
        endpoint: ENDPOINTS.TRADING.ALLOCATIONS,
        body: {
          tradeId: additionalFields.tradeId,
          allocations: additionalFields.allocations,
        },
      });
      break;
    default:
      throw new Error(`Operation "${operation}" is not supported for trading`);
  }

  const executionData = this.helpers.constructExecutionMetaData(
    this.helpers.returnJsonArray(response),
    { itemData: { item: i } },
  );
  returnData.push(...executionData);

  return returnData;
}
