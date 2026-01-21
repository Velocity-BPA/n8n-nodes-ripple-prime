/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { makeApiRequest, replacePathParams } from '../../transport/apiClient';
import { ENDPOINTS } from '../../constants/endpoints';

export async function executeAccountActivity(
  this: IExecuteFunctions,
  i: number,
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', i) as string;
  const accountId = this.getNodeParameter('accountId', i, '') as string;
  const additionalFields = this.getNodeParameter('additionalFields', i, {}) as Record<string, any>;

  const credentials = await this.getCredentials('ripplePrimeApi');
  const effectiveAccountId = accountId || (credentials.accountId as string);

  let response: any;

  switch (operation) {
    case 'getBalances': {
      const endpoint = replacePathParams(ENDPOINTS.ACCOUNT.BALANCES, { accountId: effectiveAccountId });
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint,
        query: {
          currency: additionalFields.currency,
          asOf: additionalFields.asOf,
          asAt: additionalFields.asAt,
        },
      });
      break;
    }
    case 'getTrades': {
      const endpoint = replacePathParams(ENDPOINTS.ACCOUNT.TRADES, { accountId: effectiveAccountId });
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint,
        query: {
          symbol: additionalFields.symbol,
          startDate: additionalFields.startDate,
          endDate: additionalFields.endDate,
          limit: additionalFields.limit,
          offset: additionalFields.offset,
        },
      });
      break;
    }
    case 'getPositions': {
      const endpoint = replacePathParams(ENDPOINTS.ACCOUNT.POSITIONS, { accountId: effectiveAccountId });
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint,
        query: {
          assetClass: additionalFields.assetClass,
          symbol: additionalFields.symbol,
          asOf: additionalFields.asOf,
        },
      });
      break;
    }
    case 'getFees': {
      const endpoint = replacePathParams(ENDPOINTS.ACCOUNT.FEES, { accountId: effectiveAccountId });
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint,
        query: {
          startDate: additionalFields.startDate,
          endDate: additionalFields.endDate,
        },
      });
      break;
    }
    case 'getSettlements': {
      const endpoint = replacePathParams(ENDPOINTS.ACCOUNT.SETTLEMENTS, { accountId: effectiveAccountId });
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint,
        query: {
          status: additionalFields.status,
          startDate: additionalFields.startDate,
          endDate: additionalFields.endDate,
        },
      });
      break;
    }
    case 'getStatements': {
      const endpoint = replacePathParams(ENDPOINTS.ACCOUNT.STATEMENTS, { accountId: effectiveAccountId });
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint,
        query: {
          reportType: additionalFields.reportType,
          startDate: additionalFields.startDate,
          endDate: additionalFields.endDate,
          format: additionalFields.reportFormat,
        },
      });
      break;
    }
    case 'exportSnapshot': {
      const endpoint = replacePathParams(ENDPOINTS.ACCOUNT.SNAPSHOT, { accountId: effectiveAccountId });
      response = await makeApiRequest.call(this, {
        method: 'POST',
        endpoint,
        body: {
          asOf: additionalFields.asOf,
          asAt: additionalFields.asAt,
          format: additionalFields.reportFormat || 'json',
        },
      });
      break;
    }
    default:
      throw new Error(`Operation "${operation}" is not supported for accountActivity`);
  }

  const executionData = this.helpers.constructExecutionMetaData(
    this.helpers.returnJsonArray(response),
    { itemData: { item: i } },
  );
  returnData.push(...executionData);

  return returnData;
}
