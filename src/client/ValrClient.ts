import { HttpClient } from '../utils/http';
import { RequestSigner } from '../auth/RequestSigner';
import { ValrConfigurationError } from '../errors/ValrError';
import { HEADERS } from '../utils/constants';
import { PublicAPI } from '../api/public';
import { AccountAPI } from '../api/account';
import { TradingAPI } from '../api/trading';
import { WalletsAPI } from '../api/wallets';
import { FuturesAPI } from '../api/futures';
import { MarginAPI } from '../api/margin';
import { LoansAPI } from '../api/loans';
import { StakeAPI } from '../api/stake';
import { PayAPI } from '../api/pay';
import { BundlesAPI } from '../api/bundles';
import { HealthAPI } from '../api/health';

/**
 * Configuration for ValrClient
 */
export interface ValrClientConfig {
  /**
   * API key (required for authenticated endpoints)
   */
  apiKey?: string;

  /**
   * API secret (required for authenticated endpoints)
   */
  apiSecret?: string;

  /**
   * Base URL for API (defaults to https://api.valr.com)
   */
  baseURL?: string;

  /**
   * Request timeout in milliseconds (defaults to 30000)
   */
  timeout?: number;

  /**
   * Subaccount ID for impersonating a subaccount (optional)
   */
  subaccountId?: string;
}

/**
 * Main VALR API client
 *
 * @example
 * ```typescript
 * // For public endpoints only (no authentication)
 * const client = new ValrClient();
 * const time = await client.public.getServerTime();
 *
 * // For authenticated endpoints
 * const client = new ValrClient({
 *   apiKey: 'your-api-key',
 *   apiSecret: 'your-api-secret',
 * });
 * const balances = await client.account.getBalances();
 * ```
 */
export class ValrClient {
  private http: HttpClient;
  private apiKey?: string;
  private apiSecret?: string;
  private subaccountId?: string;

  /**
   * Public API methods (no authentication required)
   */
  public readonly public: PublicAPI;

  /**
   * Account API methods (requires authentication)
   */
  public readonly account: AccountAPI;

  /**
   * Trading API methods (requires authentication with trade permission)
   */
  public readonly trading: TradingAPI;

  /**
   * Wallets API methods (requires authentication)
   */
  public readonly wallets: WalletsAPI;

  /**
   * Futures API methods (requires authentication)
   */
  public readonly futures: FuturesAPI;

  /**
   * Margin API methods (requires authentication)
   */
  public readonly margin: MarginAPI;

  /**
   * Loans API methods (requires authentication)
   */
  public readonly loans: LoansAPI;

  /**
   * Staking/Earn API methods (requires authentication)
   */
  public readonly stake: StakeAPI;

  /**
   * Pay API methods (requires authentication)
   */
  public readonly pay: PayAPI;

  /**
   * Bundles API methods (requires authentication)
   */
  public readonly bundles: BundlesAPI;

  /**
   * Health API methods
   */
  public readonly health: HealthAPI;

  /**
   * Create a new VALR API client
   *
   * @param config - Client configuration
   */
  constructor(config: ValrClientConfig = {}) {
    const { apiKey, apiSecret, baseURL, timeout, subaccountId } = config;

    // Validate credentials if provided
    if ((apiKey && !apiSecret) || (!apiKey && apiSecret)) {
      throw new ValrConfigurationError(
        'Both apiKey and apiSecret must be provided together'
      );
    }

    if (apiKey && apiSecret) {
      RequestSigner.validateCredentials(apiKey, apiSecret);
    }

    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.subaccountId = subaccountId;

    // Initialize HTTP client
    this.http = new HttpClient({
      baseURL,
      timeout,
    });

    // Add request interceptor for authentication
    this.http.getInstance().interceptors.request.use((config) => {
      // Only add auth headers for authenticated requests
      if (this.apiKey && this.apiSecret) {
        const timestamp = RequestSigner.getTimestamp();
        const method = config.method?.toUpperCase() || 'GET';
        let url = config.url || '';
        const body = config.data ? JSON.stringify(config.data) : '';

        // Include query parameters in the signature path
        if (config.params) {
          // Build query string WITHOUT encoding to match what Axios sends
          // and what VALR expects in the signature
          const queryParts: string[] = [];
          Object.keys(config.params).sort().forEach(key => {
            const value = config.params[key];
            if (value !== undefined && value !== null) {
              // Don't URL encode - use raw values
              queryParts.push(`${key}=${value}`);
            }
          });
          if (queryParts.length > 0) {
            url = `${url}?${queryParts.join('&')}`;
          }

          // Update config.url with the query string and clear params
          // so Axios uses our exact URL instead of building its own query string
          config.url = url;
          delete config.params;
        }

        const signature = RequestSigner.signRequest({
          apiSecret: this.apiSecret,
          timestamp,
          verb: method,
          path: url,
          body,
          subaccountId: this.subaccountId,
        });

        // Add authentication headers
        config.headers[HEADERS.API_KEY] = this.apiKey;
        config.headers[HEADERS.SIGNATURE] = signature;
        config.headers[HEADERS.TIMESTAMP] = timestamp.toString();

        // Add subaccount header if provided
        if (this.subaccountId) {
          config.headers[HEADERS.SUB_ACCOUNT_ID] = this.subaccountId;
        }
      }

      return config;
    });

    // Initialize API groups
    this.public = new PublicAPI(this.http);
    this.account = new AccountAPI(this.http);
    this.trading = new TradingAPI(this.http);
    this.wallets = new WalletsAPI(this.http);
    this.futures = new FuturesAPI(this.http);
    this.margin = new MarginAPI(this.http);
    this.loans = new LoansAPI(this.http);
    this.stake = new StakeAPI(this.http);
    this.pay = new PayAPI(this.http);
    this.bundles = new BundlesAPI(this.http);
    this.health = new HealthAPI(this.http);
  }

  /**
   * Update subaccount ID for impersonation
   *
   * @param subaccountId - Subaccount ID (or undefined to clear)
   */
  setSubaccountId(subaccountId?: string): void {
    this.subaccountId = subaccountId;
  }

  /**
   * Get current subaccount ID
   *
   * @returns Current subaccount ID or undefined
   */
  getSubaccountId(): string | undefined {
    return this.subaccountId;
  }
}
