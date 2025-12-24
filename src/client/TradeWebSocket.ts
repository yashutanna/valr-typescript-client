import { ValrWebSocketClient, WebSocketClientConfig, WebSocketEvents } from './ValrWebSocketClient';
import {WS_TRADE_URL_PATH} from '../utils/constants';
import type {
  WebSocketMessage,
  Subscription,
  OrderBookUpdate,
  MarketSummaryUpdate,
  NewTrade,
  CurrencyPair,
} from '../types';

/**
 * Trade WebSocket events (in addition to base events)
 */
export interface TradeWebSocketEvents {
  'orderbook:update': (data: OrderBookUpdate) => void;
  'market:summary': (data: MarketSummaryUpdate) => void;
  'trade:new': (data: NewTrade) => void;
}

/**
 * Combined event types for TradeWebSocket
 */
export type TradeWebSocketEventMap = WebSocketEvents & TradeWebSocketEvents;

/**
 * Trade WebSocket client for real-time market data
 *
 * Receives:
 * - Order book updates (aggregated and full)
 * - Market summary updates
 * - New trades
 * - Price bucket updates
 *
 * @example
 * ```typescript
 * // Public trade WebSocket (no auth required)
 * const wsClient = new TradeWebSocket();
 *
 * wsClient.on('connected', () => {
 *   console.log('Connected to trade WebSocket');
 *   wsClient.subscribeToOrderBook(['BTCZAR', 'ETHZAR']);
 *   wsClient.subscribeToTrades(['BTCZAR']);
 * });
 *
 * wsClient.on('orderbook:update', (update) => {
 *   console.log('Order book update:', update);
 * });
 *
 * wsClient.on('trade:new', (trade) => {
 *   console.log('New trade:', trade);
 * });
 *
 * wsClient.connect();
 * ```
 */
export class TradeWebSocket extends ValrWebSocketClient<TradeWebSocketEventMap> {
  constructor(config: WebSocketClientConfig = {}) {
    super(WS_TRADE_URL_PATH, config);
  }

  /**
   * Subscribe to aggregated order book updates for currency pairs
   *
   * @param pairs - Array of currency pairs (e.g., ['BTCZAR', 'ETHZAR'])
   */
  subscribeToOrderBook(pairs: CurrencyPair[]): void {
    this.subscribe([
      {
        event: 'AGGREGATED_ORDERBOOK_UPDATE',
        pairs,
      },
    ]);
  }

  /**
   * Subscribe to full (non-aggregated) order book updates
   *
   * @param pairs - Array of currency pairs
   */
  subscribeToFullOrderBook(pairs: CurrencyPair[]): void {
    this.subscribe([
      {
        event: 'FULL_ORDERBOOK_UPDATE',
        pairs,
      },
    ]);
  }

  /**
   * Subscribe to market summary updates
   *
   * @param pairs - Array of currency pairs
   */
  subscribeToMarketSummary(pairs: CurrencyPair[]): void {
    this.subscribe([
      {
        event: 'MARKET_SUMMARY_UPDATE',
        pairs,
      },
    ]);
  }

  /**
   * Subscribe to new trades
   *
   * @param pairs - Array of currency pairs
   */
  subscribeToTrades(pairs: CurrencyPair[]): void {
    this.subscribe([
      {
        event: 'NEW_TRADE',
        pairs,
      },
    ]);
  }

  /**
   * Subscribe to price bucket updates
   *
   * @param pairs - Array of currency pairs
   */
  subscribeToPriceBuckets(pairs: CurrencyPair[]): void {
    this.subscribe([
      {
        event: 'NEW_TRADE_BUCKET',
        pairs,
      },
    ]);
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
   * Handle authenticated event (optional for trade WebSocket)
   */
  protected onAuthenticated(): void {
    // Trade WebSocket can be used without authentication
    // Subclass can override this if needed
  }

  /**
   * Handle incoming messages
   */
  protected onMessage(message: WebSocketMessage): void {
    switch (message.type) {
      case 'AGGREGATED_ORDERBOOK_UPDATE':
      case 'FULL_ORDERBOOK_UPDATE':
        this.emit('orderbook:update', message as OrderBookUpdate);
        break;

      case 'MARKET_SUMMARY_UPDATE':
        this.emit('market:summary', message as MarketSummaryUpdate);
        break;

      case 'NEW_TRADE':
        this.emit('trade:new', message as NewTrade);
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
