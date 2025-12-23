/**
 * VALR TypeScript API Client
 *
 * A complete TypeScript implementation of the VALR cryptocurrency exchange API
 * with full type safety, comprehensive endpoint coverage, and WebSocket support.
 *
 * @packageDocumentation
 */

// Export main client
export { ValrClient, ValrClientConfig } from './client/ValrClient';

// Export WebSocket clients
export { AccountWebSocket } from './client/AccountWebSocket';
export { TradeWebSocket } from './client/TradeWebSocket';
export type { WebSocketClientConfig } from './client/ValrWebSocketClient';

// Export API classes (for advanced usage)
export { PublicAPI } from './api/public';
export { AccountAPI } from './api/account';
export { TradingAPI } from './api/trading';
export { WalletsAPI } from './api/wallets';
export { FuturesAPI } from './api/futures';
export { MarginAPI } from './api/margin';
export { LoansAPI } from './api/loans';
export { StakeAPI } from './api/stake';
export { PayAPI } from './api/pay';
export { BundlesAPI } from './api/bundles';
export { HealthAPI } from './api/health';

// Export all types
export * from './types';

// Export errors
export {
  ValrError,
  ValrAuthenticationError,
  ValrRateLimitError,
  ValrValidationError,
  ValrApiError,
  ValrWebSocketError,
  ValrConfigurationError,
} from './errors/ValrError';

// Export utilities
export { RequestSigner } from './auth/RequestSigner';

// Export constants
export {
  API_BASE_URL,
  WS_ACCOUNT_URL,
  WS_TRADE_URL,
  RATE_LIMITS,
  HEADERS,
} from './utils/constants';
