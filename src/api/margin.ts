import type { HttpClient } from '../utils/http';
import type { MarginStatus, EnableMarginRequest } from '../types';

/**
 * Margin API methods (requires authentication)
 */
export class MarginAPI {
  constructor(private http: HttpClient) {}

  async getMarginStatus(): Promise<MarginStatus> {
    const response = await this.http.get<MarginStatus>('/v1/margin/status');
    return response.data;
  }

  async enableMargin(request: EnableMarginRequest): Promise<MarginStatus> {
    const response = await this.http.put<MarginStatus>('/v1/margin/account/status', request);
    return response.data;
  }
}
