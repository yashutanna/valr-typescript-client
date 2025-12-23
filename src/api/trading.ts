import type { HttpClient } from '../utils/http';
import type {
  LimitOrderRequest,
  LimitOrderRequestV2,
  MarketOrderRequest,
  MarketOrderRequestV2,
  StopLimitOrderRequest,
  StopLimitOrderRequestV2,
  SimpleQuoteRequest,
  SimpleQuoteResponse,
  SimpleOrderRequest,
  OrderResponse,
  BatchOrderRequest,
  BatchOrderResponse,
  OrderStatusSummary,
  OpenOrder,
  ConditionalOrderRequest,
  ConditionalOrderResponse,
  ConditionalOrderStatus,
  ModifyOrderRequest,
  ModifyOrderRequestV2,
  CancelOrderRequest,
  CancelOrderRequestV2,
  OrderHistoryParams,
  HistoricalOrderSummary,
  HistoricalOrderDetail,
  CurrencyPair,
  OrderId,
  CustomerOrderId,
} from '../types';

/**
 * Trading API methods (requires authentication with trade permission)
 */
export class TradingAPI {
  constructor(private http: HttpClient) {}

  // ============================================================================
  // Order Placement
  // ============================================================================

  /**
   * Place a limit order (v1)
   * POST /v1/orders/limit
   *
   * @param request - Limit order request
   * @returns Order response with order ID
   */
  async placeLimitOrder(request: LimitOrderRequest): Promise<OrderResponse> {
    const response = await this.http.post<OrderResponse>('/v1/orders/limit', request);
    return response.data;
  }

  /**
   * Place a limit order (v2) - supports baseAmount or quoteAmount
   * POST /v2/orders/limit
   *
   * @param request - Limit order request (v2)
   * @returns Order response with order ID
   */
  async placeLimitOrderV2(request: LimitOrderRequestV2): Promise<OrderResponse> {
    const response = await this.http.post<OrderResponse>('/v2/orders/limit', request);
    return response.data;
  }

  /**
   * Place a market order (v1)
   * POST /v1/orders/market
   *
   * @param request - Market order request
   * @returns Order response with order ID
   */
  async placeMarketOrder(request: MarketOrderRequest): Promise<OrderResponse> {
    const response = await this.http.post<OrderResponse>('/v1/orders/market', request);
    return response.data;
  }

  /**
   * Place a market order (v2)
   * POST /v2/orders/market
   *
   * @param request - Market order request (v2)
   * @returns Order response with order ID
   */
  async placeMarketOrderV2(request: MarketOrderRequestV2): Promise<OrderResponse> {
    const response = await this.http.post<OrderResponse>('/v2/orders/market', request);
    return response.data;
  }

  /**
   * Place a stop-limit order (v1)
   * POST /v1/orders/stop/limit
   *
   * @param request - Stop-limit order request
   * @returns Order response with order ID
   */
  async placeStopLimitOrder(request: StopLimitOrderRequest): Promise<OrderResponse> {
    const response = await this.http.post<OrderResponse>('/v1/orders/stop/limit', request);
    return response.data;
  }

  /**
   * Place a stop-limit order (v2)
   * POST /v2/orders/stop/limit
   *
   * @param request - Stop-limit order request (v2)
   * @returns Order response with order ID
   */
  async placeStopLimitOrderV2(request: StopLimitOrderRequestV2): Promise<OrderResponse> {
    const response = await this.http.post<OrderResponse>('/v2/orders/stop/limit', request);
    return response.data;
  }

  /**
   * Place batch orders (up to 10 orders in a single request)
   * POST /v1/batch/orders
   *
   * @param request - Batch order request
   * @returns Array of order responses
   */
  async placeBatchOrders(request: BatchOrderRequest): Promise<BatchOrderResponse> {
    const response = await this.http.post<BatchOrderResponse>('/v1/batch/orders', request);
    return response.data;
  }

  // ============================================================================
  // Conditional Orders
  // ============================================================================

  /**
   * Place a conditional order (stop-loss or take-profit)
   * POST /v1/orders/conditionals
   *
   * @param request - Conditional order request
   * @returns Conditional order response
   */
  async placeConditionalOrder(request: ConditionalOrderRequest): Promise<ConditionalOrderResponse> {
    const response = await this.http.post<ConditionalOrderResponse>('/v1/orders/conditionals', request);
    return response.data;
  }

  /**
   * Get all conditional orders
   * GET /v1/orders/conditionals
   *
   * @returns Array of conditional orders
   */
  async getAllConditionalOrders(): Promise<ConditionalOrderStatus[]> {
    const response = await this.http.get<ConditionalOrderStatus[]>('/v1/orders/conditionals');
    return response.data;
  }

  /**
   * Get conditional order status by ID
   * GET /v1/orders/conditionals/conditional/:currencyPair/orderid/:orderId
   *
   * @param pair - Currency pair
   * @param orderId - Conditional order ID
   * @returns Conditional order status
   */
  async getConditionalOrderStatus(pair: CurrencyPair, orderId: string): Promise<ConditionalOrderStatus> {
    const response = await this.http.get<ConditionalOrderStatus>(
      `/v1/orders/conditionals/conditional/${pair}/orderid/${orderId}`
    );
    return response.data;
  }

  /**
   * Get conditional order history for a currency pair
   * GET /v1/orders/conditionals/:currencyPair/history
   *
   * @param pair - Currency pair
   * @returns Array of historical conditional orders
   */
  async getConditionalOrderHistory(pair: CurrencyPair): Promise<ConditionalOrderStatus[]> {
    const response = await this.http.get<ConditionalOrderStatus[]>(
      `/v1/orders/conditionals/${pair}/history`
    );
    return response.data;
  }

  /**
   * Modify a conditional order
   * PUT /v1/orders/conditionals/modify
   *
   * @param request - Conditional order modification request
   * @returns Updated conditional order
   */
  async modifyConditionalOrder(request: ConditionalOrderRequest & { id: string }): Promise<ConditionalOrderResponse> {
    const response = await this.http.put<ConditionalOrderResponse>('/v1/orders/conditionals/modify', request);
    return response.data;
  }

  // ============================================================================
  // Simple Buy/Sell
  // ============================================================================

  /**
   * Get a quote for simple buy/sell
   * POST /v1/simple/:currencyPair/quote
   *
   * @param pair - Currency pair
   * @param request - Quote request
   * @returns Quote with ID (valid for 5 seconds)
   */
  async getSimpleQuote(pair: CurrencyPair, request: SimpleQuoteRequest): Promise<SimpleQuoteResponse> {
    const response = await this.http.post<SimpleQuoteResponse>(`/v1/simple/${pair}/quote`, request);
    return response.data;
  }

  /**
   * Place a simple buy/sell order using a quote
   * POST /v1/simple/:currencyPair/order
   *
   * @param pair - Currency pair
   * @param request - Simple order request with quote ID
   * @returns Order response
   */
  async placeSimpleOrder(pair: CurrencyPair, request: SimpleOrderRequest): Promise<OrderResponse> {
    const response = await this.http.post<OrderResponse>(`/v1/simple/${pair}/order`, request);
    return response.data;
  }

  /**
   * Get simple order status
   * GET /v1/simple/:currencyPair/order/:orderId
   *
   * @param pair - Currency pair
   * @param orderId - Order ID
   * @returns Order status
   */
  async getSimpleOrderStatus(pair: CurrencyPair, orderId: OrderId): Promise<OrderStatusSummary> {
    const response = await this.http.get<OrderStatusSummary>(`/v1/simple/${pair}/order/${orderId}`);
    return response.data;
  }

  // ============================================================================
  // Order Status Queries
  // ============================================================================

  /**
   * Get order status by order ID
   * GET /v1/orders/:currencyPair/orderid/:orderId
   *
   * @param pair - Currency pair
   * @param orderId - Order ID
   * @returns Order status summary
   */
  async getOrderStatus(pair: CurrencyPair, orderId: OrderId): Promise<OrderStatusSummary> {
    const response = await this.http.get<OrderStatusSummary>(`/v1/orders/${pair}/orderid/${orderId}`);
    return response.data;
  }

  /**
   * Get order status by customer order ID
   * GET /v1/orders/:currencyPair/customerorderid/:customerOrderId
   *
   * @param pair - Currency pair
   * @param customerOrderId - Customer order ID
   * @returns Order status summary
   */
  async getOrderStatusByCustomerId(pair: CurrencyPair, customerOrderId: CustomerOrderId): Promise<OrderStatusSummary> {
    const response = await this.http.get<OrderStatusSummary>(
      `/v1/orders/${pair}/customerorderid/${customerOrderId}`
    );
    return response.data;
  }

  /**
   * Get all open orders
   * GET /v1/orders/open
   *
   * @returns Array of open orders
   */
  async getAllOpenOrders(): Promise<OpenOrder[]> {
    const response = await this.http.get<OpenOrder[]>('/v1/orders/open');
    return response.data;
  }

  // ============================================================================
  // Order History
  // ============================================================================

  /**
   * Get order history
   * GET /v1/orders/history
   *
   * @param params - Query parameters (skip, limit, statuses, currencyPair, startTime, endTime)
   * @returns Array of historical order summaries
   */
  async getOrderHistory(params?: OrderHistoryParams): Promise<HistoricalOrderSummary[]> {
    const response = await this.http.get<HistoricalOrderSummary[]>('/v1/orders/history', {
      params: params ? {
        ...params,
        statuses: params.statuses?.join(','),
        currencyPair: Array.isArray(params.currencyPair)
          ? params.currencyPair.join(',')
          : params.currencyPair,
      } : undefined,
    });
    return response.data;
  }

  /**
   * Get order history summary by order ID
   * GET /v1/orders/history/summary/orderid/:orderId
   *
   * @param orderId - Order ID
   * @returns Order history summary
   */
  async getOrderHistorySummary(orderId: OrderId): Promise<HistoricalOrderSummary> {
    const response = await this.http.get<HistoricalOrderSummary>(`/v1/orders/history/summary/orderid/${orderId}`);
    return response.data;
  }

  /**
   * Get order history summary by customer order ID
   * GET /v1/orders/history/summary/customerorderid/:customerOrderId
   *
   * @param customerOrderId - Customer order ID
   * @returns Order history summary
   */
  async getOrderHistorySummaryByCustomerId(customerOrderId: CustomerOrderId): Promise<HistoricalOrderSummary> {
    const response = await this.http.get<HistoricalOrderSummary>(
      `/v1/orders/history/summary/customerorderid/${customerOrderId}`
    );
    return response.data;
  }

  /**
   * Get order history detail by order ID (includes all trades)
   * GET /v1/orders/history/detail/orderid/:orderId
   *
   * @param orderId - Order ID
   * @returns Order history detail with trades
   */
  async getOrderHistoryDetail(orderId: OrderId): Promise<HistoricalOrderDetail> {
    const response = await this.http.get<HistoricalOrderDetail>(`/v1/orders/history/detail/orderid/${orderId}`);
    return response.data;
  }

  /**
   * Get order history detail by customer order ID
   * GET /v1/orders/history/detail/customerorderid/:customerOrderId
   *
   * @param customerOrderId - Customer order ID
   * @returns Order history detail with trades
   */
  async getOrderHistoryDetailByCustomerId(customerOrderId: CustomerOrderId): Promise<HistoricalOrderDetail> {
    const response = await this.http.get<HistoricalOrderDetail>(
      `/v1/orders/history/detail/customerorderid/${customerOrderId}`
    );
    return response.data;
  }

  // ============================================================================
  // Order Modification
  // ============================================================================

  /**
   * Modify an existing order (v1)
   * PUT /v1/orders/modify
   *
   * @param request - Modify order request
   * @returns Updated order response
   */
  async modifyOrder(request: ModifyOrderRequest): Promise<OrderResponse> {
    const response = await this.http.put<OrderResponse>('/v1/orders/modify', request);
    return response.data;
  }

  /**
   * Modify an existing order (v2)
   * PUT /v2/orders/modify
   *
   * @param request - Modify order request (v2)
   * @returns Updated order response
   */
  async modifyOrderV2(request: ModifyOrderRequestV2): Promise<OrderResponse> {
    const response = await this.http.put<OrderResponse>('/v2/orders/modify', request);
    return response.data;
  }

  // ============================================================================
  // Order Cancellation
  // ============================================================================

  /**
   * Cancel a single order (v1)
   * DELETE /v1/orders/order
   *
   * @param request - Cancel order request
   * @returns Cancellation confirmation
   */
  async cancelOrder(request: CancelOrderRequest): Promise<OrderResponse> {
    const response = await this.http.delete<OrderResponse>('/v1/orders/order', {
      data: request,
    });
    return response.data;
  }

  /**
   * Cancel a single order (v2)
   * DELETE /v2/orders/order
   *
   * @param request - Cancel order request (v2)
   * @returns Cancellation confirmation
   */
  async cancelOrderV2(request: CancelOrderRequestV2): Promise<OrderResponse> {
    const response = await this.http.delete<OrderResponse>('/v2/orders/order', {
      data: request,
    });
    return response.data;
  }

  /**
   * Cancel all conditional orders
   * DELETE /v1/orders/conditionals
   *
   * @returns Cancellation confirmation
   */
  async cancelAllConditionalOrders(): Promise<{ message: string }> {
    const response = await this.http.delete<{ message: string }>('/v1/orders/conditionals');
    return response.data;
  }

  /**
   * Cancel all conditional orders for a currency pair
   * DELETE /v1/orders/conditionals/:currencypair
   *
   * @param pair - Currency pair
   * @returns Cancellation confirmation
   */
  async cancelConditionalOrdersForPair(pair: CurrencyPair): Promise<{ message: string }> {
    const response = await this.http.delete<{ message: string }>(`/v1/orders/conditionals/${pair}`);
    return response.data;
  }

  /**
   * Cancel a specific conditional order
   * DELETE /v1/orders/conditionals/conditional
   *
   * @param request - Contains orderId and currencyPair
   * @returns Cancellation confirmation
   */
  async cancelConditionalOrder(request: { orderId: string; pair: CurrencyPair }): Promise<{ message: string }> {
    const response = await this.http.delete<{ message: string }>('/v1/orders/conditionals/conditional', {
      data: {
        orderId: request.orderId,
        currencyPair: request.pair,
      },
    });
    return response.data;
  }

  /**
   * Cancel all orders for all currency pairs
   * DELETE /v1/orders
   *
   * @returns Cancellation confirmation
   */
  async cancelAllOrders(): Promise<{ message: string }> {
    const response = await this.http.delete<{ message: string }>('/v1/orders');
    return response.data;
  }

  /**
   * Cancel all orders for a specific currency pair
   * DELETE /v1/orders/:currencyPair
   *
   * @param pair - Currency pair
   * @returns Cancellation confirmation
   */
  async cancelAllOrdersForPair(pair: CurrencyPair): Promise<{ message: string }> {
    const response = await this.http.delete<{ message: string }>(`/v1/orders/${pair}`);
    return response.data;
  }
}
