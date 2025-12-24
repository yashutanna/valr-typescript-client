import { ValrClient } from '../src';
import dotenv from "dotenv";
dotenv.config();

// Example 1: Public API usage (no authentication required)
async function publicAPIExample() {
  const client = new ValrClient();

  // Get server time
  const time = await client.public.getServerTime();
  console.log('Server time:', time);

  // Get all currency pairs
  const pairs = await client.public.getCurrencyPairs();
  console.log(`Found ${pairs.length} currency pairs`);

  // Get market summary for BTC/ZAR
  const btcMarket = await client.public.getMarketSummaryForPair('BTCZAR');
  console.log('BTC/ZAR price:', btcMarket.lastTradedPrice);

  // Get order book
  const orderBook = await client.public.getOrderBook('BTCZAR');
  console.log('Best ask:', orderBook.Asks[0]?.price);
  console.log('Best bid:', orderBook.Bids[0]?.price);
}

// Example 2: Authenticated API usage
async function authenticatedAPIExample() {
  const client = new ValrClient({
    apiKey: process.env.VALR_API_KEY!,
    apiSecret: process.env.VALR_API_SECRET!,
  });

  // Get account balances
  const balances = await client.account.getBalances();
  console.log('Your balances:');
  balances.forEach((balance) => {
    if (parseFloat(balance.total) > 0) {
      console.log(`  ${balance.currency}: ${balance.total}`);
    }
  });

  // Get open orders
  const openOrders = await client.trading.getAllOpenOrders();
  console.log(`You have ${openOrders.length} open orders`);
}

// Example 3: Trading
async function tradingExample() {
  const client = new ValrClient({
    apiKey: process.env.VALR_API_KEY!,
    apiSecret: process.env.VALR_API_SECRET!,
  });

  // Place a limit order
  const order = await client.trading.placeLimitOrder({
    pair: 'BTCZAR',
    side: 'BUY',
    quantity: '0.001',
    price: '500000',
    postOnly: 'POST_ONLY_REPRICE',
    customerOrderId: `order-${Date.now()}`,
  });

  console.log('Order placed:', order.id);

  // Check order status
  const status = await client.trading.getOrderStatus('BTCZAR', order.id);
  console.log('Order status:', status.orderStatus);

  // Cancel the order
  await client.trading.cancelOrder({
    pair: 'BTCZAR',
    orderId: order.id,
  });
  console.log('Order cancelled');
}

// Example 4: Futures trading
async function futuresExample() {
  const client = new ValrClient({
    apiKey: process.env.VALR_API_KEY!,
    apiSecret: process.env.VALR_API_SECRET!,
  });

  // Get open positions
  const positions = await client.futures.getOpenPositions();
  console.log(`You have ${positions.length} open positions`);

  // Get leverage info
  const leverage = await client.futures.getLeverageInfo('BTCUSDTPERP');
  console.log(`Current leverage: ${leverage.leverageMultiple}x`);
}


// Example 4: Earn Products
async function earnExample() {
    const client = new ValrClient({
        apiKey: process.env.VALR_API_KEY!,
        apiSecret: process.env.VALR_API_SECRET!,
    });

    const stakeRates = await client.stake.getRates({earnType: "STAKE"});
    const defiLendRates = await client.stake.getRates({earnType: "LEND"});
    const exchangeLendRates = await client.loans.getRates();

    console.log("staking rates")
    stakeRates.forEach((rate) => {
        console.log(`  ${rate.currencySymbol}: ${(Number(rate.rate) * (365*24) * 100).toFixed(2)}%`);
    });
    console.log("defi-lending rates")
    defiLendRates.forEach((rate) => {
        console.log(`  ${rate.currencySymbol}: ${(Number(rate.rate) * (365*24) * 100).toFixed(2)}%`);
    });
    console.log("exchange lending rates")
    exchangeLendRates.forEach((rate) => {
        if(rate.estimatedNextRate){
            console.log(`  ${rate.currency}: ${(Number(rate.estimatedNextRate) * (365*24) * 100).toFixed(2)}%`);
        } else if(Number(rate.estimatedNextBorrowRate) > 0){
            console.log(`  ${rate.currency}: ${(Number(rate.estimatedNextBorrowRate) * (365*24) * 100).toFixed(2)}%`);
        }
    });

}

// Example 5: Crypto wallets
async function walletExample() {
    const client = new ValrClient({
        apiKey: process.env.VALR_API_KEY!,
        apiSecret: process.env.VALR_API_SECRET!,
    });

    const usdcEthereum = await client.wallets.getCryptoDepositAddress("USDC", "Ethereum")
    const ethEthereum = await client.wallets.getCryptoDepositAddress("ETH", "Ethereum")
    const usdcAvalanche = await client.wallets.getCryptoDepositAddress("USDC", "Avalanche")
    console.log("USDC address(Ethereum)", usdcEthereum)
    console.log("ETH address(Ethereum)", ethEthereum)
    console.log("USDC address(Avalanche)", usdcAvalanche)
}

// Run examples (comment out as needed)
// publicAPIExample().catch(console.error);
// authenticatedAPIExample().catch(console.error);
walletExample().catch(console.error);
// tradingExample().catch(console.error);
// futuresExample().catch(console.error);
// earnExample().catch(console.error);
