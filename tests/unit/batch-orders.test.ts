import { describe, it, expect } from 'vitest';
import type {
  BatchOrderOperation,
  BatchOrderRequest,
  BatchCancelOrderData,
  BatchModifyOrderData,
  LimitOrderRequest,
  MarketOrderRequest,
  StopLimitOrderRequest,
  ModifyMatchStrategy,
} from '../../src/types';

/**
 * Type-level tests for BatchOrderOperation
 *
 * These tests verify that the TypeScript types correctly validate
 * the structure of batch order operations according to the VALR API spec.
 */
describe('BatchOrderOperation Types', () => {
  describe('PLACE_LIMIT operation', () => {
    it('should accept valid PLACE_LIMIT operation with all required fields', () => {
      const operation: BatchOrderOperation = {
        type: 'PLACE_LIMIT',
        data: {
          pair: 'BTCZAR',
          side: 'BUY',
          quantity: '0.001',
          price: '500000',
        },
      };

      expect(operation.type).toBe('PLACE_LIMIT');
      expect(operation.data.pair).toBe('BTCZAR');
      expect(operation.data.side).toBe('BUY');
    });

    it('should accept PLACE_LIMIT with optional fields', () => {
      const operation: BatchOrderOperation = {
        type: 'PLACE_LIMIT',
        data: {
          pair: 'ETHZAR',
          side: 'SELL',
          quantity: '0.5',
          price: '25000',
          postOnly: 'POST_ONLY_REPRICE',
          timeInForce: 'GTC',
          customerOrderId: 'my-order-123',
          allowMargin: true,
          postOnlyReprice: true,
          postOnlyRepriceTicks: '5',
        },
      };

      expect(operation.type).toBe('PLACE_LIMIT');
      expect((operation.data as LimitOrderRequest).postOnly).toBe('POST_ONLY_REPRICE');
      expect((operation.data as LimitOrderRequest).timeInForce).toBe('GTC');
      expect((operation.data as LimitOrderRequest).customerOrderId).toBe('my-order-123');
    });

    it('should require pair field in PLACE_LIMIT data', () => {
      // This is a compile-time check - the operation below should have pair
      const operation: BatchOrderOperation = {
        type: 'PLACE_LIMIT',
        data: {
          pair: 'BTCZAR', // Required field
          side: 'BUY',
          quantity: '0.001',
          price: '500000',
        },
      };

      // Runtime verification that pair exists
      expect(operation.data.pair).toBeDefined();
      expect(typeof operation.data.pair).toBe('string');
    });
  });

  describe('PLACE_MARKET operation', () => {
    it('should accept valid PLACE_MARKET operation with baseAmount', () => {
      const operation: BatchOrderOperation = {
        type: 'PLACE_MARKET',
        data: {
          pair: 'BTCZAR',
          side: 'BUY',
          baseAmount: '0.001',
        },
      };

      expect(operation.type).toBe('PLACE_MARKET');
      expect(operation.data.pair).toBe('BTCZAR');
      expect((operation.data as MarketOrderRequest).baseAmount).toBe('0.001');
    });

    it('should accept valid PLACE_MARKET operation with quoteAmount', () => {
      const operation: BatchOrderOperation = {
        type: 'PLACE_MARKET',
        data: {
          pair: 'BTCZAR',
          side: 'SELL',
          quoteAmount: '1000',
        },
      };

      expect(operation.type).toBe('PLACE_MARKET');
      expect((operation.data as MarketOrderRequest).quoteAmount).toBe('1000');
    });

    it('should accept PLACE_MARKET with customerOrderId', () => {
      const operation: BatchOrderOperation = {
        type: 'PLACE_MARKET',
        data: {
          pair: 'ETHUSDT',
          side: 'BUY',
          quoteAmount: '100',
          customerOrderId: 'market-order-456',
        },
      };

      expect((operation.data as MarketOrderRequest).customerOrderId).toBe('market-order-456');
    });

    it('should require pair field in PLACE_MARKET data', () => {
      const operation: BatchOrderOperation = {
        type: 'PLACE_MARKET',
        data: {
          pair: 'BTCUSDT', // Required field
          side: 'SELL',
          quoteAmount: '100',
        },
      };

      expect(operation.data.pair).toBeDefined();
    });
  });

  describe('PLACE_STOP_LIMIT operation', () => {
    it('should accept valid PLACE_STOP_LIMIT operation for TAKE_PROFIT_LIMIT', () => {
      const operation: BatchOrderOperation = {
        type: 'PLACE_STOP_LIMIT',
        data: {
          pair: 'BTCZAR',
          side: 'SELL',
          quantity: '0.001',
          price: '550000',
          stopPrice: '540000',
          type: 'TAKE_PROFIT_LIMIT',
        },
      };

      expect(operation.type).toBe('PLACE_STOP_LIMIT');
      expect((operation.data as StopLimitOrderRequest).stopPrice).toBe('540000');
      expect((operation.data as StopLimitOrderRequest).type).toBe('TAKE_PROFIT_LIMIT');
    });

    it('should accept valid PLACE_STOP_LIMIT operation for STOP_LOSS_LIMIT', () => {
      const operation: BatchOrderOperation = {
        type: 'PLACE_STOP_LIMIT',
        data: {
          pair: 'BTCZAR',
          side: 'SELL',
          quantity: '0.001',
          price: '480000',
          stopPrice: '490000',
          type: 'STOP_LOSS_LIMIT',
          timeInForce: 'GTC',
        },
      };

      expect((operation.data as StopLimitOrderRequest).type).toBe('STOP_LOSS_LIMIT');
      expect((operation.data as StopLimitOrderRequest).timeInForce).toBe('GTC');
    });

    it('should require pair field in PLACE_STOP_LIMIT data', () => {
      const operation: BatchOrderOperation = {
        type: 'PLACE_STOP_LIMIT',
        data: {
          pair: 'ETHZAR', // Required field
          side: 'BUY',
          quantity: '0.1',
          price: '26000',
          stopPrice: '25000',
        },
      };

      expect(operation.data.pair).toBeDefined();
    });
  });

  describe('CANCEL_ORDER operation', () => {
    it('should accept CANCEL_ORDER with orderId', () => {
      const operation: BatchOrderOperation = {
        type: 'CANCEL_ORDER',
        data: {
          orderId: 'e5886f2d-191b-4330-a221-c7b41b0bc553',
          pair: 'BTCZAR',
        },
      };

      expect(operation.type).toBe('CANCEL_ORDER');
      expect((operation.data as BatchCancelOrderData).orderId).toBe('e5886f2d-191b-4330-a221-c7b41b0bc553');
      expect(operation.data.pair).toBe('BTCZAR');
    });

    it('should accept CANCEL_ORDER with customerOrderId', () => {
      const operation: BatchOrderOperation = {
        type: 'CANCEL_ORDER',
        data: {
          customerOrderId: 'my-custom-order-id',
          pair: 'ETHZAR',
        },
      };

      expect((operation.data as BatchCancelOrderData).customerOrderId).toBe('my-custom-order-id');
      expect(operation.data.pair).toBe('ETHZAR');
    });

    it('should require pair field in CANCEL_ORDER data', () => {
      const operation: BatchOrderOperation = {
        type: 'CANCEL_ORDER',
        data: {
          orderId: 'some-order-id',
          pair: 'BTCUSDT', // Required field
        },
      };

      expect(operation.data.pair).toBeDefined();
    });
  });

  describe('MODIFY_ORDER operation', () => {
    it('should accept MODIFY_ORDER with newTotalQuantity', () => {
      const operation: BatchOrderOperation = {
        type: 'MODIFY_ORDER',
        data: {
          orderId: '6eaf85b7-7e69-4e26-9664-33a8f23bfb4f',
          pair: 'BTCUSDC',
          modifyMatchStrategy: 'RETAIN_ORIGINAL',
          newTotalQuantity: '0.00004',
        },
      };

      expect(operation.type).toBe('MODIFY_ORDER');
      expect((operation.data as BatchModifyOrderData).newTotalQuantity).toBe('0.00004');
      expect((operation.data as BatchModifyOrderData).modifyMatchStrategy).toBe('RETAIN_ORIGINAL');
    });

    it('should accept MODIFY_ORDER with newPrice', () => {
      const operation: BatchOrderOperation = {
        type: 'MODIFY_ORDER',
        data: {
          orderId: '6cfe6d35-5245-4957-b28d-74abbddf994d',
          pair: 'BTCUSDCPERP',
          modifyMatchStrategy: 'CANCEL_ORIGINAL',
          newPrice: '33560',
        },
      };

      expect((operation.data as BatchModifyOrderData).newPrice).toBe('33560');
      expect((operation.data as BatchModifyOrderData).modifyMatchStrategy).toBe('CANCEL_ORIGINAL');
    });

    it('should accept MODIFY_ORDER with newRemainingQuantity', () => {
      const operation: BatchOrderOperation = {
        type: 'MODIFY_ORDER',
        data: {
          orderId: 'abc123',
          pair: 'ETHZAR',
          modifyMatchStrategy: 'RETAIN_ORIGINAL',
          newRemainingQuantity: '0.5',
        },
      };

      expect((operation.data as BatchModifyOrderData).newRemainingQuantity).toBe('0.5');
    });

    it('should accept MODIFY_ORDER with customerOrderId', () => {
      const operation: BatchOrderOperation = {
        type: 'MODIFY_ORDER',
        data: {
          orderId: 'def456',
          pair: 'BTCZAR',
          modifyMatchStrategy: 'RETAIN_ORIGINAL',
          newPrice: '500000',
          customerOrderId: 'modified-order-123',
        },
      };

      expect((operation.data as BatchModifyOrderData).customerOrderId).toBe('modified-order-123');
    });

    it('should require pair field in MODIFY_ORDER data', () => {
      const operation: BatchOrderOperation = {
        type: 'MODIFY_ORDER',
        data: {
          orderId: 'some-id',
          pair: 'BTCZAR', // Required field
          modifyMatchStrategy: 'RETAIN_ORIGINAL',
        },
      };

      expect(operation.data.pair).toBeDefined();
    });

    it('should require modifyMatchStrategy field in MODIFY_ORDER data', () => {
      const operation: BatchOrderOperation = {
        type: 'MODIFY_ORDER',
        data: {
          orderId: 'some-id',
          pair: 'BTCZAR',
          modifyMatchStrategy: 'RETAIN_ORIGINAL', // Required field
        },
      };

      expect((operation.data as BatchModifyOrderData).modifyMatchStrategy).toBeDefined();
    });
  });

  describe('ModifyMatchStrategy type', () => {
    it('should accept RETAIN_ORIGINAL strategy', () => {
      const strategy: ModifyMatchStrategy = 'RETAIN_ORIGINAL';
      expect(strategy).toBe('RETAIN_ORIGINAL');
    });

    it('should accept CANCEL_ORIGINAL strategy', () => {
      const strategy: ModifyMatchStrategy = 'CANCEL_ORIGINAL';
      expect(strategy).toBe('CANCEL_ORIGINAL');
    });
  });
});

describe('BatchOrderRequest', () => {
  it('should accept valid batch request with multiple operations', () => {
    const request: BatchOrderRequest = {
      requests: [
        {
          type: 'PLACE_MARKET',
          data: {
            pair: 'BTCUSDT',
            side: 'SELL',
            quoteAmount: '100',
            customerOrderId: '1234',
          },
        },
        {
          type: 'PLACE_LIMIT',
          data: {
            pair: 'BTCUSDT',
            side: 'BUY',
            quantity: '0.0002',
            price: '100000',
            timeInForce: 'GTC',
          },
        },
        {
          type: 'PLACE_STOP_LIMIT',
          data: {
            pair: 'BTCUSDT',
            side: 'BUY',
            quantity: '0.0002',
            price: '100000',
            timeInForce: 'GTC',
            stopPrice: '110000',
            type: 'TAKE_PROFIT_LIMIT',
          },
        },
        {
          type: 'CANCEL_ORDER',
          data: {
            orderId: 'e5886f2d-191b-4330-a221-c7b41b0bc553',
            pair: 'ETHUSDT',
          },
        },
        {
          type: 'MODIFY_ORDER',
          data: {
            orderId: '6eaf85b7-7e69-4e26-9664-33a8f23bfb4f',
            pair: 'BTCUSDC',
            modifyMatchStrategy: 'RETAIN_ORIGINAL',
            newTotalQuantity: '0.00004',
          },
        },
      ],
    };

    expect(request.requests).toHaveLength(5);
    expect(request.requests[0].type).toBe('PLACE_MARKET');
    expect(request.requests[1].type).toBe('PLACE_LIMIT');
    expect(request.requests[2].type).toBe('PLACE_STOP_LIMIT');
    expect(request.requests[3].type).toBe('CANCEL_ORDER');
    expect(request.requests[4].type).toBe('MODIFY_ORDER');
  });

  it('should ensure all operations have pair field in data', () => {
    const request: BatchOrderRequest = {
      requests: [
        {
          type: 'PLACE_LIMIT',
          data: { pair: 'BTCZAR', side: 'BUY', quantity: '0.001', price: '500000' },
        },
        {
          type: 'PLACE_MARKET',
          data: { pair: 'ETHZAR', side: 'SELL', quoteAmount: '1000' },
        },
        {
          type: 'PLACE_STOP_LIMIT',
          data: { pair: 'BTCZAR', side: 'SELL', quantity: '0.001', price: '480000', stopPrice: '490000' },
        },
        {
          type: 'CANCEL_ORDER',
          data: { pair: 'BTCZAR', orderId: 'some-id' },
        },
        {
          type: 'MODIFY_ORDER',
          data: { pair: 'ETHZAR', orderId: 'some-id', modifyMatchStrategy: 'RETAIN_ORIGINAL' },
        },
      ],
    };

    // Verify all operations have pair field
    request.requests.forEach((operation) => {
      expect(operation.data.pair).toBeDefined();
      expect(typeof operation.data.pair).toBe('string');
      expect(operation.data.pair.length).toBeGreaterThan(0);
    });
  });

  it('should accept empty requests array', () => {
    const request: BatchOrderRequest = {
      requests: [],
    };

    expect(request.requests).toHaveLength(0);
  });

  it('should match VALR API example structure exactly', () => {
    // This test verifies the structure matches the Postman collection example
    const request: BatchOrderRequest = {
      requests: [
        {
          type: 'PLACE_MARKET',
          data: {
            side: 'SELL',
            quoteAmount: '100',
            pair: 'BTCUSDT',
            customerOrderId: '1234',
          },
        },
        {
          type: 'PLACE_LIMIT',
          data: {
            pair: 'BTCUSDT',
            side: 'BUY',
            quantity: '0.0002',
            price: '100000',
            timeInForce: 'GTC',
          },
        },
        {
          type: 'PLACE_LIMIT',
          data: {
            pair: 'ETHUSDT',
            side: 'SELL',
            quantity: '0.2',
            price: '32000',
            postOnly: 'NOT_POST_ONLY',
            timeInForce: 'GTC',
          },
        },
        {
          type: 'PLACE_STOP_LIMIT',
          data: {
            pair: 'BTCUSDT',
            side: 'BUY',
            quantity: '0.0002',
            price: '100000',
            timeInForce: 'GTC',
            stopPrice: '110000',
            type: 'TAKE_PROFIT_LIMIT',
          },
        },
        {
          type: 'PLACE_STOP_LIMIT',
          data: {
            pair: 'BTCUSDT',
            side: 'SELL',
            quantity: '0.0003',
            price: '1150000',
            timeInForce: 'GTC',
            stopPrice: '110000',
            type: 'STOP_LOSS_LIMIT',
          },
        },
        {
          type: 'CANCEL_ORDER',
          data: {
            orderId: 'e5886f2d-191b-4330-a221-c7b41b0bc553',
            pair: 'ETHUSDT',
          },
        },
      ],
    };

    expect(request.requests).toHaveLength(6);

    // Verify structure of first operation
    const marketOrder = request.requests[0];
    expect(marketOrder.type).toBe('PLACE_MARKET');
    expect(marketOrder.data).toHaveProperty('side');
    expect(marketOrder.data).toHaveProperty('quoteAmount');
    expect(marketOrder.data).toHaveProperty('pair');
    expect(marketOrder.data).toHaveProperty('customerOrderId');
  });
});

describe('BatchCancelOrderData', () => {
  it('should accept orderId for cancellation', () => {
    const cancelData: BatchCancelOrderData = {
      orderId: 'uuid-order-id',
      pair: 'BTCZAR',
    };

    expect(cancelData.orderId).toBe('uuid-order-id');
    expect(cancelData.pair).toBe('BTCZAR');
  });

  it('should accept customerOrderId for cancellation', () => {
    const cancelData: BatchCancelOrderData = {
      customerOrderId: 'my-custom-id',
      pair: 'ETHZAR',
    };

    expect(cancelData.customerOrderId).toBe('my-custom-id');
    expect(cancelData.pair).toBe('ETHZAR');
  });

  it('should require pair field', () => {
    const cancelData: BatchCancelOrderData = {
      orderId: 'some-id',
      pair: 'BTCUSDT',
    };

    expect(cancelData.pair).toBeDefined();
  });
});

describe('BatchModifyOrderData', () => {
  it('should require orderId field', () => {
    const modifyData: BatchModifyOrderData = {
      orderId: 'uuid-order-id',
      pair: 'BTCZAR',
      modifyMatchStrategy: 'RETAIN_ORIGINAL',
    };

    expect(modifyData.orderId).toBe('uuid-order-id');
  });

  it('should require pair field', () => {
    const modifyData: BatchModifyOrderData = {
      orderId: 'uuid-order-id',
      pair: 'BTCZAR',
      modifyMatchStrategy: 'RETAIN_ORIGINAL',
    };

    expect(modifyData.pair).toBe('BTCZAR');
  });

  it('should require modifyMatchStrategy field', () => {
    const modifyData: BatchModifyOrderData = {
      orderId: 'uuid-order-id',
      pair: 'BTCZAR',
      modifyMatchStrategy: 'RETAIN_ORIGINAL',
    };

    expect(modifyData.modifyMatchStrategy).toBe('RETAIN_ORIGINAL');
  });

  it('should accept newTotalQuantity as optional field', () => {
    const modifyData: BatchModifyOrderData = {
      orderId: 'uuid-order-id',
      pair: 'BTCZAR',
      modifyMatchStrategy: 'RETAIN_ORIGINAL',
      newTotalQuantity: '0.005',
    };

    expect(modifyData.newTotalQuantity).toBe('0.005');
  });

  it('should accept newRemainingQuantity as optional field', () => {
    const modifyData: BatchModifyOrderData = {
      orderId: 'uuid-order-id',
      pair: 'BTCZAR',
      modifyMatchStrategy: 'CANCEL_ORIGINAL',
      newRemainingQuantity: '0.003',
    };

    expect(modifyData.newRemainingQuantity).toBe('0.003');
  });

  it('should accept newPrice as optional field', () => {
    const modifyData: BatchModifyOrderData = {
      orderId: 'uuid-order-id',
      pair: 'BTCZAR',
      modifyMatchStrategy: 'RETAIN_ORIGINAL',
      newPrice: '520000',
    };

    expect(modifyData.newPrice).toBe('520000');
  });

  it('should accept customerOrderId as optional field', () => {
    const modifyData: BatchModifyOrderData = {
      orderId: 'uuid-order-id',
      pair: 'BTCZAR',
      modifyMatchStrategy: 'RETAIN_ORIGINAL',
      customerOrderId: 'my-modified-order',
    };

    expect(modifyData.customerOrderId).toBe('my-modified-order');
  });

  it('should accept combination of modification fields', () => {
    const modifyData: BatchModifyOrderData = {
      orderId: 'uuid-order-id',
      pair: 'ETHZAR',
      modifyMatchStrategy: 'CANCEL_ORIGINAL',
      newPrice: '25000',
      newTotalQuantity: '1.5',
      customerOrderId: 'combo-modify',
    };

    expect(modifyData.newPrice).toBe('25000');
    expect(modifyData.newTotalQuantity).toBe('1.5');
    expect(modifyData.customerOrderId).toBe('combo-modify');
  });
});
