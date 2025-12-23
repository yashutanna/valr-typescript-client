import type { HttpClient } from '../utils/http';
import type {
  FuturesPosition,
  ClosedPositionSummary,
  ClosedPosition,
  FundingPayment,
  LeverageInfo,
  UpdateLeverageRequest,
  CurrencyPair,
  PositionHistoryParams,
  FundingHistoryParams,
} from '../types';

/**
 * Futures API methods (requires authentication)
 */
export class FuturesAPI {
  constructor(private http: HttpClient) {}

  async getOpenPositions(): Promise<FuturesPosition[]> {
    const response = await this.http.get<FuturesPosition[]>('/v1/positions/open');
    return response.data;
  }

  async getClosedPositionsSummary(): Promise<ClosedPositionSummary[]> {
    const response = await this.http.get<ClosedPositionSummary[]>('/v1/positions/closed/summary');
    return response.data;
  }

  async getClosedPositions(pair: CurrencyPair): Promise<ClosedPosition[]> {
    const response = await this.http.get<ClosedPosition[]>('/v1/positions/closed', {
      params: { currencyPair: pair },
    });
    return response.data;
  }

  async getPositionHistory(params: PositionHistoryParams): Promise<FuturesPosition[]> {
    const response = await this.http.get<FuturesPosition[]>('/v1/positions/history', { params });
    return response.data;
  }

  async getFundingHistory(params: FundingHistoryParams): Promise<FundingPayment[]> {
    const response = await this.http.get<FundingPayment[]>('/v1/positions/funding/history', { params });
    return response.data;
  }

  async getLeverageInfo(pair: CurrencyPair): Promise<LeverageInfo> {
    const response = await this.http.get<LeverageInfo>(`/v1/margin/leverage/${pair}`);
    return response.data;
  }

  async updateLeverage(pair: CurrencyPair, request: UpdateLeverageRequest): Promise<LeverageInfo> {
    const response = await this.http.put<LeverageInfo>(`/v1/margin/leverage/${pair}`, request);
    return response.data;
  }
}
