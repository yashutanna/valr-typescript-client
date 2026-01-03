import type { HttpClient } from '../utils/http';
import type {
  CreatePaymentRequest,
  PaymentResponse,
  PaymentStatus,
  PaymentDetails,
  PaymentHistoryItem,
  PaymentLimits,
  PayIdResponse,
  CurrencyCode,
} from '../types';

/**
 * Pay API methods (requires authentication)
 * P2P payments within VALR
 */
export class PayAPI {
  constructor(private http: HttpClient) {}

  /**
   * Create a new P2P payment
   * POST /v1/pay
   *
   * @param request - Payment request (must specify one of: recipientEmail, recipientCellNumber, or recipientPayId)
   * @returns Payment response with identifier and transaction ID
   */
  async createPayment(request: CreatePaymentRequest): Promise<PaymentResponse> {
    const response = await this.http.post<PaymentResponse>('/v1/pay', request);
    return response.data;
  }

  /**
   * Reverse a payment completely
   * PUT /v1/pay/transactionid/:transactionId/reverse
   *
   * @param transactionId - Transaction ID to reverse
   * @returns Reversal confirmation
   */
  async reversePayment(transactionId: string): Promise<void> {
    await this.http.put(`/v1/pay/transactionid/${transactionId}/reverse`);
  }

  /**
   * Partially reverse a payment
   * PUT /v1/pay/transactionid/:transactionId/partial-reverse
   *
   * @param transactionId - Transaction ID to partially reverse
   * @param amountToReverse - Amount to reverse
   * @returns Partial reversal confirmation
   */
  async partiallyReversePayment(
    transactionId: string,
    amountToReverse: string
  ): Promise<void> {
    await this.http.put(`/v1/pay/transactionid/${transactionId}/partial-reverse`, {
      amountToReverse,
    });
  }

  /**
   * Get payment limits for a currency
   * GET /v1/pay/limits
   *
   * @param currency - Currency code (e.g., "BTC", "ZAR")
   * @returns Payment limits for the specified currency
   */
  async getPaymentLimits(currency: CurrencyCode): Promise<PaymentLimits> {
    const response = await this.http.get<PaymentLimits>('/v1/pay/limits', {
      params: { currency },
    });
    return response.data;
  }

  /**
   * Get your Pay ID (unique identifier for receiving payments)
   * GET /v1/pay/payid
   *
   * @returns Your Pay ID
   */
  async getPayId(): Promise<PayIdResponse> {
    const response = await this.http.get<PayIdResponse>('/v1/pay/payid');
    return response.data;
  }

  /**
   * Get payment history (sent and received payments)
   * GET /v1/pay/history
   *
   * @returns Array of payment history items
   */
  async getPaymentHistory(): Promise<PaymentHistoryItem[]> {
    const response = await this.http.get<PaymentHistoryItem[]>('/v1/pay/history');
    return response.data;
  }

  /**
   * Get payment details by identifier
   * GET /v1/pay/identifier/:identifier
   *
   * @param identifier - Payment identifier
   * @returns Payment details
   */
  async getPaymentByIdentifier(identifier: string): Promise<PaymentDetails> {
    const response = await this.http.get<PaymentDetails>(`/v1/pay/identifier/${identifier}`);
    return response.data;
  }

  /**
   * Get payment status by transaction ID
   * GET /v1/pay/transactionid/:transactionId
   *
   * @param transactionId - Transaction ID
   * @returns Payment status
   */
  async getPaymentStatus(transactionId: string): Promise<PaymentStatus> {
    const response = await this.http.get<PaymentStatus>(`/v1/pay/transactionid/${transactionId}`);
    return response.data;
  }
}
