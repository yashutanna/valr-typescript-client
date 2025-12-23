import { ValrClient } from '../src';

/**
 * Example 1: Manage crypto deposits
 */
async function manageCryptoDeposits() {
  const client = new ValrClient({
    apiKey: process.env.VALR_API_KEY!,
    apiSecret: process.env.VALR_API_SECRET!,
  });

  try {
    console.log('=== Crypto Deposit Management ===\n');

    // Get deposit address for BTC
    const btcAddress = await client.wallets.getCryptoDepositAddress('BTC');
    console.log('Bitcoin Deposit Address:');
    console.log(`  Address: ${btcAddress.address}`);
    console.log(`  Currency: ${btcAddress.currency}`);
    if (btcAddress.networkType) {
      console.log(`  Network: ${btcAddress.networkType}`);
    }

    // Get deposit address for ETH
    const ethAddress = await client.wallets.getCryptoDepositAddress('ETH');
    console.log('\nEthereum Deposit Address:');
    console.log(`  Address: ${ethAddress.address}`);
    console.log(`  Currency: ${ethAddress.currency}`);

    // For currencies with multiple networks (e.g., USDT)
    const usdtAddress = await client.wallets.getCryptoDepositAddress('USDT', 'Ethereum');
    console.log('\nUSDT Deposit Address (Ethereum):');
    console.log(`  Address: ${usdtAddress.address}`);
    console.log(`  Network: ${usdtAddress.networkType}`);

    console.log('\n⚠️  Important:');
    console.log('  - Always verify the network before depositing');
    console.log('  - Sending to wrong network will result in loss of funds');
    console.log('  - Keep your deposit addresses secure');
  } catch (error: any) {
    console.error('Error:', error.message);
  }
}

/**
 * Example 2: Withdraw cryptocurrency
 */
async function withdrawCrypto() {
  const client = new ValrClient({
    apiKey: process.env.VALR_API_KEY!,
    apiSecret: process.env.VALR_API_SECRET!,
  });

  try {
    console.log('=== Crypto Withdrawal ===\n');

    // Example withdrawal (commented out for safety)
    console.log('⚠️  Withdrawal example (not executed for safety)\n');

    const withdrawalRequest = {
      currency: 'BTC',
      amount: '0.001',
      address: 'bc1q...your-destination-address',
    };

    console.log('Withdrawal details:');
    console.log(`  Currency: ${withdrawalRequest.currency}`);
    console.log(`  Amount: ${withdrawalRequest.amount}`);
    console.log(`  To Address: ${withdrawalRequest.address}`);

    // Uncomment to actually execute:
    // const withdrawal = await client.wallets.withdrawCrypto(withdrawalRequest);
    // console.log(`\n✓ Withdrawal initiated:`);
    // console.log(`  Withdrawal ID: ${withdrawal.id}`);
    // console.log(`  Status: ${withdrawal.status}`);
    // console.log(`  Amount: ${withdrawal.amount}`);
    // console.log(`  Fee: ${withdrawal.fee}`);

    console.log('\n⚠️  Important security notes:');
    console.log('  - Always double-check the destination address');
    console.log('  - Verify the network matches the address');
    console.log('  - Start with a small test transaction');
    console.log('  - Cryptocurrency transactions are irreversible');
  } catch (error: any) {
    console.error('Error:', error.message);
  }
}

/**
 * Example 3: Check withdrawal status
 */
async function checkWithdrawalStatus() {
  const client = new ValrClient({
    apiKey: process.env.VALR_API_KEY!,
    apiSecret: process.env.VALR_API_SECRET!,
  });

  try {
    console.log('=== Check Withdrawal Status ===\n');

    const currency = 'BTC';
    const withdrawalId = 'your-withdrawal-id';

    console.log(`Checking status for withdrawal: ${withdrawalId}\n`);

    // Uncomment to check actual withdrawal:
    // const status = await client.wallets.getCryptoWithdrawalStatus(currency, withdrawalId);
    // console.log('Withdrawal Status:');
    // console.log(`  ID: ${status.id}`);
    // console.log(`  Currency: ${status.currency}`);
    // console.log(`  Amount: ${status.amount}`);
    // console.log(`  Fee: ${status.fee}`);
    // console.log(`  Status: ${status.status}`);
    // console.log(`  Address: ${status.address}`);
    // if (status.transactionHash) {
    //   console.log(`  TX Hash: ${status.transactionHash}`);
    // }
    // if (status.confirmations) {
    //   console.log(`  Confirmations: ${status.confirmations}`);
    // }

    console.log('Status values:');
    console.log('  PENDING - Withdrawal is being processed');
    console.log('  PROCESSING - Transaction has been broadcast');
    console.log('  CONFIRMED - Transaction confirmed on blockchain');
    console.log('  FAILED - Withdrawal failed');
    console.log('  CANCELLED - Withdrawal was cancelled');
  } catch (error: any) {
    console.error('Error:', error.message);
  }
}

/**
 * Example 4: Manage fiat bank accounts
 */
async function manageBankAccounts() {
  const client = new ValrClient({
    apiKey: process.env.VALR_API_KEY!,
    apiSecret: process.env.VALR_API_SECRET!,
  });

  try {
    console.log('=== Fiat Bank Account Management ===\n');

    // Get linked bank accounts
    const bankAccounts = await client.wallets.getBankAccounts('ZAR');

    if (bankAccounts.length === 0) {
      console.log('No bank accounts linked\n');
    } else {
      console.log(`You have ${bankAccounts.length} linked bank account(s):\n`);
      bankAccounts.forEach((account, index) => {
        console.log(`Account ${index + 1}:`);
        console.log(`  Bank: ${account.bank}`);
        console.log(`  Holder: ${account.accountHolder}`);
        console.log(`  Number: ${account.accountNumber}`);
        console.log(`  Verified: ${account.verified ? 'Yes' : 'No'}`);
        console.log('');
      });
    }

    // Link a new bank account (example - commented out)
    console.log('To link a new account:');
    console.log('```typescript');
    console.log('const newAccount = await client.wallets.linkBankAccount("ZAR", {');
    console.log('  bank: "Standard Bank",');
    console.log('  accountHolder: "John Doe",');
    console.log('  accountNumber: "123456789",');
    console.log('  branchCode: "051001",');
    console.log('  accountType: "Current"');
    console.log('});');
    console.log('```');
  } catch (error: any) {
    console.error('Error:', error.message);
  }
}

/**
 * Example 5: Fiat deposits and withdrawals
 */
async function manageFiatTransfers() {
  const client = new ValrClient({
    apiKey: process.env.VALR_API_KEY!,
    apiSecret: process.env.VALR_API_SECRET!,
  });

  try {
    console.log('=== Fiat Deposits and Withdrawals ===\n');

    // Get deposit reference
    const depositInfo = await client.wallets.getFiatDepositReference('ZAR');
    console.log('To deposit ZAR to your VALR account:');
    console.log(`  Bank: ${depositInfo.bankAccountDetails.bank}`);
    console.log(`  Account Holder: ${depositInfo.bankAccountDetails.accountHolder}`);
    console.log(`  Account Number: ${depositInfo.bankAccountDetails.accountNumber}`);
    if (depositInfo.bankAccountDetails.branchCode) {
      console.log(`  Branch Code: ${depositInfo.bankAccountDetails.branchCode}`);
    }
    console.log(`\n  ⚠️  IMPORTANT - Use this reference: ${depositInfo.paymentReference}`);
    console.log('  This unique reference links the deposit to your account\n');

    // Withdraw fiat (example - commented out for safety)
    console.log('To withdraw ZAR:');
    console.log('```typescript');
    console.log('const withdrawal = await client.wallets.withdrawFiat({');
    console.log('  currency: "ZAR",');
    console.log('  amount: "1000",');
    console.log('  beneficiaryId: "your-bank-account-id", // From linked accounts');
    console.log('  fast: false // Set to true for instant EFT (may have higher fees)');
    console.log('});');
    console.log('```');

    console.log('\n⚠️  Withdrawal timing:');
    console.log('  - Standard: 1-2 business days');
    console.log('  - Fast (instant): Usually within minutes (higher fees)');
  } catch (error: any) {
    console.error('Error:', error.message);
  }
}

/**
 * Example 6: Check balances before withdrawing
 */
async function checkBalancesBeforeWithdrawal() {
  const client = new ValrClient({
    apiKey: process.env.VALR_API_KEY!,
    apiSecret: process.env.VALR_API_SECRET!,
  });

  try {
    console.log('=== Balance Check for Withdrawals ===\n');

    // Get all balances
    const balances = await client.account.getBalances({ excludeZeroBalances: true });

    console.log('Available for withdrawal:\n');

    balances.forEach((balance) => {
      const available = parseFloat(balance.available);
      const reserved = parseFloat(balance.reserved);

      if (available > 0 || reserved > 0) {
        console.log(`${balance.currency}:`);
        console.log(`  Total: ${balance.total}`);
        console.log(`  Available: ${balance.available} ✓`);
        console.log(`  Reserved: ${balance.reserved} (in orders/pending)`);
        console.log('');
      }
    });

    console.log('Notes:');
    console.log('  - Only "Available" balance can be withdrawn');
    console.log('  - "Reserved" balance is locked in open orders');
    console.log('  - Cancel orders to free up reserved balance');
  } catch (error: any) {
    console.error('Error:', error.message);
  }
}

// Run examples
// Uncomment the example you want to run:

manageCryptoDeposits().catch(console.error);
// withdrawCrypto().catch(console.error);
// checkWithdrawalStatus().catch(console.error);
// manageBankAccounts().catch(console.error);
// manageFiatTransfers().catch(console.error);
// checkBalancesBeforeWithdrawal().catch(console.error);
