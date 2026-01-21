/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';

import { executeAccountActivity } from './actions/accountActivity/execute';
import { executeRiskMetrics } from './actions/riskMetrics/execute';
import { executeTreasury } from './actions/treasury/execute';
import { executeTrading } from './actions/trading/execute';
import { executeFxTrading } from './actions/fxTrading/execute';
import { executeDigitalAssets } from './actions/digitalAssets/execute';
import { executeDerivatives } from './actions/derivatives/execute';
import { executeFixedIncome } from './actions/fixedIncome/execute';
import { executePrimeBrokerage } from './actions/primeBrokerage/execute';
import { executeRoute28 } from './actions/route28/execute';
import { executeCollateral } from './actions/collateral/execute';
import { executeSettlement } from './actions/settlement/execute';
import { executeReporting } from './actions/reporting/execute';
import { executeCounterparty } from './actions/counterparty/execute';
import { executeExchange } from './actions/exchange/execute';
import { executeCompliance } from './actions/compliance/execute';
import { executeWebhook } from './actions/webhook/execute';
import { executeUtility } from './actions/utility/execute';

import {
  ORDER_TYPES,
  ORDER_SIDES,
  ASSET_CLASSES,
  COLLATERAL_TYPES,
  CURRENCIES,
  CRYPTO_ASSETS,
  TRANSFER_TYPES,
  REPORT_TYPES,
  REPORT_FORMATS,
  WEBHOOK_EVENTS,
  FX_TENOR,
  OPTION_TYPES,
} from './constants/enums';

export class RipplePrime implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Ripple Prime',
    name: 'ripplePrime',
    icon: 'file:ripplePrime.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
    description: 'Institutional prime brokerage platform for multi-asset trading and treasury management',
    defaults: {
      name: 'Ripple Prime',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'ripplePrimeApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          { name: 'Account Activity', value: 'accountActivity' },
          { name: 'Risk Metrics', value: 'riskMetrics' },
          { name: 'Treasury', value: 'treasury' },
          { name: 'Trading', value: 'trading' },
          { name: 'FX Trading', value: 'fxTrading' },
          { name: 'Digital Assets', value: 'digitalAssets' },
          { name: 'Derivatives', value: 'derivatives' },
          { name: 'Fixed Income', value: 'fixedIncome' },
          { name: 'Prime Brokerage', value: 'primeBrokerage' },
          { name: 'Route28', value: 'route28' },
          { name: 'Collateral', value: 'collateral' },
          { name: 'Settlement', value: 'settlement' },
          { name: 'Reporting', value: 'reporting' },
          { name: 'Counterparty', value: 'counterparty' },
          { name: 'Exchange', value: 'exchange' },
          { name: 'Compliance', value: 'compliance' },
          { name: 'Webhook', value: 'webhook' },
          { name: 'Utility', value: 'utility' },
        ],
        default: 'accountActivity',
      },

      // Account Activity Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['accountActivity'] } },
        options: [
          { name: 'Get Balances', value: 'getBalances' },
          { name: 'Get Trades', value: 'getTrades' },
          { name: 'Get Positions', value: 'getPositions' },
          { name: 'Get Fees', value: 'getFees' },
          { name: 'Get Settlements', value: 'getSettlements' },
          { name: 'Get Statements', value: 'getStatements' },
          { name: 'Export Snapshot', value: 'exportSnapshot' },
        ],
        default: 'getBalances',
      },

      // Risk Metrics Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['riskMetrics'] } },
        options: [
          { name: 'Get Credit Utilization', value: 'getCreditUtilization' },
          { name: 'Get Credit Limits', value: 'getCreditLimits' },
          { name: 'Get Margin Status', value: 'getMarginStatus' },
          { name: 'Get Exposure', value: 'getExposure' },
          { name: 'Get Counterparty Risk', value: 'getCounterpartyRisk' },
          { name: 'Get VaR', value: 'getVaR' },
          { name: 'Run Stress Test', value: 'runStressTest' },
          { name: 'Get Risk Alerts', value: 'getRiskAlerts' },
        ],
        default: 'getCreditUtilization',
      },

      // Treasury Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['treasury'] } },
        options: [
          { name: 'Create Transfer', value: 'createTransfer' },
          { name: 'Get Transfer Status', value: 'getTransferStatus' },
          { name: 'Execute Sweep', value: 'executeSweep' },
          { name: 'Allocate Collateral', value: 'allocateCollateral' },
          { name: 'Optimize Collateral', value: 'optimizeCollateral' },
          { name: 'Get Funding Status', value: 'getFundingStatus' },
          { name: 'Respond to Margin Call', value: 'respondToMarginCall' },
        ],
        default: 'createTransfer',
      },

      // Trading Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['trading'] } },
        options: [
          { name: 'Create Order', value: 'createOrder' },
          { name: 'Cancel Order', value: 'cancelOrder' },
          { name: 'Modify Order', value: 'modifyOrder' },
          { name: 'Get Order Status', value: 'getOrderStatus' },
          { name: 'Get Fills', value: 'getFills' },
          { name: 'Get Executions', value: 'getExecutions' },
          { name: 'Request Quote (RFQ)', value: 'requestQuote' },
          { name: 'Get Trade Confirmations', value: 'getTradeConfirmations' },
          { name: 'Allocate Trade', value: 'allocateTrade' },
        ],
        default: 'createOrder',
      },

      // FX Trading Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['fxTrading'] } },
        options: [
          { name: 'Get FX Quote', value: 'getFxQuote' },
          { name: 'Execute Spot', value: 'executeSpot' },
          { name: 'Execute Forward', value: 'executeForward' },
          { name: 'Execute Swap', value: 'executeSwap' },
          { name: 'Execute NDF', value: 'executeNdf' },
          { name: 'Get FX Positions', value: 'getFxPositions' },
          { name: 'Get FX Settlements', value: 'getFxSettlements' },
          { name: 'Get FX Blotter', value: 'getFxBlotter' },
          { name: 'Roll Forward', value: 'rollForward' },
        ],
        default: 'getFxQuote',
      },

      // Digital Assets Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['digitalAssets'] } },
        options: [
          { name: 'Get Crypto Balances', value: 'getCryptoBalances' },
          { name: 'Create Crypto Order', value: 'createCryptoOrder' },
          { name: 'Get Crypto Markets', value: 'getCryptoMarkets' },
          { name: 'Get Crypto Quote', value: 'getCryptoQuote' },
          { name: 'Get Crypto Positions', value: 'getCryptoPositions' },
          { name: 'Request Withdrawal', value: 'requestWithdrawal' },
          { name: 'Get Deposit Address', value: 'getDepositAddress' },
          { name: 'Get Wallet Info', value: 'getWalletInfo' },
          { name: 'Get Staking Positions', value: 'getStakingPositions' },
        ],
        default: 'getCryptoBalances',
      },

      // Derivatives Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['derivatives'] } },
        options: [
          { name: 'Get Futures', value: 'getFutures' },
          { name: 'Get Options', value: 'getOptions' },
          { name: 'Get Positions', value: 'getPositions' },
          { name: 'Get Margin', value: 'getMargin' },
          { name: 'Exercise Option', value: 'exerciseOption' },
          { name: 'Get Expiry', value: 'getExpiry' },
          { name: 'Get Greeks', value: 'getGreeks' },
          { name: 'Get Settlements', value: 'getSettlements' },
        ],
        default: 'getFutures',
      },

      // Fixed Income Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['fixedIncome'] } },
        options: [
          { name: 'Get Bonds', value: 'getBonds' },
          { name: 'Get Repo', value: 'getRepo' },
          { name: 'Get Securities Lending', value: 'getSecuritiesLending' },
          { name: 'Get Yields', value: 'getYields' },
          { name: 'Get Positions', value: 'getPositions' },
          { name: 'Get Settlements', value: 'getSettlements' },
          { name: 'Get Coupons', value: 'getCoupons' },
          { name: 'Get Maturities', value: 'getMaturities' },
        ],
        default: 'getBonds',
      },

      // Prime Brokerage Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['primeBrokerage'] } },
        options: [
          { name: 'Get Services', value: 'getServices' },
          { name: 'Get Financing', value: 'getFinancing' },
          { name: 'Request Locate', value: 'requestLocate' },
          { name: 'Request Borrow', value: 'requestBorrow' },
          { name: 'Get Custody', value: 'getCustody' },
          { name: 'Get Clearing', value: 'getClearing' },
          { name: 'Get PB Reporting', value: 'getPBReporting' },
          { name: 'Get Agreement', value: 'getAgreement' },
        ],
        default: 'getServices',
      },

      // Route28 Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['route28'] } },
        options: [
          { name: 'Get Positions', value: 'getPositions' },
          { name: 'Get Swaps', value: 'getSwaps' },
          { name: 'Get Margin', value: 'getMargin' },
          { name: 'Get Collateral', value: 'getCollateral' },
          { name: 'Get P&L', value: 'getPnL' },
          { name: 'Request Rebalance', value: 'requestRebalance' },
          { name: 'Get Funding', value: 'getFunding' },
          { name: 'Request Termination', value: 'requestTermination' },
        ],
        default: 'getPositions',
      },

      // Collateral Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['collateral'] } },
        options: [
          { name: 'Get Positions', value: 'getPositions' },
          { name: 'Get Movements', value: 'getMovements' },
          { name: 'Get Haircuts', value: 'getHaircuts' },
          { name: 'Get Valuations', value: 'getValuations' },
          { name: 'Get Eligible', value: 'getEligible' },
          { name: 'Request Substitution', value: 'requestSubstitution' },
          { name: 'Run Optimization', value: 'runOptimization' },
          { name: 'Get Disputes', value: 'getDisputes' },
        ],
        default: 'getPositions',
      },

      // Settlement Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['settlement'] } },
        options: [
          { name: 'Get Instructions', value: 'getInstructions' },
          { name: 'Get Pending', value: 'getPending' },
          { name: 'Get History', value: 'getHistory' },
          { name: 'Get Netting', value: 'getNetting' },
          { name: 'Get Fails', value: 'getFails' },
          { name: 'Get SSI', value: 'getSSI' },
          { name: 'Get Reconciliation', value: 'getReconciliation' },
          { name: 'Get Confirmation', value: 'getConfirmation' },
        ],
        default: 'getInstructions',
      },

      // Reporting Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['reporting'] } },
        options: [
          { name: 'Get Standard Reports', value: 'getStandardReports' },
          { name: 'Create Custom Report', value: 'createCustomReport' },
          { name: 'Schedule Report', value: 'scheduleReport' },
          { name: 'Get Report History', value: 'getReportHistory' },
          { name: 'Get Templates', value: 'getTemplates' },
          { name: 'Export Report', value: 'exportReport' },
          { name: 'Get Bitemporal Data', value: 'getBitemporalData' },
          { name: 'Get Analytics', value: 'getAnalytics' },
        ],
        default: 'getStandardReports',
      },

      // Counterparty Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['counterparty'] } },
        options: [
          { name: 'List Counterparties', value: 'listCounterparties' },
          { name: 'Get Details', value: 'getDetails' },
          { name: 'Get Limits', value: 'getLimits' },
          { name: 'Get Agreements', value: 'getAgreements' },
          { name: 'Get Exposure', value: 'getExposure' },
          { name: 'Get Netting', value: 'getNetting' },
          { name: 'Get Credit', value: 'getCredit' },
          { name: 'Start Onboarding', value: 'startOnboarding' },
        ],
        default: 'listCounterparties',
      },

      // Exchange Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['exchange'] } },
        options: [
          { name: 'Get Connected Exchanges', value: 'getConnectedExchanges' },
          { name: 'Get Exchange Status', value: 'getExchangeStatus' },
          { name: 'Get Exchange Balances', value: 'getExchangeBalances' },
          { name: 'Transfer to Exchange', value: 'transferToExchange' },
          { name: 'Transfer from Exchange', value: 'transferFromExchange' },
          { name: 'Get Supported Exchanges', value: 'getSupportedExchanges' },
          { name: 'Get Exchange Fees', value: 'getExchangeFees' },
          { name: 'Get Exchange Markets', value: 'getExchangeMarkets' },
        ],
        default: 'getConnectedExchanges',
      },

      // Compliance Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['compliance'] } },
        options: [
          { name: 'Get Status', value: 'getStatus' },
          { name: 'Get Surveillance Alerts', value: 'getSurveillanceAlerts' },
          { name: 'Get AML Alerts', value: 'getAMLAlerts' },
          { name: 'Get Regulatory Filings', value: 'getRegulatoryFilings' },
          { name: 'Get Audit Trail', value: 'getAuditTrail' },
          { name: 'Get SOC 2 Reports', value: 'getSOC2Reports' },
          { name: 'Get KYC Status', value: 'getKYCStatus' },
          { name: 'Get Sanctions Screening', value: 'getSanctionsScreening' },
        ],
        default: 'getStatus',
      },

      // Webhook Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['webhook'] } },
        options: [
          { name: 'Create Webhook', value: 'createWebhook' },
          { name: 'List Webhooks', value: 'listWebhooks' },
          { name: 'Get Webhook', value: 'getWebhook' },
          { name: 'Update Webhook', value: 'updateWebhook' },
          { name: 'Delete Webhook', value: 'deleteWebhook' },
          { name: 'Get Events', value: 'getEvents' },
          { name: 'Test Webhook', value: 'testWebhook' },
          { name: 'Get Logs', value: 'getLogs' },
        ],
        default: 'listWebhooks',
      },

      // Utility Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['utility'] } },
        options: [
          { name: 'Get API Status', value: 'getApiStatus' },
          { name: 'Get Supported Assets', value: 'getSupportedAssets' },
          { name: 'Get Supported Markets', value: 'getSupportedMarkets' },
          { name: 'Get Trading Hours', value: 'getTradingHours' },
          { name: 'Get Market Holidays', value: 'getMarketHolidays' },
          { name: 'Get Fee Schedule', value: 'getFeeSchedule' },
          { name: 'Get Rate Limits', value: 'getRateLimits' },
          { name: 'Get SDK Version', value: 'getSdkVersion' },
          { name: 'Ping', value: 'ping' },
          { name: 'Get Server Time', value: 'getServerTime' },
        ],
        default: 'getApiStatus',
      },

      // Common Parameters
      {
        displayName: 'Account ID',
        name: 'accountId',
        type: 'string',
        default: '',
        description: 'Account ID (leave empty to use default from credentials)',
      },
      {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        options: [
          {
            displayName: 'Symbol',
            name: 'symbol',
            type: 'string',
            default: '',
          },
          {
            displayName: 'Side',
            name: 'side',
            type: 'options',
            options: [...ORDER_SIDES],
            default: 'buy',
          },
          {
            displayName: 'Order Type',
            name: 'orderType',
            type: 'options',
            options: [...ORDER_TYPES],
            default: 'limit',
          },
          {
            displayName: 'Quantity',
            name: 'quantity',
            type: 'number',
            default: 0,
          },
          {
            displayName: 'Price',
            name: 'price',
            type: 'number',
            default: 0,
          },
          {
            displayName: 'Currency',
            name: 'currency',
            type: 'options',
            options: [...CURRENCIES],
            default: 'USD',
          },
          {
            displayName: 'Asset Class',
            name: 'assetClass',
            type: 'options',
            options: [...ASSET_CLASSES],
            default: 'equity',
          },
          {
            displayName: 'Collateral Type',
            name: 'collateralType',
            type: 'options',
            options: [...COLLATERAL_TYPES],
            default: 'cash',
          },
          {
            displayName: 'Transfer Type',
            name: 'transferType',
            type: 'options',
            options: [...TRANSFER_TYPES],
            default: 'internal',
          },
          {
            displayName: 'Report Type',
            name: 'reportType',
            type: 'options',
            options: [...REPORT_TYPES],
            default: 'daily_activity',
          },
          {
            displayName: 'Report Format',
            name: 'reportFormat',
            type: 'options',
            options: [...REPORT_FORMATS],
            default: 'pdf',
          },
          {
            displayName: 'Webhook Events',
            name: 'webhookEvents',
            type: 'multiOptions',
            options: [...WEBHOOK_EVENTS],
            default: [],
          },
          {
            displayName: 'FX Tenor',
            name: 'fxTenor',
            type: 'options',
            options: [...FX_TENOR],
            default: 'spot',
          },
          {
            displayName: 'Option Type',
            name: 'optionType',
            type: 'options',
            options: [...OPTION_TYPES],
            default: 'call',
          },
          {
            displayName: 'Crypto Asset',
            name: 'cryptoAsset',
            type: 'options',
            options: [...CRYPTO_ASSETS],
            default: 'BTC',
          },
          {
            displayName: 'Start Date',
            name: 'startDate',
            type: 'dateTime',
            default: '',
          },
          {
            displayName: 'End Date',
            name: 'endDate',
            type: 'dateTime',
            default: '',
          },
          {
            displayName: 'As Of (Bitemporal)',
            name: 'asOf',
            type: 'dateTime',
            default: '',
            description: 'Valid time for bitemporal queries',
          },
          {
            displayName: 'As At (Bitemporal)',
            name: 'asAt',
            type: 'dateTime',
            default: '',
            description: 'Transaction time for bitemporal queries',
          },
          {
            displayName: 'Limit',
            name: 'limit',
            type: 'number',
            default: 100,
          },
          {
            displayName: 'Offset',
            name: 'offset',
            type: 'number',
            default: 0,
          },
        ],
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    let returnData: INodeExecutionData[] = [];

    const resource = this.getNodeParameter('resource', 0) as string;

    for (let i = 0; i < items.length; i++) {
      try {
        let result: INodeExecutionData[] = [];

        switch (resource) {
          case 'accountActivity':
            result = await executeAccountActivity.call(this, i);
            break;
          case 'riskMetrics':
            result = await executeRiskMetrics.call(this, i);
            break;
          case 'treasury':
            result = await executeTreasury.call(this, i);
            break;
          case 'trading':
            result = await executeTrading.call(this, i);
            break;
          case 'fxTrading':
            result = await executeFxTrading.call(this, i);
            break;
          case 'digitalAssets':
            result = await executeDigitalAssets.call(this, i);
            break;
          case 'derivatives':
            result = await executeDerivatives.call(this, i);
            break;
          case 'fixedIncome':
            result = await executeFixedIncome.call(this, i);
            break;
          case 'primeBrokerage':
            result = await executePrimeBrokerage.call(this, i);
            break;
          case 'route28':
            result = await executeRoute28.call(this, i);
            break;
          case 'collateral':
            result = await executeCollateral.call(this, i);
            break;
          case 'settlement':
            result = await executeSettlement.call(this, i);
            break;
          case 'reporting':
            result = await executeReporting.call(this, i);
            break;
          case 'counterparty':
            result = await executeCounterparty.call(this, i);
            break;
          case 'exchange':
            result = await executeExchange.call(this, i);
            break;
          case 'compliance':
            result = await executeCompliance.call(this, i);
            break;
          case 'webhook':
            result = await executeWebhook.call(this, i);
            break;
          case 'utility':
            result = await executeUtility.call(this, i);
            break;
          default:
            throw new Error(`Unknown resource: ${resource}`);
        }

        returnData = returnData.concat(result);
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({
            json: { error: (error as Error).message },
            pairedItem: { item: i },
          });
        } else {
          throw error;
        }
      }
    }

    return [returnData];
  }
}
