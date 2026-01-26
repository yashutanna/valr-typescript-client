import { ValrWebSocketClient, WebSocketClientConfig } from './ValrWebSocketClient';
import {WS_ACCOUNT_URL_PATH} from '../utils/constants';
import type {
  WebSocketMessage,
  Subscription,
  OrderProcessed,
  OrderStatusUpdate,
  BalanceUpdate,
  WebSocketAccountTrade,
} from '../types';

/**
 * Account WebSocket event names
 */
export type AccountWebSocketEventName =
  | 'connected'
  | 'authenticated'
  | 'message'
  | 'error'
  | 'close'
  | 'disconnected'
  | 'reconnecting'
  | 'order:processed'
  | 'order:statusUpdate'
  | 'balance:update'
  | 'trade:new';

/**
 * Account WebSocket client for real-time account updates
 *
 * Receives:
 * - Order processing results
 * - Order status updates
 * - Balance changes
 * - Account trades
 *
 * @example
 * ```typescript
 * const wsClient = new AccountWebSocket({
 *   apiKey: 'your-api-key',
 *   apiSecret: 'your-api-secret',
 * });
 *
 * wsClient.on('connected', () => {
 *   console.log('Connected to account WebSocket');
 * });
 *
 * wsClient.on('authenticated', () => {
 *   console.log('Authenticated');
 * });
 *
 * wsClient.on('balance:update', (update) => {
 *   console.log('Balance updated:', update);
 * });
 *
 * wsClient.on('order:processed', (result) => {
 *   console.log('Order processed:', result);
 * });
 *
 * wsClient.connect();
 * ```
 */
export class AccountWebSocket extends ValrWebSocketClient {
  constructor(config: WebSocketClientConfig) {
    if (!config.apiKey || !config.apiSecret) {
      throw new Error('API key and secret are required for Account WebSocket');
    }
    super(WS_ACCOUNT_URL_PATH, config);
  }

  /**
   * Subscribe to specific events
   *
   * @param subscriptions - Array of subscription objects
   */
  subscribe(subscriptions: Subscription[]): void {
    this.send({
      type: 'SUBSCRIBE',
      subscriptions,
    });
  }

  /**
   * Unsubscribe from specific events
   *
   * @param subscriptions - Array of subscription objects
   */
  unsubscribe(subscriptions: Subscription[]): void {
    this.send({
      type: 'UNSUBSCRIBE',
      subscriptions,
    });
  }

  /**
   * Handle authenticated event
   */
  protected onAuthenticated(): void {
    // Auto-subscribe to all account events
    this.subscribe([
      { event: 'INSTANT_ORDER_COMPLETED' },
      { event: 'ORDER_PROCESSED' },
      { event: 'ORDER_STATUS_UPDATE' },
      { event: 'BALANCE_UPDATE' },
      { event: 'NEW_ACCOUNT_TRADE' },
      { event: 'OPEN_ORDERS_UPDATE' },
      { event: 'NEW_PENDING_RECEIVE' },
      { event: 'SEND_STATUS_UPDATE' },
      { event: 'FAILED_CANCEL_ORDER' },
    ]);
  }

  /**
   * Handle incoming messages
   */
  protected onMessage(message: WebSocketMessage): void {
    switch (message.type) {
      case 'ORDER_PROCESSED':
        this.emit('order:processed', message as OrderProcessed);
        break;

      case 'ORDER_STATUS_UPDATE':
        this.emit('order:statusUpdate', message as OrderStatusUpdate);
        break;

      case 'BALANCE_UPDATE':
        this.emit('balance:update', message as BalanceUpdate);
        break;

      case 'NEW_ACCOUNT_TRADE':
        this.emit('trade:new', message as WebSocketAccountTrade);
        break;

      case 'SUBSCRIBED':
        // Successfully subscribed
        break;

      case 'UNSUBSCRIBED':
        // Successfully unsubscribed
        break;

      default:
        // Unknown message type - still emit via base 'message' event
        break;
    }
  }

}
