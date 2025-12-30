import type { HttpClient } from '../utils/http';
import type {
  MarginInfoV1,
  MarginInfoV2,
  AccountMarginStatus,
  EnableMarginRequest,
  LeverageInfo,
  UpdateLeverageRequest,
  CurrencyPair,
} from '../types';

/**
 * Margin API methods (requires authentication)
 *
 * Provides methods for managing margin trading, leverage, and account status.
 */
export class MarginAPI {
  constructor(private http: HttpClient) {}

  /**
   * Get margin information (V1)
   *
   * Returns detailed margin account information including collateral and borrowing.
   *
   * @returns Promise resolving to margin information
   *
   * @example
   * ```typescript
   * const marginInfo = await client.margin.getMarginInfo();
   * console.log('Available margin:', marginInfo.availableInReference);
   * ```
   */
  async getMarginInfo(): Promise<MarginInfoV1> {
    const response = await this.http.get<MarginInfoV1>('/v1/margin/status');
    return response.data;
  }

  /**
   * Get margin information (V2)
   *
   * Returns detailed margin account information with additional fields.
   *
   * @returns Promise resolving to margin information
   *
   * @example
   * ```typescript
   * const marginInfo = await client.margin.getMarginInfoV2();
   * console.log('Trade reserved:', marginInfo.tradeReservedInReference);
   * ```
   */
  async getMarginInfoV2(): Promise<MarginInfoV2> {
    const response = await this.http.get<MarginInfoV2>('/v2/margin/status');
    return response.data;
  }

  /**
   * Get account margin status
   *
   * Returns whether margin and futures trading are enabled for the account.
   *
   * @returns Promise resolving to account margin status
   *
   * @example
   * ```typescript
   * const status = await client.margin.getAccountStatus();
   * console.log('Margin enabled:', status.marginEnabled);
   * console.log('In liquidation:', status.inLiquidation);
   * ```
   */
  async getAccountStatus(): Promise<AccountMarginStatus> {
    const response = await this.http.get<AccountMarginStatus>('/v1/margin/account/status');
    return response.data;
  }

  /**
   * Enable or disable margin/futures trading
   *
   * @param request - Enable/disable request
   * @returns Promise resolving to updated account status
   *
   * @example
   * ```typescript
   * // Enable margin trading
   * await client.margin.updateAccountStatus({
   *   accountStatusFieldName: 'MARGIN_ENABLED',
   *   enabled: true
   * });
   *
   * // Enable futures trading
   * await client.margin.updateAccountStatus({
   *   accountStatusFieldName: 'FUTURES_ENABLED',
   *   enabled: true
   * });
   * ```
   */
  async updateAccountStatus(request: EnableMarginRequest): Promise<AccountMarginStatus> {
    const response = await this.http.put<AccountMarginStatus>('/v1/margin/account/status', request);
    return response.data;
  }

  /**
   * Get leverage information for a currency pair
   *
   * @param currencyPair - Currency pair (e.g., 'BTCUSDTPERP')
   * @returns Promise resolving to leverage information
   *
   * @example
   * ```typescript
   * const leverage = await client.margin.getLeverageInfo('BTCUSDTPERP');
   * console.log('Current leverage:', leverage.leverageMultiple);
   * console.log('Risk limit:', leverage.riskLimit);
   * ```
   */
  async getLeverageInfo(currencyPair: CurrencyPair): Promise<LeverageInfo> {
    const response = await this.http.get<LeverageInfo>(`/v1/margin/leverage/${currencyPair}`);
    return response.data;
  }

  /**
   * Update leverage for a currency pair
   *
   * @param currencyPair - Currency pair (e.g., 'BTCUSDTPERP')
   * @param request - Update leverage request
   * @returns Promise resolving to updated leverage information
   *
   * @example
   * ```typescript
   * const updated = await client.margin.updateLeverage('BTCUSDTPERP', {
   *   leverageMultiple: 10
   * });
   * console.log('New leverage:', updated.leverageMultiple);
   * ```
   */
  async updateLeverage(currencyPair: CurrencyPair, request: UpdateLeverageRequest): Promise<LeverageInfo> {
    const response = await this.http.put<LeverageInfo>(`/v1/margin/leverage/${currencyPair}`, request);
    return response.data;
  }
}
