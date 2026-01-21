/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { makeApiRequest } from '../../transport/apiClient';
import { ENDPOINTS } from '../../constants/endpoints';

export async function executeRiskMetrics(
  this: IExecuteFunctions,
  i: number,
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', i) as string;
  const additionalFields = this.getNodeParameter('additionalFields', i, {}) as Record<string, any>;

  let response: any;

  switch (operation) {
    case 'getCreditUtilization':
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.RISK.CREDIT_UTILIZATION,
        query: { asOf: additionalFields.asOf },
      });
      break;
    case 'getCreditLimits':
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.RISK.CREDIT_LIMITS,
      });
      break;
    case 'getMarginStatus':
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.RISK.MARGIN,
        query: { assetClass: additionalFields.assetClass },
      });
      break;
    case 'getExposure':
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.RISK.EXPOSURE,
        query: {
          assetClass: additionalFields.assetClass,
          currency: additionalFields.currency,
        },
      });
      break;
    case 'getCounterpartyRisk':
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.RISK.COUNTERPARTY,
      });
      break;
    case 'getVaR':
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.RISK.VAR,
        query: {
          confidenceLevel: additionalFields.confidenceLevel,
          horizon: additionalFields.horizon,
        },
      });
      break;
    case 'runStressTest':
      response = await makeApiRequest.call(this, {
        method: 'POST',
        endpoint: ENDPOINTS.RISK.STRESS_TEST,
        body: {
          scenario: additionalFields.scenario,
          shockSize: additionalFields.shockSize,
        },
      });
      break;
    case 'getRiskAlerts':
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.RISK.ALERTS,
        query: {
          severity: additionalFields.severity,
          status: additionalFields.status,
          limit: additionalFields.limit,
        },
      });
      break;
    default:
      throw new Error(`Operation "${operation}" is not supported for riskMetrics`);
  }

  const executionData = this.helpers.constructExecutionMetaData(
    this.helpers.returnJsonArray(response),
    { itemData: { item: i } },
  );
  returnData.push(...executionData);

  return returnData;
}
