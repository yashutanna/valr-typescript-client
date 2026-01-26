import {
  ValrApiError,
  ValrAuthenticationError,
  ValrRateLimitError,
  ValrValidationError,
} from '../errors/ValrError';
import { API_BASE_URL, CONTENT_TYPE_JSON, HEADERS } from './constants';

/**
 * HTTP client configuration
 */
export interface HttpClientConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

/**
 * Request configuration (similar to AxiosRequestConfig for compatibility)
 */
export interface RequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, any>;
  signal?: AbortSignal;
  /** Request body data (for DELETE with body) */
  data?: any;
}

/**
 * Internal request configuration used by interceptors
 */
export interface InternalRequestConfig {
  method: string;
  url: string;
  headers: Record<string, string>;
  params?: Record<string, any>;
  data?: any;
}

/**
 * Request interceptor function type
 */
export type RequestInterceptor = (config: InternalRequestConfig) => InternalRequestConfig;

/**
 * Response wrapper (similar to AxiosResponse for compatibility)
 */
export interface HttpResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

/**
 * HTTP client wrapper for VALR API using native fetch
 * Zero dependencies - uses Node.js built-in fetch (Node 18+)
 */
export class HttpClient {
  private baseURL: string;
  private timeout: number;
  private defaultHeaders: Record<string, string>;
  private requestInterceptors: RequestInterceptor[] = [];

  constructor(config: HttpClientConfig = {}) {
    this.baseURL = config.baseURL || API_BASE_URL;
    this.timeout = config.timeout || 30000;
    this.defaultHeaders = {
      [HEADERS.CONTENT_TYPE]: CONTENT_TYPE_JSON,
      ...config.headers,
    };
  }

  /**
   * Add a request interceptor
   * Interceptors are called in order before each request
   */
  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  /**
   * Build full URL with query parameters
   */
  private buildUrl(path: string, params?: Record<string, any>): string {
    // Handle absolute URLs vs relative paths
    let url: URL;
    if (path.startsWith('http://') || path.startsWith('https://')) {
      url = new URL(path);
    } else {
      url = new URL(path, this.baseURL);
    }

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  /**
   * Execute HTTP request with error handling
   */
  private async request<T>(
    method: string,
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<HttpResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      // Build initial request config
      let requestConfig: InternalRequestConfig = {
        method,
        url,
        headers: {
          ...this.defaultHeaders,
          ...config?.headers,
        },
        params: config?.params,
        data,
      };

      // Apply request interceptors
      for (const interceptor of this.requestInterceptors) {
        requestConfig = interceptor(requestConfig);
      }

      // Build final URL (after interceptors may have modified params)
      const fullUrl = this.buildUrl(requestConfig.url, requestConfig.params);

      const fetchOptions: RequestInit = {
        method: requestConfig.method,
        headers: requestConfig.headers,
        signal: config?.signal || controller.signal,
      };

      if (requestConfig.data !== undefined && method !== 'GET' && method !== 'HEAD') {
        fetchOptions.body = typeof requestConfig.data === 'string'
          ? requestConfig.data
          : JSON.stringify(requestConfig.data);
      }

      const response = await fetch(fullUrl, fetchOptions);

      // Parse response body
      let responseData: T;
      const contentType = response.headers.get('content-type');

      if (contentType?.includes('application/json')) {
        const text = await response.text();
        responseData = text ? JSON.parse(text) : null;
      } else {
        responseData = await response.text() as unknown as T;
      }

      // Handle error responses
      if (!response.ok) {
        this.handleErrorResponse(response.status, responseData, response.headers);
      }

      return {
        data: responseData,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      };
    } catch (error: any) {
      // Re-throw VALR errors as-is
      if (error instanceof ValrApiError) {
        throw error;
      }

      // Handle abort/timeout
      if (error.name === 'AbortError') {
        throw new ValrApiError('Request timeout', undefined, error);
      }

      // Network or other errors
      throw new ValrApiError(
        error.message || 'Network error occurred',
        undefined,
        error
      );
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Handle error responses and throw appropriate VALR errors
   */
  private handleErrorResponse(status: number, data: any, headers: Headers): never {
    // Check for rate limiting
    if (status === 429 || headers.get(HEADERS.RATE_LIMITED) === 'true') {
      throw new ValrRateLimitError(
        data?.message || 'API rate limit exceeded'
      );
    }

    // Check for authentication errors
    if (status === 401 || status === 403) {
      throw new ValrAuthenticationError(
        data?.message || 'Authentication failed'
      );
    }

    // Check for validation errors
    if (status === 400) {
      throw new ValrValidationError(
        data?.message || 'Validation failed',
        data?.errors || data?.validationErrors?.errors
      );
    }

    // Generic API error
    throw new ValrApiError(
      data?.message || `API request failed with status ${status}`,
      status,
      data
    );
  }

  /**
   * Perform GET request
   */
  async get<T = any>(
    url: string,
    config?: RequestConfig
  ): Promise<HttpResponse<T>> {
    return this.request<T>('GET', url, undefined, config);
  }

  /**
   * Perform POST request
   */
  async post<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<HttpResponse<T>> {
    return this.request<T>('POST', url, data, config);
  }

  /**
   * Perform PUT request
   */
  async put<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<HttpResponse<T>> {
    return this.request<T>('PUT', url, data, config);
  }

  /**
   * Perform PATCH request
   */
  async patch<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<HttpResponse<T>> {
    return this.request<T>('PATCH', url, data, config);
  }

  /**
   * Perform DELETE request
   */
  async delete<T = any>(
    url: string,
    config?: RequestConfig
  ): Promise<HttpResponse<T>> {
    return this.request<T>('DELETE', url, config?.data, config);
  }

  /**
   * Set default header
   */
  setHeader(key: string, value: string): void {
    this.defaultHeaders[key] = value;
  }

  /**
   * Remove default header
   */
  removeHeader(key: string): void {
    delete this.defaultHeaders[key];
  }
}
