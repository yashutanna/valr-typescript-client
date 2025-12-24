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
  /** Minimum withdrawal amount */
  minimumWithdrawAmount: string;
  /** Maximum withdrawal amount */
  maximumWithdrawAmount: string;
  /** Withdrawal fee */
  withdrawalFee: string;
  /** Whether withdrawals are enabled */
  withdrawalsEnabled: boolean;
  /** Available networks for withdrawal */
  networks?: Array<{
    networkType: string;
    minimumWithdrawAmount: string;
    maximumWithdrawAmount: string;
    withdrawalFee: string;
  }>;
}

/**
 * Crypto withdrawal request
 */
export interface CryptoWithdrawalRequest {
  /** Currency code */
  currency: CurrencyCode;
  /** Withdrawal amount */
  amount: string;
  /** Destination address */
  address: string;
  /** Network type */
  networkType?: NetworkType;
  /** Payment reference/memo (optional) */
  paymentReference?: string;
}

/**
 * Crypto withdrawal response
 */
export interface CryptoWithdrawalResponse {
  /** Unique withdrawal ID */
  id: string;
  /** Currency code */
  currency: CurrencyCode;
  /** Withdrawal amount */
  amount: string;
  /** Fee amount */
  feeAmount: string;
  /** When withdrawal was created */
  createdAt: ISOTimestamp;
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
  /** Provider name */
  name: string;
  /** Supported currencies */
  supportedCurrencies: CurrencyCode[];
}

/**
 * Crypto withdrawal history params
 */
export interface CryptoWithdrawalHistoryParams {
  /** Number of records to skip */
  skip?: number;
  /** Maximum number of records to return */
  limit?: number;
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
}

/**
 * Fiat deposit reference
 */
export interface FiatDepositReference {
  /** Currency code */
  currency: CurrencyCode;
  /** Reference code to use when depositing */
  reference: string;
  /** Deposit instructions */
  depositInstructions?: string;
}

/**
 * Auto-buy deposit reference
 */
export interface AutoBuyDepositReference {
  /** Fiat currency code */
  currency: CurrencyCode;
  /** Crypto currency to auto-buy */
  buyCurrencySymbol: CurrencyCode;
  /** Reference code to use when depositing */
  reference: string;
  /** Deposit instructions */
  depositInstructions?: string;
}

/**
 * Supported auto-buy currency
 */
export interface AutoBuyCurrency {
  /** Currency code */
  currencySymbol: CurrencyCode;
  /** Currency name */
  currencyName: string;
  /** Whether auto-buy is enabled */
  enabled: boolean;
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
}

/**
 * Fiat withdrawal response
 */
export interface FiatWithdrawalResponse {
  /** Unique withdrawal ID */
  id: string;
  /** Currency code */
  currency: CurrencyCode;
  /** Withdrawal amount */
  amount: string;
  /** When withdrawal was created */
  createdAt: ISOTimestamp;
}
