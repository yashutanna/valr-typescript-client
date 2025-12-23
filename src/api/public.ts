import type { HttpClient } from '../utils/http';
import type {
  ServerTime,
  ValrStatus,
  Currency,
  CurrencyPairInfo,
  MarketSummary,
  OrderBook,
  Trade,
  CurrencyPairOrderTypes,
  PriceBucket,
  FuturesInfo,
  FundingRateHistory,
  LoanInfo,
  LeverageOption,
  TradeHistoryParams,
  PriceBucketsParams,
  OrderTypesParams,
  CurrencyPair,
  PairType,
} from '../types';

/**
 * Public API methods (no authentication required)
 */
export class PublicAPI {
  constructor(private http: HttpClient) {}

  /**
   * Get server time
   * GET /v1/public/time
   *
   * @returns Server time with Unix epoch and ISO timestamp
   */
  async getServerTime(): Promise<ServerTime> {
    const response = await this.http.get<ServerTime>('/v1/public/time');
    return response.data;
  }

  /**
   * Get VALR API status
   * GET /v1/public/status
   *
   * @returns Current API status
   */
  async getStatus(): Promise<ValrStatus> {
    const response = await this.http.get<ValrStatus>('/v1/public/status');
    return response.data;
  }

  /**
   * Get list of currencies supported by VALR
   * GET /v1/public/currencies
   *
   * @returns Array of currency information
   */
  async getCurrencies(): Promise<Currency[]> {
    const response = await this.http.get<Currency[]>('/v1/public/currencies');
    return response.data;
  }

  /**
   * Get list of all currency pairs
   * GET /v1/public/pairs
   *
   * @returns Array of currency pair information
   */
  async getCurrencyPairs(): Promise<CurrencyPairInfo[]> {
    const response = await this.http.get<CurrencyPairInfo[]>('/v1/public/pairs');
    return response.data;
  }

  /**
   * Get currency pairs by type (SPOT or FUTURES)
   * GET /v1/public/pairs/:type
   *
   * @param type - Pair type (SPOT or FUTURES)
   * @returns Array of currency pair information
   */
  async getCurrencyPairsByType(type: PairType): Promise<CurrencyPairInfo[]> {
    const response = await this.http.get<CurrencyPairInfo[]>(`/v1/public/pairs/${type}`);
    return response.data;
  }

  /**
   * Get market summary for all pairs
   * GET /v1/public/marketsummary
   *
   * @returns Array of market summaries
   */
  async getMarketSummary(): Promise<MarketSummary[]> {
    const response = await this.http.get<MarketSummary[]>('/v1/public/marketsummary');
    return response.data;
  }

  /**
   * Get market summary for a specific currency pair
   * GET /v1/public/:currencyPair/marketsummary
   *
   * @param pair - Currency pair (e.g., 'BTCZAR', 'ETHUSDC')
   * @returns Market summary for the pair
   */
  async getMarketSummaryForPair(pair: CurrencyPair): Promise<MarketSummary> {
    const response = await this.http.get<MarketSummary>(`/v1/public/${pair}/marketsummary`);
    return response.data;
  }

  /**
   * Get aggregated order book for a currency pair
   * GET /v1/public/:currencyPair/orderbook
   *
   * @param pair - Currency pair
   * @returns Aggregated order book
   */
  async getOrderBook(pair: CurrencyPair): Promise<OrderBook> {
    const response = await this.http.get<OrderBook>(`/v1/public/${pair}/orderbook`);
    return response.data;
  }

  /**
   * Get full (non-aggregated) order book for a currency pair
   * GET /v1/public/:currencyPair/orderbook/full
   *
   * @param pair - Currency pair
   * @returns Full order book with individual orders
   */
  async getFullOrderBook(pair: CurrencyPair): Promise<OrderBook> {
    const response = await this.http.get<OrderBook>(`/v1/public/${pair}/orderbook/full`);
    return response.data;
  }

  /**
   * Get recent trades for a currency pair
   * GET /v1/public/:currencyPair/trades
   *
   * @param pair - Currency pair
   * @param params - Query parameters (skip, limit, startTime, endTime, beforeId)
   * @returns Array of trades
   */
  async getTradeHistory(pair: CurrencyPair, params?: TradeHistoryParams): Promise<Trade[]> {
    const response = await this.http.get<Trade[]>(`/v1/public/${pair}/trades`, {
      params,
    });
    return response.data;
  }

  /**
   * Get supported order types for all currency pairs
   * GET /v1/public/ordertypes
   *
   * @param params - Query parameters (includeInactivePairs)
   * @returns Array of currency pairs with their supported order types
   */
  async getOrderTypes(params?: OrderTypesParams): Promise<CurrencyPairOrderTypes[]> {
    const response = await this.http.get<CurrencyPairOrderTypes[]>('/v1/public/ordertypes', {
      params,
    });
    return response.data;
  }

  /**
   * Get supported order types for a specific currency pair
   * GET /v1/public/:currencyPair/ordertypes
   *
   * @param pair - Currency pair
   * @returns Array of supported order type strings
   */
  async getOrderTypesForPair(pair: CurrencyPair): Promise<string[]> {
    const response = await this.http.get<string[]>(`/v1/public/${pair}/ordertypes`);
    return response.data;
  }

  /**
   * Get OHLC price buckets for a currency pair
   * GET /v1/public/:currencyPair/buckets
   *
   * @param pair - Currency pair
   * @param params - Query parameters (periodSeconds, startTime, endTime, skip, limit, includeEmpty)
   * @returns Array of price buckets (OHLC data)
   */
  async getPriceBuckets(pair: CurrencyPair, params: PriceBucketsParams): Promise<PriceBucket[]> {
    const response = await this.http.get<PriceBucket[]>(`/v1/public/${pair}/buckets`, {
      params,
    });
    return response.data;
  }

  /**
   * Get mark price buckets for a futures currency pair
   * GET /v1/public/:currencyPair/markprice/buckets
   *
   * @param pair - Currency pair (futures)
   * @param params - Query parameters (periodSeconds, startTime, endTime, skip, limit, includeEmpty)
   * @returns Array of mark price buckets
   */
  async getMarkPriceBuckets(pair: CurrencyPair, params: PriceBucketsParams): Promise<PriceBucket[]> {
    const response = await this.http.get<PriceBucket[]>(`/v1/public/${pair}/markprice/buckets`, {
      params,
    });
    return response.data;
  }

  /**
   * Get futures contracts information
   * GET /v1/public/futures/info
   *
   * @returns Array of futures contract information
   */
  async getFuturesInfo(): Promise<FuturesInfo[]> {
    const response = await this.http.get<FuturesInfo[]>('/v1/public/futures/info');
    return response.data;
  }

  /**
   * Get funding rate history for a futures pair
   * GET /v1/public/futures/funding/history
   *
   * @param pair - Futures currency pair
   * @returns Array of funding rate history
   */
  async getFundingRateHistory(pair: CurrencyPair): Promise<FundingRateHistory[]> {
    const response = await this.http.get<FundingRateHistory[]>('/v1/public/futures/funding/history', {
      params: { currencyPair: pair },
    });
    return response.data;
  }

  /**
   * Get loan information for all currencies
   * GET /v1/public/loans/info
   *
   * @returns Array of loan information
   */
  async getLoanInfo(): Promise<LoanInfo[]> {
    const response = await this.http.get<LoanInfo[]>('/v1/public/loans/info');
    return response.data;
  }

  /**
   * Get available leverage options for a currency pair
   * GET /v1/public/risklimit/:currencypair
   *
   * @param pair - Currency pair
   * @returns Array of leverage options with risk limits
   */
  async getAvailableLeverageOptions(pair: CurrencyPair): Promise<LeverageOption[]> {
    const response = await this.http.get<LeverageOption[]>(`/v1/public/risklimit/${pair}`);
    return response.data;
  }
}
