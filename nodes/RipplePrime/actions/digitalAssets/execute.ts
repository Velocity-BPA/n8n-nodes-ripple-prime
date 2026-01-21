/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { makeApiRequest } from '../../transport/apiClient';
import { ENDPOINTS } from '../../constants/endpoints';

export async function executeDigitalAssets(
  this: IExecuteFunctions,
  i: number,
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', i) as string;
  const additionalFields = this.getNodeParameter('additionalFields', i, {}) as Record<string, any>;

  let response: any;

  switch (operation) {
    case 'getCryptoBalances':
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.DIGITAL_ASSETS.BALANCES,
        query: { asset: additionalFields.cryptoAsset },
      });
      break;
    case 'createCryptoOrder':
      response = await makeApiRequest.call(this, {
        method: 'POST',
        endpoint: ENDPOINTS.DIGITAL_ASSETS.ORDERS,
        body: {
          symbol: additionalFields.symbol,
          side: additionalFields.side,
          orderType: additionalFields.orderType,
          quantity: additionalFields.quantity,
          price: additionalFields.price,
        },
      });
      break;
    case 'getCryptoMarkets':
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.DIGITAL_ASSETS.MARKETS,
      });
      break;
    case 'getCryptoQuote':
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.DIGITAL_ASSETS.QUOTE,
        query: {
          symbol: additionalFields.symbol,
          side: additionalFields.side,
          quantity: additionalFields.quantity,
        },
      });
      break;
    case 'getCryptoPositions':
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.DIGITAL_ASSETS.POSITIONS,
      });
      break;
    case 'requestWithdrawal':
      response = await makeApiRequest.call(this, {
        method: 'POST',
        endpoint: ENDPOINTS.DIGITAL_ASSETS.WITHDRAWALS,
        body: {
          asset: additionalFields.cryptoAsset,
          amount: additionalFields.amount,
          address: additionalFields.address,
          network: additionalFields.network,
        },
      });
      break;
    case 'getDepositAddress':
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.DIGITAL_ASSETS.DEPOSITS,
        query: {
          asset: additionalFields.cryptoAsset,
          network: additionalFields.network,
        },
      });
      break;
    case 'getWalletInfo':
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.DIGITAL_ASSETS.WALLETS,
        query: { walletId: additionalFields.walletId },
      });
      break;
    case 'getStakingPositions':
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.DIGITAL_ASSETS.STAKING,
      });
      break;
    default:
      throw new Error(`Operation "${operation}" is not supported for digitalAssets`);
  }

  const executionData = this.helpers.constructExecutionMetaData(
    this.helpers.returnJsonArray(response),
    { itemData: { item: i } },
  );
  returnData.push(...executionData);

  return returnData;
}
