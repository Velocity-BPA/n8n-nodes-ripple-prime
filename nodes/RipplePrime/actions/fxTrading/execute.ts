/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { makeApiRequest } from '../../transport/apiClient';
import { ENDPOINTS } from '../../constants/endpoints';

export async function executeFxTrading(
  this: IExecuteFunctions,
  i: number,
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', i) as string;
  const additionalFields = this.getNodeParameter('additionalFields', i, {}) as Record<string, any>;

  let response: any;

  switch (operation) {
    case 'getFxQuote':
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.FX.QUOTE,
        query: {
          currencyPair: additionalFields.currencyPair,
          side: additionalFields.side,
          amount: additionalFields.amount,
          tenor: additionalFields.fxTenor,
        },
      });
      break;
    case 'executeSpot':
      response = await makeApiRequest.call(this, {
        method: 'POST',
        endpoint: ENDPOINTS.FX.SPOT,
        body: {
          currencyPair: additionalFields.currencyPair,
          side: additionalFields.side,
          amount: additionalFields.amount,
          rate: additionalFields.rate,
        },
      });
      break;
    case 'executeForward':
      response = await makeApiRequest.call(this, {
        method: 'POST',
        endpoint: ENDPOINTS.FX.FORWARD,
        body: {
          currencyPair: additionalFields.currencyPair,
          side: additionalFields.side,
          amount: additionalFields.amount,
          tenor: additionalFields.fxTenor,
          valueDate: additionalFields.valueDate,
        },
      });
      break;
    case 'executeSwap':
      response = await makeApiRequest.call(this, {
        method: 'POST',
        endpoint: ENDPOINTS.FX.SWAP,
        body: {
          currencyPair: additionalFields.currencyPair,
          nearLegAmount: additionalFields.nearLegAmount,
          farLegAmount: additionalFields.farLegAmount,
          nearLegDate: additionalFields.nearLegDate,
          farLegDate: additionalFields.farLegDate,
        },
      });
      break;
    case 'executeNdf':
      response = await makeApiRequest.call(this, {
        method: 'POST',
        endpoint: ENDPOINTS.FX.NDF,
        body: {
          currencyPair: additionalFields.currencyPair,
          side: additionalFields.side,
          notionalAmount: additionalFields.notionalAmount,
          fixingDate: additionalFields.fixingDate,
          settlementDate: additionalFields.settlementDate,
        },
      });
      break;
    case 'getFxPositions':
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.FX.POSITIONS,
        query: { currencyPair: additionalFields.currencyPair },
      });
      break;
    case 'getFxSettlements':
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.FX.SETTLEMENTS,
        query: {
          status: additionalFields.status,
          startDate: additionalFields.startDate,
          endDate: additionalFields.endDate,
        },
      });
      break;
    case 'getFxBlotter':
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.FX.BLOTTER,
        query: {
          startDate: additionalFields.startDate,
          endDate: additionalFields.endDate,
          limit: additionalFields.limit,
        },
      });
      break;
    case 'rollForward':
      response = await makeApiRequest.call(this, {
        method: 'POST',
        endpoint: ENDPOINTS.FX.ROLL,
        body: {
          tradeId: additionalFields.tradeId,
          newValueDate: additionalFields.newValueDate,
        },
      });
      break;
    default:
      throw new Error(`Operation "${operation}" is not supported for fxTrading`);
  }

  const executionData = this.helpers.constructExecutionMetaData(
    this.helpers.returnJsonArray(response),
    { itemData: { item: i } },
  );
  returnData.push(...executionData);

  return returnData;
}
