/**
 * VALR API constants
 */

/**
 * Base URL for VALR API
 */
export const API_BASE_URL = 'https://api.valr.com';

/**
 * WebSocket URLs
 */
export const WS_ACCOUNT_URL = 'wss://api.valr.com/ws/account';
export const WS_TRADE_URL = 'wss://api.valr.com/ws/trade';

/**
 * API rate limits
 */
export const RATE_LIMITS = {
  /** Global rate limit per API key */
  PER_KEY_PER_MINUTE: 2000,
  /** Global rate limit per IP */
  PER_IP_PER_MINUTE: 1200,
  /** WebSocket new connections per minute */
  WS_CONNECTIONS_PER_MINUTE: 60,
  /** Specific endpoint limits (per second) */
  ENDPOINTS: {
    PUBLIC_TIME: 20,
    PUBLIC_STATUS: 20,
    PUBLIC_BUCKETS: 20,
    BATCH_ORDERS: 400,
    DELETE_ORDERS: 450,
    POST_ORDERS: 400,
    MODIFY_ORDERS: 400,
    LOANS: 1,
    CREATE_SUBACCOUNT: 1,
    SUBACCOUNT_TRANSFER: 20,
  },
} as const;

/**
 * HTTP request headers
 */
export const HEADERS = {
  API_KEY: 'X-VALR-API-KEY',
  SIGNATURE: 'X-VALR-SIGNATURE',
  TIMESTAMP: 'X-VALR-TIMESTAMP',
  SUB_ACCOUNT_ID: 'X-VALR-SUB-ACCOUNT-ID',
  CONTENT_TYPE: 'Content-Type',
  RATE_LIMITED: 'x-valr-ratelimited',
} as const;

/**
 * API content type
 */
export const CONTENT_TYPE_JSON = 'application/json';

/**
 * API version prefixes
 */
export const API_VERSION = {
  V1: '/v1',
  V2: '/v2',
} as const;
