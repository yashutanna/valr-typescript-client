import type {
  CurrencyPair,
  ISOTimestamp,
  PaginationParams,
} from './common';

/**
 * Futures position
 */
export interface FuturesPosition {
  /** Currency pair */
  currencyPair: CurrencyPair;
  /** Position side (LONG or SHORT) */
  side: 'LONG' | 'SHORT';
  /** Position quantity */
  quantity: string;
  /** Average entry price */
  entryPrice: string;
  /** Mark price */
  markPrice: string;
  /** Liquidation price */
  liquidationPrice: string;
  /** Unrealized PnL */
  unrealizedPnl: string;
  /** Realized PnL */
  realizedPnl: string;
  /** Margin */
  margin: string;
  /** Leverage */
  leverage: number;
  /** Auto-close enabled */
  autoClose: boolean;
  /** When position was opened */
  openedAt: ISOTimestamp;
}

/**
 * Closed futures position summary
 */
export interface ClosedPositionSummary {
  /** Currency pair */
  currencyPair: CurrencyPair;
  /** Realized PnL */
  realizedPnl: string;
  /** Total funding */
  totalFunding: string;
  /** Number of positions closed */
  positionCount: number;
}

/**
 * Closed futures position
 */
export interface ClosedPosition {
  /** Currency pair */
  currencyPair: CurrencyPair;
  /** Position side */
  side: 'LONG' | 'SHORT';
  /** Entry price */
  entryPrice: string;
  /** Exit price */
  exitPrice: string;
  /** Quantity */
  quantity: string;
  /** Realized PnL */
  realizedPnl: string;
  /** When opened */
  openedAt: ISOTimestamp;
  /** When closed */
  closedAt: ISOTimestamp;
}

/**
 * Funding payment
 */
export interface FundingPayment {
  /** Currency pair */
  currencyPair: CurrencyPair;
  /** Funding rate */
  fundingRate: string;
  /** Funding amount paid/received */
  fundingAmount: string;
  /** Position size at funding time */
  positionSize: string;
  /** When funding occurred */
  fundingTime: ISOTimestamp;
}


/**
 * Futures position history params
 */
export interface PositionHistoryParams extends PaginationParams {
  /** Filter by currency pair */
  currencyPair?: CurrencyPair;
}

/**
 * Funding history params
 */
export interface FundingHistoryParams extends PaginationParams {
  /** Filter by currency pair */
  currencyPair?: CurrencyPair;
}
