/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { makeApiRequest } from '../../transport/apiClient';
import { ENDPOINTS } from '../../constants/endpoints';

export async function executeDerivatives(
  this: IExecuteFunctions,
  i: number,
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', i) as string;
  const additionalFields = this.getNodeParameter('additionalFields', i, {}) as Record<string, any>;

  let response: any;

  switch (operation) {
    case 'getFutures':
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.DERIVATIVES.FUTURES,
        query: { underlying: additionalFields.underlying, expiry: additionalFields.expiry },
      });
      break;
    case 'getOptions':
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.DERIVATIVES.OPTIONS,
        query: {
          underlying: additionalFields.underlying,
          optionType: additionalFields.optionType,
          expiry: additionalFields.expiry,
        },
      });
      break;
    case 'getPositions':
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.DERIVATIVES.POSITIONS,
      });
      break;
    case 'getMargin':
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.DERIVATIVES.MARGIN,
      });
      break;
    case 'exerciseOption':
      response = await makeApiRequest.call(this, {
        method: 'POST',
        endpoint: ENDPOINTS.DERIVATIVES.EXERCISE,
        body: { positionId: additionalFields.positionId, quantity: additionalFields.quantity },
      });
      break;
    case 'getExpiry':
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.DERIVATIVES.EXPIRY,
        query: { underlying: additionalFields.underlying },
      });
      break;
    case 'getGreeks':
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.DERIVATIVES.GREEKS,
        query: { positionId: additionalFields.positionId },
      });
      break;
    case 'getSettlements':
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.DERIVATIVES.SETTLEMENTS,
        query: { startDate: additionalFields.startDate, endDate: additionalFields.endDate },
      });
      break;
    default:
      throw new Error(`Operation "${operation}" is not supported for derivatives`);
  }

  const executionData = this.helpers.constructExecutionMetaData(
    this.helpers.returnJsonArray(response),
    { itemData: { item: i } },
  );
  returnData.push(...executionData);

  return returnData;
}
