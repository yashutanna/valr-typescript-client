import { ValrClient } from '../src';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Example: Using VALR API with Subaccounts
 *
 * IMPORTANT: There are TWO ways to work with subaccounts:
 *
 * 1. SUBACCOUNT API KEY (most common):
 *    - You created an API key directly on the subaccount
 *    - The key is already scoped to that subaccount
 *    - DO NOT include subaccountId in the client config
 *    - Use: new ValrClient({ apiKey, apiSecret })
 *
 * 2. PRIMARY ACCOUNT KEY + IMPERSONATION:
 *    - You have a primary account API key
 *    - You want to impersonate/access a subaccount
 *    - MUST include subaccountId in the client config
 *    - Use: new ValrClient({ apiKey, apiSecret, subaccountId })
 */

/**
 * Option 1: Using a subaccount API key (most common)
 */
async function subaccountKeyExample() {
  // If your API key was created on the subaccount itself
  const client = new ValrClient({
    apiKey: process.env.VALR_API_KEY!, // Subaccount API key
    apiSecret: process.env.VALR_API_SECRET!, // Subaccount API secret
    // DO NOT include subaccountId - the key is already scoped
  });

  console.log('=== Using Subaccount API Key ===\n');

  // All operations automatically use the subaccount
  const balances = await client.account.getBalances();
  console.log('Subaccount balances:');
  balances.forEach((balance) => {
    if (parseFloat(balance.total) > 0) {
      console.log(`  ${balance.currency}: ${balance.total}`);
    }
  });

  const openOrders = await client.trading.getAllOpenOrders();
  console.log(`\nOpen orders: ${openOrders.length}`);
}

/**
 * Option 2: Using primary account key to impersonate subaccount
 */
async function subaccountImpersonationExample() {
  // Initialize client with PRIMARY account key to impersonate a subaccount
  const client = new ValrClient({
    apiKey: process.env.VALR_PRIMARY_API_KEY!, // Primary account key
    apiSecret: process.env.VALR_PRIMARY_API_SECRET!, // Primary account secret
    subaccountId: process.env.VALR_SUBACCOUNT_ID!, // Subaccount to impersonate
  });

  console.log('=== Subaccount Example ===\n');

  // Get balances for the subaccount
  const balances = await client.account.getBalances();
  console.log('Subaccount balances:');
  balances.forEach((balance) => {
    if (parseFloat(balance.total) > 0) {
      console.log(`  ${balance.currency}: ${balance.total}`);
    }
  });

  // Get transaction history for the subaccount
  const transactions = await client.account.getTransactionHistory({ limit: 5 });
  console.log(`\nRecent transactions: ${transactions.length}`);

  // Get open orders for the subaccount
  const openOrders = await client.trading.getAllOpenOrders();
  console.log(`\nOpen orders: ${openOrders.length}`);

  // You can also change the subaccount ID dynamically
  const anotherSubaccountId = process.env.VALR_ANOTHER_SUBACCOUNT_ID;
  if (anotherSubaccountId) {
    client.setSubaccountId(anotherSubaccountId);
    console.log('\n✓ Switched to another subaccount');

    const newBalances = await client.account.getBalances();
    console.log('New subaccount balances:');
    newBalances.forEach((balance) => {
      if (parseFloat(balance.total) > 0) {
        console.log(`  ${balance.currency}: ${balance.total}`);
      }
    });
  }

  // Clear subaccount ID to use primary account
  client.setSubaccountId(undefined);
  console.log('\n✓ Switched back to primary account');
}

/**
 * Example: Staking/Lending with Subaccount
 */
async function subaccountStakingExample() {
  const client = new ValrClient({
    apiKey: process.env.VALR_API_KEY!,
    apiSecret: process.env.VALR_API_SECRET!,
    subaccountId: process.env.VALR_SUBACCOUNT_ID!,
  });

  console.log('\n=== Subaccount Staking Example ===\n');

  // Get staking rates
  const stakeRates = await client.stake.getRates({ earnType: 'STAKE' });
  console.log('Available staking rates:');
  stakeRates.forEach((rate) => {
    console.log(`  ${rate.currencySymbol}: ${rate.rate} (${rate.periodIntervalMinutes} min periods)`);
  });

  // Get current staking balances for this subaccount
  const stakingBalances = await client.stake.getBalances({ earnType: 'STAKE' });
  console.log('\nStaking balances:');
  stakingBalances.forEach((balance) => {
    console.log(`  ${balance.currencySymbol}: ${balance.amount}`);
  });

  // Get lending balances for this subaccount
  const lendingBalances = await client.stake.getBalances({ earnType: 'LEND' });
  console.log('\nLending balances:');
  lendingBalances.forEach((balance) => {
    console.log(`  ${balance.currencySymbol}: ${balance.amount}`);
  });
}

/**
 * Example: Transfering funds from a Subaccount
 */
async function transferBetweenSubaccountsExample() {
    const subAccount1Client = new ValrClient({
        apiKey: process.env.VALR_API_KEY!,
        apiSecret: process.env.VALR_API_SECRET!,
    });

    console.log('\n=== Subaccount Transfer example ===\n');

    const sendFundsResult = await subAccount1Client.account.transferBetweenAccounts({
        amount: "1",
        //@ts-ignore
        currencyCode: "ZAR",
        toId: process.env.DESTINATION_SUBACCOUNT,
        fromId: process.env.SOURCE_SUBACCOUNT,
        allowBorrow: false
    })
    console.log({ sendFundsResult })
}

// Run examples
// Choose based on your setup:
// subaccountKeyExample().catch(console.error); // If you have a subaccount API key
transferBetweenSubaccountsExample().catch(console.error);
// subaccountImpersonationExample().catch(console.error); // If you have a primary key + want to impersonate
// subaccountStakingExample().catch(console.error);
