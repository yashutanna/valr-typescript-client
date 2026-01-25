import type {
  CurrencyPair,
  CustomerOrderId,
  OrderId,
  OrderSide,
  OrderStatus,
  OrderType,
  PostOnly,
  TimeInForce,
  ISOTimestamp,
  PaginationParams,
  ConditionalOrderTriggerType,
  ConditionalOrderType,
} from './common';

/**
 * Base order request fields
 */
export interface BaseOrderRequest {
  /** Currency pair to trade */
  pair: CurrencyPair;
  /** Order side (BUY or SELL) */
  side: OrderSide;
  /** Optional customer order ID (max 50 chars, alphanumeric + underscore/hyphen) */
  customerOrderId?: CustomerOrderId;
}

/**
 * Conditional order data for attaching TP/SL to limit/market orders (futures only)
 */
export interface InlineConditionalOrderData {
  /** Quantity (0 = close entire position, -1 = close only added quantity, >0 = reduce-only) */
  quantity: string;
  /** Trigger type (LAST_TRADED or MARK_PRICE) */
  triggerType: ConditionalOrderTriggerType;
  /** Take profit trigger price */
  takeProfitTriggerPrice?: string;
  /** Take profit order price (-1 for market order) */
  takeProfitOrderPrice?: string;
  /** Stop loss trigger price */
  stopLossTriggerPrice?: string;
  /** Stop loss order price (-1 for market order) */
  stopLossOrderPrice?: string;
  /** Customer order ID for the conditional order */
  customerOrderId?: CustomerOrderId;
}

/**
 * Limit order request (v1)
 */
export interface LimitOrderRequest extends BaseOrderRequest {
  /** Quantity in base currency */
  quantity: string;
  /** Price per unit */
  price: string;
  /** Post-only behavior */
  postOnly?: PostOnly;
  /** Time in force */
  timeInForce?: TimeInForce;
  /** Allow margin trading */
  allowMargin?: string | boolean;
  /** Enable post-only repricing */
  postOnlyReprice?: boolean;
  /** Number of ticks to reprice */
  postOnlyRepriceTicks?: string;
  /** Reduce-only order for futures (only reduces position, never increases) */
  reduceOnly?: string | boolean;
  /** Conditional order data for attaching TP/SL (futures only) */
  conditionalOrderData?: InlineConditionalOrderData;
}

/**
 * Limit order request (v2) - same as v1, uses quantity not baseAmount/quoteAmount
 */
export interface LimitOrderRequestV2 extends LimitOrderRequest {}

/**
 * Market order request (v1)
 */
export interface MarketOrderRequest extends BaseOrderRequest {
  /** Base amount (optional, either baseAmount or quoteAmount required) */
  baseAmount?: string;
  /** Quote amount (optional, either baseAmount or quoteAmount required) */
  quoteAmount?: string;
  /** Allow margin trading */
  allowMargin?: string | boolean;
  /** Reduce-only order for futures (only reduces position, never increases) */
  reduceOnly?: string | boolean;
  /** Conditional order data for attaching TP/SL (futures only) */
  conditionalOrderData?: InlineConditionalOrderData;
}

/**
 * Market order request (v2)
 */
export interface MarketOrderRequestV2 extends MarketOrderRequest {}

/**
 * Stop-limit order request (v1)
 */
export interface StopLimitOrderRequest extends LimitOrderRequest {
  /** Stop price that triggers the order */
  stopPrice: string;
  /** Type of stop order */
  type?: 'STOP_LOSS_LIMIT' | 'TAKE_PROFIT_LIMIT';
}

/**
 * Stop-limit order request (v2)
 */
export interface StopLimitOrderRequestV2 extends LimitOrderRequestV2 {
  /** Stop price that triggers the order */
  stopPrice: string;
  /** Type of stop order */
  type?: 'STOP_LOSS_LIMIT' | 'TAKE_PROFIT_LIMIT';
}

/**
 * Simple buy/sell quote request
 */
export interface SimpleQuoteRequest {
  /** Currency pair */
  pair: CurrencyPair;
  /** Pay-in currency code */
  payInCurrency: string;
  /** Pay-in amount */
  payAmount: string;
  /** Order side (BUY or SELL) */
  side: OrderSide;
}

/**
 * Simple buy/sell quote response
 */
export interface SimpleQuoteResponse {
  /** Currency pair */
  currencyPair: CurrencyPair;
  /** Pay currency */
  payInCurrency: string;
  /** Pay amount */
  payAmount: string;
  /** Receive currency */
  receiveAmount: string;
  /** Fee amount */
  feeAmount: string;
  /** Fee currency */
  feeCurrency: string;
  /** Quote ID (use within 5 seconds) */
  id: string;
  /** When quote was created */
  createdAt: ISOTimestamp;
  /** When quote expires */
  expiresAt: ISOTimestamp;
}

/**
 * Simple buy/sell order request
 */
export interface SimpleOrderRequest {
  /** Currency pair */
  pair: CurrencyPair;
  /** Quote ID from quote request */
  quoteId: string;
}

/**
 * Order response
 */
export interface OrderResponse {
  /** Internal order ID */
  id: OrderId;
  /** Customer order ID if provided */
  customerOrderId?: CustomerOrderId;
  /** HTTP status indicator */
  success?: boolean;
  /** Message */
  message?: string;
}

/**
 * Batch order operation types
 */
export type BatchOrderOperationType =
  | 'PLACE_LIMIT'
  | 'PLACE_MARKET'
  | 'PLACE_STOP_LIMIT'
  | 'CANCEL_ORDER'
  | 'MODIFY_ORDER';

/**
 * Modify match strategy for modify orders
 * - RETAIN_ORIGINAL: Keep the original order if modification fails
 * - CANCEL_ORIGINAL: Cancel the original order if modification fails
 * - REPRICE: Adjust price to 1 tick below best ask (buy) or above best bid (sell) if would match (V1 only)
 */
export type ModifyMatchStrategy = 'RETAIN_ORIGINAL' | 'CANCEL_ORIGINAL' | 'REPRICE';

/**
 * Batch modify order data
 */
export interface BatchModifyOrderData {
  /** Order ID to modify (required) */
  orderId: OrderId;
  /** Currency pair (required) */
  pair: CurrencyPair;
  /** Strategy when modification fails (required) */
  modifyMatchStrategy: ModifyMatchStrategy;
  /** New remaining quantity (optional, cannot be used with newTotalQuantity) */
  newRemainingQuantity?: string;
  /** New total quantity (optional, cannot be used with newRemainingQuantity) */
  newTotalQuantity?: string;
  /** New price (optional) */
  newPrice?: string;
  /** Customer order ID (optional) */
  customerOrderId?: CustomerOrderId;
}

/**
 * Cancel order data for batch operations
 */
export interface BatchCancelOrderData {
  /** Order ID to cancel (use either orderId or customerOrderId, not both) */
  orderId?: OrderId;
  /** Customer order ID to cancel (use either orderId or customerOrderId, not both) */
  customerOrderId?: CustomerOrderId;
  /** Currency pair (required) */
  pair: CurrencyPair;
}

/**
 * Individual batch order operation
 */
export type BatchOrderOperation =
  | {
      type: 'PLACE_LIMIT';
      data: LimitOrderRequest;
    }
  | {
      type: 'PLACE_MARKET';
      data: MarketOrderRequest;
    }
  | {
      type: 'PLACE_STOP_LIMIT';
      data: StopLimitOrderRequest;
    }
  | {
      type: 'CANCEL_ORDER';
      data: BatchCancelOrderData;
    }
  | {
      type: 'MODIFY_ORDER';
      data: BatchModifyOrderData;
    };

/**
 * Batch order request
 */
export interface BatchOrderRequest {
  /** List of batch order operations (max 10) */
  requests: BatchOrderOperation[];
}

/**
 * Batch order error
 */
export interface BatchOrderError {
  /** Error code */
  code: number;
  /** Error message */
  message: string;
}

/**
 * Batch order response item (outcome)
 */
export interface BatchOrderResponseItem {
  /** Whether order was accepted */
  accepted: boolean;
  /** Order ID if accepted */
  orderId?: OrderId;
  /** Customer order ID if provided */
  customerOrderId?: CustomerOrderId;
  /** Request type that was processed */
  requestType?: BatchOrderOperationType;
  /** Error details if failed */
  error?: BatchOrderError;
}

/**
 * Batch order response
 */
export interface BatchOrderResponse {
  /** Array of outcomes for each order in the batch */
  outcomes: BatchOrderResponseItem[];
  /** Batch ID */
  batchId: number;
}

/**
 * Order status summary
 */
export interface OrderStatusSummary {
  /** Order ID */
  orderId: OrderId;
  /** Order type */
  orderType: OrderType;
  /** Currency pair */
  currencyPair: CurrencyPair;
  /** Average price */
  averagePrice: string;
  /** Original price */
  originalPrice: string;
  /** Remaining quantity */
  remainingQuantity: string;
  /** Original quantity */
  originalQuantity: string;
  /** Total filled */
  total: string;
  /** Total fee */
  totalFee: string;
  /** Fee currency */
  feeCurrency: string;
  /** Order status */
  orderStatus: OrderStatus;
  /** Order side */
  orderSide: OrderSide;
  /** When order was created */
  orderCreatedAt: ISOTimestamp;
  /** When order was updated */
  orderUpdatedAt: ISOTimestamp;
  /** When order expires (for GTD orders) */
  orderExpiresAt?: ISOTimestamp;
  /** Customer order ID if provided */
  customerOrderId?: CustomerOrderId;
  /** Time in force */
  timeInForce?: TimeInForce;
  /** Stop price (for stop-limit orders) */
  stopPrice?: string;
}

/**
 * Order status detail (includes individual trades)
 */
export interface OrderStatusDetail extends OrderStatusSummary {
  /** Order trades */
  orderTrades: OrderTrade[];
}

/**
 * Individual trade within an order
 */
export interface OrderTrade {
  /** Trade price */
  price: string;
  /** Trade quantity */
  quantity: string;
  /** Currency pair */
  currencyPair: CurrencyPair;
  /** When trade occurred */
  tradedAt: ISOTimestamp;
  /** Taker or maker */
  takerOrMaker: 'TAKER' | 'MAKER';
  /** Trade ID */
  id: string;
  /** Sequence ID */
  sequenceId: number;
  /** Quote volume */
  quoteVolume: string;
}

/**
 * Open order
 */
export interface OpenOrder {
  /** Order ID */
  orderId: OrderId;
  /** Order side */
  side: OrderSide;
  /** Remaining quantity */
  remainingQuantity: string;
  /** Original price */
  originalPrice: string;
  /** Currency pair */
  currencyPair: CurrencyPair;
  /** When created */
  createdAt: ISOTimestamp;
  /** Original quantity */
  originalQuantity: string;
  /** Filled percentage */
  filledPercentage: string;
  /** Customer order ID if provided */
  customerOrderId?: CustomerOrderId;
  /** Order type */
  orderType: OrderType;
  /** Stop price (for stop-limit orders) */
  stopPrice?: string;
  /** Time in force */
  timeInForce?: TimeInForce;
  /** Order status */
  status?: OrderStatus;
}

/**
 * Conditional order request (for futures TPSL orders)
 */
export interface ConditionalOrderRequest {
  /** Currency pair (perpetual futures contract, e.g., BTCUSDTPERP) */
  pair: CurrencyPair;
  /** Quantity (0 = close entire position, -1 = close only added quantity, >0 = reduce-only) */
  quantity: string;
  /** Trigger type (LAST_TRADED or MARK_PRICE) */
  triggerType: ConditionalOrderTriggerType;
  /** Take profit trigger price (required for TP, optional for OCO) */
  takeProfitTriggerPrice?: string;
  /** Take profit order price (required for TP, optional for OCO, -1 for market) */
  takeProfitOrderPrice?: string;
  /** Stop loss trigger price (required for SL, optional for OCO) */
  stopLossTriggerPrice?: string;
  /** Stop loss order price (required for SL, optional for OCO, -1 for market) */
  stopLossOrderPrice?: string;
  /** Customer order ID */
  customerOrderId?: CustomerOrderId;
}

/**
 * Conditional order response
 */
export interface ConditionalOrderResponse {
  /** Conditional order ID */
  id: string;
  /** Customer order ID if provided */
  customerOrderId?: CustomerOrderId;
}

/**
 * Modify conditional order request
 */
export interface ModifyConditionalOrderRequest {
  /** Customer order ID to identify which order to modify */
  customerOrderId: CustomerOrderId;
  /** Currency pair */
  pair: CurrencyPair;
  /** New quantity */
  newQuantity?: string;
  /** New take profit trigger price */
  newTakeProfitTriggerPrice?: string;
  /** New take profit order price */
  newTakeProfitOrderPrice?: string;
  /** New stop loss trigger price */
  newStopLossTriggerPrice?: string;
  /** New stop loss order price */
  newStopLossOrderPrice?: string;
}

/**
 * Conditional order status
 */
export interface ConditionalOrderStatus {
  /** Conditional order ID */
  id: string;
  /** Currency pair */
  currencyPair: CurrencyPair;
  /** Order side */
  side: OrderSide;
  /** Conditional order type */
  type: ConditionalOrderType;
  /** Trigger price */
  triggerPrice: string;
  /** Trigger type */
  triggerType: ConditionalOrderTriggerType;
  /** Quantity */
  quantity: string;
  /** Limit price (if limit order) */
  price?: string;
  /** Status */
  status: 'PENDING' | 'TRIGGERED' | 'CANCELLED' | 'FAILED';
  /** When created */
  createdAt: ISOTimestamp;
  /** When updated */
  updatedAt: ISOTimestamp;
  /** Customer order ID if provided */
  customerOrderId?: CustomerOrderId;
  /** Triggered order ID (if triggered) */
  triggeredOrderId?: OrderId;
}

/**
 * Modify match strategy for V2 (excludes REPRICE)
 */
export type ModifyMatchStrategyV2 = 'RETAIN_ORIGINAL' | 'CANCEL_ORIGINAL';

/**
 * Modify order request (v1)
 */
export interface ModifyOrderRequest {
  /** Order ID (required) */
  orderId: OrderId;
  /** Currency pair (required) */
  pair: CurrencyPair;
  /** Strategy when modification fails (required) - V1 supports REPRICE */
  modifyMatchStrategy: ModifyMatchStrategy;
  /** New remaining quantity (optional, cannot use with newTotalQuantity) */
  newRemainingQuantity?: string;
  /** New total quantity (optional, cannot use with newRemainingQuantity) */
  newTotalQuantity?: string;
  /** New price (optional) */
  newPrice?: string;
  /** Customer order ID (optional) */
  customerOrderId?: CustomerOrderId;
}

/**
 * Modify order request (v2) - same fields but no REPRICE option for modifyMatchStrategy
 */
export interface ModifyOrderRequestV2 {
  /** Order ID (required) */
  orderId: OrderId;
  /** Currency pair (required) */
  pair: CurrencyPair;
  /** Strategy when modification fails (required) - V2 does not support REPRICE */
  modifyMatchStrategy: ModifyMatchStrategyV2;
  /** New remaining quantity (optional, cannot use with newTotalQuantity) */
  newRemainingQuantity?: string;
  /** New total quantity (optional, cannot use with newTotalQuantity) */
  newTotalQuantity?: string;
  /** New price (optional) */
  newPrice?: string;
  /** Customer order ID (optional) */
  customerOrderId?: CustomerOrderId;
}

/**
 * Cancel order request
 */
export interface CancelOrderRequest {
  /** Order ID */
  orderId?: OrderId;
  /** Customer order ID */
  customerOrderId?: CustomerOrderId;
  /** Currency pair */
  pair: CurrencyPair;
}

/**
 * Cancel order request (v2)
 */
export interface CancelOrderRequestV2 extends CancelOrderRequest {}

/**
 * Order history query parameters
 */
export interface OrderHistoryParams extends PaginationParams {
  /** Filter by order statuses */
  statuses?: OrderStatus[];
  /** Filter by currency pairs */
  currencyPair?: CurrencyPair | CurrencyPair[];
  /** Start time filter */
  startTime?: ISOTimestamp;
  /** End time filter */
  endTime?: ISOTimestamp;
  /** Exclude failed orders */
  excludeFailures?: boolean | 'TRUE' | 'FALSE';
  /** Include zero-volume cancelled orders */
  showZeroVolumeCancels?: boolean | 'TRUE' | 'FALSE';
}

/**
 * Historical order summary
 */
export interface HistoricalOrderSummary extends OrderStatusSummary {}

/**
 * Historical order detail
 */
export interface HistoricalOrderDetail extends OrderStatusDetail {}
