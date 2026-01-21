/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { makeApiRequest } from '../../transport/apiClient';
import { ENDPOINTS } from '../../constants/endpoints';

export async function executeSettlement(
  this: IExecuteFunctions,
  i: number,
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', i) as string;
  const additionalFields = this.getNodeParameter('additionalFields', i, {}) as Record<string, any>;

  let response: any;

  switch (operation) {
    case 'getInstructions':
      response = await makeApiRequest.call(this, { method: 'GET', endpoint: ENDPOINTS.SETTLEMENT.INSTRUCTIONS });
      break;
    case 'getPending':
      response = await makeApiRequest.call(this, { method: 'GET', endpoint: ENDPOINTS.SETTLEMENT.PENDING });
      break;
    case 'getHistory':
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.SETTLEMENT.HISTORY,
        query: { startDate: additionalFields.startDate, endDate: additionalFields.endDate, limit: additionalFields.limit },
      });
      break;
    case 'getNetting':
      response = await makeApiRequest.call(this, { method: 'GET', endpoint: ENDPOINTS.SETTLEMENT.NETTING });
      break;
    case 'getFails':
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.SETTLEMENT.FAILS,
        query: { status: additionalFields.status },
      });
      break;
    case 'getSSI':
      response = await makeApiRequest.call(this, { method: 'GET', endpoint: ENDPOINTS.SETTLEMENT.SSI });
      break;
    case 'getReconciliation':
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.SETTLEMENT.RECONCILIATION,
        query: { date: additionalFields.date },
      });
      break;
    case 'getConfirmation':
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.SETTLEMENT.CONFIRMATION,
        query: { settlementId: additionalFields.settlementId },
      });
      break;
    default:
      throw new Error(`Operation "${operation}" is not supported for settlement`);
  }

  const executionData = this.helpers.constructExecutionMetaData(
    this.helpers.returnJsonArray(response),
    { itemData: { item: i } },
  );
  returnData.push(...executionData);

  return returnData;
}
