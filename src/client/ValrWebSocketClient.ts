import WebSocket from 'ws';
import EventEmitter from 'eventemitter3';
import { RequestSigner } from '../auth/RequestSigner';
import { ValrWebSocketError } from '../errors/ValrError';
import type { WebSocketMessage } from '../types';
import {WS_BASE_URL} from "../utils/constants";

/**
 * WebSocket client configuration
 */
export interface WebSocketClientConfig {
  /** API key (required for authenticated endpoints) */
  apiKey?: string;
  /** API secret (required for authenticated endpoints) */
  apiSecret?: string;
  /** Subaccount ID for impersonation */
  subaccountId?: string;
  /** Auto-reconnect on disconnect (default: true) */
  autoReconnect?: boolean;
  /** Reconnect delay in milliseconds (default: 5000) */
  reconnectDelay?: number;
  /** Maximum reconnect attempts (default: Infinity) */
  maxReconnectAttempts?: number;
  /** Base URL for WS (defaults to wss://api.valr.com) */
  baseURL?: string;
}

/**
 * WebSocket event types
 */
export interface WebSocketEvents {
  connected: () => void;
  authenticated: () => void;
  message: (message: WebSocketMessage) => void;
  error: (error: Error) => void;
  close: (code: number, reason: string) => void;
  disconnected: () => void;
  reconnecting: (attempt: number) => void;
}

/**
 * Base WebSocket client for VALR API
 */
export abstract class ValrWebSocketClient<TEvents extends WebSocketEvents = WebSocketEvents> extends EventEmitter<TEvents> {
  protected ws?: WebSocket;
  protected url: string;
  protected path: string;
  protected config: Required<WebSocketClientConfig>;
  protected reconnectAttempts = 0;
  protected reconnectTimer?: NodeJS.Timeout;
  protected isIntentionalClose = false;
  protected isConnected = false;
  protected isAuthenticated = false;

  constructor(path: string, config: WebSocketClientConfig = {}) {
    super();
    this.config = {
      apiKey: config.apiKey || '',
      apiSecret: config.apiSecret || '',
      subaccountId: config.subaccountId || '',
      autoReconnect: config.autoReconnect ?? true,
      reconnectDelay: config.reconnectDelay || 5000,
      maxReconnectAttempts: config.maxReconnectAttempts || Infinity,
      baseURL: config.baseURL || WS_BASE_URL
    };
    this.url = `${this.config.baseURL}${path}`;
    this.path = path;
  }

  /**
   * Connect to WebSocket
   */
  connect(): void {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return; // Already connected or connecting
    }

    this.isIntentionalClose = false;

    try {
      // Build WebSocket options with authentication headers if credentials provided
      const wsOptions: WebSocket.ClientOptions = {};

      if (this.config.apiKey && this.config.apiSecret) {
        const timestamp = RequestSigner.getTimestamp();
        const signature = RequestSigner.signRequest({
          apiSecret: this.config.apiSecret,
          timestamp,
          verb: 'GET',
          path: this.path,
          body: '',
          subaccountId: this.config.subaccountId,
        });

        wsOptions.headers = {
          'X-VALR-API-KEY': this.config.apiKey,
          'X-VALR-SIGNATURE': signature,
          'X-VALR-TIMESTAMP': timestamp.toString(),
        };

        if (this.config.subaccountId) {
          wsOptions.headers['X-VALR-SUB-ACCOUNT-ID'] = this.config.subaccountId;
        }
      }

      this.ws = new WebSocket(this.url, wsOptions);

      this.ws.on('open', () => {
        this.handleOpen();
      });

      this.ws.on('message', (data: WebSocket.Data) => {
        this.handleMessage(data);
      });

      this.ws.on('error', (error: Error) => {
        this.handleError(error);
      });

      this.ws.on('close', (code: number, reason: Buffer) => {
        this.handleClose(code, reason.toString());
      });
    } catch (error) {
      // @ts-ignore - Base event is always available
      this.emit('error', new ValrWebSocketError(`Failed to connect: ${error}`));
    }
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect(): void {
    this.isIntentionalClose = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = undefined;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = undefined;
    }
  }

  /**
   * Check if connected
   */
  isOpen(): boolean {
    return this.isConnected && this.ws?.readyState === WebSocket.OPEN;
  }

  /**
   * Send a message to WebSocket
   */
  protected send(message: any): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new ValrWebSocketError('WebSocket is not connected');
    }

    const data = typeof message === 'string' ? message : JSON.stringify(message);
    this.ws.send(data);
  }

  /**
   * Handle WebSocket open event
   */
  protected handleOpen(): void {
    this.isConnected = true;
    this.reconnectAttempts = 0;
    // @ts-ignore - Base event is always available
    this.emit('connected');

    // If credentials were provided, authentication happened via headers during handshake
    if (this.config.apiKey && this.config.apiSecret) {
      this.isAuthenticated = true;
      // @ts-ignore - Base event is always available
      this.emit('authenticated');
      this.onAuthenticated();
      this.startPing()
    }
  }

  protected startPing(){
      setInterval(() => {
          if(this.isConnected && this.isAuthenticated){
            this.send({ type: "PING"});
          }
      }, 30000)
    }

  /**
   * Handle incoming WebSocket message
   */
  protected handleMessage(data: WebSocket.Data): void {
    try {
      const message = JSON.parse(data.toString()) as WebSocketMessage;

      // Emit the message event
      // @ts-ignore - Base event is always available
      this.emit('message', message);

      // Call subclass handler
      this.onMessage(message);
    } catch (error) {
      // @ts-ignore - Base event is always available
      this.emit('error', new ValrWebSocketError(`Failed to parse message: ${error}`));
    }
  }

  /**
   * Handle WebSocket error
   */
  protected handleError(error: Error): void {
    // @ts-ignore - Base event is always available
    this.emit('error', new ValrWebSocketError(error.message));
  }

  /**
   * Handle WebSocket close event
   */
  protected handleClose(code: number, reason: string): void {
    this.isConnected = false;
    this.isAuthenticated = false;
    // @ts-ignore - Base event is always available
    this.emit('close', code, reason);
    // @ts-ignore - Base event is always available
    this.emit('disconnected');

    // Attempt to reconnect if not intentional
    if (!this.isIntentionalClose && this.config.autoReconnect) {
      this.attemptReconnect();
    }
  }

  /**
   * Attempt to reconnect
   */
  protected attemptReconnect(): void {
    if (this.reconnectAttempts >= this.config.maxReconnectAttempts) {
      // @ts-ignore - Base event is always available
      this.emit('error', new ValrWebSocketError('Max reconnect attempts reached'));
      return;
    }

    this.reconnectAttempts++;
    // @ts-ignore - Base event is always available
    this.emit('reconnecting', this.reconnectAttempts);

    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, this.config.reconnectDelay);
  }

  /**
   * Override this method to handle authenticated event
   */
  protected onAuthenticated(): void {
    // Override in subclass
  }

  /**
   * Override this method to handle messages
   */
  protected abstract onMessage(message: WebSocketMessage): void;
}
