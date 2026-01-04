import type { HttpClient } from '../utils/http';
import type {
  Balance,
  Transaction,
  AccountTrade,
  TradeFee,
  Subaccount,
  ApiKey,
  BalancesParams,
  TransactionHistoryParams,
  TradeHistoryParams as AccountTradeHistoryParams,
  CreateApiKeyRequest,
  CreateApiKeyResponse,
  CreateSubaccountRequest,
  TransferRequest,
  CurrencyPair,
} from '../types';

/**
 * Account API methods (requires authentication)
 */
export class AccountAPI {
  constructor(private http: HttpClient) {}

  /**
   * Get account balances for all currencies
   * GET /v1/account/balances
   *
   * @param params - Query parameters (excludeZeroBalances)
   * @returns Array of currency balances
   */
  async getBalances(params?: BalancesParams): Promise<Balance[]> {
    const response = await this.http.get<Balance[]>('/v1/account/balances', {
      params,
    });
    return response.data;
  }

  /**
   * Get transaction history
   * GET /v1/account/transactionhistory
   *
   * @param params - Query parameters (skip, limit, beforeId, transactionTypes, currency, startTime, endTime)
   * @returns Array of transactions
   */
  async getTransactionHistory(params?: TransactionHistoryParams): Promise<Transaction[]> {
    const response = await this.http.get<Transaction[]>('/v1/account/transactionhistory', {
      params: params ? {
        ...params,
        transactionTypes: params.transactionTypes?.join(','),
      } : undefined,
    });
    return response.data;
  }

  /**
   * Get trade history for all currency pairs
   * GET /v1/account/tradehistory
   *
   * @param params - Query parameters (skip, limit)
   * @returns Array of account trades
   */
  async getTradeHistory(params?: AccountTradeHistoryParams): Promise<AccountTrade[]> {
    const response = await this.http.get<AccountTrade[]>('/v1/account/tradehistory', {
      params,
    });
    return response.data;
  }

  /**
   * Get trade history for a specific currency pair
   * GET /v1/account/:currencyPair/tradehistory
   *
   * @param pair - Currency pair
   * @param params - Query parameters (skip, limit)
   * @returns Array of account trades for the pair
   */
  async getTradeHistoryForPair(pair: CurrencyPair, params?: AccountTradeHistoryParams): Promise<AccountTrade[]> {
    const response = await this.http.get<AccountTrade[]>(`/v1/account/${pair}/tradehistory`, {
      params,
    });
    return response.data;
  }

  /**
   * Get trading fees for all currency pairs
   * GET /v1/account/fees/trade
   *
   * @returns Array of trading fees per currency pair
   */
  async getTradeFees(): Promise<TradeFee[]> {
    const response = await this.http.get<TradeFee[]>('/v1/account/fees/trade');
    return response.data;
  }

  /**
   * Get list of subaccounts
   * GET /v1/account/subaccounts
   *
   * @returns Array of subaccounts
   */
  async getSubaccounts(): Promise<Subaccount[]> {
    const response = await this.http.get<Subaccount[]>('/v1/account/subaccounts');
    return response.data;
  }

  /**
   * Create a new subaccount
   * POST /v1/account/subaccount
   *
   * @param request - Subaccount creation request
   * @returns Created subaccount
   */
  async createSubaccount(request: CreateSubaccountRequest): Promise<Subaccount> {
    const response = await this.http.post<Subaccount>('/v1/account/subaccount', request);
    return response.data;
  }

  /**
   * Transfer funds between primary account and subaccounts
   * POST /v1/account/subaccount/transfer
   *
   * @param request - Transfer request
   * @returns Transfer confirmation
   */
  async transferBetweenAccounts(request: TransferRequest): Promise<{ success: boolean }> {
    const response = await this.http.post<{ success: boolean }>('/v1/account/subaccounts/transfer', request);
    return response.data;
  }

  /**
   * Get list of API keys
   * GET /v1/account/api-keys
   *
   * @returns Array of API keys
   */
  async getApiKeys(): Promise<ApiKey[]> {
    const response = await this.http.get<ApiKey[]>('/v1/account/api-keys');
    return response.data;
  }

  /**
   * Create a new API key
   * POST /v1/account/api-keys
   *
   * @param request - API key creation request
   * @returns Created API key with secret (SAVE THE SECRET - only returned once!)
   */
  async createApiKey(request: CreateApiKeyRequest): Promise<CreateApiKeyResponse> {
    const response = await this.http.post<CreateApiKeyResponse>('/v1/account/api-keys', request);
    return response.data;
  }

  /**
   * Delete an API key
   * DELETE /v1/account/api-keys/:keyId
   *
   * @param keyId - API key ID to delete
   * @returns Deletion confirmation
   */
  async deleteApiKey(keyId: string): Promise<{ success: boolean }> {
    const response = await this.http.delete<{ success: boolean }>(`/v1/account/api-keys/${keyId}`);
    return response.data;
  }
}
