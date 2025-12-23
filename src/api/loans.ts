import type { HttpClient } from '../utils/http';
import type { CreateLoanRequest, Loan, RepayLoanRequest, LoanHistoryParams } from '../types';

/**
 * Loans API methods (requires authentication)
 */
export class LoansAPI {
  constructor(private http: HttpClient) {}

  async createLoan(request: CreateLoanRequest): Promise<Loan> {
    const response = await this.http.post<Loan>('/v1/loans', request);
    return response.data;
  }

  async getActiveLoans(): Promise<Loan[]> {
    const response = await this.http.get<Loan[]>('/v1/loans');
    return response.data;
  }

  async getLoanHistory(params?: LoanHistoryParams): Promise<Loan[]> {
    const response = await this.http.get<Loan[]>('/v1/loans/history', { params });
    return response.data;
  }

  async repayLoan(request: RepayLoanRequest): Promise<Loan> {
    const response = await this.http.post<Loan>('/v1/loans/repay', request);
    return response.data;
  }
}
