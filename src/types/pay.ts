import type { CurrencyCode, ISOTimestamp } from './common';

/**
 * Payment request
 */
export interface CreatePaymentRequest {
  /** Merchant ID */
  merchantId: string;
  /** Currency */
  currency: CurrencyCode;
  /** Amount */
  amount: string;
  /** Description */
  description?: string;
  /** Return URL after payment */
  returnUrl?: string;
  /** Callback URL for payment notifications */
  callbackUrl?: string;
}

/**
 * Payment
 */
export interface Payment {
  /** Payment ID */
  id: string;
  /** Merchant ID */
  merchantId: string;
  /** Currency */
  currency: CurrencyCode;
  /** Amount */
  amount: string;
  /** Payment status */
  status: 'PENDING' | 'COMPLETED' | 'EXPIRED' | 'CANCELLED';
  /** Payment URL */
  paymentUrl: string;
  /** When created */
  createdAt: ISOTimestamp;
  /** When expires */
  expiresAt: ISOTimestamp;
  /** When completed */
  completedAt?: ISOTimestamp;
}

/**
 * Payment status
 */
export interface PaymentStatus extends Payment {}
