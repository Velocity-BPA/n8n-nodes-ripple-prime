/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { makeApiRequest } from '../../transport/apiClient';
import { ENDPOINTS } from '../../constants/endpoints';

export async function executeReporting(
  this: IExecuteFunctions,
  i: number,
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', i) as string;
  const additionalFields = this.getNodeParameter('additionalFields', i, {}) as Record<string, any>;

  let response: any;

  switch (operation) {
    case 'getStandardReports':
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.REPORTING.STANDARD,
        query: { reportType: additionalFields.reportType },
      });
      break;
    case 'createCustomReport':
      response = await makeApiRequest.call(this, {
        method: 'POST',
        endpoint: ENDPOINTS.REPORTING.CUSTOM,
        body: {
          name: additionalFields.reportName,
          fields: additionalFields.fields,
          filters: additionalFields.filters,
          format: additionalFields.reportFormat,
        },
      });
      break;
    case 'scheduleReport':
      response = await makeApiRequest.call(this, {
        method: 'POST',
        endpoint: ENDPOINTS.REPORTING.SCHEDULE,
        body: {
          reportId: additionalFields.reportId,
          schedule: additionalFields.schedule,
          recipients: additionalFields.recipients,
        },
      });
      break;
    case 'getReportHistory':
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.REPORTING.HISTORY,
        query: { reportType: additionalFields.reportType, limit: additionalFields.limit },
      });
      break;
    case 'getTemplates':
      response = await makeApiRequest.call(this, { method: 'GET', endpoint: ENDPOINTS.REPORTING.TEMPLATES });
      break;
    case 'exportReport':
      response = await makeApiRequest.call(this, {
        method: 'POST',
        endpoint: ENDPOINTS.REPORTING.EXPORT,
        body: { reportId: additionalFields.reportId, format: additionalFields.reportFormat },
      });
      break;
    case 'getBitemporalData':
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.REPORTING.BITEMPORAL,
        query: {
          dataType: additionalFields.dataType,
          asOf: additionalFields.asOf,
          asAt: additionalFields.asAt,
        },
      });
      break;
    case 'getAnalytics':
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.REPORTING.ANALYTICS,
        query: { metric: additionalFields.metric, startDate: additionalFields.startDate, endDate: additionalFields.endDate },
      });
      break;
    default:
      throw new Error(`Operation "${operation}" is not supported for reporting`);
  }

  const executionData = this.helpers.constructExecutionMetaData(
    this.helpers.returnJsonArray(response),
    { itemData: { item: i } },
  );
  returnData.push(...executionData);

  return returnData;
}
