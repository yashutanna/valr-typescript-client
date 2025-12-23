/**
 * Base error class for all VALR API errors
 */
export class ValrError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValrError';
    Object.setPrototypeOf(this, ValrError.prototype);
  }
}

/**
 * Error thrown when API authentication fails
 */
export class ValrAuthenticationError extends ValrError {
  constructor(message: string = 'Authentication failed') {
    super(message);
    this.name = 'ValrAuthenticationError';
    Object.setPrototypeOf(this, ValrAuthenticationError.prototype);
  }
}

/**
 * Error thrown when API rate limit is exceeded
 */
export class ValrRateLimitError extends ValrError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message);
    this.name = 'ValrRateLimitError';
    Object.setPrototypeOf(this, ValrRateLimitError.prototype);
  }
}

/**
 * Error thrown when API request validation fails
 */
export class ValrValidationError extends ValrError {
  public readonly errors?: Record<string, string[]>;

  constructor(message: string, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'ValrValidationError';
    this.errors = errors;
    Object.setPrototypeOf(this, ValrValidationError.prototype);
  }
}

/**
 * Error thrown when API request fails due to network or server error
 */
export class ValrApiError extends ValrError {
  public readonly statusCode?: number;
  public readonly response?: unknown;

  constructor(message: string, statusCode?: number, response?: unknown) {
    super(message);
    this.name = 'ValrApiError';
    this.statusCode = statusCode;
    this.response = response;
    Object.setPrototypeOf(this, ValrApiError.prototype);
  }
}

/**
 * Error thrown when WebSocket connection fails
 */
export class ValrWebSocketError extends ValrError {
  constructor(message: string) {
    super(message);
    this.name = 'ValrWebSocketError';
    Object.setPrototypeOf(this, ValrWebSocketError.prototype);
  }
}

/**
 * Error thrown when required configuration is missing
 */
export class ValrConfigurationError extends ValrError {
  constructor(message: string) {
    super(message);
    this.name = 'ValrConfigurationError';
    Object.setPrototypeOf(this, ValrConfigurationError.prototype);
  }
}
