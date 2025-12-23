import type {
  CurrencyCode,
  CurrencyPair,
  ISOTimestamp,
  OrderSide,
  PaginationParams,
  CursorPaginationParams,
  TimeRangeParams,
} from './common';

/**
 * Server time response
 */
export interface ServerTime {
  /** Unix epoch time in seconds */
  epochTime: number;
  /** ISO 8601 timestamp */
  time: ISOTimestamp;
}

/**
 * VALR API status
 */
export interface ValrStatus {
  /** Current status of the API */
  status: 'online' | 'offline' | 'maintenance';
}

/**
 * Currency information
 */
export interface Currency {
  /** Currency symbol (e.g., BTC, ETH, ZAR) */
  symbol: CurrencyCode;
  /** Whether the currency is currently active */
  isActive: boolean;
  /** Short name for display */
  shortName: string;
  /** Full name of the currency */
  longName: string;
  /** Number of decimal places */
  decimalPlaces: string;
  /** Decimal places for withdrawals */
  withdrawalDecimalPlaces: string;
  /** Whether currency can be used as collateral */
  collateral: boolean;
  /** Collateral discount */
  collateralDiscount?: string;
  /** Supported network types for this currency */
  supportedNetworkTypes?: string[];
  /** Default network type */
  defaultNetworkType?: string;
  /** Whether currency supports deposits */
  supportDeposit?: boolean;
  /** Whether currency supports withdrawals */
  supportWithdrawal?: boolean;
  /** Minimum deposit amount */
  minDeposit?: string;
  /** Minimum withdrawal amount */
  minWithdrawal?: string;
  /** Withdrawal fee */
  withdrawalFee?: string;
}

/**
 * Currency pair information
 */
export interface CurrencyPairInfo {
  /** Currency pair symbol (e.g., BTCZAR, ETHUSDC) */
  symbol: CurrencyPair;
  /** Base currency */
  baseCurrency: CurrencyCode;
  /** Quote currency */
  quoteCurrency: CurrencyCode;
  /** Short name for display */
  shortName: string;
  /** Whether the pair is active */
  active: boolean;
  /** Minimum base amount for orders */
  minBaseAmount: string;
  /** Maximum base amount for orders */
  maxBaseAmount: string;
  /** Minimum quote amount for orders */
  minQuoteAmount: string;
  /** Maximum quote amount for orders */
  maxQuoteAmount: string;
  /** Number of decimal places for price */
  tickSize: string;
  /** Minimum increment for base amount */
  baseDecimalPlaces: string;
  /** Quote currency decimal places */
  quoteDecimalPlaces?: string;
}

/**
 * Market summary for a currency pair
 */
export interface MarketSummary {
  /** Currency pair */
  currencyPair: CurrencyPair;
  /** Current ask (sell) price */
  askPrice: string;
  /** Current bid (buy) price */
  bidPrice: string;
  /** Last traded price */
  lastTradedPrice: string;
  /** Previous 24h close price */
  previousClosePrice: string;
  /** 24h base volume */
  baseVolume: string;
  /** 24h quote volume */
  quoteVolume: string;
  /** 24h high price */
  highPrice: string;
  /** 24h low price */
  lowPrice: string;
  /** Timestamp of this summary */
  created: ISOTimestamp;
  /** 24h price change percentage */
  changeFromPrevious?: string;
  /** Mark price (for futures) */
  markPrice?: string;
}

/**
 * Order book entry
 */
export interface OrderBookEntry {
  /** Order side */
  side: OrderSide | 'buy' | 'sell';
  /** Quantity available at this price */
  quantity: string;
  /** Price level */
  price: string;
  /** Currency pair */
  currencyPair: CurrencyPair;
  /** Number of orders at this price level */
  orderCount: number;
  /** Position (for full order book) */
  positionAtCrossOver?: number;
  /** ID (for full order book) */
  id?: string;
}

/**
 * Aggregated order book
 */
export interface OrderBook {
  /** Ask orders (sell side) */
  Asks: OrderBookEntry[];
  /** Bid orders (buy side) */
  Bids: OrderBookEntry[];
  /** Last change sequence number */
  LastChange?: string;
  /** Checksum for validation */
  Checksum?: number;
}

/**
 * Trade history entry
 */
export interface Trade {
  /** Trade price */
  price: string;
  /** Trade quantity */
  quantity: string;
  /** Currency pair */
  currencyPair: CurrencyPair;
  /** When the trade occurred */
  tradedAt: ISOTimestamp;
  /** Taker side of the trade */
  takerSide: OrderSide | 'buy' | 'sell';
  /** Sequence ID for ordering */
  sequenceId: number;
  /** Trade ID */
  id: string;
  /** Quote volume */
  quoteVolume?: string;
}

/**
 * Supported order types for a currency pair
 */
export interface CurrencyPairOrderTypes {
  /** Currency pair */
  currencyPair: CurrencyPair;
  /** Supported order types */
  orderTypes: string[];
}

/**
 * Price/Mark price bucket (OHLC data)
 */
export interface PriceBucket {
  /** Currency pair symbol */
  currencyPairSymbol: CurrencyPair;
  /** Bucket period in seconds */
  bucketPeriodInSeconds: number;
  /** Bucket start time */
  startTime: ISOTimestamp;
  /** Opening price */
  open: string;
  /** Highest price in bucket */
  high: string;
  /** Lowest price in bucket */
  low: string;
  /** Closing price */
  close: string;
  /** Volume in base currency */
  volume?: string;
  /** Number of trades in this bucket */
  numberOfTrades?: number;
}

/**
 * Futures contract information
 */
export interface FuturesInfo {
  /** Currency pair */
  currencyPair: CurrencyPair;
  /** Estimated funding rate */
  estimatedFundingRate: string;
  /** Open interest */
  openInterest: string;
  /** Next funding run timestamp (Unix milliseconds) */
  nextFundingRun: number;
  /** Next PnL run timestamp (Unix milliseconds) */
  nextPnlRun: number;
}

/**
 * Funding rate history entry
 */
export interface FundingRateHistory {
  /** Currency pair */
  currencyPair: CurrencyPair;
  /** Funding rate */
  fundingRate: string;
  /** When funding occurred */
  fundingTime: ISOTimestamp;
}

/**
 * Loan information for a currency
 */
export interface LoanInfo {
  /** Whether lending is supported */
  lendingSupported: boolean;
  /** Currency short name */
  shortName: CurrencyCode;
  /** Minimum interest rate */
  minimumRate: string;
  /** Maximum interest rate */
  maximumRate: string;
  /** Minimum loan amount */
  minimumAmount: string;
  /** Maximum loan amount */
  maximumAmount: string;
}

/**
 * Leverage options for a currency pair
 */
export interface LeverageOption {
  /** Currency pair symbol */
  pairSymbol: CurrencyPair;
  /** Leverage multiple */
  leverageMultiple: number;
  /** Initial margin fraction */
  initialMarginFraction: number;
  /** Maintenance margin fraction */
  maintenanceMarginFraction: number;
  /** Auto-close margin fraction */
  autoCloseMarginFraction: number;
  /** Risk limit value */
  riskLimitValue: number;
}

/**
 * Query parameters for trade history
 */
export interface TradeHistoryParams extends PaginationParams, CursorPaginationParams, TimeRangeParams {}

/**
 * Query parameters for price buckets
 */
export interface PriceBucketsParams extends PaginationParams, TimeRangeParams {
  /** Bucket period in seconds (e.g., 60, 300, 3600) */
  periodSeconds?: number;
  /** Include empty buckets */
  includeEmpty?: boolean;
}

/**
 * Query parameters for order types
 */
export interface OrderTypesParams {
  /** Include inactive currency pairs */
  includeInactivePairs?: boolean;
}
