import type { CurrencyCode, ISOTimestamp, PaginationParams } from './common';

/**
 * Loan request
 */
export interface CreateLoanRequest {
  /** Currency to borrow */
  currency: CurrencyCode;
  /** Amount to borrow */
  amount: string;
  /** Interest rate (annual) */
  rate: string;
  /** Loan duration in days */
  durationDays: number;
}

/**
 * Loan
 */
export interface Loan {
  /** Loan ID */
  id: string;
  /** Currency */
  currency: CurrencyCode;
  /** Borrowed amount */
  amount: string;
  /** Outstanding amount */
  outstandingAmount: string;
  /** Interest rate */
  rate: string;
  /** Accrued interest */
  accruedInterest: string;
  /** Loan status */
  status: 'ACTIVE' | 'REPAID' | 'DEFAULTED' | 'LIQUIDATED';
  /** When loan was created */
  createdAt: ISOTimestamp;
  /** When loan matures */
  maturityDate: ISOTimestamp;
  /** Last interest payment date */
  lastInterestPayment?: ISOTimestamp;
}

/**
 * Repay loan request
 */
export interface RepayLoanRequest {
  /** Loan ID */
  loanId: string;
  /** Amount to repay */
  amount: string;
}

/**
 * Loan history params
 */
export interface LoanHistoryParams extends PaginationParams {
  /** Filter by currency */
  currency?: CurrencyCode;
  /** Filter by status */
  status?: 'ACTIVE' | 'REPAID' | 'DEFAULTED' | 'LIQUIDATED';
}
