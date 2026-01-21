/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { makeApiRequest } from '../../transport/apiClient';
import { ENDPOINTS } from '../../constants/endpoints';

export async function executeCompliance(
  this: IExecuteFunctions,
  i: number,
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', i) as string;
  const additionalFields = this.getNodeParameter('additionalFields', i, {}) as Record<string, any>;

  let response: any;

  switch (operation) {
    case 'getStatus': {
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.COMPLIANCE.STATUS,
        query: {
          accountId: additionalFields.accountId,
        },
      });
      break;
    }
    case 'getSurveillanceAlerts': {
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.COMPLIANCE.SURVEILLANCE,
        query: {
          status: additionalFields.status,
          severity: additionalFields.severity,
          alertType: additionalFields.alertType,
          startDate: additionalFields.startDate,
          endDate: additionalFields.endDate,
          limit: additionalFields.limit,
          offset: additionalFields.offset,
        },
      });
      break;
    }
    case 'getAmlAlerts': {
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.COMPLIANCE.AML,
        query: {
          status: additionalFields.status,
          riskLevel: additionalFields.riskLevel,
          startDate: additionalFields.startDate,
          endDate: additionalFields.endDate,
          limit: additionalFields.limit,
        },
      });
      break;
    }
    case 'getRegulatoryFilings': {
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.COMPLIANCE.REGULATORY,
        query: {
          filingType: additionalFields.filingType,
          jurisdiction: additionalFields.jurisdiction,
          status: additionalFields.status,
          startDate: additionalFields.startDate,
          endDate: additionalFields.endDate,
        },
      });
      break;
    }
    case 'getAuditTrail': {
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.COMPLIANCE.AUDIT,
        query: {
          entityType: additionalFields.entityType,
          entityId: additionalFields.entityId,
          action: additionalFields.action,
          userId: additionalFields.userId,
          startDate: additionalFields.startDate,
          endDate: additionalFields.endDate,
          limit: additionalFields.limit,
          asOf: additionalFields.asOf,
          asAt: additionalFields.asAt,
        },
      });
      break;
    }
    case 'getSoc2Status': {
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.COMPLIANCE.SOC2,
        query: {
          controlCategory: additionalFields.controlCategory,
        },
      });
      break;
    }
    case 'getKycStatus': {
      response = await makeApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.COMPLIANCE.KYC,
        query: {
          entityId: additionalFields.entityId,
          entityType: additionalFields.entityType,
          status: additionalFields.status,
        },
      });
      break;
    }
    case 'runSanctionsCheck': {
      const entityName = this.getNodeParameter('entityName', i) as string;
      response = await makeApiRequest.call(this, {
        method: 'POST',
        endpoint: ENDPOINTS.COMPLIANCE.SANCTIONS,
        body: {
          entityName,
          entityType: additionalFields.entityType,
          jurisdiction: additionalFields.jurisdiction,
          additionalIdentifiers: additionalFields.additionalIdentifiers,
        },
      });
      break;
    }
    default:
      throw new Error(`Operation "${operation}" is not supported for compliance`);
  }

  const executionData = this.helpers.constructExecutionMetaData(
    this.helpers.returnJsonArray(response),
    { itemData: { item: i } },
  );
  returnData.push(...executionData);

  return returnData;
}
