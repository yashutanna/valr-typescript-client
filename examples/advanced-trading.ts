import { ValrClient } from '../src';

/**
 * Example 1: Advanced order placement with error handling
 */
export async function advancedOrderPlacement() {
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
      postOnly: true,
      postOnlyReprice: true, // Reprice if order would match immediately
      postOnlyRepriceTicks: '1', // Reprice by 1 tick
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
export async function batchOrderExample() {
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
    // Each batch operation requires a 'type' and 'data' wrapper
    const batchResult = await client.trading.placeBatchOrders({
      requests: [
        {
          type: 'PLACE_LIMIT',
          data: {
            pair: 'BTCZAR',
            side: 'BUY',
            quantity: '0.001',
            price: (btcPrice * 0.95).toFixed(0),
            postOnly: true,
            customerOrderId: `batch-btc-${Date.now()}`,
          },
        },
        {
          type: 'PLACE_LIMIT',
          data: {
            pair: 'ETHZAR',
            side: 'BUY',
            quantity: '0.01',
            price: (ethPrice * 0.95).toFixed(0),
            postOnly: true,
            customerOrderId: `batch-eth-${Date.now()}`,
          },
        },
      ],
    });

    console.log(`\nBatch Order Results:`);
    batchResult.outcomes.forEach((result) => {
      if(result.accepted){
        console.log(`  Order ID: ${result.orderId}`);
        console.log(`  Customer Order Id: ${result.customerOrderId}`);
      } else {
        console.log(`  Order ID: ${result.orderId}`);
        console.log(`  error: ${result.error?.message}`);
      }
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
 * Example 3: Stop-Limit Orders (Stop-loss and Take-profit for spot trading)
 */
export async function stopLimitOrdersExample() {
  const client = new ValrClient({
    apiKey: process.env.VALR_API_KEY!,
    apiSecret: process.env.VALR_API_SECRET!,
  });

  try {
    console.log('=== Stop-Limit Orders Example ===\n');

    // Get current market price
    const market = await client.public.getMarketSummaryForPair('BTCZAR');
    const currentPrice = parseFloat(market.lastTradedPrice);

    console.log(`Current BTC price: ${currentPrice} ZAR`);

    // Assume we have a BTC position - set stop-loss and take-profit
    const stopLossStopPrice = (currentPrice * 0.95).toFixed(0); // Trigger at 5% below
    const stopLossLimitPrice = (currentPrice * 0.94).toFixed(0); // Execute at 6% below
    const takeProfitStopPrice = (currentPrice * 1.10).toFixed(0); // Trigger at 10% above
    const takeProfitLimitPrice = (currentPrice * 1.09).toFixed(0); // Execute at 9% above

    console.log(`\nSetting up stop-limit orders:`);
    console.log(`  Stop-loss trigger: ${stopLossStopPrice} ZAR, limit: ${stopLossLimitPrice} ZAR`);
    console.log(`  Take-profit trigger: ${takeProfitStopPrice} ZAR, limit: ${takeProfitLimitPrice} ZAR`);

    // Place stop-loss order (STOP_LOSS_LIMIT)
    const stopLoss = await client.trading.placeStopLimitOrder({
      pair: 'BTCZAR',
      side: 'SELL',
      quantity: '0.001',
      price: stopLossLimitPrice,
      stopPrice: stopLossStopPrice,
      type: 'STOP_LOSS_LIMIT',
      timeInForce: 'GTC',
      customerOrderId: `sl-${Date.now()}`,
    });

    console.log(`\n✓ Stop-loss order placed: ${stopLoss.id}`);

    // Place take-profit order (TAKE_PROFIT_LIMIT)
    const takeProfit = await client.trading.placeStopLimitOrder({
      pair: 'BTCZAR',
      side: 'SELL',
      quantity: '0.001',
      price: takeProfitLimitPrice,
      stopPrice: takeProfitStopPrice,
      type: 'TAKE_PROFIT_LIMIT',
      timeInForce: 'GTC',
      customerOrderId: `tp-${Date.now()}`,
    });

    console.log(`✓ Take-profit order placed: ${takeProfit.id}`);

    // Check all open orders
    const openOrders = await client.trading.getAllOpenOrders();
    const stopOrders = openOrders.filter(
      (o) => o.orderType === 'STOP_LOSS_LIMIT' || o.orderType === 'TAKE_PROFIT_LIMIT'
    );
    console.log(`\nActive stop-limit orders: ${stopOrders.length}`);

    stopOrders.forEach((order) => {
      console.log(`\n  ${order.orderType}:`);
      console.log(`    Stop Price: ${order.stopPrice}`);
      console.log(`    Limit Price: ${order.originalPrice}`);
      console.log(`    Status: ${order.status}`);
    });

    // Clean up - cancel the orders
    console.log(`\nCancelling orders...`);
    await client.trading.cancelOrder({ pair: 'BTCZAR', orderId: stopLoss.id });
    await client.trading.cancelOrder({ pair: 'BTCZAR', orderId: takeProfit.id });
    console.log(`✓ Orders cancelled`);
  } catch (error: any) {
    console.error('Error:', error.message);
  }
}

/**
 * Example 4: Order modification
 */
export async function orderModificationExample() {
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
      postOnly: true,
      postOnlyReprice: true,
      customerOrderId: `modify-test-${Date.now()}`,
    });

    console.log(`✓ Order placed: ${order.id}`);

    // Wait 2 seconds, then modify the order
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const newPrice = (currentPrice * 0.97).toFixed(0);
    const newQuantity = '0.002';

    console.log(`\nModifying order:`);
    console.log(`  New price: ${newPrice} ZAR`);
    console.log(`  New remaining quantity: ${newQuantity} BTC`);

    // Modify the order using the correct API fields
    const modified = await client.trading.modifyOrder({
      orderId: order.id,
      pair: 'BTCZAR',
      modifyMatchStrategy: 'RETAIN_ORIGINAL', // Keep original if modification would match
      newPrice: newPrice,
      newRemainingQuantity: newQuantity,
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
export async function simpleTradeExample() {
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
// stopLimitOrdersExample().catch(console.error);
// orderModificationExample().catch(console.error);
simpleTradeExample().catch(console.error);
