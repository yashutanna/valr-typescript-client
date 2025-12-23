import { ValrClient } from '../src';

/**
 * Example 1: Advanced order placement with error handling
 */
async function advancedOrderPlacement() {
  const client = new ValrClient({
    apiKey: process.env.VALR_API_KEY!,
    apiSecret: process.env.VALR_API_SECRET!,
  });

  try {
    console.log('=== Advanced Order Placement ===\n');

    // Get current market price
    const market = await client.public.getMarketSummaryForPair('BTCZAR');
    console.log(`Current BTC price: ${market.lastTradedPrice} ZAR`);

    const currentPrice = parseFloat(market.lastTradedPrice);

    // Place a limit order 1% below current price
    const buyPrice = (currentPrice * 0.99).toFixed(0);
    console.log(`\nPlacing buy order at ${buyPrice} ZAR (1% below market)`);

    const order = await client.trading.placeLimitOrder({
      pair: 'BTCZAR',
      side: 'BUY',
      quantity: '0.001',
      price: buyPrice,
      postOnly: 'POST_ONLY_REPRICE',
      timeInForce: 'GTC',
      customerOrderId: `adv-order-${Date.now()}`,
    });

    console.log(`✓ Order placed successfully`);
    console.log(`  Order ID: ${order.id}`);
    console.log(`  Customer Order ID: ${order.customerOrderId}`);

    // Check order status
    const status = await client.trading.getOrderStatus('BTCZAR', order.id);
    console.log(`\nOrder Status:`);
    console.log(`  Status: ${status.orderStatus}`);
    console.log(`  Remaining: ${status.remainingQuantity}`);
    console.log(`  Original: ${status.originalQuantity}`);

    // Cancel the order after 5 seconds
    setTimeout(async () => {
      console.log(`\nCancelling order...`);
      await client.trading.cancelOrder({
        pair: 'BTCZAR',
        orderId: order.id,
      });
      console.log(`✓ Order cancelled`);
    }, 5000);
  } catch (error: any) {
    console.error('Error:', error.message);
  }
}

/**
 * Example 2: Batch order placement
 */
async function batchOrderExample() {
  const client = new ValrClient({
    apiKey: process.env.VALR_API_KEY!,
    apiSecret: process.env.VALR_API_SECRET!,
  });

  try {
    console.log('=== Batch Order Placement ===\n');

    // Get current prices
    const btcMarket = await client.public.getMarketSummaryForPair('BTCZAR');
    const ethMarket = await client.public.getMarketSummaryForPair('ETHZAR');

    const btcPrice = parseFloat(btcMarket.lastTradedPrice);
    const ethPrice = parseFloat(ethMarket.lastTradedPrice);

    console.log(`BTC: ${btcPrice} ZAR`);
    console.log(`ETH: ${ethPrice} ZAR`);

    // Place multiple orders in one request
    const batchResult = await client.trading.placeBatchOrders({
      requests: [
        {
          pair: 'BTCZAR',
          side: 'BUY',
          quantity: '0.001',
          price: (btcPrice * 0.95).toFixed(0),
          postOnly: 'POST_ONLY_REPRICE',
          customerOrderId: `batch-btc-${Date.now()}`,
        },
        {
          pair: 'ETHZAR',
          side: 'BUY',
          quantity: '0.01',
          price: (ethPrice * 0.95).toFixed(0),
          postOnly: 'POST_ONLY_REPRICE',
          customerOrderId: `batch-eth-${Date.now()}`,
        },
      ],
    });

    console.log(`\nBatch Order Results:`);
    batchResult.forEach((result, index) => {
      console.log(`\nOrder ${index + 1}:`);
      console.log(`  Status: ${result.status}`);
      console.log(`  Order ID: ${result.id || 'N/A'}`);
      console.log(`  Message: ${result.message || 'Success'}`);
    });

    // Cancel all orders after 10 seconds
    setTimeout(async () => {
      console.log(`\nCancelling all orders...`);
      await client.trading.cancelAllOrders();
      console.log(`✓ All orders cancelled`);
    }, 10000);
  } catch (error: any) {
    console.error('Error:', error.message);
  }
}

/**
 * Example 3: Conditional orders (Stop-loss and Take-profit)
 */
async function conditionalOrdersExample() {
  const client = new ValrClient({
    apiKey: process.env.VALR_API_KEY!,
    apiSecret: process.env.VALR_API_SECRET!,
  });

  try {
    console.log('=== Conditional Orders Example ===\n');

    // First, place a regular buy order
    const market = await client.public.getMarketSummaryForPair('BTCZAR');
    const currentPrice = parseFloat(market.lastTradedPrice);

    console.log(`Current BTC price: ${currentPrice} ZAR`);

    // Assume we have a position, set stop-loss and take-profit
    const stopLossPrice = (currentPrice * 0.95).toFixed(0); // 5% below
    const takeProfitPrice = (currentPrice * 1.10).toFixed(0); // 10% above

    console.log(`\nSetting up conditional orders:`);
    console.log(`  Stop-loss at: ${stopLossPrice} ZAR (-5%)`);
    console.log(`  Take-profit at: ${takeProfitPrice} ZAR (+10%)`);

    // Place stop-loss order
    const stopLoss = await client.trading.placeConditionalOrder({
      pair: 'BTCZAR',
      side: 'SELL',
      type: 'STOP_LOSS',
      triggerPrice: stopLossPrice,
      quantity: '0.001',
      price: stopLossPrice, // Limit price
      customerOrderId: `sl-${Date.now()}`,
    });

    console.log(`\n✓ Stop-loss order placed: ${stopLoss.id}`);

    // Place take-profit order
    const takeProfit = await client.trading.placeConditionalOrder({
      pair: 'BTCZAR',
      side: 'SELL',
      type: 'TAKE_PROFIT',
      triggerPrice: takeProfitPrice,
      quantity: '0.001',
      price: takeProfitPrice,
      customerOrderId: `tp-${Date.now()}`,
    });

    console.log(`✓ Take-profit order placed: ${takeProfit.id}`);

    // Check all conditional orders
    const allConditionals = await client.trading.getAllConditionalOrders();
    console.log(`\nActive conditional orders: ${allConditionals.length}`);

    allConditionals.forEach((order) => {
      console.log(`\n  ${order.type}:`);
      console.log(`    Trigger Price: ${order.triggerPrice}`);
      console.log(`    Status: ${order.status}`);
    });
  } catch (error: any) {
    console.error('Error:', error.message);
  }
}

/**
 * Example 4: Order modification
 */
async function orderModificationExample() {
  const client = new ValrClient({
    apiKey: process.env.VALR_API_KEY!,
    apiSecret: process.env.VALR_API_SECRET!,
  });

  try {
    console.log('=== Order Modification Example ===\n');

    // Place initial order
    const market = await client.public.getMarketSummaryForPair('BTCZAR');
    const currentPrice = parseFloat(market.lastTradedPrice);
    const initialPrice = (currentPrice * 0.98).toFixed(0);

    console.log(`Placing initial order at ${initialPrice} ZAR`);

    const order = await client.trading.placeLimitOrder({
      pair: 'BTCZAR',
      side: 'BUY',
      quantity: '0.001',
      price: initialPrice,
      postOnly: 'POST_ONLY_REPRICE',
      customerOrderId: `modify-test-${Date.now()}`,
    });

    console.log(`✓ Order placed: ${order.id}`);

    // Wait 2 seconds, then modify the order
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const newPrice = (currentPrice * 0.97).toFixed(0);
    const newQuantity = '0.002';

    console.log(`\nModifying order:`);
    console.log(`  New price: ${newPrice} ZAR`);
    console.log(`  New quantity: ${newQuantity} BTC`);

    const modified = await client.trading.modifyOrder({
      orderId: order.id,
      pair: 'BTCZAR',
      price: newPrice,
      quantity: newQuantity,
    });

    console.log(`✓ Order modified: ${modified.id}`);

    // Check the updated status
    const status = await client.trading.getOrderStatus('BTCZAR', order.id);
    console.log(`\nUpdated order:`);
    console.log(`  Price: ${status.originalPrice}`);
    console.log(`  Quantity: ${status.originalQuantity}`);

    // Clean up
    await client.trading.cancelOrder({ pair: 'BTCZAR', orderId: order.id });
    console.log(`\n✓ Order cancelled`);
  } catch (error: any) {
    console.error('Error:', error.message);
  }
}

/**
 * Example 5: Simple buy/sell with instant quotes
 */
async function simpleTradeExample() {
  const client = new ValrClient({
    apiKey: process.env.VALR_API_KEY!,
    apiSecret: process.env.VALR_API_SECRET!,
  });

  try {
    console.log('=== Simple Trade Example ===\n');

    // Get a quote to buy 1000 ZAR worth of BTC
    console.log(`Getting quote to buy 1000 ZAR worth of BTC...`);

    const quote = await client.trading.getSimpleQuote('BTCZAR', {
      pair: 'BTCZAR',
      side: 'BUY',
      payInCurrency: 'ZAR',
      payAmount: '1000',
    });

    console.log(`\nQuote received:`);
    console.log(`  You pay: ${quote.payAmount} ${quote.payInCurrency}`);
    console.log(`  You receive: ${quote.receiveAmount} BTC`);
    console.log(`  Fee: ${quote.feeAmount} ${quote.feeCurrency}`);
    console.log(`  Quote expires at: ${quote.expiresAt}`);
    console.log(`  Quote ID: ${quote.id}`);

    // To execute the trade (commented out for safety):
    // const order = await client.trading.placeSimpleOrder('BTCZAR', {
    //   pair: 'BTCZAR',
    //   quoteId: quote.id,
    // });
    // console.log(`\n✓ Trade executed: ${order.id}`);

    console.log(`\n⚠️  Trade not executed (uncomment to actually trade)`);
  } catch (error: any) {
    console.error('Error:', error.message);
  }
}

// Run examples
// Uncomment the example you want to run:

// advancedOrderPlacement().catch(console.error);
// batchOrderExample().catch(console.error);
// conditionalOrdersExample().catch(console.error);
// orderModificationExample().catch(console.error);
simpleTradeExample().catch(console.error);
