/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { makeApiRequest } from '../../transport/apiClient';
import { ENDPOINTS } from '../../constants/endpoints';

export async function executeUtility(
  this: IExecuteFunctions,
  i: number,
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', i) as string;
  const additionalFields = this.getNodeParameter('additionalFields', i, {}) as Record<string, any>;

  let response: any;

  switch (operation) {
    case 'getApiStatus': {
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.UTILITY.API_STATUS,
      });
      break;
    }
    case 'getAssets': {
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.UTILITY.ASSETS,
        query: {
          assetClass: additionalFields.assetClass,
          status: additionalFields.status,
          searchTerm: additionalFields.searchTerm,
          limit: additionalFields.limit,
          offset: additionalFields.offset,
        },
      });
      break;
    }
    case 'getMarkets': {
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.UTILITY.MARKETS,
        query: {
          assetClass: additionalFields.assetClass,
          exchange: additionalFields.exchange,
          status: additionalFields.status,
          limit: additionalFields.limit,
        },
      });
      break;
    }
    case 'getTradingHours': {
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.UTILITY.TRADING_HOURS,
        query: {
          market: additionalFields.market,
          exchange: additionalFields.exchange,
          date: additionalFields.date,
        },
      });
      break;
    }
    case 'getHolidays': {
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.UTILITY.HOLIDAYS,
        query: {
          market: additionalFields.market,
          country: additionalFields.country,
          year: additionalFields.year,
        },
      });
      break;
    }
    case 'getFeeSchedule': {
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.UTILITY.FEE_SCHEDULE,
        query: {
          assetClass: additionalFields.assetClass,
          service: additionalFields.service,
          tier: additionalFields.tier,
        },
      });
      break;
    }
    case 'getRateLimits': {
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.UTILITY.RATE_LIMITS,
      });
      break;
    }
    case 'getVersion': {
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.UTILITY.VERSION,
      });
      break;
    }
    case 'ping': {
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.UTILITY.PING,
      });
      break;
    }
    case 'getServerTime': {
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.UTILITY.TIME,
      });
      break;
    }
    default:
      throw new Error(`Operation "${operation}" is not supported for utility`);
  }

  const executionData = this.helpers.constructExecutionMetaData(
    this.helpers.returnJsonArray(response),
    { itemData: { item: i } },
  );
  returnData.push(...executionData);

  return returnData;
}
