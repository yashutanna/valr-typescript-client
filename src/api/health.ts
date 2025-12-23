import type { HttpClient } from '../utils/http';
import type { ValrStatus } from '../types';

/**
 * Health API methods
 */
export class HealthAPI {
  constructor(private http: HttpClient) {}

  async getHealth(): Promise<ValrStatus> {
    const response = await this.http.get<ValrStatus>('/v1/health');
    return response.data;
  }
}
