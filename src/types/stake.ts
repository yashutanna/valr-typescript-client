import type { CurrencyCode, ISOTimestamp } from './common';

/**
 * Earn type - STAKE or LEND
 */
export type EarnType = 'STAKE' | 'LEND';

/**
 * Stake/Lock request
 */
export interface StakeRequest {
  /** Currency symbol to stake */
  currencySymbol: CurrencyCode;
  /** Amount to stake */
  amount: string;
  /** Earn type (STAKE or LEND) */
  earnType: EarnType;
}

/**
 * Unstake/Unlock request
 */
export interface UnstakeRequest {
  /** Currency symbol to unstake */
  currencySymbol: CurrencyCode;
  /** Amount to unstake */
  amount: string;
  /** Earn type (STAKE or LEND) */
  earnType: EarnType;
}

/**
 * Earn balance information
 */
export interface EarnBalance {
  /** Currency symbol */
  currencySymbol: CurrencyCode;
  /** Current staked/lent amount */
  amount: string;
  /** Earn type */
  earnType: string; // Note: API returns 'Stake' or 'Lend' (capitalized)
  /** Last updated timestamp */
  lastUpdated: ISOTimestamp;
}

/**
 * Earn rate information
 */
export interface EarnRate {
  /** Currency symbol */
  currencySymbol: CurrencyCode;
  /** Earning rate per period */
  rate: string;
  /** Period interval in minutes */
  periodIntervalMinutes: number;
  /** Minimum amount required to stake */
  minimumStakeAmount: string;
  /** Earn type */
  earnType: string; // Note: API returns 'Stake' or 'Lend' (capitalized)
}

/**
 * Earn reward information
 */
export interface EarnReward {
  /** Reward period timestamp */
  period: ISOTimestamp;
  /** Reward amount earned */
  rewardAmount: string;
  /** Rate for this period */
  rate: string;
  /** Annualized rate (percentage) */
  ratePerYear: string;
  /** Currency symbol */
  currencySymbol: CurrencyCode;
  /** Earn type */
  earnType: string; // Note: API returns 'Stake' or 'Lend' (capitalized)
}

/**
 * Earn history transaction type
 */
export type EarnHistoryType = 'STAKE' | 'UNSTAKE';

/**
 * Earn history item
 */
export interface EarnHistoryItem {
  /** Transaction type (STAKE or UNSTAKE) */
  type: EarnHistoryType;
  /** Currency symbol */
  currencySymbol: CurrencyCode;
  /** Amount staked or unstaked */
  amount: string;
  /** Earn type */
  earnType: string; // Note: API returns 'Stake' or 'Lend' (capitalized)
  /** Completion timestamp */
  completedAt: ISOTimestamp;
}

/**
 * Parameters for earn balances query
 */
export interface EarnBalancesParams {
  /** Earn type filter (optional, default: STAKE) */
  earnType?: EarnType;
}

/**
 * Parameters for earn rates query
 */
export interface EarnRatesParams {
  /** Earn type filter (optional, default: STAKE) */
  earnType?: EarnType;
}

/**
 * Parameters for earn rewards query
 */
export interface EarnRewardsParams {
  /** Currency symbol to query */
  currencySymbol: CurrencyCode;
  /** Earn type filter (optional, default: STAKE) */
  earnType?: EarnType;
  /** Number of items to skip (pagination) */
  skip?: number;
  /** Maximum number of items to return (max: 100) */
  limit?: number;
}

/**
 * Parameters for earn history query
 */
export interface EarnHistoryParams {
  /** Currency symbol to query */
  currencySymbol: CurrencyCode;
  /** Earn type filter (optional, default: STAKE) */
  earnType?: EarnType;
  /** Number of items to skip (pagination) */
  skip?: number;
  /** Maximum number of items to return (max: 100) */
  limit?: number;
}
