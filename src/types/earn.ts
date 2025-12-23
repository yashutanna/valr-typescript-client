import type { CurrencyCode, ISOTimestamp } from './common';

/**
 * Earn product (staking/lending opportunity)
 */
export interface EarnProduct {
  /** Product ID */
  id: string;
  /** Currency */
  currency: CurrencyCode;
  /** Product type */
  type: 'STAKING' | 'LENDING' | 'SAVINGS';
  /** Annual percentage yield */
  apy: string;
  /** Minimum amount */
  minAmount: string;
  /** Maximum amount */
  maxAmount?: string;
  /** Lock period in days */
  lockPeriodDays: number;
  /** Whether currently available */
  available: boolean;
}

/**
 * Subscribe to earn product request
 */
export interface SubscribeEarnRequest {
  /** Product ID */
  productId: string;
  /** Amount to subscribe */
  amount: string;
}

/**
 * Earn subscription
 */
export interface EarnSubscription {
  /** Subscription ID */
  id: string;
  /** Product ID */
  productId: string;
  /** Currency */
  currency: CurrencyCode;
  /** Subscribed amount */
  amount: string;
  /** Accrued rewards */
  accruedRewards: string;
  /** Status */
  status: 'ACTIVE' | 'REDEEMED' | 'PENDING';
  /** When subscribed */
  subscribedAt: ISOTimestamp;
  /** When can be redeemed */
  redeemableAt?: ISOTimestamp;
}

/**
 * Redeem earn subscription request
 */
export interface RedeemEarnRequest {
  /** Subscription ID */
  subscriptionId: string;
  /** Amount to redeem (optional, redeems all if not specified) */
  amount?: string;
}
