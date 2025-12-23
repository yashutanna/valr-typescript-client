import { createHmac } from 'crypto';

/**
 * Request signing configuration
 */
export interface SignRequestParams {
  /** API secret key for HMAC signing */
  apiSecret: string;
  /** Unix timestamp in milliseconds */
  timestamp: number;
  /** HTTP verb (GET, POST, PUT, DELETE, etc.) */
  verb: string;
  /** Request path (including query string, excluding host) */
  path: string;
  /** Request body as string (optional, empty string if no body) */
  body?: string;
  /** Subaccount ID (optional, for subaccount impersonation) */
  subaccountId?: string;
}

/**
 * Request signer for VALR API authentication
 * Implements HMAC SHA512 signature generation as per VALR API specification
 */
export class RequestSigner {
  /**
   * Generate HMAC SHA512 signature for VALR API request
   *
   * Signature is computed from concatenation of:
   * timestamp + verb + path + body + subaccountId
   *
   * @param params - Request signing parameters
   * @returns Hex-encoded HMAC SHA512 signature
   *
   * @example
   * ```typescript
   * const signature = RequestSigner.signRequest({
   *   apiSecret: 'your-api-secret',
   *   timestamp: Date.now(),
   *   verb: 'GET',
   *   path: '/v1/account/balances',
   * });
   * ```
   */
  static signRequest(params: SignRequestParams): string {
    const {
      apiSecret,
      timestamp,
      verb,
      path,
      body = '',
      subaccountId = '',
    } = params;

    // Concatenate all parameters in the required order
    const payload = `${timestamp}${verb.toUpperCase()}${path}${body}${subaccountId}`;

    // Create HMAC SHA512 hash
    const hmac = createHmac('sha512', apiSecret);
    hmac.update(payload);

    // Return hex-encoded signature
    return hmac.digest('hex');
  }

  /**
   * Get current timestamp in milliseconds
   *
   * @returns Unix timestamp in milliseconds
   */
  static getTimestamp(): number {
    return Date.now();
  }

  /**
   * Validate API credentials
   *
   * @param apiKey - API key
   * @param apiSecret - API secret
   * @throws Error if credentials are invalid
   */
  static validateCredentials(apiKey: string, apiSecret: string): void {
    if (!apiKey || typeof apiKey !== 'string') {
      throw new Error('Invalid API key: must be a non-empty string');
    }

    if (!apiSecret || typeof apiSecret !== 'string') {
      throw new Error('Invalid API secret: must be a non-empty string');
    }

    // VALR API keys and secrets are 64 characters long
    if (apiKey.length !== 64) {
      throw new Error('Invalid API key: must be 64 characters long');
    }

    if (apiSecret.length !== 64) {
      throw new Error('Invalid API secret: must be 64 characters long');
    }

    // Validate hex format (only alphanumeric characters)
    const hexRegex = /^[a-f0-9]+$/i;
    if (!hexRegex.test(apiKey)) {
      throw new Error('Invalid API key: must be hexadecimal');
    }

    if (!hexRegex.test(apiSecret)) {
      throw new Error('Invalid API secret: must be hexadecimal');
    }
  }
}
