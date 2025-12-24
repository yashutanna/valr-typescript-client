/**
 * Export all VALR API types
 */

// Common types
export type {
  OrderSide,
  OrderType,
  TimeInForce,
  OrderStatus,
  PostOnly,
  TransactionType,
  CurrencyCode,
  CurrencyPair,
  NetworkType,
  CryptoAddress,
  PairType,
  PaginationParams,
  CursorPaginationParams,
  TimeRangeParams,
  PriceQuantity,
  OrderBookEntry,
  CustomerOrderId,
  OrderId,
  SubaccountId,
  ISOTimestamp,
  ConditionalOrderTriggerType,
  ConditionalOrderType,
  BatchOrderStatus,
} from './common';

// Public API types
export type {
  ServerTime,
  ValrStatus,
  Currency,
  CurrencyPairInfo,
  MarketSummary,
  OrderBook,
  Trade,
  CurrencyPairOrderTypes,
  PriceBucket,
  FuturesInfo,
  FundingRateHistory,
  LoanInfo,
  LeverageOption,
  PriceBucketsParams,
  OrderTypesParams,
} from './public';

// Re-export TradeHistoryParams from public (primary export)
export type { TradeHistoryParams } from './public';

// Account types
export type {
  Balance,
  Transaction,
  AccountTrade,
  TradeFee,
  Subaccount,
  ApiKey,
  BalancesParams,
  TransactionHistoryParams,
  CreateApiKeyRequest,
  CreateApiKeyResponse,
  CreateSubaccountRequest,
  TransferRequest,
} from './account';

// Trading types
export type {
  BaseOrderRequest,
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
  BatchOrderResponseItem,
  BatchOrderResponse,
  OrderStatusSummary,
  OrderStatusDetail,
  OrderTrade,
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
} from './trading';

// Wallets types
export type {
  DepositAddress,
  CryptoWithdrawalRequest,
  CryptoWithdrawalResponse,
  CryptoWithdrawalStatus,
  CryptoWithdrawalHistoryParams,
  BankAccount,
  LinkBankAccountRequest,
  FiatWithdrawalRequest,
  FiatWithdrawalResponse,
  FiatDepositReference,
} from './wallets';

// Futures types
export type {
  FuturesPosition,
  ClosedPositionSummary,
  ClosedPosition,
  FundingPayment,
  LeverageInfo,
  UpdateLeverageRequest,
  PositionHistoryParams,
  FundingHistoryParams,
} from './futures';

// Margin types
export type {
  MarginStatus,
  EnableMarginRequest,
  CurrencyLeverageSettings,
} from './margin';

// Loans types
export type {
  LoanRate,
  OpenLoan,
  CreateLoanRequest,
  LoanCreditHistoryItem,
  IncreaseLoanRequest,
  ChangeLoanRateRequest,
  RequestUnlockRequest,
  BorrowHistoryItem,
} from './loans';

// Stake/Earn types
export type {
  EarnType,
  StakeRequest,
  UnstakeRequest,
  EarnBalance,
  EarnRate,
  EarnReward,
  EarnHistoryType,
  EarnHistoryItem,
  EarnBalancesParams,
  EarnRatesParams,
  EarnRewardsParams,
  EarnHistoryParams,
} from './stake';

// Pay types
export type {
  CreatePaymentRequest,
  Payment,
  PaymentStatus,
} from './pay';

// Bundles types
export type {
  Bundle,
  BundleComposition,
  BuyBundleRequest,
  BundleOrder,
} from './bundles';

// WebSocket types
export type {
  WebSocketMessageType,
  BaseWebSocketMessage,
  SubscriptionRequest,
  Subscription,
  OrderBookUpdate,
  MarketSummaryUpdate,
  NewTrade,
  OrderProcessed,
  OrderStatusUpdate,
  BalanceUpdate,
  AccountTrade as WebSocketAccountTrade,
  WebSocketMessage,
} from './websocket';
