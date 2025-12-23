import type { HttpClient } from '../utils/http';
import type { CreatePaymentRequest, Payment, PaymentStatus } from '../types';

/**
 * Pay API methods (requires authentication)
 */
export class PayAPI {
  constructor(private http: HttpClient) {}

  async createPayment(request: CreatePaymentRequest): Promise<Payment> {
    const response = await this.http.post<Payment>('/v1/pay/payment', request);
    return response.data;
  }

  async getPaymentStatus(paymentId: string): Promise<PaymentStatus> {
    const response = await this.http.get<PaymentStatus>(`/v1/pay/payment/${paymentId}`);
    return response.data;
  }
}
