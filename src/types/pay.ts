import type { CurrencyCode, ISOTimestamp } from './common';

/**
 * Create payment request (P2P payment within VALR)
 */
export interface CreatePaymentRequest {
  /** Payment currency */
  currency: CurrencyCode;
  /** Payment amount */
  amount: number | string;
  /** Recipient's email address (one of: recipientEmail, recipientCellNumber, or recipientPayId required) */
  recipientEmail?: string;
  /** Recipient's cell number (one of: recipientEmail, recipientCellNumber, or recipientPayId required) */
  recipientCellNumber?: string;
  /** Recipient's Pay ID (one of: recipientEmail, recipientCellNumber, or recipientPayId required) */
  recipientPayId?: string;
  /** Note visible to recipient */
  recipientNote?: string;
  /** Private note for sender */
  senderNote?: string;
  /** Whether to send payment anonymously */
  anonymous?: boolean | string;
}

/**
 * Payment creation response
 */
export interface PaymentResponse {
  /** Unique payment identifier */
  identifier: string;
  /** Transaction ID */
  transactionId: string;
}

/**
 * Payment status
 */
export type PaymentStatusType = 'PENDING' | 'COMPLETE' | 'RETURNED' | 'CANCELLED';

/**
 * Payment direction/type
 */
export type PaymentDirection = 'SEND' | 'RECEIVE';

/**
 * Payment transaction type
 */
export type PaymentTransactionType = 'DEBIT' | 'CREDIT';

/**
 * Payment status by transaction ID
 */
export interface PaymentStatus {
  /** Payment amount */
  amount: string;
  /** Transaction timestamp */
  timestamp: ISOTimestamp;
  /** Transaction ID */
  transactionId: string;
  /** Payment status */
  status: PaymentStatusType;
  /** Payment direction */
  direction: PaymentDirection;
}

/**
 * Payment details
 */
export interface PaymentDetails {
  /** Unique payment identifier */
  identifier: string;
  /** Other party identifier (email, phone, or name) */
  otherPartyIdentifier: string;
  /** Payment amount */
  amount: number;
  /** Payment status */
  status: PaymentStatusType;
  /** Transaction timestamp */
  timestamp: ISOTimestamp;
  /** Private note from sender (only visible if you're the sender) */
  senderNote?: string;
  /** Note from recipient (visible to both parties) */
  recipientNote?: string;
  /** Transaction ID */
  transactionId: string;
  /** Whether payment was anonymous */
  anonymous: boolean;
  /** Transaction type (DEBIT = sent, CREDIT = received) */
  type: PaymentTransactionType;
}

/**
 * Payment history item
 */
export interface PaymentHistoryItem extends PaymentDetails {}

/**
 * Payment limits
 */
export interface PaymentLimits {
  /** Maximum payment amount */
  maxPaymentAmount: number;
  /** Minimum payment amount */
  minPaymentAmount: number;
  /** Currency for these limits */
  paymentCurrency: CurrencyCode;
  /** Type of limit */
  limitType: string;
}

/**
 * Pay ID response
 */
export interface PayIdResponse {
  /** User's Pay ID */
  payId: string;
}

/**
 * Reverse payment request
 */
export interface ReversePaymentRequest {
  /** Transaction ID to reverse */
  transactionId: string;
}

/**
 * Partial reverse payment request
 */
export interface PartialReversePaymentRequest {
  /** Transaction ID to partially reverse */
  transactionId: string;
  /** Amount to reverse */
  amountToReverse: string;
}
