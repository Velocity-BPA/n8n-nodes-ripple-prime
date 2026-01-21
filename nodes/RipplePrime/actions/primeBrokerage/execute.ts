/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { makeApiRequest } from '../../transport/apiClient';
import { ENDPOINTS } from '../../constants/endpoints';

export async function executePrimeBrokerage(
  this: IExecuteFunctions,
  i: number,
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', i) as string;
  const additionalFields = this.getNodeParameter('additionalFields', i, {}) as Record<string, any>;

  let response: any;

  switch (operation) {
    case 'getServices':
      response = await makeApiRequest.call(this, { method: 'GET', endpoint: ENDPOINTS.PRIME.SERVICES });
      break;
    case 'getFinancing':
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.PRIME.FINANCING,
        query: { currency: additionalFields.currency },
      });
      break;
    case 'requestLocate':
      response = await makeApiRequest.call(this, {
        method: 'POST',
        endpoint: ENDPOINTS.PRIME.LOCATE,
        body: { symbol: additionalFields.symbol, quantity: additionalFields.quantity },
      });
      break;
    case 'requestBorrow':
      response = await makeApiRequest.call(this, {
        method: 'POST',
        endpoint: ENDPOINTS.PRIME.BORROW,
        body: {
          symbol: additionalFields.symbol,
          quantity: additionalFields.quantity,
          duration: additionalFields.duration,
        },
      });
      break;
    case 'getCustody':
      response = await makeApiRequest.call(this, { method: 'GET', endpoint: ENDPOINTS.PRIME.CUSTODY });
      break;
    case 'getClearing':
      response = await makeApiRequest.call(this, { method: 'GET', endpoint: ENDPOINTS.PRIME.CLEARING });
      break;
    case 'getPBReporting':
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.PRIME.REPORTING,
        query: { reportType: additionalFields.reportType },
      });
      break;
    case 'getAgreement':
      response = await makeApiRequest.call(this, { method: 'GET', endpoint: ENDPOINTS.PRIME.AGREEMENT });
      break;
    default:
      throw new Error(`Operation "${operation}" is not supported for primeBrokerage`);
  }

  const executionData = this.helpers.constructExecutionMetaData(
    this.helpers.returnJsonArray(response),
    { itemData: { item: i } },
  );
  returnData.push(...executionData);

  return returnData;
}
