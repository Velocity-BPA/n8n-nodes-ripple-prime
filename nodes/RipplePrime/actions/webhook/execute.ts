/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { makeApiRequest, replacePathParams } from '../../transport/apiClient';
import { ENDPOINTS } from '../../constants/endpoints';

export async function executeWebhook(
  this: IExecuteFunctions,
  i: number,
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', i) as string;
  const additionalFields = this.getNodeParameter('additionalFields', i, {}) as Record<string, any>;

  let response: any;

  switch (operation) {
    case 'list': {
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.WEBHOOK.LIST,
        query: {
          status: additionalFields.status,
          eventType: additionalFields.eventType,
          limit: additionalFields.limit,
          offset: additionalFields.offset,
        },
      });
      break;
    }
    case 'create': {
      const url = this.getNodeParameter('webhookUrl', i) as string;
      const events = this.getNodeParameter('events', i) as string[];
      response = await makeApiRequest.call(this, {
        method: 'POST',
        endpoint: ENDPOINTS.WEBHOOK.CREATE,
        body: {
          url,
          events,
          name: additionalFields.name,
          description: additionalFields.description,
          secret: additionalFields.secret,
          enabled: additionalFields.enabled !== false,
          retryPolicy: additionalFields.retryPolicy,
          headers: additionalFields.customHeaders,
        },
      });
      break;
    }
    case 'get': {
      const webhookId = this.getNodeParameter('webhookId', i) as string;
      const endpoint = replacePathParams(ENDPOINTS.WEBHOOK.GET, { webhookId });
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint,
      });
      break;
    }
    case 'update': {
      const webhookId = this.getNodeParameter('webhookId', i) as string;
      const endpoint = replacePathParams(ENDPOINTS.WEBHOOK.UPDATE, { webhookId });
      response = await makeApiRequest.call(this, {
        method: 'PATCH',
        endpoint,
        body: {
          url: additionalFields.url,
          events: additionalFields.events,
          name: additionalFields.name,
          description: additionalFields.description,
          enabled: additionalFields.enabled,
          retryPolicy: additionalFields.retryPolicy,
          headers: additionalFields.customHeaders,
        },
      });
      break;
    }
    case 'delete': {
      const webhookId = this.getNodeParameter('webhookId', i) as string;
      const endpoint = replacePathParams(ENDPOINTS.WEBHOOK.DELETE, { webhookId });
      response = await makeApiRequest.call(this, {
        method: 'DELETE',
        endpoint,
      });
      break;
    }
    case 'getEvents': {
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.WEBHOOK.EVENTS,
        query: {
          category: additionalFields.category,
        },
      });
      break;
    }
    case 'test': {
      const webhookId = this.getNodeParameter('webhookId', i) as string;
      const endpoint = replacePathParams(ENDPOINTS.WEBHOOK.TEST, { webhookId });
      response = await makeApiRequest.call(this, {
        method: 'POST',
        endpoint,
        body: {
          eventType: additionalFields.eventType || 'test.ping',
          payload: additionalFields.testPayload,
        },
      });
      break;
    }
    case 'getLogs': {
      const webhookId = this.getNodeParameter('webhookId', i) as string;
      const endpoint = replacePathParams(ENDPOINTS.WEBHOOK.LOGS, { webhookId });
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint,
        query: {
          status: additionalFields.status,
          startDate: additionalFields.startDate,
          endDate: additionalFields.endDate,
          limit: additionalFields.limit,
          offset: additionalFields.offset,
        },
      });
      break;
    }
    default:
      throw new Error(`Operation "${operation}" is not supported for webhook`);
  }

  const executionData = this.helpers.constructExecutionMetaData(
    this.helpers.returnJsonArray(response),
    { itemData: { item: i } },
  );
  returnData.push(...executionData);

  return returnData;
}
