/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { makeApiRequest, replacePathParams } from '../../transport/apiClient';
import { ENDPOINTS } from '../../constants/endpoints';

export async function executeExchange(
  this: IExecuteFunctions,
  i: number,
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', i) as string;
  const additionalFields = this.getNodeParameter('additionalFields', i, {}) as Record<string, any>;

  let response: any;

  switch (operation) {
    case 'getConnectedExchanges':
      response = await makeApiRequest.call(this, { method: 'GET', endpoint: ENDPOINTS.EXCHANGE.LIST });
      break;
    case 'getExchangeStatus': {
      const exchangeId = additionalFields.exchangeId as string;
      const endpoint = replacePathParams(ENDPOINTS.EXCHANGE.STATUS, { exchangeId });
      response = await makeApiRequest.call(this, { method: 'GET', endpoint });
      break;
    }
    case 'getExchangeBalances': {
      const exchangeId = additionalFields.exchangeId as string;
      const endpoint = replacePathParams(ENDPOINTS.EXCHANGE.BALANCES, { exchangeId });
      response = await makeApiRequest.call(this, { method: 'GET', endpoint });
      break;
    }
    case 'transferToExchange': {
      const exchangeId = additionalFields.exchangeId as string;
      const endpoint = replacePathParams(ENDPOINTS.EXCHANGE.TRANSFER_TO, { exchangeId });
      response = await makeApiRequest.call(this, {
        method: 'POST',
        endpoint,
        body: { asset: additionalFields.asset, amount: additionalFields.amount },
      });
      break;
    }
    case 'transferFromExchange': {
      const exchangeId = additionalFields.exchangeId as string;
      const endpoint = replacePathParams(ENDPOINTS.EXCHANGE.TRANSFER_FROM, { exchangeId });
      response = await makeApiRequest.call(this, {
        method: 'POST',
        endpoint,
        body: { asset: additionalFields.asset, amount: additionalFields.amount },
      });
      break;
    }
    case 'getSupportedExchanges':
      response = await makeApiRequest.call(this, { method: 'GET', endpoint: ENDPOINTS.EXCHANGE.SUPPORTED });
      break;
    case 'getExchangeFees': {
      const exchangeId = additionalFields.exchangeId as string;
      const endpoint = replacePathParams(ENDPOINTS.EXCHANGE.FEES, { exchangeId });
      response = await makeApiRequest.call(this, { method: 'GET', endpoint });
      break;
    }
    case 'getExchangeMarkets': {
      const exchangeId = additionalFields.exchangeId as string;
      const endpoint = replacePathParams(ENDPOINTS.EXCHANGE.MARKETS, { exchangeId });
      response = await makeApiRequest.call(this, { method: 'GET', endpoint });
      break;
    }
    default:
      throw new Error(`Operation "${operation}" is not supported for exchange`);
  }

  const executionData = this.helpers.constructExecutionMetaData(
    this.helpers.returnJsonArray(response),
    { itemData: { item: i } },
  );
  returnData.push(...executionData);

  return returnData;
}
