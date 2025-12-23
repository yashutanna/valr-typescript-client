import type { HttpClient } from '../utils/http';
import type {
  DepositAddress,
  CryptoWithdrawalRequest,
  CryptoWithdrawalResponse,
  CryptoWithdrawalStatus,
  BankAccount,
  LinkBankAccountRequest,
  FiatWithdrawalRequest,
  FiatWithdrawalResponse,
  FiatDepositReference,
  CurrencyCode,
} from '../types';

/**
 * Wallets API methods (requires authentication)
 */
export class WalletsAPI {
  constructor(private http: HttpClient) {}

  // Crypto wallet methods
  async getCryptoDepositAddress(currency: CurrencyCode, networkType?: string): Promise<DepositAddress> {
    const response = await this.http.get<DepositAddress>(`/v1/wallet/crypto/${currency}/deposit/address`, {
      params: networkType ? { networkType } : undefined,
    });
    return response.data;
  }

  async withdrawCrypto(request: CryptoWithdrawalRequest): Promise<CryptoWithdrawalResponse> {
    const response = await this.http.post<CryptoWithdrawalResponse>(
      `/v1/wallet/crypto/${request.currency}/withdraw`,
      request
    );
    return response.data;
  }

  async getCryptoWithdrawalStatus(currency: CurrencyCode, withdrawalId: string): Promise<CryptoWithdrawalStatus> {
    const response = await this.http.get<CryptoWithdrawalStatus>(
      `/v1/wallet/crypto/${currency}/withdraw/${withdrawalId}`
    );
    return response.data;
  }

  // Fiat wallet methods
  async getBankAccounts(currency: CurrencyCode): Promise<BankAccount[]> {
    const response = await this.http.get<BankAccount[]>(`/v1/wallet/fiat/${currency}/accounts`);
    return response.data;
  }

  async linkBankAccount(currency: CurrencyCode, request: LinkBankAccountRequest): Promise<BankAccount> {
    const response = await this.http.post<BankAccount>(`/v1/wallet/fiat/${currency}/accounts`, request);
    return response.data;
  }

  async withdrawFiat(request: FiatWithdrawalRequest): Promise<FiatWithdrawalResponse> {
    const response = await this.http.post<FiatWithdrawalResponse>(
      `/v1/wallet/fiat/${request.currency}/withdraw`,
      request
    );
    return response.data;
  }

  async getFiatDepositReference(currency: CurrencyCode): Promise<FiatDepositReference> {
    const response = await this.http.get<FiatDepositReference>(`/v1/wallet/fiat/${currency}/deposit`);
    return response.data;
  }
}
