import type { HttpClient } from '../utils/http';
import type { Bundle, BuyBundleRequest, BundleOrder } from '../types';

/**
 * Bundles API methods (requires authentication)
 */
export class BundlesAPI {
  constructor(private http: HttpClient) {}

  async getBundles(): Promise<Bundle[]> {
    const response = await this.http.get<Bundle[]>('/v1/bundles');
    return response.data;
  }

  async buyBundle(request: BuyBundleRequest): Promise<BundleOrder> {
    const response = await this.http.post<BundleOrder>('/v1/bundles/buy', request);
    return response.data;
  }
}
