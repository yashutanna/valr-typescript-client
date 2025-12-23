# VALR TypeScript Client

A comprehensive, fully-typed TypeScript/JavaScript client for the [VALR](https://www.valr.com) cryptocurrency exchange API.

## Features

- ✅ **Full TypeScript Support** - Complete type definitions for all endpoints and responses
- ✅ **Comprehensive API Coverage** - All 147 REST endpoints implemented
- ✅ **WebSocket Support** - Real-time market data and account updates (coming soon)
- ✅ **Modern Architecture** - Built with axios, supports both ESM and CommonJS
- ✅ **Automatic Authentication** - HMAC SHA512 request signing handled automatically
- ✅ **Error Handling** - Custom error classes for different error types
- ✅ **Rate Limit Aware** - Built-in awareness of VALR API rate limits
- ✅ **Subaccount Support** - Easy subaccount impersonation

## Installation

```bash
npm install valr-typescript-client
```

or

```bash
yarn add valr-typescript-client
```

or

```bash
pnpm add valr-typescript-client
```

## Quick Start

### Public API (No Authentication Required)

```typescript
import { ValrClient } from 'valr-typescript-client';

const client = new ValrClient();

// Get server time
const time = await client.public.getServerTime();
console.log('Server time:', time);

// Get market summary for all pairs
const markets = await client.public.getMarketSummary();
console.log('Markets:', markets);

// Get order book for a specific pair
const orderBook = await client.public.getOrderBook('BTCZAR');
console.log('Order book:', orderBook);

// Get currencies
const currencies = await client.public.getCurrencies();
console.log('Supported currencies:', currencies);
```

### Authenticated API

```typescript
import { ValrClient } from 'valr-typescript-client';

const client = new ValrClient({
  apiKey: 'your-api-key',
  apiSecret: 'your-api-secret',
});

// Get account balances
const balances = await client.account.getBalances();
console.log('Balances:', balances);

// Place a limit order
const order = await client.trading.placeLimitOrder({
  pair: 'BTCZAR',
  side: 'BUY',
  quantity: '0.001',
  price: '500000',
  postOnly: 'POST_ONLY_REPRICE',
  customerOrderId: 'my-order-1',
});
console.log('Order placed:', order);

// Get open orders
const openOrders = await client.trading.getAllOpenOrders();
console.log('Open orders:', openOrders);

// Get trade history
const trades = await client.account.getTradeHistory({
  skip: 0,
  limit: 100,
});
console.log('Trade history:', trades);
```

### Advanced Trading

```typescript
// Place a market order
const marketOrder = await client.trading.placeMarketOrder({
  pair: 'ETHZAR',
  side: 'BUY',
  quoteAmount: '1000', // Spend 1000 ZAR
});

// Place a stop-limit order
const stopOrder = await client.trading.placeStopLimitOrder({
  pair: 'BTCZAR',
  side: 'SELL',
  quantity: '0.001',
  price: '450000',
  stopPrice: '460000',
});

// Place batch orders
const batchOrders = await client.trading.placeBatchOrders({
  requests: [
    {
      pair: 'BTCZAR',
      side: 'BUY',
      quantity: '0.001',
      price: '480000',
      postOnly: 'POST_ONLY_REPRICE',
    },
    {
      pair: 'ETHZAR',
      side: 'BUY',
      quantity: '0.01',
      price: '30000',
      postOnly: 'POST_ONLY_REPRICE',
    },
  ],
});

// Get order status
const orderStatus = await client.trading.getOrderStatus('BTCZAR', order.id);
console.log('Order status:', orderStatus);

// Cancel order
await client.trading.cancelOrder({
  pair: 'BTCZAR',
  orderId: order.id,
});
```

### Wallets

```typescript
// Get crypto deposit address
const depositAddress = await client.wallets.getCryptoDepositAddress('BTC');
console.log('Deposit to:', depositAddress.address);

// Withdraw crypto
const withdrawal = await client.wallets.withdrawCrypto({
  currency: 'BTC',
  amount: '0.001',
  address: 'bc1q...',
});
console.log('Withdrawal ID:', withdrawal.id);

// Get bank accounts
const bankAccounts = await client.wallets.getBankAccounts('ZAR');
console.log('Bank accounts:', bankAccounts);
```

### Futures Trading

```typescript
// Get open futures positions
const positions = await client.futures.getOpenPositions();
console.log('Open positions:', positions);

// Get leverage info
const leverage = await client.futures.getLeverageInfo('BTCUSDTPERP');
console.log('Current leverage:', leverage);

// Update leverage
await client.futures.updateLeverage('BTCUSDTPERP', {
  leverageMultiple: 5,
});
```

### Subaccount Impersonation

```typescript
const client = new ValrClient({
  apiKey: 'your-primary-account-api-key',
  apiSecret: 'your-primary-account-api-secret',
  subaccountId: 'subaccount-id',
});

// All requests will now be made on behalf of the subaccount
const balances = await client.account.getBalances();

// Change subaccount or clear
client.setSubaccountId('different-subaccount-id');
client.setSubaccountId(undefined); // Back to primary account
```

## API Categories

The client organizes endpoints into logical categories:

- **`client.public`** - Public market data (no auth required)
- **`client.account`** - Account information, balances, history
- **`client.trading`** - Order placement and management
- **`client.wallets`** - Deposits and withdrawals
- **`client.futures`** - Futures positions and leverage
- **`client.margin`** - Margin trading
- **`client.loans`** - Lending and borrowing
- **`client.earn`** - Staking and earning products
- **`client.pay`** - Payment functionality
- **`client.bundles`** - Currency bundles
- **`client.health`** - API health status

## Authentication

VALR API uses HMAC SHA512 signatures for authentication. This client handles all signature generation automatically.

### Getting API Keys

1. Enable 2FA on your VALR account
2. Navigate to Account → API Keys
3. Create a new API key with appropriate permissions:
   - **View**: Read-only access to account data
   - **Trade**: Place and cancel orders
   - **Transfer**: Transfer between accounts
   - **Withdraw**: Withdraw funds

### API Key Security

- Never commit your API keys to version control
- Store keys in environment variables:
  ```typescript
  const client = new ValrClient({
    apiKey: process.env.VALR_API_KEY,
    apiSecret: process.env.VALR_API_SECRET,
  });
  ```
- Use minimal permissions for each key
- Regularly rotate your API keys
- Delete unused API keys

## Error Handling

The client throws typed errors for different failure scenarios:

```typescript
import {
  ValrError,
  ValrAuthenticationError,
  ValrRateLimitError,
  ValrValidationError,
  ValrApiError,
} from 'valr-typescript-client';

try {
  await client.trading.placeLimitOrder({
    pair: 'BTCZAR',
    side: 'BUY',
    quantity: '0.001',
    price: '500000',
  });
} catch (error) {
  if (error instanceof ValrAuthenticationError) {
    console.error('Authentication failed - check your API keys');
  } else if (error instanceof ValrRateLimitError) {
    console.error('Rate limit exceeded - slow down requests');
  } else if (error instanceof ValrValidationError) {
    console.error('Validation error:', error.errors);
  } else if (error instanceof ValrApiError) {
    console.error('API error:', error.statusCode, error.message);
  } else if (error instanceof ValrError) {
    console.error('VALR error:', error.message);
  } else {
    console.error('Unknown error:', error);
  }
}
```

## Rate Limits

VALR enforces rate limits on API requests:

- **2000 requests per minute** per API key
- **1200 requests per minute** per IP address
- Some endpoints have stricter per-second limits (e.g., order placement: 400/s)

The client automatically includes rate limit information in error responses when limits are exceeded.

## TypeScript Support

The client is written in TypeScript and provides comprehensive type definitions:

```typescript
import type {
  CurrencyPair,
  OrderSide,
  OrderStatus,
  Balance,
  MarketSummary,
  OrderResponse,
} from 'valr-typescript-client';

// All API responses are fully typed
const balances: Balance[] = await client.account.getBalances();
const markets: MarketSummary[] = await client.public.getMarketSummary();

// Request parameters are type-checked
await client.trading.placeLimitOrder({
  pair: 'BTCZAR', // Type: CurrencyPair
  side: 'BUY', // Type: OrderSide
  quantity: '0.001',
  price: '500000',
  postOnly: 'POST_ONLY_REPRICE', // Type-checked enum
});
```

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Type check
npm run type-check
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Links

- [VALR Website](https://www.valr.com)
- [VALR API Documentation](https://docs.valr.com)
- [GitHub Repository](https://github.com/yourusername/valr-typescript-client)
- [NPM Package](https://www.npmjs.com/package/valr-typescript-client)

## Disclaimer

This is an unofficial client library and is not affiliated with or endorsed by VALR. Use at your own risk.

## Support

For issues and questions:

- [GitHub Issues](https://github.com/yourusername/valr-typescript-client/issues)
- [VALR Support](https://support.valr.com)
