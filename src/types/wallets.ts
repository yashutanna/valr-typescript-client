import type {
  CurrencyCode,
  CryptoAddress,
  NetworkType,
  ISOTimestamp,
  PaginationParams,
} from './common';

/**
 * Crypto deposit address
 */
export interface DepositAddress {
  /** Currency code */
  currency: CurrencyCode;
  /** Deposit address */
  address: CryptoAddress;
  /** Network type */
  networkType?: NetworkType;
  /** Additional deposit info (e.g., memo, tag) */
  additionalInfo?: {
    paymentReference?: string;
    memo?: string;
    destinationTag?: string;
  };
}

/**
 * Crypto withdrawal request
 */
export interface CryptoWithdrawalRequest {
  /** Currency to withdraw */
  currency: CurrencyCode;
  /** Amount to withdraw */
  amount: string;
  /** Destination address */
  address: CryptoAddress;
  /** Network type (optional) */
  networkType?: NetworkType;
  /** Payment reference/memo/tag (optional) */
  paymentReference?: string;
}

/**
 * Crypto withdrawal response
 */
export interface CryptoWithdrawalResponse {
  /** Withdrawal ID */
  id: string;
  /** Currency */
  currency: CurrencyCode;
  /** Amount */
  amount: string;
  /** Fee */
  fee: string;
  /** Destination address */
  address: CryptoAddress;
  /** Transaction hash (once broadcast) */
  transactionHash?: string;
  /** Confirmations */
  confirmations?: number;
  /** Status */
  status: 'PENDING' | 'PROCESSING' | 'CONFIRMED' | 'FAILED' | 'CANCELLED';
  /** Created timestamp */
  createdAt: ISOTimestamp;
}

/**
 * Crypto withdrawal status
 */
export interface CryptoWithdrawalStatus extends CryptoWithdrawalResponse {}

/**
 * Crypto withdrawal history parameters
 */
export interface CryptoWithdrawalHistoryParams extends PaginationParams {
  /** Filter by currency */
  currency?: CurrencyCode;
}

/**
 * Fiat bank account
 */
export interface BankAccount {
  /** Bank account ID */
  id: string;
  /** Bank name */
  bank: string;
  /** Account holder name */
  accountHolder: string;
  /** Account number (masked) */
  accountNumber: string;
  /** Branch code */
  branchCode?: string;
  /** Account type */
  accountType?: string;
  /** Verified status */
  verified: boolean;
}

/**
 * Link bank account request
 */
export interface LinkBankAccountRequest {
  /** Bank name */
  bank: string;
  /** Account holder name */
  accountHolder: string;
  /** Account number */
  accountNumber: string;
  /** Branch code */
  branchCode?: string;
  /** Account type */
  accountType?: string;
}

/**
 * Fiat withdrawal request
 */
export interface FiatWithdrawalRequest {
  /** Currency (e.g., ZAR) */
  currency: CurrencyCode;
  /** Amount to withdraw */
  amount: string;
  /** Bank account ID (from linked accounts) */
  beneficiaryId: string;
  /** Whether this is a fast withdrawal */
  fast?: boolean;
}

/**
 * Fiat withdrawal response
 */
export interface FiatWithdrawalResponse {
  /** Withdrawal ID */
  id: string;
  /** Currency */
  currency: CurrencyCode;
  /** Amount */
  amount: string;
  /** Fee */
  fee: string;
  /** Bank account ID */
  beneficiaryId: string;
  /** Status */
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  /** Created timestamp */
  createdAt: ISOTimestamp;
}

/**
 * Fiat deposit reference
 */
export interface FiatDepositReference {
  /** Unique payment reference */
  paymentReference: string;
  /** Bank account details for deposit */
  bankAccountDetails: {
    bank: string;
    accountHolder: string;
    accountNumber: string;
    branchCode?: string;
  };
}
