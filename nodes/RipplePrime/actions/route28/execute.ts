/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { makeApiRequest } from '../../transport/apiClient';
import { ENDPOINTS } from '../../constants/endpoints';

export async function executeRoute28(
  this: IExecuteFunctions,
  i: number,
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', i) as string;
  const additionalFields = this.getNodeParameter('additionalFields', i, {}) as Record<string, any>;

  let response: any;

  switch (operation) {
    case 'getPositions':
      response = await makeApiRequest.call(this, { method: 'GET', endpoint: ENDPOINTS.ROUTE28.POSITIONS });
      break;
    case 'getSwaps':
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.ROUTE28.SWAPS,
        query: { status: additionalFields.status },
      });
      break;
    case 'getMargin':
      response = await makeApiRequest.call(this, { method: 'GET', endpoint: ENDPOINTS.ROUTE28.MARGIN });
      break;
    case 'getCollateral':
      response = await makeApiRequest.call(this, { method: 'GET', endpoint: ENDPOINTS.ROUTE28.COLLATERAL });
      break;
    case 'getPnL':
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.ROUTE28.PNL,
        query: { startDate: additionalFields.startDate, endDate: additionalFields.endDate },
      });
      break;
    case 'requestRebalance':
      response = await makeApiRequest.call(this, {
        method: 'POST',
        endpoint: ENDPOINTS.ROUTE28.REBALANCE,
        body: { targetAllocations: additionalFields.targetAllocations },
      });
      break;
    case 'getFunding':
      response = await makeApiRequest.call(this, { method: 'GET', endpoint: ENDPOINTS.ROUTE28.FUNDING });
      break;
    case 'requestTermination':
      response = await makeApiRequest.call(this, {
        method: 'POST',
        endpoint: ENDPOINTS.ROUTE28.TERMINATION,
        body: { swapId: additionalFields.swapId, reason: additionalFields.reason },
      });
      break;
    default:
      throw new Error(`Operation "${operation}" is not supported for route28`);
  }

  const executionData = this.helpers.constructExecutionMetaData(
    this.helpers.returnJsonArray(response),
    { itemData: { item: i } },
  );
  returnData.push(...executionData);

  return returnData;
}
