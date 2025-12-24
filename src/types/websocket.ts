import type {
  CurrencyPair,
  OrderSide,
  OrderStatus,
  ISOTimestamp,
  OrderId,
  CustomerOrderId,
} from './common';

/**
 * WebSocket message type
 */
export type WebSocketMessageType =
  | 'AUTHENTICATED'
  | 'SUBSCRIBED'
  | 'UNSUBSCRIBED'
  | 'AGGREGATED_ORDERBOOK_UPDATE'
  | 'FULL_ORDERBOOK_UPDATE'
  | 'MARKET_SUMMARY_UPDATE'
  | 'NEW_TRADE'
  | 'NEW_TRADE_BUCKET'
  | 'INSTANT_ORDER_COMPLETED'
  | 'ORDER_PROCESSED'
  | 'ORDER_STATUS_UPDATE'
  | 'BALANCE_UPDATE'
  | 'NEW_ACCOUNT_TRADE'
  | 'OPEN_ORDERS_UPDATE'
  | 'NEW_PENDING_RECEIVE'
  | 'SEND_STATUS_UPDATE'
  | 'FAILED_CANCEL_ORDER'
  | 'PONG';

/**
 * Base WebSocket message
 */
export interface BaseWebSocketMessage {
  /** Message type */
  type: WebSocketMessageType;
}

/**
 * Subscription request
 */
export interface SubscriptionRequest {
  /** Subscription type */
  type: 'SUBSCRIBE' | 'UNSUBSCRIBE';
  /** Subscriptions */
  subscriptions: Subscription[];
}

/**
 * Subscription
 */
export interface Subscription {
  /** Event type */
  event: string;
  /** Currency pairs (optional) */
  pairs?: CurrencyPair[];
}

/**
 * Order book update (WebSocket)
 */
export interface OrderBookUpdate extends BaseWebSocketMessage {
  type: 'AGGREGATED_ORDERBOOK_UPDATE' | 'FULL_ORDERBOOK_UPDATE';
  /** Currency pair */
  currencyPairSymbol: CurrencyPair;
  /** Ask orders */
  Asks: Array<{
    side: 'sell';
    quantity: string;
    price: string;
    currencyPair: CurrencyPair;
    orderCount: number;
  }>;
  /** Bid orders */
  Bids: Array<{
    side: 'buy';
    quantity: string;
    price: string;
    currencyPair: CurrencyPair;
    orderCount: number;
  }>;
  /** Last change sequence */
  LastChange?: string;
  /** Checksum */
  Checksum?: number;
}

/**
 * Market summary update (WebSocket)
 */
export interface MarketSummaryUpdate extends BaseWebSocketMessage {
  type: 'MARKET_SUMMARY_UPDATE';
  /** Currency pair */
  currencyPairSymbol: CurrencyPair;
  /** Ask price */
  askPrice: string;
  /** Bid price */
  bidPrice: string;
  /** Last traded price */
  lastTradedPrice: string;
  /** Previous close price */
  previousClosePrice: string;
  /** Base volume */
  baseVolume: string;
  /** Quote volume */
  quoteVolume: string;
  /** High price */
  highPrice: string;
  /** Low price */
  lowPrice: string;
  /** Change from previous */
  changeFromPrevious: string;
  /** Created timestamp */
  created: ISOTimestamp;
}

/**
 * New trade (WebSocket)
 */
export interface NewTrade extends BaseWebSocketMessage {
  type: 'NEW_TRADE';
  /** Currency pair */
  currencyPairSymbol: CurrencyPair;
  /** Trade price */
  price: string;
  /** Trade quantity */
  quantity: string;
  /** Taker side */
  takerSide: OrderSide;
  /** Traded at */
  tradedAt: ISOTimestamp;
  /** Sequence ID */
  sequenceId: number;
  /** Trade ID */
  id: string;
}

/**
 * Order processed (WebSocket)
 */
export interface OrderProcessed extends BaseWebSocketMessage {
  type: 'ORDER_PROCESSED';
  /** Order ID */
  orderId: OrderId;
  /** Success flag */
  success: boolean;
  /** Failure reason (if failed) */
  failureReason?: string;
}

/**
 * Order status update (WebSocket)
 */
export interface OrderStatusUpdate extends BaseWebSocketMessage {
  type: 'ORDER_STATUS_UPDATE';
  /** Order ID */
  orderId: OrderId;
  /** Order status */
  orderStatus: OrderStatus;
  /** Currency pair */
  currencyPair: CurrencyPair;
  /** Remaining quantity */
  remainingQuantity: string;
  /** Original quantity */
  originalQuantity: string;
  /** Customer order ID */
  customerOrderId?: CustomerOrderId;
}

/**
 * Currency info in balance update
 */
export interface BalanceCurrency {
  /** Currency symbol */
  symbol: string;
  /** Decimal places */
  decimalPlaces: number;
  /** Whether currency is active */
  isActive: boolean;
  /** Short name */
  shortName: string;
  /** Long name */
  longName: string;
  /** Supported withdraw decimal places */
  supportedWithdrawDecimalPlaces: number;
  /** Whether currency can be used as collateral */
  collateral: boolean;
  /** Collateral weight */
  collateralWeight: string;
}

/**
 * Balance update data
 */
export interface BalanceUpdateData {
  /** Currency info */
  currency: BalanceCurrency;
  /** Available balance */
  available: string;
  /** Reserved balance */
  reserved: string;
  /** Total balance */
  total: string;
  /** When balance was updated */
  updatedAt: ISOTimestamp;
  /** Lend reserved amount */
  lendReserved: string;
  /** Borrow collateral reserved */
  borrowCollateralReserved: string;
  /** Borrowed amount */
  borrowedAmount: string;
  /** Total in reference currency */
  totalInReference: string;
  /** Total in reference currency weighted */
  totalInReferenceWeighted: string;
  /** Reference currency */
  referenceCurrency: string;
}

/**
 * Balance update (WebSocket)
 */
export interface BalanceUpdate extends BaseWebSocketMessage {
  type: 'BALANCE_UPDATE';
  /** Balance data */
  data: BalanceUpdateData;
}

/**
 * Account trade (WebSocket)
 */
export interface AccountTrade extends BaseWebSocketMessage {
  type: 'NEW_ACCOUNT_TRADE';
  /** Currency pair */
  currencyPair: CurrencyPair;
  /** Price */
  price: string;
  /** Quantity */
  quantity: string;
  /** Side */
  side: OrderSide;
  /** Order ID */
  orderId: OrderId;
  /** Trade ID */
  id: string;
  /** Traded at */
  tradedAt: ISOTimestamp;
}

/**
 * Union of all WebSocket message types
 */
export type WebSocketMessage =
  | BaseWebSocketMessage
  | OrderBookUpdate
  | MarketSummaryUpdate
  | NewTrade
  | OrderProcessed
  | OrderStatusUpdate
  | BalanceUpdate
  | AccountTrade;
