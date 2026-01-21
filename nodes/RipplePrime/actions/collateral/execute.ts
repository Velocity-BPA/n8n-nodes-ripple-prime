/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { makeApiRequest } from '../../transport/apiClient';
import { ENDPOINTS } from '../../constants/endpoints';

export async function executeCollateral(
  this: IExecuteFunctions,
  i: number,
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', i) as string;
  const additionalFields = this.getNodeParameter('additionalFields', i, {}) as Record<string, any>;

  let response: any;

  switch (operation) {
    case 'getPositions':
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.COLLATERAL.POSITIONS,
        query: { collateralType: additionalFields.collateralType },
      });
      break;
    case 'getMovements':
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.COLLATERAL.MOVEMENTS,
        query: { startDate: additionalFields.startDate, endDate: additionalFields.endDate },
      });
      break;
    case 'getHaircuts':
      response = await makeApiRequest.call(this, { method: 'GET', endpoint: ENDPOINTS.COLLATERAL.HAIRCUTS });
      break;
    case 'getValuations':
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.COLLATERAL.VALUATIONS,
        query: { asOf: additionalFields.asOf },
      });
      break;
    case 'getEligible':
      response = await makeApiRequest.call(this, { method: 'GET', endpoint: ENDPOINTS.COLLATERAL.ELIGIBLE });
      break;
    case 'requestSubstitution':
      response = await makeApiRequest.call(this, {
        method: 'POST',
        endpoint: ENDPOINTS.COLLATERAL.SUBSTITUTION,
        body: {
          outCollateral: additionalFields.outCollateral,
          inCollateral: additionalFields.inCollateral,
          amount: additionalFields.amount,
        },
      });
      break;
    case 'runOptimization':
      response = await makeApiRequest.call(this, {
        method: 'POST',
        endpoint: ENDPOINTS.COLLATERAL.OPTIMIZATION,
        body: { strategy: additionalFields.strategy },
      });
      break;
    case 'getDisputes':
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.COLLATERAL.DISPUTES,
        query: { status: additionalFields.status },
      });
      break;
    default:
      throw new Error(`Operation "${operation}" is not supported for collateral`);
  }

  const executionData = this.helpers.constructExecutionMetaData(
    this.helpers.returnJsonArray(response),
    { itemData: { item: i } },
  );
  returnData.push(...executionData);

  return returnData;
}
