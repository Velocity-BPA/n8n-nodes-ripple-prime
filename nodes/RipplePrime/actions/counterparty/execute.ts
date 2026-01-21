/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { makeApiRequest, replacePathParams } from '../../transport/apiClient';
import { ENDPOINTS } from '../../constants/endpoints';

export async function executeCounterparty(
  this: IExecuteFunctions,
  i: number,
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', i) as string;
  const additionalFields = this.getNodeParameter('additionalFields', i, {}) as Record<string, any>;

  let response: any;

  switch (operation) {
    case 'listCounterparties':
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.COUNTERPARTY.LIST,
        query: { status: additionalFields.status, limit: additionalFields.limit },
      });
      break;
    case 'getDetails': {
      const counterpartyId = additionalFields.counterpartyId as string;
      const endpoint = replacePathParams(ENDPOINTS.COUNTERPARTY.DETAILS, { counterpartyId });
      response = await makeApiRequest.call(this, { method: 'GET', endpoint });
      break;
    }
    case 'getLimits': {
      const counterpartyId = additionalFields.counterpartyId as string;
      const endpoint = replacePathParams(ENDPOINTS.COUNTERPARTY.LIMITS, { counterpartyId });
      response = await makeApiRequest.call(this, { method: 'GET', endpoint });
      break;
    }
    case 'getAgreements': {
      const counterpartyId = additionalFields.counterpartyId as string;
      const endpoint = replacePathParams(ENDPOINTS.COUNTERPARTY.AGREEMENTS, { counterpartyId });
      response = await makeApiRequest.call(this, { method: 'GET', endpoint });
      break;
    }
    case 'getExposure': {
      const counterpartyId = additionalFields.counterpartyId as string;
      const endpoint = replacePathParams(ENDPOINTS.COUNTERPARTY.EXPOSURE, { counterpartyId });
      response = await makeApiRequest.call(this, { method: 'GET', endpoint });
      break;
    }
    case 'getNetting': {
      const counterpartyId = additionalFields.counterpartyId as string;
      const endpoint = replacePathParams(ENDPOINTS.COUNTERPARTY.NETTING, { counterpartyId });
      response = await makeApiRequest.call(this, { method: 'GET', endpoint });
      break;
    }
    case 'getCredit': {
      const counterpartyId = additionalFields.counterpartyId as string;
      const endpoint = replacePathParams(ENDPOINTS.COUNTERPARTY.CREDIT, { counterpartyId });
      response = await makeApiRequest.call(this, { method: 'GET', endpoint });
      break;
    }
    case 'startOnboarding':
      response = await makeApiRequest.call(this, {
        method: 'POST',
        endpoint: ENDPOINTS.COUNTERPARTY.ONBOARDING,
        body: {
          name: additionalFields.counterpartyName,
          type: additionalFields.counterpartyType,
          jurisdiction: additionalFields.jurisdiction,
        },
      });
      break;
    default:
      throw new Error(`Operation "${operation}" is not supported for counterparty`);
  }

  const executionData = this.helpers.constructExecutionMetaData(
    this.helpers.returnJsonArray(response),
    { itemData: { item: i } },
  );
  returnData.push(...executionData);

  return returnData;
}
