import type { CurrencyCode, ISOTimestamp } from './common';

/**
 * Loan rate information
 */
export interface LoanRate {
  /** Currency symbol */
  currency: CurrencyCode;
  /** Interest rate applied during the most recent interest auction */
  previousFundingRate: number;
  /** Estimated rate of interest for the next funding period */
  estimatedNextRate: number;
  /** Estimated interest rate that will be charged to borrowers in the next funding round */
  estimatedNextBorrowRate: string;
}

/**
 * Open loan
 */
export interface OpenLoan {
  /** Loan ID */
  loanId: string;
  /** Currency symbol */
  currency: CurrencyCode;
  /** Total loan amount */
  totalAmount: string;
  /** Amount of the loan that has been used */
  usedAmount: string;
  /** Hourly interest rate */
  hourlyRate: string;
  /** When the loan was created */
  createdAt: ISOTimestamp;
  /** When the loan was last updated */
  updatedAt: ISOTimestamp;
}

/**
 * Create loan request
 */
export interface CreateLoanRequest {
  /** Currency symbol to borrow */
  currencySymbol: CurrencyCode;
  /** Hourly interest rate */
  hourlyRate: string;
  /** Amount to borrow */
  amount: string;
}

/**
 * Loan credit history item
 */
export interface LoanCreditHistoryItem {
  /** Currency symbol */
  currency: CurrencyCode;
  /** Interest amount charged */
  interestAmount: string;
  /** Loan quantity/amount */
  quantity: string;
  /** When this credit entry was created */
  createdAt: ISOTimestamp;
}

/**
 * Increase loan amount request
 */
export interface IncreaseLoanRequest {
  /** Currency symbol */
  currencySymbol: CurrencyCode;
  /** Amount to increase the loan by */
  increaseLoanAmountBy: string;
  /** Loan ID */
  loanId: string;
}

/**
 * Change loan rate request
 */
export interface ChangeLoanRateRequest {
  /** Currency symbol */
  currencySymbol: CurrencyCode;
  /** New hourly rate */
  hourlyRate: string;
  /** Loan ID */
  loanId: string;
}

/**
 * Request unlock request
 */
export interface RequestUnlockRequest {
  /** Currency symbol */
  currencySymbol: CurrencyCode;
  /** Amount to unlock */
  unlockAmount: string;
  /** Loan ID */
  loanId: string;
}

/**
 * Borrow history item
 */
export interface BorrowHistoryItem {
  /** Currency symbol */
  currency: CurrencyCode;
  /** Borrow amount */
  amount: string;
  /** Interest rate */
  rate: string;
  /** When the borrow occurred */
  createdAt: ISOTimestamp;
}
