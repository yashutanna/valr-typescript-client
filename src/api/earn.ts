import type { HttpClient } from '../utils/http';
import type { EarnProduct, SubscribeEarnRequest, EarnSubscription, RedeemEarnRequest } from '../types';

/**
 * Earn API methods (requires authentication)
 */
export class EarnAPI {
  constructor(private http: HttpClient) {}

  async getEarnProducts(): Promise<EarnProduct[]> {
    const response = await this.http.get<EarnProduct[]>('/v1/earn/products');
    return response.data;
  }

  async subscribe(request: SubscribeEarnRequest): Promise<EarnSubscription> {
    const response = await this.http.post<EarnSubscription>('/v1/earn/subscribe', request);
    return response.data;
  }

  async getSubscriptions(): Promise<EarnSubscription[]> {
    const response = await this.http.get<EarnSubscription[]>('/v1/earn/subscriptions');
    return response.data;
  }

  async redeem(request: RedeemEarnRequest): Promise<EarnSubscription> {
    const response = await this.http.post<EarnSubscription>('/v1/earn/redeem', request);
    return response.data;
  }
}
