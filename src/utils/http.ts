import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
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
 * HTTP client wrapper for VALR API
 */
export class HttpClient {
  private axiosInstance: AxiosInstance;

  constructor(config: HttpClientConfig = {}) {
    this.axiosInstance = axios.create({
      baseURL: config.baseURL || API_BASE_URL,
      timeout: config.timeout || 30000,
      headers: {
        [HEADERS.CONTENT_TYPE]: CONTENT_TYPE_JSON,
        ...config.headers,
      },
    });

    // Response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          const { status, data, headers } = error.response;

          // Check for rate limiting
          if (status === 429 || headers[HEADERS.RATE_LIMITED] === 'true') {
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

        // Network or other errors
        throw new ValrApiError(
          error.message || 'Network error occurred',
          undefined,
          error
        );
      }
    );
  }

  /**
   * Perform GET request
   */
  async get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.get<T>(url, config);
  }

  /**
   * Perform POST request
   */
  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.post<T>(url, data, config);
  }

  /**
   * Perform PUT request
   */
  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.put<T>(url, data, config);
  }

  /**
   * Perform PATCH request
   */
  async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.patch<T>(url, data, config);
  }

  /**
   * Perform DELETE request
   */
  async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.delete<T>(url, config);
  }

  /**
   * Set default header
   */
  setHeader(key: string, value: string): void {
    this.axiosInstance.defaults.headers.common[key] = value;
  }

  /**
   * Remove default header
   */
  removeHeader(key: string): void {
    delete this.axiosInstance.defaults.headers.common[key];
  }

  /**
   * Get the underlying Axios instance
   */
  getInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}
