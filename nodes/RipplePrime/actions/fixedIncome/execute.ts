/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { makeApiRequest } from '../../transport/apiClient';
import { ENDPOINTS } from '../../constants/endpoints';

export async function executeFixedIncome(
  this: IExecuteFunctions,
  i: number,
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', i) as string;
  const additionalFields = this.getNodeParameter('additionalFields', i, {}) as Record<string, any>;

  let response: any;

  switch (operation) {
    case 'getBonds':
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.FIXED_INCOME.BONDS,
        query: { issuer: additionalFields.issuer, maturity: additionalFields.maturity },
      });
      break;
    case 'getRepo':
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.FIXED_INCOME.REPO,
        query: { status: additionalFields.status },
      });
      break;
    case 'getSecuritiesLending':
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.FIXED_INCOME.LENDING,
      });
      break;
    case 'getYields':
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.FIXED_INCOME.YIELDS,
        query: { curve: additionalFields.curve },
      });
      break;
    case 'getPositions':
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.FIXED_INCOME.POSITIONS,
      });
      break;
    case 'getSettlements':
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.FIXED_INCOME.SETTLEMENTS,
        query: { startDate: additionalFields.startDate, endDate: additionalFields.endDate },
      });
      break;
    case 'getCoupons':
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.FIXED_INCOME.COUPONS,
        query: { startDate: additionalFields.startDate, endDate: additionalFields.endDate },
      });
      break;
    case 'getMaturities':
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.FIXED_INCOME.MATURITIES,
        query: { startDate: additionalFields.startDate, endDate: additionalFields.endDate },
      });
      break;
    default:
      throw new Error(`Operation "${operation}" is not supported for fixedIncome`);
  }

  const executionData = this.helpers.constructExecutionMetaData(
    this.helpers.returnJsonArray(response),
    { itemData: { item: i } },
  );
  returnData.push(...executionData);

  return returnData;
}
