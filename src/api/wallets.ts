import type { HttpClient } from '../utils/http';
import type {
  DepositAddress,
  CryptoDepositHistoryParams,
  CryptoDepositHistoryItem,
  WhitelistedAddress,
  WithdrawalConfigInfo,
  CryptoWithdrawalRequest,
  CryptoWithdrawalResponse,
  CryptoWithdrawalStatus,
  CryptoWithdrawalHistoryParams,
  CryptoWithdrawalHistoryItem,
  ServiceProvider,
  Bank,
  BankAccount,
  LinkBankAccountRequest,
  FiatDepositReference,
  AutoBuyDepositReference,
  FiatWithdrawalRequest,
  FiatWithdrawalResponse,
  CurrencyCode,
} from '../types';

/**
 * Wallets API methods (requires authentication)
 *
 * Provides methods for managing crypto and fiat wallets,
 * including deposits, withdrawals, and account management.
 */
export class WalletsAPI {
  constructor(private http: HttpClient) {}

  // ===== Crypto Wallet Methods =====

  /**
   * Get deposit address for a currency
   *
   * @param currencyCode - Currency code
   * @param networkType - Optional network type
   * @returns Promise resolving to deposit address
   *
   * @example
   * ```typescript
   * const address = await client.wallets.getCryptoDepositAddress('BTC');
   * console.log('Deposit to:', address.address);
   * ```
   */
  async getCryptoDepositAddress(
    currencyCode: CurrencyCode,
    networkType?: string
  ): Promise<DepositAddress> {
    const response = await this.http.get<DepositAddress>(
      `/v1/wallet/crypto/${currencyCode}/deposit/address`,
      { params: networkType ? { networkType } : undefined }
    );
    return response.data;
  }

  /**
   * Get crypto deposit history
   *
   * @param params - Optional query parameters for filtering
   * @returns Promise resolving to array of deposit history items
   *
   * @example
   * ```typescript
   * const deposits = await client.wallets.getCryptoDepositHistory({
   *   skip: 0,
   *   limit: 100,
   *   currency: 'BTC',
   *   startTime: '2025-01-01T00:00:00Z',
   *   endTime: '2025-01-31T23:59:59Z'
   * });
   * ```
   */
  async getCryptoDepositHistory(
    params?: CryptoDepositHistoryParams
  ): Promise<CryptoDepositHistoryItem[]> {
    const response = await this.http.get<CryptoDepositHistoryItem[]>(
      '/v1/wallet/crypto/deposit/history',
      { params }
    );
    return response.data;
  }

  /**
   * Get whitelisted withdrawal address book
   *
   * @returns Promise resolving to array of whitelisted addresses
   *
   * @example
   * ```typescript
   * const addresses = await client.wallets.getWhitelistedAddresses();
   * ```
   */
  async getWhitelistedAddresses(): Promise<WhitelistedAddress[]> {
    const response = await this.http.get<WhitelistedAddress[]>(
      '/v1/wallet/crypto/address-book'
    );
    return response.data;
  }

  /**
   * Get whitelisted withdrawal addresses for a specific currency
   *
   * @param currencyCode - Currency code
   * @returns Promise resolving to array of whitelisted addresses for that currency
   *
   * @example
   * ```typescript
   * const btcAddresses = await client.wallets.getWhitelistedAddressesByCurrency('BTC');
   * ```
   */
  async getWhitelistedAddressesByCurrency(
    currencyCode: CurrencyCode
  ): Promise<WhitelistedAddress[]> {
    const response = await this.http.get<WhitelistedAddress[]>(
      `/v1/wallet/crypto/address-book/${currencyCode}`
    );
    return response.data;
  }

  /**
   * Get withdrawal configuration info for a currency
   *
   * Returns withdrawal limits and fees.
   *
   * @param currencyCode - Currency code
   * @returns Promise resolving to withdrawal config info
   *
   * @example
   * ```typescript
   * const config = await client.wallets.getCryptoWithdrawalInfo('ETH');
   * console.log('Fee:', config.withdrawalFee);
   * ```
   */
  async getCryptoWithdrawalInfo(currencyCode: CurrencyCode): Promise<WithdrawalConfigInfo> {
    const response = await this.http.get<WithdrawalConfigInfo>(
      `/v1/wallet/crypto/${currencyCode}/withdraw`
    );
    return response.data;
  }

  /**
   * Withdraw cryptocurrency
   *
   * @param request - Withdrawal request parameters
   * @returns Promise resolving to withdrawal response
   *
   * @example
   * ```typescript
   * const withdrawal = await client.wallets.withdrawCrypto({
   *   currency: 'BTC',
   *   amount: '0.1',
   *   address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'
   * });
   * ```
   */
  async withdrawCrypto(request: CryptoWithdrawalRequest): Promise<CryptoWithdrawalResponse> {
    const response = await this.http.post<CryptoWithdrawalResponse>(
      `/v1/wallet/crypto/${request.currency}/withdraw`,
      request
    );
    return response.data;
  }

  /**
   * Get withdrawal status
   *
   * @param currencyCode - Currency code
   * @param withdrawId - Withdrawal ID
   * @returns Promise resolving to withdrawal status
   *
   * @example
   * ```typescript
   * const status = await client.wallets.getCryptoWithdrawalStatus('BTC', 'withdraw-id-123');
   * console.log('Status:', status.status);
   * ```
   */
  async getCryptoWithdrawalStatus(
    currencyCode: CurrencyCode,
    withdrawId: string
  ): Promise<CryptoWithdrawalStatus> {
    const response = await this.http.get<CryptoWithdrawalStatus>(
      `/v1/wallet/crypto/${currencyCode}/withdraw/${withdrawId}`
    );
    return response.data;
  }

  /**
   * Get supported service providers
   *
   * Returns list of supported crypto service providers.
   *
   * @returns Promise resolving to array of service providers
   *
   * @example
   * ```typescript
   * const providers = await client.wallets.getServiceProviders();
   * ```
   */
  async getServiceProviders(): Promise<ServiceProvider[]> {
    const response = await this.http.get<ServiceProvider[]>(
      '/v1/wallet/crypto/service-providers'
    );
    return response.data;
  }

  /**
   * Get crypto withdrawal history
   *
   * @param params - Optional query parameters
   * @returns Promise resolving to array of withdrawal history items
   *
   * @example
   * ```typescript
   * const history = await client.wallets.getCryptoWithdrawalHistory({ skip: 0, limit: 100 });
   * ```
   */
  async getCryptoWithdrawalHistory(
    params?: CryptoWithdrawalHistoryParams
  ): Promise<CryptoWithdrawalHistoryItem[]> {
    const response = await this.http.get<CryptoWithdrawalHistoryItem[]>(
      '/v1/wallet/crypto/withdraw/history',
      { params }
    );
    return response.data;
  }

  // ===== Fiat Wallet Methods =====

  /**
   * Add/link a bank account
   *
   * @param currencyCode - Currency code (e.g., 'ZAR')
   * @param request - Bank account details
   * @returns Promise resolving to created bank account
   *
   * @example
   * ```typescript
   * const account = await client.wallets.addBankAccount('ZAR', {
   *   bank: 'FNB',
   *   accountHolder: 'John Doe',
   *   accountNumber: '62792461544',
   *   branchCode: '250655',
   *   accountType: 'Current/Cheque'
   * });
   * ```
   */
  async addBankAccount(
    currencyCode: CurrencyCode,
    request: LinkBankAccountRequest
  ): Promise<BankAccount> {
    const response = await this.http.post<BankAccount>(
      `/v1/wallet/fiat/${currencyCode}/accounts`,
      request
    );
    return response.data;
  }

  /**
   * Get bank account details
   *
   * @param currencyCode - Currency code
   * @param accountId - Bank account ID
   * @returns Promise resolving to bank account details
   *
   * @example
   * ```typescript
   * const account = await client.wallets.getBankAccount('ZAR', 'account-id-123');
   * ```
   */
  async getBankAccount(currencyCode: CurrencyCode, accountId: string): Promise<BankAccount> {
    const response = await this.http.get<BankAccount>(
      `/v1/wallet/fiat/${currencyCode}/accounts/${accountId}`
    );
    return response.data;
  }

  /**
   * Get all linked bank accounts
   *
   * @param currencyCode - Currency code
   * @returns Promise resolving to array of bank accounts
   *
   * @example
   * ```typescript
   * const accounts = await client.wallets.getBankAccounts('ZAR');
   * ```
   */
  async getBankAccounts(currencyCode: CurrencyCode): Promise<BankAccount[]> {
    const response = await this.http.get<BankAccount[]>(
      `/v1/wallet/fiat/${currencyCode}/accounts`
    );
    return response.data;
  }

  /**
   * Delete a bank account
   *
   * @param currencyCode - Currency code
   * @param accountId - Bank account ID
   * @returns Promise that resolves when account is deleted
   *
   * @example
   * ```typescript
   * await client.wallets.deleteBankAccount('ZAR', 'account-id-123');
   * ```
   */
  async deleteBankAccount(currencyCode: CurrencyCode, accountId: string): Promise<void> {
    await this.http.delete(`/v1/wallet/fiat/${currencyCode}/accounts/${accountId}`);
  }

  /**
   * Get list of supported banks for a currency
   *
   * @param currencyCode - Currency code
   * @returns Promise resolving to array of banks
   *
   * @example
   * ```typescript
   * const banks = await client.wallets.getBanks('ZAR');
   * banks.forEach(bank => {
   *   console.log(`${bank.displayName} (${bank.code})`);
   * });
   * ```
   */
  async getBanks(currencyCode: CurrencyCode): Promise<Bank[]> {
    const response = await this.http.get<Bank[]>(`/v1/wallet/fiat/${currencyCode}/banks`);
    return response.data;
  }

  /**
   * Get fiat deposit reference
   *
   * Returns your unique deposit reference for depositing fiat currency.
   *
   * @param currencyCode - Currency code
   * @returns Promise resolving to deposit reference
   *
   * @example
   * ```typescript
   * const ref = await client.wallets.getFiatDepositReference('ZAR');
   * console.log('Use reference:', ref.reference);
   * ```
   */
  async getFiatDepositReference(currencyCode: CurrencyCode): Promise<FiatDepositReference> {
    const response = await this.http.get<FiatDepositReference>(
      `/v1/wallet/fiat/${currencyCode}/deposit/reference`
    );
    return response.data;
  }

  /**
   * Get auto-buy deposit reference
   *
   * Returns a deposit reference that will automatically convert fiat to crypto.
   *
   * @param currencyCode - Fiat currency code (e.g., 'ZAR')
   * @param buyCurrencySymbol - Crypto currency to auto-buy (e.g., 'BTC')
   * @returns Promise resolving to auto-buy deposit reference
   *
   * @example
   * ```typescript
   * const ref = await client.wallets.getAutoBuyDepositReference('ZAR', 'BTC');
   * console.log('Deposit ZAR with this reference to auto-buy BTC:', ref.reference);
   * ```
   */
  async getAutoBuyDepositReference(
    currencyCode: CurrencyCode,
    buyCurrencySymbol: CurrencyCode
  ): Promise<AutoBuyDepositReference> {
    const response = await this.http.get<AutoBuyDepositReference>(
      `/v1/wallet/fiat/${currencyCode}/deposit/reference/${buyCurrencySymbol}`
    );
    return response.data;
  }

  /**
   * Get supported auto-buy currencies
   *
   * Returns which crypto currencies can be auto-bought with the specified fiat currency.
   *
   * @param currencyCode - Fiat currency code
   * @returns Promise resolving to array of supported currency codes
   *
   * @example
   * ```typescript
   * const currencies = await client.wallets.getAutoBuyCurrencies('ZAR');
   * currencies.forEach(code => {
   *   console.log(`Supports auto-buy for: ${code}`);
   * });
   * ```
   */
  async getAutoBuyCurrencies(currencyCode: CurrencyCode): Promise<CurrencyCode[]> {
    const response = await this.http.get<CurrencyCode[]>(
      `/v1/wallet/fiat/${currencyCode}/auto-buy`
    );
    return response.data;
  }

  /**
   * Withdraw fiat currency
   *
   * @param request - Withdrawal request parameters
   * @returns Promise resolving to withdrawal response
   *
   * @example
   * ```typescript
   * const withdrawal = await client.wallets.withdrawFiat({
   *   currency: 'ZAR',
   *   amount: '1000',
   *   linkedBankAccountId: 'account-id-123',
   *   fast: true
   * });
   * ```
   */
  async withdrawFiat(request: FiatWithdrawalRequest): Promise<FiatWithdrawalResponse> {
    const response = await this.http.post<FiatWithdrawalResponse>(
      `/v1/wallet/fiat/${request.currency}/withdraw`,
      request
    );
    return response.data;
  }
}
