/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { RipplePrime } from '../nodes/Ripple Prime/Ripple Prime.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('RipplePrime Node', () => {
  let node: RipplePrime;

  beforeAll(() => {
    node = new RipplePrime();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('Ripple Prime');
      expect(node.description.name).toBe('rippleprime');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 6 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(6);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(6);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('Account Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://api.rippleprime.com/v1' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { httpRequest: jest.fn(), requestWithAuthentication: jest.fn() },
    };
  });

  describe('getProfile operation', () => {
    it('should successfully get account profile', async () => {
      const mockProfile = { accountId: '123', permissions: ['trading'] };
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getProfile');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockProfile);

      const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockProfile, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.rippleprime.com/v1/account/profile',
        headers: { 'Authorization': 'Bearer test-key', 'Content-Type': 'application/json' },
        json: true
      });
    });

    it('should handle errors in getProfile', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getProfile');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('getBalances operation', () => {
    it('should successfully get balances with filters', async () => {
      const mockBalances = [{ asset: 'XRP', balance: '1000' }];
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getBalances')
        .mockReturnValueOnce('XRP')
        .mockReturnValueOnce(true);
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockBalances);

      const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockBalances, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.rippleprime.com/v1/account/balances?asset=XRP&includeZero=true',
        headers: { 'Authorization': 'Bearer test-key', 'Content-Type': 'application/json' },
        json: true
      });
    });
  });

  describe('getPositions operation', () => {
    it('should successfully get positions with status filter', async () => {
      const mockPositions = [{ asset: 'XRP', size: '100', status: 'open' }];
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getPositions')
        .mockReturnValueOnce('XRP')
        .mockReturnValueOnce('open');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockPositions);

      const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockPositions, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.rippleprime.com/v1/account/positions?asset=XRP&status=open',
        headers: { 'Authorization': 'Bearer test-key', 'Content-Type': 'application/json' },
        json: true
      });
    });
  });

  describe('getMarginInfo operation', () => {
    it('should successfully get margin information', async () => {
      const mockMargin = { totalMargin: '5000', usedMargin: '2000' };
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getMarginInfo');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockMargin);

      const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockMargin, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.rippleprime.com/v1/account/margin',
        headers: { 'Authorization': 'Bearer test-key', 'Content-Type': 'application/json' },
        json: true
      });
    });
  });
});

describe('Order Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-key',
        baseUrl: 'https://api.rippleprime.com/v1',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('createOrder', () => {
    it('should create a new order successfully', async () => {
      const mockResponse = { orderId: '123456', status: 'pending' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('createOrder')
        .mockReturnValueOnce('BTC/USD')
        .mockReturnValueOnce('buy')
        .mockReturnValueOnce('limit')
        .mockReturnValueOnce(1.5)
        .mockReturnValueOnce(50000)
        .mockReturnValueOnce('GTC');

      const result = await executeOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.rippleprime.com/v1/orders',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json',
        },
        body: {
          symbol: 'BTC/USD',
          side: 'buy',
          type: 'limit',
          quantity: 1.5,
          price: 50000,
          timeInForce: 'GTC',
        },
        json: true,
      });
    });

    it('should handle createOrder error', async () => {
      const error = new Error('API Error');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);
      mockExecuteFunctions.getNodeParameter.mockReturnValue('createOrder');
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('getOrder', () => {
    it('should get order details successfully', async () => {
      const mockResponse = { orderId: '123456', symbol: 'BTC/USD', status: 'filled' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getOrder')
        .mockReturnValueOnce('123456');

      const result = await executeOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.rippleprime.com/v1/orders/123456',
        headers: {
          'Authorization': 'Bearer test-key',
        },
        json: true,
      });
    });
  });

  describe('getAllOrders', () => {
    it('should get all orders successfully', async () => {
      const mockResponse = { orders: [{ orderId: '123456' }, { orderId: '789012' }] };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAllOrders')
        .mockReturnValueOnce('BTC/USD')
        .mockReturnValueOnce('active')
        .mockReturnValueOnce(50)
        .mockReturnValueOnce(10);

      const result = await executeOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.rippleprime.com/v1/orders?symbol=BTC%2FUSD&status=active&limit=50&offset=10',
        headers: {
          'Authorization': 'Bearer test-key',
        },
        json: true,
      });
    });
  });

  describe('updateOrder', () => {
    it('should update order successfully', async () => {
      const mockResponse = { orderId: '123456', status: 'updated' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('updateOrder')
        .mockReturnValueOnce('123456')
        .mockReturnValueOnce(2.0)
        .mockReturnValueOnce(55000);

      const result = await executeOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'PUT',
        url: 'https://api.rippleprime.com/v1/orders/123456',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json',
        },
        body: {
          quantity: 2.0,
          price: 55000,
        },
        json: true,
      });
    });
  });

  describe('cancelOrder', () => {
    it('should cancel order successfully', async () => {
      const mockResponse = { orderId: '123456', status: 'cancelled' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('cancelOrder')
        .mockReturnValueOnce('123456');

      const result = await executeOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'DELETE',
        url: 'https://api.rippleprime.com/v1/orders/123456',
        headers: {
          'Authorization': 'Bearer test-key',
        },
        json: true,
      });
    });
  });

  describe('cancelAllOrders', () => {
    it('should cancel all orders successfully', async () => {
      const mockResponse = { cancelled: 5 };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('cancelAllOrders')
        .mockReturnValueOnce('BTC/USD');

      const result = await executeOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'DELETE',
        url: 'https://api.rippleprime.com/v1/orders?symbol=BTC%2FUSD',
        headers: {
          'Authorization': 'Bearer test-key',
        },
        json: true,
      });
    });
  });
});

describe('Trade Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://api.rippleprime.com/v1',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('getAllTrades operation', () => {
    it('should get all trades successfully', async () => {
      const mockResponse = {
        trades: [
          { id: 'trade1', symbol: 'BTC/USD', quantity: 1.5, price: 50000 },
          { id: 'trade2', symbol: 'ETH/USD', quantity: 10, price: 3000 },
        ],
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAllTrades')
        .mockReturnValueOnce('BTC/USD')
        .mockReturnValueOnce('2023-01-01T00:00:00Z')
        .mockReturnValueOnce('2023-01-02T00:00:00Z')
        .mockReturnValueOnce(100);

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTradeOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.rippleprime.com/v1/trades?symbol=BTC%2FUSD&startTime=2023-01-01T00%3A00%3A00.000Z&endTime=2023-01-02T00%3A00%3A00.000Z&limit=100',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 },
      }]);
    });

    it('should handle getAllTrades error', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getAllTrades');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeTradeOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{
        json: { error: 'API Error' },
        pairedItem: { item: 0 },
      }]);
    });
  });

  describe('getTrade operation', () => {
    it('should get specific trade successfully', async () => {
      const mockResponse = {
        id: 'trade123',
        symbol: 'BTC/USD',
        quantity: 1.5,
        price: 50000,
        timestamp: '2023-01-01T10:30:00Z',
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getTrade')
        .mockReturnValueOnce('trade123');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTradeOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.rippleprime.com/v1/trades/trade123',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 },
      }]);
    });

    it('should handle getTrade error', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getTrade')
        .mockReturnValueOnce('trade123');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Trade not found'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeTradeOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{
        json: { error: 'Trade not found' },
        pairedItem: { item: 0 },
      }]);
    });
  });

  describe('getSettlements operation', () => {
    it('should get settlements successfully', async () => {
      const mockResponse = {
        settlements: [
          { id: 'settle1', status: 'settled', amount: 75000, date: '2023-01-01' },
          { id: 'settle2', status: 'pending', amount: 30000, date: '2023-01-01' },
        ],
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getSettlements')
        .mockReturnValueOnce('2023-01-01T00:00:00Z')
        .mockReturnValueOnce('settled');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTradeOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.rippleprime.com/v1/trades/settlements?date=2023-01-01&status=settled',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 },
      }]);
    });

    it('should handle getSettlements error', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getSettlements');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Settlement API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeTradeOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{
        json: { error: 'Settlement API Error' },
        pairedItem: { item: 0 },
      }]);
    });
  });
});

describe('MarketData Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				baseUrl: 'https://api.rippleprime.com/v1',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	describe('getInstruments operation', () => {
		it('should get instruments successfully', async () => {
			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				switch (paramName) {
					case 'operation': return 'getInstruments';
					case 'assetClass': return 'crypto';
					case 'status': return 'active';
					default: return '';
				}
			});

			const mockResponse = { instruments: [{ symbol: 'BTC-USD', status: 'active' }] };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeMarketDataOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.rippleprime.com/v1/market/instruments',
				headers: {
					'Authorization': 'Bearer test-key',
					'Content-Type': 'application/json',
				},
				qs: { assetClass: 'crypto', status: 'active' },
				json: true,
			});

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});

		it('should handle getInstruments error', async () => {
			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				if (paramName === 'operation') return 'getInstruments';
				return '';
			});

			const error = new Error('API Error');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);

			await expect(executeMarketDataOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('API Error');
		});
	});

	describe('getTicker operation', () => {
		it('should get ticker successfully', async () => {
			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				switch (paramName) {
					case 'operation': return 'getTicker';
					case 'symbol': return 'BTC-USD';
					default: return '';
				}
			});

			const mockResponse = { symbol: 'BTC-USD', price: '50000', volume: '1000' };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeMarketDataOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.rippleprime.com/v1/market/ticker',
				headers: {
					'Authorization': 'Bearer test-key',
					'Content-Type': 'application/json',
				},
				qs: { symbol: 'BTC-USD' },
				json: true,
			});

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('getOrderBook operation', () => {
		it('should get order book successfully', async () => {
			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				switch (paramName) {
					case 'operation': return 'getOrderBook';
					case 'symbol': return 'BTC-USD';
					case 'depth': return 10;
					default: return '';
				}
			});

			const mockResponse = { bids: [], asks: [] };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeMarketDataOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.rippleprime.com/v1/market/orderbook',
				headers: {
					'Authorization': 'Bearer test-key',
					'Content-Type': 'application/json',
				},
				qs: { symbol: 'BTC-USD', depth: 10 },
				json: true,
			});

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('getMarketTrades operation', () => {
		it('should get market trades successfully', async () => {
			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				switch (paramName) {
					case 'operation': return 'getMarketTrades';
					case 'symbol': return 'BTC-USD';
					case 'limit': return 25;
					default: return '';
				}
			});

			const mockResponse = { trades: [] };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeMarketDataOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.rippleprime.com/v1/market/trades',
				headers: {
					'Authorization': 'Bearer test-key',
					'Content-Type': 'application/json',
				},
				qs: { symbol: 'BTC-USD', limit: 25 },
				json: true,
			});

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('getCandles operation', () => {
		it('should get candles successfully', async () => {
			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				switch (paramName) {
					case 'operation': return 'getCandles';
					case 'symbol': return 'BTC-USD';
					case 'interval': return '1h';
					case 'startTime': return '2023-01-01T00:00:00Z';
					case 'endTime': return '2023-01-02T00:00:00Z';
					default: return '';
				}
			});

			const mockResponse = { candles: [] };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeMarketDataOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.rippleprime.com/v1/market/candles',
				headers: {
					'Authorization': 'Bearer test-key',
					'Content-Type': 'application/json',
				},
				qs: { 
					symbol: 'BTC-USD',
					interval: '1h',
					startTime: '2023-01-01T00:00:00.000Z',
					endTime: '2023-01-02T00:00:00.000Z',
				},
				json: true,
			});

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});
});

describe('PrimeBrokerage Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				baseUrl: 'https://api.rippleprime.com/v1',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn(),
			},
		};
	});

	it('should get lending rates successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getLendingRates')
			.mockReturnValueOnce('XRP')
			.mockReturnValueOnce('1D');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			rates: [{ asset: 'XRP', rate: 5.5, term: '1D' }],
		});

		const result = await executePrimeBrokerageOperations.call(
			mockExecuteFunctions,
			[{ json: {} }],
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.rates).toBeDefined();
	});

	it('should create lending order successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('createLendingOrder')
			.mockReturnValueOnce('XRP')
			.mockReturnValueOnce(1000)
			.mockReturnValueOnce(5.5)
			.mockReturnValueOnce('1D');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			orderId: 'order123',
			status: 'active',
		});

		const result = await executePrimeBrokerageOperations.call(
			mockExecuteFunctions,
			[{ json: {} }],
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.orderId).toBe('order123');
	});

	it('should get borrowing rates successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getBorrowingRates')
			.mockReturnValueOnce('BTC')
			.mockReturnValueOnce(0.5);

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			rates: [{ asset: 'BTC', rate: 7.2, available: true }],
		});

		const result = await executePrimeBrokerageOperations.call(
			mockExecuteFunctions,
			[{ json: {} }],
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.rates).toBeDefined();
	});

	it('should create borrowing order successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('createBorrowingOrder')
			.mockReturnValueOnce('BTC')
			.mockReturnValueOnce(0.5)
			.mockReturnValueOnce('XRP');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			borrowId: 'borrow123',
			status: 'approved',
		});

		const result = await executePrimeBrokerageOperations.call(
			mockExecuteFunctions,
			[{ json: {} }],
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.borrowId).toBe('borrow123');
	});

	it('should get collateral requirements successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getCollateralRequirements')
			.mockReturnValueOnce('ETH')
			.mockReturnValueOnce(10);

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			requirements: { minCollateral: 15000, ratio: 1.5 },
		});

		const result = await executePrimeBrokerageOperations.call(
			mockExecuteFunctions,
			[{ json: {} }],
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.requirements).toBeDefined();
	});

	it('should manage collateral successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('manageCollateral')
			.mockReturnValueOnce('XRP')
			.mockReturnValueOnce(5000)
			.mockReturnValueOnce('add');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			transactionId: 'tx123',
			newBalance: 15000,
		});

		const result = await executePrimeBrokerageOperations.call(
			mockExecuteFunctions,
			[{ json: {} }],
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.transactionId).toBe('tx123');
	});

	it('should handle API errors gracefully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getLendingRates')
			.mockReturnValueOnce('XRP')
			.mockReturnValueOnce('1D');

		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(
			new Error('API Error'),
		);

		await expect(
			executePrimeBrokerageOperations.call(mockExecuteFunctions, [{ json: {} }]),
		).rejects.toThrow('API Error');
	});

	it('should continue on fail when configured', async () => {
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getLendingRates')
			.mockReturnValueOnce('XRP')
			.mockReturnValueOnce('1D');

		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(
			new Error('API Error'),
		);

		const result = await executePrimeBrokerageOperations.call(
			mockExecuteFunctions,
			[{ json: {} }],
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.error).toBe('API Error');
	});
});

describe('Risk Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				baseUrl: 'https://api.rippleprime.com/v1',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn(),
			},
		};
	});

	describe('getExposure operation', () => {
		it('should successfully get risk exposure', async () => {
			const mockResponse = {
				totalExposure: 150000,
				exposureByAsset: {
					BTC: 75000,
					ETH: 50000,
					XRP: 25000,
				},
			};

			mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
				switch (param) {
					case 'operation':
						return 'getExposure';
					case 'assetClass':
						return 'crypto';
					case 'currency':
						return 'USD';
					default:
						return undefined;
				}
			});

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const items = [{ json: {} }];
			const result = await executeRiskOperations.call(mockExecuteFunctions, items);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.rippleprime.com/v1/risk/exposure?assetClass=crypto&currency=USD',
				headers: {
					'Authorization': 'Bearer test-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});
		});

		it('should handle error when getting risk exposure', async () => {
			mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
				switch (param) {
					case 'operation':
						return 'getExposure';
					default:
						return '';
				}
			});

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const items = [{ json: {} }];
			const result = await executeRiskOperations.call(mockExecuteFunctions, items);

			expect(result).toHaveLength(1);
			expect(result[0].json.error).toBe('API Error');
		});
	});

	describe('getMarginRequirements operation', () => {
		it('should successfully get margin requirements', async () => {
			const mockResponse = {
				totalMarginRequired: 5000,
				marginByPosition: {
					'BTC-USDT': 3000,
					'ETH-USDT': 2000,
				},
			};

			const positions = JSON.stringify([
				{ symbol: 'BTC-USDT', quantity: 1 },
				{ symbol: 'ETH-USDT', quantity: 10 },
			]);

			mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
				switch (param) {
					case 'operation':
						return 'getMarginRequirements';
					case 'positions':
						return positions;
					default:
						return undefined;
				}
			});

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const items = [{ json: {} }];
			const result = await executeRiskOperations.call(mockExecuteFunctions, items);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
		});
	});

	describe('getRiskLimits operation', () => {
		it('should successfully get risk limits', async () => {
			const mockResponse = {
				limitType: 'exposure',
				currentLimit: 500000,
				utilizationPercentage: 30,
			};

			mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
				switch (param) {
					case 'operation':
						return 'getRiskLimits';
					case 'limitType':
						return 'exposure';
					default:
						return undefined;
				}
			});

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const items = [{ json: {} }];
			const result = await executeRiskOperations.call(mockExecuteFunctions, items);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
		});
	});

	describe('updateRiskLimits operation', () => {
		it('should successfully update risk limits', async () => {
			const mockResponse = {
				limitType: 'exposure',
				newValue: 750000,
				previousValue: 500000,
				status: 'updated',
			};

			mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
				switch (param) {
					case 'operation':
						return 'updateRiskLimits';
					case 'limitType':
						return 'exposure';
					case 'value':
						return 750000;
					default:
						return undefined;
				}
			});

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const items = [{ json: {} }];
			const result = await executeRiskOperations.call(mockExecuteFunctions, items);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'PUT',
				url: 'https://api.rippleprime.com/v1/risk/limits',
				headers: {
					'Authorization': 'Bearer test-key',
					'Content-Type': 'application/json',
				},
				body: {
					limitType: 'exposure',
					value: 750000,
				},
				json: true,
			});
		});

		it('should handle error when updating risk limits', async () => {
			mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
				switch (param) {
					case 'operation':
						return 'updateRiskLimits';
					case 'limitType':
						return 'exposure';
					case 'value':
						return 750000;
					default:
						return undefined;
				}
			});

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Update failed'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const items = [{ json: {} }];
			const result = await executeRiskOperations.call(mockExecuteFunctions, items);

			expect(result).toHaveLength(1);
			expect(result[0].json.error).toBe('Update failed');
		});
	});
});
});
