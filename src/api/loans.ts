import type { HttpClient } from '../utils/http';
import type {
  LoanRate,
  OpenLoan,
  CreateLoanRequest,
  LoanCreditHistoryItem,
  IncreaseLoanRequest,
  ChangeLoanRateRequest,
  RequestUnlockRequest,
  BorrowHistoryItem,
  CurrencyCode,
} from '../types';

/**
 * Loans API methods (requires authentication)
 *
 * VALR's lending platform allows users to lend crypto and earn interest.
 * Interest rates are determined through an hourly auction system.
 */
export class LoansAPI {
  constructor(private http: HttpClient) {}

  /**
   * Get current loan rates for all currencies
   *
   * Returns interest rate information including:
   * - Previous funding rate from the most recent interest auction
   * - Estimated rate for the next funding period
   * - Estimated borrow rate for the next funding round
   *
   * @returns Promise resolving to array of loan rates
   *
   * @example
   * ```typescript
   * const rates = await client.loans.getRates();
   * rates.forEach(rate => {
   *   console.log(`${rate.currency}: ${rate.estimatedNextRate}`);
   * });
   * ```
   */
  async getRates(): Promise<LoanRate[]> {
    const response = await this.http.get<LoanRate[]>('/v1/loans/rates');
    return response.data;
  }

  /**
   * Get historical loan rates
   *
   * @returns Promise resolving to array of historical loan rates
   *
   * @example
   * ```typescript
   * const history = await client.loans.getRatesHistory();
   * ```
   */
  async getRatesHistory(): Promise<LoanRate[]> {
    const response = await this.http.get<LoanRate[]>('/v1/loans/rates/history');
    return response.data;
  }

  /**
   * Get all open loans
   *
   * @returns Promise resolving to array of open loans
   *
   * @example
   * ```typescript
   * const openLoans = await client.loans.getOpenLoans();
   * openLoans.forEach(loan => {
   *   console.log(`${loan.currency}: ${loan.totalAmount} at ${loan.hourlyRate}/hr`);
   * });
   * ```
   */
  async getOpenLoans(): Promise<OpenLoan[]> {
    const response = await this.http.get<OpenLoan[]>('/v1/loans/open');
    return response.data;
  }

  /**
   * Create a new loan
   *
   * Opens a new lending position at the specified hourly rate.
   *
   * @param request - Loan creation parameters
   * @returns Promise that resolves when loan is created
   *
   * @example
   * ```typescript
   * await client.loans.createLoan({
   *   currencySymbol: 'USDC',
   *   hourlyRate: '0.00001255',
   *   amount: '100'
   * });
   * ```
   */
  async createLoan(request: CreateLoanRequest): Promise<void> {
    await this.http.post('/v1/loans', request);
  }

  /**
   * Get loan credit history
   *
   * Returns history of interest entries as calculated during margin interest auction runs.
   *
   * @returns Promise resolving to array of credit history items
   *
   * @example
   * ```typescript
   * const history = await client.loans.getCreditHistory();
   * history.forEach(item => {
   *   console.log(`${item.currency}: earned ${item.interestAmount}`);
   * });
   * ```
   */
  async getCreditHistory(): Promise<LoanCreditHistoryItem[]> {
    const response = await this.http.get<LoanCreditHistoryItem[]>('/v1/loans/credit-history');
    return response.data;
  }

  /**
   * Increase loan amount
   *
   * Increases the total amount of an existing loan.
   *
   * @param request - Increase loan parameters
   * @returns Promise that resolves when loan is increased
   *
   * @example
   * ```typescript
   * await client.loans.increaseLoan({
   *   currencySymbol: 'USDC',
   *   increaseLoanAmountBy: '20',
   *   loanId: '1289055810346737664'
   * });
   * ```
   */
  async increaseLoan(request: IncreaseLoanRequest): Promise<void> {
    await this.http.put('/v1/loans/increase', request);
  }

  /**
   * Change loan rate
   *
   * Updates the hourly interest rate for an existing loan.
   *
   * @param request - Change rate parameters
   * @returns Promise that resolves when rate is changed
   *
   * @example
   * ```typescript
   * await client.loans.changeRate({
   *   currencySymbol: 'USDC',
   *   hourlyRate: '0.0000126',
   *   loanId: '1289055810346737664'
   * });
   * ```
   */
  async changeRate(request: ChangeLoanRateRequest): Promise<void> {
    await this.http.put('/v1/loans/rate', request);
  }

  /**
   * Get loan update history
   *
   * Returns history of loan modifications (rate changes, amount increases, etc).
   *
   * @returns Promise resolving to array of loan updates
   *
   * @example
   * ```typescript
   * const updates = await client.loans.getUpdateHistory();
   * ```
   */
  async getUpdateHistory(): Promise<any[]> {
    const response = await this.http.get<any[]>('/v1/loans/update-history');
    return response.data;
  }

  /**
   * Request to unlock loan funds
   *
   * Requests to unlock a portion of a loan to make it available for withdrawal.
   *
   * @param request - Unlock request parameters
   * @returns Promise that resolves when unlock is requested
   *
   * @example
   * ```typescript
   * await client.loans.requestUnlock({
   *   currencySymbol: 'USDC',
   *   unlockAmount: '50',
   *   loanId: '1289055810346737664'
   * });
   * ```
   */
  async requestUnlock(request: RequestUnlockRequest): Promise<void> {
    await this.http.put('/v1/loans/unlock', request);
  }

  /**
   * Cancel unlock request
   *
   * Cancels a pending unlock request for loan funds.
   *
   * @returns Promise that resolves when unlock request is cancelled
   *
   * @example
   * ```typescript
   * await client.loans.cancelUnlock();
   * ```
   */
  async cancelUnlock(): Promise<void> {
    await this.http.delete('/v1/loans/unlock');
  }

  /**
   * Get borrow history for a specific currency
   *
   * @param currencySymbol - Currency symbol to get borrow history for
   * @returns Promise resolving to array of borrow history items
   *
   * @example
   * ```typescript
   * const history = await client.loans.getBorrowHistory('USDC');
   * ```
   */
  async getBorrowHistory(currencySymbol: CurrencyCode): Promise<BorrowHistoryItem[]> {
    const response = await this.http.get<BorrowHistoryItem[]>(
      `/v1/borrows/${currencySymbol}/history`
    );
    return response.data;
  }
}
