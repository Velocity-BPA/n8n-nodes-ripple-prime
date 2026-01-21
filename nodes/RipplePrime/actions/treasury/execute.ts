/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { makeApiRequest, replacePathParams } from '../../transport/apiClient';
import { ENDPOINTS } from '../../constants/endpoints';

export async function executeTreasury(
  this: IExecuteFunctions,
  i: number,
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', i) as string;
  const additionalFields = this.getNodeParameter('additionalFields', i, {}) as Record<string, any>;

  let response: any;

  switch (operation) {
    case 'createTransfer':
      response = await makeApiRequest.call(this, {
        method: 'POST',
        endpoint: ENDPOINTS.TREASURY.TRANSFERS,
        body: {
          type: additionalFields.transferType,
          amount: additionalFields.amount,
          currency: additionalFields.currency,
          fromAccount: additionalFields.fromAccount,
          toAccount: additionalFields.toAccount,
          reference: additionalFields.reference,
        },
      });
      break;
    case 'getTransferStatus': {
      const transferId = additionalFields.transferId as string;
      const endpoint = replacePathParams(ENDPOINTS.TREASURY.TRANSFER_STATUS, { transferId });
      response = await makeApiRequest.call(this, { method: 'GET', endpoint });
      break;
    }
    case 'executeSweep':
      response = await makeApiRequest.call(this, {
        method: 'POST',
        endpoint: ENDPOINTS.TREASURY.SWEEPS,
        body: {
          sourceAccount: additionalFields.sourceAccount,
          targetAccount: additionalFields.targetAccount,
          threshold: additionalFields.threshold,
          currency: additionalFields.currency,
        },
      });
      break;
    case 'allocateCollateral':
      response = await makeApiRequest.call(this, {
        method: 'POST',
        endpoint: ENDPOINTS.TREASURY.COLLATERAL,
        body: {
          collateralType: additionalFields.collateralType,
          amount: additionalFields.amount,
          purpose: additionalFields.purpose,
        },
      });
      break;
    case 'optimizeCollateral':
      response = await makeApiRequest.call(this, {
        method: 'POST',
        endpoint: ENDPOINTS.TREASURY.COLLATERAL_OPTIMIZE,
        body: { strategy: additionalFields.strategy },
      });
      break;
    case 'getFundingStatus':
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.TREASURY.FUNDING,
        query: { currency: additionalFields.currency },
      });
      break;
    case 'respondToMarginCall':
      response = await makeApiRequest.call(this, {
        method: 'POST',
        endpoint: ENDPOINTS.TREASURY.MARGIN_CALLS,
        body: {
          marginCallId: additionalFields.marginCallId,
          response: additionalFields.response,
          collateralType: additionalFields.collateralType,
          amount: additionalFields.amount,
        },
      });
      break;
    default:
      throw new Error(`Operation "${operation}" is not supported for treasury`);
  }

  const executionData = this.helpers.constructExecutionMetaData(
    this.helpers.returnJsonArray(response),
    { itemData: { item: i } },
  );
  returnData.push(...executionData);

  return returnData;
}
