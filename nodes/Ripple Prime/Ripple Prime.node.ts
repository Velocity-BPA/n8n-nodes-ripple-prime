/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-rippleprime/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

export class RipplePrime implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Ripple Prime',
    name: 'rippleprime',
    icon: 'file:rippleprime.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the Ripple Prime API',
    defaults: {
      name: 'Ripple Prime',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'rippleprimeApi',
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
          {
            name: 'Account',
            value: 'account',
          },
          {
            name: 'Order',
            value: 'order',
          },
          {
            name: 'Trade',
            value: 'trade',
          },
          {
            name: 'MarketData',
            value: 'marketData',
          },
          {
            name: 'PrimeBrokerage',
            value: 'primeBrokerage',
          },
          {
            name: 'Risk',
            value: 'risk',
          }
        ],
        default: 'account',
      },
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['account'] } },
  options: [
    { name: 'Get Profile', value: 'getProfile', description: 'Get account profile and permissions', action: 'Get account profile' },
    { name: 'Get Balances', value: 'getBalances', description: 'Get all asset balances', action: 'Get asset balances' },
    { name: 'Get Positions', value: 'getPositions', description: 'Get current trading positions', action: 'Get trading positions' },
    { name: 'Get Margin Info', value: 'getMarginInfo', description: 'Get margin requirements and utilization', action: 'Get margin information' }
  ],
  default: 'getProfile',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['order'] } },
  options: [
    { name: 'Create Order', value: 'createOrder', description: 'Place a new order', action: 'Create order' },
    { name: 'Get Order', value: 'getOrder', description: 'Get specific order details', action: 'Get order' },
    { name: 'Get All Orders', value: 'getAllOrders', description: 'Get order history and active orders', action: 'Get all orders' },
    { name: 'Update Order', value: 'updateOrder', description: 'Modify existing order', action: 'Update order' },
    { name: 'Cancel Order', value: 'cancelOrder', description: 'Cancel an order', action: 'Cancel order' },
    { name: 'Cancel All Orders', value: 'cancelAllOrders', description: 'Cancel all orders', action: 'Cancel all orders' },
  ],
  default: 'createOrder',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['trade'] } },
  options: [
    { name: 'Get All Trades', value: 'getAllTrades', description: 'Get trade execution history', action: 'Get all trades' },
    { name: 'Get Trade', value: 'getTrade', description: 'Get specific trade details', action: 'Get a trade' },
    { name: 'Get Settlements', value: 'getSettlements', description: 'Get settlement information', action: 'Get settlements' },
  ],
  default: 'getAllTrades',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['marketData'],
		},
	},
	options: [
		{
			name: 'Get Instruments',
			value: 'getInstruments',
			description: 'Get available trading instruments',
			action: 'Get instruments',
		},
		{
			name: 'Get Ticker',
			value: 'getTicker',
			description: 'Get current market prices',
			action: 'Get ticker',
		},
		{
			name: 'Get Order Book',
			value: 'getOrderBook',
			description: 'Get order book depth',
			action: 'Get order book',
		},
		{
			name: 'Get Market Trades',
			value: 'getMarketTrades',
			description: 'Get recent market trades',
			action: 'Get market trades',
		},
		{
			name: 'Get Candles',
			value: 'getCandles',
			description: 'Get historical price data',
			action: 'Get candles',
		},
	],
	default: 'getInstruments',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['primeBrokerage'],
		},
	},
	options: [
		{
			name: 'Get Lending Rates',
			value: 'getLendingRates',
			description: 'Get current lending rates for assets',
			action: 'Get lending rates',
		},
		{
			name: 'Create Lending Order',
			value: 'createLendingOrder',
			description: 'Place a new lending order',
			action: 'Create lending order',
		},
		{
			name: 'Get Borrowing Rates',
			value: 'getBorrowingRates',
			description: 'Get borrowing rates and availability',
			action: 'Get borrowing rates',
		},
		{
			name: 'Create Borrowing Order',
			value: 'createBorrowingOrder',
			description: 'Place a new borrowing request',
			action: 'Create borrowing order',
		},
		{
			name: 'Get Collateral Requirements',
			value: 'getCollateralRequirements',
			description: 'Get collateral requirements for borrowing',
			action: 'Get collateral requirements',
		},
		{
			name: 'Manage Collateral',
			value: 'manageCollateral',
			description: 'Add or remove collateral from account',
			action: 'Manage collateral',
		},
	],
	default: 'getLendingRates',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['risk'] } },
	options: [
		{
			name: 'Get Exposure',
			value: 'getExposure',
			description: 'Get current risk exposure',
			action: 'Get current risk exposure',
		},
		{
			name: 'Get Margin Requirements',
			value: 'getMarginRequirements',
			description: 'Calculate margin requirements',
			action: 'Calculate margin requirements',
		},
		{
			name: 'Get Risk Limits',
			value: 'getRiskLimits',
			description: 'Get account risk limits',
			action: 'Get account risk limits',
		},
		{
			name: 'Update Risk Limits',
			value: 'updateRiskLimits',
			description: 'Update risk limit settings',
			action: 'Update risk limit settings',
		},
	],
	default: 'getExposure',
},
{
  displayName: 'Asset',
  name: 'asset',
  type: 'string',
  default: '',
  description: 'Filter balances by specific asset symbol',
  displayOptions: { show: { resource: ['account'], operation: ['getBalances'] } }
},
{
  displayName: 'Include Zero Balances',
  name: 'includeZero',
  type: 'boolean',
  default: false,
  description: 'Whether to include assets with zero balance',
  displayOptions: { show: { resource: ['account'], operation: ['getBalances'] } }
},
{
  displayName: 'Asset',
  name: 'asset',
  type: 'string',
  default: '',
  description: 'Filter positions by specific asset symbol',
  displayOptions: { show: { resource: ['account'], operation: ['getPositions'] } }
},
{
  displayName: 'Status',
  name: 'status',
  type: 'options',
  options: [
    { name: 'All', value: 'all' },
    { name: 'Open', value: 'open' },
    { name: 'Closed', value: 'closed' }
  ],
  default: 'all',
  description: 'Filter positions by status',
  displayOptions: { show: { resource: ['account'], operation: ['getPositions'] } }
},
{
  displayName: 'Symbol',
  name: 'symbol',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['order'], operation: ['createOrder'] } },
  default: '',
  description: 'Trading symbol (e.g., BTC/USD)',
},
{
  displayName: 'Side',
  name: 'side',
  type: 'options',
  required: true,
  displayOptions: { show: { resource: ['order'], operation: ['createOrder'] } },
  options: [
    { name: 'Buy', value: 'buy' },
    { name: 'Sell', value: 'sell' },
  ],
  default: 'buy',
  description: 'Order side',
},
{
  displayName: 'Type',
  name: 'type',
  type: 'options',
  required: true,
  displayOptions: { show: { resource: ['order'], operation: ['createOrder'] } },
  options: [
    { name: 'Market', value: 'market' },
    { name: 'Limit', value: 'limit' },
    { name: 'Stop', value: 'stop' },
    { name: 'Stop Limit', value: 'stop_limit' },
  ],
  default: 'limit',
  description: 'Order type',
},
{
  displayName: 'Quantity',
  name: 'quantity',
  type: 'number',
  required: true,
  displayOptions: { show: { resource: ['order'], operation: ['createOrder'] } },
  default: 0,
  description: 'Order quantity',
},
{
  displayName: 'Price',
  name: 'price',
  type: 'number',
  displayOptions: { show: { resource: ['order'], operation: ['createOrder'] } },
  default: 0,
  description: 'Order price (required for limit orders)',
},
{
  displayName: 'Time In Force',
  name: 'timeInForce',
  type: 'options',
  displayOptions: { show: { resource: ['order'], operation: ['createOrder'] } },
  options: [
    { name: 'Good Till Cancelled', value: 'GTC' },
    { name: 'Immediate Or Cancel', value: 'IOC' },
    { name: 'Fill Or Kill', value: 'FOK' },
    { name: 'Good Till Date', value: 'GTD' },
  ],
  default: 'GTC',
  description: 'Time in force for the order',
},
{
  displayName: 'Order ID',
  name: 'orderId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['order'], operation: ['getOrder', 'updateOrder', 'cancelOrder'] } },
  default: '',
  description: 'The ID of the order',
},
{
  displayName: 'Symbol',
  name: 'symbol',
  type: 'string',
  displayOptions: { show: { resource: ['order'], operation: ['getAllOrders', 'cancelAllOrders'] } },
  default: '',
  description: 'Filter by trading symbol',
},
{
  displayName: 'Status',
  name: 'status',
  type: 'options',
  displayOptions: { show: { resource: ['order'], operation: ['getAllOrders'] } },
  options: [
    { name: 'All', value: '' },
    { name: 'Active', value: 'active' },
    { name: 'Filled', value: 'filled' },
    { name: 'Cancelled', value: 'cancelled' },
    { name: 'Rejected', value: 'rejected' },
  ],
  default: '',
  description: 'Filter by order status',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: { show: { resource: ['order'], operation: ['getAllOrders'] } },
  default: 100,
  description: 'Maximum number of orders to return',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  displayOptions: { show: { resource: ['order'], operation: ['getAllOrders'] } },
  default: 0,
  description: 'Number of orders to skip',
},
{
  displayName: 'Quantity',
  name: 'quantity',
  type: 'number',
  displayOptions: { show: { resource: ['order'], operation: ['updateOrder'] } },
  default: 0,
  description: 'New order quantity',
},
{
  displayName: 'Price',
  name: 'price',
  type: 'number',
  displayOptions: { show: { resource: ['order'], operation: ['updateOrder'] } },
  default: 0,
  description: 'New order price',
},
{
  displayName: 'Symbol',
  name: 'symbol',
  type: 'string',
  displayOptions: { show: { resource: ['trade'], operation: ['getAllTrades'] } },
  default: '',
  description: 'Trading pair symbol to filter trades',
},
{
  displayName: 'Start Time',
  name: 'startTime',
  type: 'dateTime',
  displayOptions: { show: { resource: ['trade'], operation: ['getAllTrades'] } },
  default: '',
  description: 'Start time for trade history',
},
{
  displayName: 'End Time',
  name: 'endTime',
  type: 'dateTime',
  displayOptions: { show: { resource: ['trade'], operation: ['getAllTrades'] } },
  default: '',
  description: 'End time for trade history',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: { show: { resource: ['trade'], operation: ['getAllTrades'] } },
  default: 100,
  description: 'Maximum number of trades to return',
  typeOptions: {
    minValue: 1,
    maxValue: 1000,
  },
},
{
  displayName: 'Trade ID',
  name: 'tradeId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['trade'], operation: ['getTrade'] } },
  default: '',
  description: 'The unique identifier of the trade',
},
{
  displayName: 'Date',
  name: 'date',
  type: 'dateTime',
  displayOptions: { show: { resource: ['trade'], operation: ['getSettlements'] } },
  default: '',
  description: 'Date for settlement information',
},
{
  displayName: 'Status',
  name: 'status',
  type: 'options',
  displayOptions: { show: { resource: ['trade'], operation: ['getSettlements'] } },
  options: [
    { name: 'All', value: '' },
    { name: 'Pending', value: 'pending' },
    { name: 'Settled', value: 'settled' },
    { name: 'Failed', value: 'failed' },
  ],
  default: '',
  description: 'Settlement status filter',
},
{
	displayName: 'Asset Class',
	name: 'assetClass',
	type: 'string',
	default: '',
	description: 'Filter instruments by asset class',
	displayOptions: {
		show: {
			resource: ['marketData'],
			operation: ['getInstruments'],
		},
	},
},
{
	displayName: 'Status',
	name: 'status',
	type: 'options',
	options: [
		{
			name: 'Active',
			value: 'active',
		},
		{
			name: 'Inactive',
			value: 'inactive',
		},
		{
			name: 'All',
			value: 'all',
		},
	],
	default: 'active',
	description: 'Filter instruments by status',
	displayOptions: {
		show: {
			resource: ['marketData'],
			operation: ['getInstruments'],
		},
	},
},
{
	displayName: 'Symbol',
	name: 'symbol',
	type: 'string',
	required: true,
	default: '',
	description: 'Trading symbol (e.g., BTC-USD)',
	displayOptions: {
		show: {
			resource: ['marketData'],
			operation: ['getTicker', 'getOrderBook', 'getMarketTrades', 'getCandles'],
		},
	},
},
{
	displayName: 'Depth',
	name: 'depth',
	type: 'number',
	default: 20,
	description: 'Number of order book levels to return',
	displayOptions: {
		show: {
			resource: ['marketData'],
			operation: ['getOrderBook'],
		},
	},
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	default: 50,
	description: 'Maximum number of trades to return',
	displayOptions: {
		show: {
			resource: ['marketData'],
			operation: ['getMarketTrades'],
		},
	},
},
{
	displayName: 'Interval',
	name: 'interval',
	type: 'options',
	options: [
		{
			name: '1 Minute',
			value: '1m',
		},
		{
			name: '5 Minutes',
			value: '5m',
		},
		{
			name: '15 Minutes',
			value: '15m',
		},
		{
			name: '1 Hour',
			value: '1h',
		},
		{
			name: '4 Hours',
			value: '4h',
		},
		{
			name: '1 Day',
			value: '1d',
		},
	],
	default: '1h',
	description: 'Candlestick interval',
	displayOptions: {
		show: {
			resource: ['marketData'],
			operation: ['getCandles'],
		},
	},
},
{
	displayName: 'Start Time',
	name: 'startTime',
	type: 'dateTime',
	default: '',
	description: 'Start time for historical data (ISO 8601 format)',
	displayOptions: {
		show: {
			resource: ['marketData'],
			operation: ['getCandles'],
		},
	},
},
{
	displayName: 'End Time',
	name: 'endTime',
	type: 'dateTime',
	default: '',
	description: 'End time for historical data (ISO 8601 format)',
	displayOptions: {
		show: {
			resource: ['marketData'],
			operation: ['getCandles'],
		},
	},
},
{
	displayName: 'Asset',
	name: 'asset',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['primeBrokerage'],
			operation: ['getLendingRates', 'createLendingOrder', 'getBorrowingRates', 'createBorrowingOrder', 'getCollateralRequirements', 'manageCollateral'],
		},
	},
	default: '',
	description: 'The asset symbol (e.g., XRP, BTC, ETH)',
},
{
	displayName: 'Term',
	name: 'term',
	type: 'options',
	required: true,
	displayOptions: {
		show: {
			resource: ['primeBrokerage'],
			operation: ['getLendingRates', 'createLendingOrder'],
		},
	},
	options: [
		{
			name: '1 Day',
			value: '1D',
		},
		{
			name: '7 Days',
			value: '7D',
		},
		{
			name: '30 Days',
			value: '30D',
		},
		{
			name: '90 Days',
			value: '90D',
		},
	],
	default: '1D',
	description: 'Lending term duration',
},
{
	displayName: 'Amount',
	name: 'amount',
	type: 'number',
	required: true,
	displayOptions: {
		show: {
			resource: ['primeBrokerage'],
			operation: ['createLendingOrder', 'getBorrowingRates', 'createBorrowingOrder', 'getCollateralRequirements', 'manageCollateral'],
		},
	},
	default: 0,
	description: 'Amount of the asset',
},
{
	displayName: 'Rate',
	name: 'rate',
	type: 'number',
	required: true,
	displayOptions: {
		show: {
			resource: ['primeBrokerage'],
			operation: ['createLendingOrder'],
		},
	},
	default: 0,
	description: 'Annual interest rate as percentage',
},
{
	displayName: 'Collateral',
	name: 'collateral',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['primeBrokerage'],
			operation: ['createBorrowingOrder'],
		},
	},
	default: '',
	description: 'Collateral asset symbol',
},
{
	displayName: 'Action',
	name: 'action',
	type: 'options',
	required: true,
	displayOptions: {
		show: {
			resource: ['primeBrokerage'],
			operation: ['manageCollateral'],
		},
	},
	options: [
		{
			name: 'Add',
			value: 'add',
		},
		{
			name: 'Remove',
			value: 'remove',
		},
	],
	default: 'add',
	description: 'Action to perform on collateral',
},
{
	displayName: 'Asset Class',
	name: 'assetClass',
	type: 'string',
	required: false,
	displayOptions: {
		show: {
			resource: ['risk'],
			operation: ['getExposure'],
		},
	},
	default: '',
	description: 'The asset class to filter exposure data',
},
{
	displayName: 'Currency',
	name: 'currency',
	type: 'string',
	required: false,
	displayOptions: {
		show: {
			resource: ['risk'],
			operation: ['getExposure'],
		},
	},
	default: '',
	description: 'The currency to filter exposure data',
},
{
	displayName: 'Positions',
	name: 'positions',
	type: 'json',
	required: true,
	displayOptions: {
		show: {
			resource: ['risk'],
			operation: ['getMarginRequirements'],
		},
	},
	default: '[]',
	description: 'Array of positions to calculate margin requirements for',
},
{
	displayName: 'Limit Type',
	name: 'limitType',
	type: 'options',
	required: true,
	displayOptions: {
		show: {
			resource: ['risk'],
			operation: ['getRiskLimits', 'updateRiskLimits'],
		},
	},
	options: [
		{
			name: 'Exposure',
			value: 'exposure',
		},
		{
			name: 'Leverage',
			value: 'leverage',
		},
		{
			name: 'Position Size',
			value: 'position_size',
		},
		{
			name: 'Loss',
			value: 'loss',
		},
	],
	default: 'exposure',
	description: 'The type of risk limit',
},
{
	displayName: 'Value',
	name: 'value',
	type: 'number',
	required: true,
	displayOptions: {
		show: {
			resource: ['risk'],
			operation: ['updateRiskLimits'],
		},
	},
	default: 0,
	description: 'The new value for the risk limit',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'account':
        return [await executeAccountOperations.call(this, items)];
      case 'order':
        return [await executeOrderOperations.call(this, items)];
      case 'trade':
        return [await executeTradeOperations.call(this, items)];
      case 'marketData':
        return [await executeMarketDataOperations.call(this, items)];
      case 'primeBrokerage':
        return [await executePrimeBrokerageOperations.call(this, items)];
      case 'risk':
        return [await executeRiskOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeAccountOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('rippleprimeApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getProfile': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/account/profile`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json'
            },
            json: true
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getBalances': {
          const asset = this.getNodeParameter('asset', i) as string;
          const includeZero = this.getNodeParameter('includeZero', i) as boolean;
          
          const queryParams = new URLSearchParams();
          if (asset) queryParams.append('asset', asset);
          if (includeZero) queryParams.append('includeZero', 'true');
          
          const url = `${credentials.baseUrl}/account/balances${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
          
          const options: any = {
            method: 'GET',
            url,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json'
            },
            json: true
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getPositions': {
          const asset = this.getNodeParameter('asset', i) as string;
          const status = this.getNodeParameter('status', i) as string;
          
          const queryParams = new URLSearchParams();
          if (asset) queryParams.append('asset', asset);
          if (status && status !== 'all') queryParams.append('status', status);
          
          const url = `${credentials.baseUrl}/account/positions${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
          
          const options: any = {
            method: 'GET',
            url,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json'
            },
            json: true
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getMarginInfo': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/account/margin`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json'
            },
            json: true
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeOrderOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('rippleprimeApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'createOrder': {
          const symbol = this.getNodeParameter('symbol', i) as string;
          const side = this.getNodeParameter('side', i) as string;
          const type = this.getNodeParameter('type', i) as string;
          const quantity = this.getNodeParameter('quantity', i) as number;
          const price = this.getNodeParameter('price', i) as number;
          const timeInForce = this.getNodeParameter('timeInForce', i) as string;

          const body: any = {
            symbol,
            side,
            type,
            quantity,
            timeInForce,
          };

          if (type !== 'market') {
            body.price = price;
          }

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/orders`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getOrder': {
          const orderId = this.getNodeParameter('orderId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/orders/${orderId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAllOrders': {
          const symbol = this.getNodeParameter('symbol', i) as string;
          const status = this.getNodeParameter('status', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;

          const queryParams = new URLSearchParams();
          if (symbol) queryParams.append('symbol', symbol);
          if (status) queryParams.append('status', status);
          queryParams.append('limit', limit.toString());
          queryParams.append('offset', offset.toString());

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/orders?${queryParams.toString()}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateOrder': {
          const orderId = this.getNodeParameter('orderId', i) as string;
          const quantity = this.getNodeParameter('quantity', i) as number;
          const price = this.getNodeParameter('price', i) as number;

          const body: any = {};
          if (quantity) body.quantity = quantity;
          if (price) body.price = price;

          const options: any = {
            method: 'PUT',
            url: `${credentials.baseUrl}/orders/${orderId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'cancelOrder': {
          const orderId = this.getNodeParameter('orderId', i) as string;

          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl}/orders/${orderId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'cancelAllOrders': {
          const symbol = this.getNodeParameter('symbol', i) as string;

          const queryParams = new URLSearchParams();
          if (symbol) queryParams.append('symbol', symbol);

          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl}/orders${queryParams.toString() ? '?' + queryParams.toString() : ''}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeTradeOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('rippleprimeApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getAllTrades': {
          const symbol = this.getNodeParameter('symbol', i) as string;
          const startTime = this.getNodeParameter('startTime', i) as string;
          const endTime = this.getNodeParameter('endTime', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;

          const queryParams: any = {};
          if (symbol) queryParams.symbol = symbol;
          if (startTime) queryParams.startTime = new Date(startTime).toISOString();
          if (endTime) queryParams.endTime = new Date(endTime).toISOString();
          if (limit) queryParams.limit = limit.toString();

          const queryString = Object.keys(queryParams).length > 0 
            ? '?' + new URLSearchParams(queryParams).toString() 
            : '';

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/trades${queryString}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTrade': {
          const tradeId = this.getNodeParameter('tradeId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/trades/${tradeId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getSettlements': {
          const date = this.getNodeParameter('date', i) as string;
          const status = this.getNodeParameter('status', i) as string;

          const queryParams: any = {};
          if (date) queryParams.date = new Date(date).toISOString().split('T')[0];
          if (status) queryParams.status = status;

          const queryString = Object.keys(queryParams).length > 0 
            ? '?' + new URLSearchParams(queryParams).toString() 
            : '';

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/trades/settlements${queryString}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeMarketDataOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('rippleprimeApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'getInstruments': {
					const assetClass = this.getNodeParameter('assetClass', i) as string;
					const status = this.getNodeParameter('status', i) as string;
					
					const qs: any = {};
					if (assetClass) qs.assetClass = assetClass;
					if (status !== 'all') qs.status = status;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/market/instruments`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						qs,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getTicker': {
					const symbol = this.getNodeParameter('symbol', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/market/ticker`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						qs: { symbol },
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getOrderBook': {
					const symbol = this.getNodeParameter('symbol', i) as string;
					const depth = this.getNodeParameter('depth', i) as number;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/market/orderbook`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						qs: { symbol, depth },
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getMarketTrades': {
					const symbol = this.getNodeParameter('symbol', i) as string;
					const limit = this.getNodeParameter('limit', i) as number;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/market/trades`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						qs: { symbol, limit },
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getCandles': {
					const symbol = this.getNodeParameter('symbol', i) as string;
					const interval = this.getNodeParameter('interval', i) as string;
					const startTime = this.getNodeParameter('startTime', i) as string;
					const endTime = this.getNodeParameter('endTime', i) as string;

					const qs: any = { symbol, interval };
					if (startTime) qs.startTime = new Date(startTime).toISOString();
					if (endTime) qs.endTime = new Date(endTime).toISOString();

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/market/candles`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						qs,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(
						this.getNode(),
						`Unknown operation: ${operation}`,
						{ itemIndex: i },
					);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executePrimeBrokerageOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('rippleprimeApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'getLendingRates': {
					const asset = this.getNodeParameter('asset', i) as string;
					const term = this.getNodeParameter('term', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/prime/lending`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						qs: {
							asset,
							term,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'createLendingOrder': {
					const asset = this.getNodeParameter('asset', i) as string;
					const amount = this.getNodeParameter('amount', i) as number;
					const rate = this.getNodeParameter('rate', i) as number;
					const term = this.getNodeParameter('term', i) as string;

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/prime/lending`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body: {
							asset,
							amount,
							rate,
							term,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getBorrowingRates': {
					const asset = this.getNodeParameter('asset', i) as string;
					const amount = this.getNodeParameter('amount', i) as number;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/prime/borrowing`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						qs: {
							asset,
							amount,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'createBorrowingOrder': {
					const asset = this.getNodeParameter('asset', i) as string;
					const amount = this.getNodeParameter('amount', i) as number;
					const collateral = this.getNodeParameter('collateral', i) as string;

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/prime/borrowing`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body: {
							asset,
							amount,
							collateral,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getCollateralRequirements': {
					const asset = this.getNodeParameter('asset', i) as string;
					const amount = this.getNodeParameter('amount', i) as number;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/prime/collateral`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						qs: {
							asset,
							amount,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'manageCollateral': {
					const asset = this.getNodeParameter('asset', i) as string;
					const amount = this.getNodeParameter('amount', i) as number;
					const action = this.getNodeParameter('action', i) as string;

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/prime/collateral`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body: {
							asset,
							amount,
							action,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeRiskOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('rippleprimeApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'getExposure': {
					const assetClass = this.getNodeParameter('assetClass', i) as string;
					const currency = this.getNodeParameter('currency', i) as string;

					let url = `${credentials.baseUrl}/risk/exposure`;
					const queryParams: string[] = [];

					if (assetClass) {
						queryParams.push(`assetClass=${encodeURIComponent(assetClass)}`);
					}
					if (currency) {
						queryParams.push(`currency=${encodeURIComponent(currency)}`);
					}

					if (queryParams.length > 0) {
						url += `?${queryParams.join('&')}`;
					}

					const options: any = {
						method: 'GET',
						url,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getMarginRequirements': {
					const positions = this.getNodeParameter('positions', i) as string;
					let parsedPositions: any[];

					try {
						parsedPositions = JSON.parse(positions);
					} catch (error: any) {
						throw new NodeOperationError(
							this.getNode(),
							`Invalid JSON format for positions: ${error.message}`,
						);
					}

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/risk/margin?positions=${encodeURIComponent(JSON.stringify(parsedPositions))}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getRiskLimits': {
					const limitType = this.getNodeParameter('limitType', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/risk/limits?limitType=${encodeURIComponent(limitType)}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'updateRiskLimits': {
					const limitType = this.getNodeParameter('limitType', i) as string;
					const value = this.getNodeParameter('value', i) as number;

					const options: any = {
						method: 'PUT',
						url: `${credentials.baseUrl}/risk/limits`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body: {
							limitType,
							value,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(
						this.getNode(),
						`Unknown operation: ${operation}`,
						{ itemIndex: i },
					);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}
