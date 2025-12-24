import type { CurrencyCode, ISOTimestamp, NetworkType } from './common';

// ===== Crypto Wallet Types =====

/**
 * Crypto deposit address
 */
export interface DepositAddress {
  /** Currency code */
  currency: CurrencyCode;
  /** Deposit address */
  address: string;
  /** Network type (e.g., "Ethereum", "Bitcoin") */
  networkType?: NetworkType;
  /** Additional network-specific data */
  metadata?: {
    /** Destination tag for XRP, memo for Stellar, etc. */
    tag?: string;
  };
}

/**
 * Crypto deposit history params
 */
export interface CryptoDepositHistoryParams {
  /** Number of records to skip */
  skip?: number;
  /** Maximum number of records to return */
  limit?: number;
  /** Start time (ISO 8601) */
  startTime?: ISOTimestamp;
  /** End time (ISO 8601) */
  endTime?: ISOTimestamp;
  /** Filter by currency code */
  currency?: CurrencyCode;
}

/**
 * Crypto deposit history item
 */
export interface CryptoDepositHistoryItem {
  /** Currency code */
  currencyCode: CurrencyCode;
  /** Receiving address */
  receiveAddress: string;
  /** Transaction hash */
  transactionHash: string;
  /** Deposit amount */
  amount: string;
  /** When deposit was created */
  createdAt: ISOTimestamp;
  /** Number of confirmations */
  confirmations: number;
  /** Whether deposit is confirmed */
  confirmed: boolean;
  /** When deposit was confirmed */
  confirmedAt?: ISOTimestamp;
}

/**
 * Whitelisted withdrawal address
 */
export interface WhitelistedAddress {
  /** Address ID */
  id: string;
  /** User-friendly label */
  label: string;
  /** Currency code */
  currency: CurrencyCode;
  /** Withdrawal address */
  address: string;
  /** Network type */
  networkType: string;
  /** When address was created */
  createdAt: ISOTimestamp;
  /** Beneficiary name */
  beneficiaryName?: string;
  /** Whether beneficiary is a corporate entity */
  isCorporate?: boolean;
  /** Whether address is self-hosted */
  isSelfHosted?: boolean;
  /** Service provider name if applicable */
  serviceProviderName?: string;
}

/**
 * Withdrawal configuration info
 */
export interface WithdrawalConfigInfo {
  /** Currency code */
  currency: CurrencyCode;
  /** Whether withdrawals are active */
  isActive: boolean;
  /** Minimum withdrawal amount */
  minimumWithdrawAmount: string;
  /** Network type */
  networkType: string;
  /** Whether payment reference is supported */
  supportsPaymentReference: boolean;
  /** Withdrawal cost/fee */
  withdrawCost: string;
  /** Withdrawal decimal places */
  withdrawalDecimalPlaces: number;
}

/**
 * Crypto withdrawal request
 */
export interface CryptoWithdrawalRequest {
  /** Currency code (not in body, used in path) */
  currency: CurrencyCode;
  /** Destination address */
  address: string;
  /** Withdrawal amount */
  amount: string;
  /** Network type */
  networkType?: NetworkType;
  /** Payment reference/memo (optional) */
  paymentReference?: string;
  /** Allow borrowing to fulfill withdrawal */
  allowBorrow?: boolean;
  /** Beneficiary name (Travel Rule requirement) */
  beneficiaryName?: string;
  /** Whether beneficiary is a corporate entity (Travel Rule) */
  isCorporate?: boolean;
  /** Whether address is self-hosted (Travel Rule) */
  isSelfHosted?: boolean;
  /** Service provider ID */
  serviceProviderId?: string;
}

/**
 * Crypto withdrawal response
 */
export interface CryptoWithdrawalResponse {
  /** Unique withdrawal ID */
  id: string;
}

/**
 * Crypto withdrawal status
 */
export interface CryptoWithdrawalStatus {
  /** Unique withdrawal ID */
  uniqueId: string;
  /** Currency code */
  currency: CurrencyCode;
  /** Destination address */
  address: string;
  /** Withdrawal amount */
  amount: string;
  /** Fee amount */
  feeAmount: string;
  /** Transaction hash (if available) */
  transactionHash?: string;
  /** Number of confirmations */
  confirmations: number;
  /** When last confirmation occurred */
  lastConfirmationAt?: ISOTimestamp;
  /** When withdrawal was created */
  createdAt: ISOTimestamp;
  /** Whether withdrawal is verified */
  verified: boolean;
  /** Withdrawal status */
  status: 'Pending' | 'Processing' | 'Complete' | 'Failed' | 'Cancelled';
  /** Network type */
  networkType?: string;
}

/**
 * Service provider information
 */
export interface ServiceProvider {
  /** Service provider ID */
  id: string;
  /** Provider name */
  name: string;
}

/**
 * Crypto withdrawal history params
 */
export interface CryptoWithdrawalHistoryParams {
  /** Number of records to skip */
  skip?: number;
  /** Maximum number of records to return */
  limit?: number;
  /** Filter by currency code */
  currency?: CurrencyCode;
  /** Start time (ISO 8601) */
  startTime?: ISOTimestamp;
  /** End time (ISO 8601) */
  endTime?: ISOTimestamp;
}

/**
 * Crypto withdrawal history item
 */
export interface CryptoWithdrawalHistoryItem {
  /** Currency code */
  currency: CurrencyCode;
  /** Destination address */
  address: string;
  /** Withdrawal amount */
  amount: string;
  /** Fee amount */
  feeAmount: string;
  /** Transaction hash (if available) */
  transactionHash?: string;
  /** Number of confirmations */
  confirmations: number;
  /** When last confirmation occurred */
  lastConfirmationAt?: ISOTimestamp;
  /** Unique withdrawal ID */
  uniqueId: string;
  /** When withdrawal was created */
  createdAt: ISOTimestamp;
  /** Whether withdrawal is verified */
  verified: boolean;
  /** Withdrawal status */
  status: string;
  /** Network type */
  networkType: string;
}

// ===== Fiat Wallet Types =====

/**
 * Bank information
 */
export interface Bank {
  /** Bank code */
  code: string;
  /** Display name */
  displayName: string;
  /** Default branch code */
  defaultBranchCode: string;
  /** Whether bank participates in RTC (Real-Time Clearing) */
  rtcParticipant: boolean;
  /** Whether bank participates in RTGS (Real-Time Gross Settlement) */
  rtgsParticipant: boolean;
  /** Country code */
  countryCode: string;
}

/**
 * Bank account
 */
export interface BankAccount {
  /** Account ID */
  id: string;
  /** Bank name */
  bank: string;
  /** Account holder name */
  accountHolder: string;
  /** Account number */
  accountNumber: string;
  /** Branch code */
  branchCode: string;
  /** Account type */
  accountType: string;
  /** When account was linked */
  createdAt: ISOTimestamp;
  /** Country code */
  country: string;
}

/**
 * Link bank account request
 */
export interface LinkBankAccountRequest {
  /** Bank code */
  bank: string;
  /** Account holder name */
  accountHolder: string;
  /** Account number */
  accountNumber: string;
  /** Branch code */
  branchCode: string;
  /** Account type */
  accountType: string;
  /** Country code */
  country: string;
}

/**
 * Fiat deposit reference
 */
export interface FiatDepositReference {
  /** Reference code to use when depositing */
  reference: string;
}

/**
 * Auto-buy deposit reference
 */
export interface AutoBuyDepositReference {
  /** Reference code to use when depositing */
  reference: string;
}


/**
 * Fiat withdrawal request
 */
export interface FiatWithdrawalRequest {
  /** Currency code */
  currency: CurrencyCode;
  /** Withdrawal amount */
  amount: string;
  /** Linked bank account ID */
  linkedBankAccountId: string;
  /** Whether withdrawal is fast */
  fast?: boolean;
  /** Allow borrowing to fulfill withdrawal */
  allowBorrow?: boolean;
}

/**
 * Fiat withdrawal response
 */
export interface FiatWithdrawalResponse {
  /** Unique withdrawal ID */
  id: string;
}
