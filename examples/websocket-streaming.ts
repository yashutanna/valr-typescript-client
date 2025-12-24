import { AccountWebSocket, TradeWebSocket } from '../src';
import dotenv from "dotenv";
dotenv.config();

/**
 * Example 1: Trade WebSocket - Real-time market data (no authentication required)
 */
async function tradeWebSocketExample() {
  console.log('=== Trade WebSocket Example ===\n');

  const wsClient = new TradeWebSocket();

  wsClient.on('connected', () => {
    console.log('✓ Connected to trade WebSocket');

    // Subscribe to BTC/ZAR order book updates
    wsClient.subscribeToOrderBook(['BTCZAR']);

    // Subscribe to ETH/ZAR trade updates
    wsClient.subscribeToTrades(['ETHZAR']);

    // Subscribe to market summaries
    wsClient.subscribeToMarketSummary(['BTCZAR', 'ETHZAR']);
  });

  wsClient.on('orderbook:update', (update) => {
    console.log('\n📊 Order Book Update:');
    console.log(`  Pair: ${update.currencyPairSymbol}`);
    console.log(`  Best Ask: ${update.Asks[0]?.price}`);
    console.log(`  Best Bid: ${update.Bids[0]?.price}`);
  });

  wsClient.on('trade:new', (trade) => {
    console.log('\n💱 New Trade:');
    console.log(`  Pair: ${trade.currencyPairSymbol}`);
    console.log(`  Price: ${trade.price}`);
    console.log(`  Quantity: ${trade.quantity}`);
    console.log(`  Side: ${trade.takerSide}`);
  });

  wsClient.on('market:summary', (summary) => {
    console.log('\n📈 Market Summary:');
    console.log(`  Pair: ${summary.currencyPairSymbol}`);
    console.log(`  Last Price: ${summary.lastTradedPrice}`);
    console.log(`  24h Change: ${summary.changeFromPrevious}`);
    console.log(`  24h Volume: ${summary.baseVolume}`);
  });

  wsClient.on('error', (error) => {
    console.error('❌ WebSocket error:', error.message);
  });

  wsClient.on('disconnected', () => {
    console.log('⚠️  Disconnected from trade WebSocket');
  });

  wsClient.on('reconnecting', (attempt) => {
    console.log(`🔄 Reconnecting... (attempt ${attempt})`);
  });

  // Connect
  wsClient.connect();

  // Disconnect after 30 seconds (for example purposes)
  setTimeout(() => {
    console.log('\n--- Disconnecting ---');
    wsClient.disconnect();
  }, 30000);
}

/**
 * Example 2: Account WebSocket - Real-time account updates (requires authentication)
 */
async function accountWebSocketExample() {
  console.log('=== Account WebSocket Example ===\n');

  if (!process.env.VALR_API_KEY || !process.env.VALR_API_SECRET) {
    console.log('⚠️  Skipping account WebSocket example - no credentials');
    return;
  }

  const wsClient = new AccountWebSocket({
    apiKey: process.env.VALR_API_KEY,
    apiSecret: process.env.VALR_API_SECRET,
  });

  wsClient.on('connected', () => {
    console.log('✓ Connected to account WebSocket');
  });

  wsClient.on('authenticated', () => {
    console.log('✓ Authenticated successfully');
    console.log('📡 Listening for account updates...\n');
  });

  wsClient.on('order:processed', (result) => {
    console.log('\n✅ Order Processed:');
    console.log(`  Order ID: ${result.orderId}`);
    console.log(`  Success: ${result.success}`);
    if (!result.success) {
      console.log(`  Failure Reason: ${result.failureReason}`);
    }
  });

  wsClient.on('order:statusUpdate', (update) => {
    console.log('\n📝 Order Status Update:');
    console.log(`  Order ID: ${update.orderId}`);
    console.log(`  Status: ${update.orderStatus}`);
    console.log(`  Pair: ${update.currencyPair}`);
    console.log(`  Remaining: ${update.remainingQuantity}`);
  });

  wsClient.on('balance:update', (update) => {
    console.log('\n💰 Balance Update:');
    console.log(`  Currency: ${update.data.currency.symbol}`);
    console.log(`  Available: ${update.data.available}`);
    console.log(`  Reserved: ${update.data.reserved}`);
    console.log(`  Total: ${update.data.total}`);
  });

  wsClient.on('trade:new', (trade) => {
    console.log('\n🎯 Account Trade:');
    console.log(`  Pair: ${trade.currencyPair}`);
    console.log(`  Price: ${trade.price}`);
    console.log(`  Quantity: ${trade.quantity}`);
    console.log(`  Side: ${trade.side}`);
    console.log(`  Order ID: ${trade.orderId}`);
  });

  wsClient.on('error', (error) => {
    console.error('❌ WebSocket error:', error.message);
  });

  wsClient.on('disconnected', () => {
    console.log('⚠️  Disconnected from account WebSocket');
  });

  wsClient.on('reconnecting', (attempt) => {
    console.log(`🔄 Reconnecting... (attempt ${attempt})`);
  });

  // Connect
  wsClient.connect();

  // Keep running (press Ctrl+C to exit)
  console.log('Press Ctrl+C to exit\n');
}

/**
 * Example 3: Multiple subscriptions on Trade WebSocket
 */
async function multipleSubscriptionsExample() {
  console.log('=== Multiple Subscriptions Example ===\n');

  const wsClient = new TradeWebSocket();

  wsClient.on('connected', () => {
    console.log('✓ Connected\n');

    // Subscribe to multiple currency pairs and event types
    const pairs = ['BTCZAR', 'ETHZAR', 'USDCZAR'];

    console.log(`Subscribing to ${pairs.length} pairs:`);
    console.log(`  - Order book updates`);
    console.log(`  - Trade updates`);
    console.log(`  - Market summary updates\n`);

    wsClient.subscribeToOrderBook(pairs);
    wsClient.subscribeToTrades(pairs);
    wsClient.subscribeToMarketSummary(pairs);
  });

  let tradeCount = 0;
  let orderBookCount = 0;

  wsClient.on('trade:new', (trade) => {
    tradeCount++;
    console.log(`[${tradeCount}] Trade: ${trade.currencyPairSymbol} @ ${trade.price}`);
  });

  wsClient.on('orderbook:update', (update) => {
    orderBookCount++;
    if (orderBookCount % 10 === 0) {
      console.log(`[${orderBookCount}] Order book updates received`);
    }
  });

  wsClient.on('error', (error) => {
    console.error('Error:', error.message);
  });

  wsClient.connect();

  // Summary after 20 seconds
  setTimeout(() => {
    console.log('\n--- Summary ---');
    console.log(`Total trades received: ${tradeCount}`);
    console.log(`Total order book updates: ${orderBookCount}`);
    wsClient.disconnect();
  }, 20000);
}

/**
 * Example 4: Auto-reconnection on disconnect
 */
async function autoReconnectExample() {
  console.log('=== Auto-Reconnect Example ===\n');

  const wsClient = new TradeWebSocket({
    autoReconnect: true,
    reconnectDelay: 3000, // 3 seconds
    maxReconnectAttempts: 5,
  });

  wsClient.on('connected', () => {
    console.log('✓ Connected at', new Date().toLocaleTimeString());
    wsClient.subscribeToTrades(['BTCZAR']);
  });

  wsClient.on('disconnected', () => {
    console.log('⚠️  Disconnected at', new Date().toLocaleTimeString());
  });

  wsClient.on('reconnecting', (attempt) => {
    console.log(`🔄 Reconnection attempt ${attempt} at`, new Date().toLocaleTimeString());
  });

  wsClient.on('trade:new', (trade) => {
    console.log(`📊 Trade: ${trade.price}`);
  });

  wsClient.on('error', (error) => {
    console.error('Error:', error.message);
  });

  wsClient.connect();

  console.log('WebSocket will automatically reconnect if disconnected');
  console.log('Press Ctrl+C to exit\n');
}

// Run examples
// Uncomment the example you want to run:

// tradeWebSocketExample().catch(console.error);
accountWebSocketExample().catch(console.error);
// multipleSubscriptionsExample().catch(console.error);
// autoReconnectExample().catch(console.error);
