import {ValrClient} from '../src';
import dotenv from 'dotenv';
dotenv.config();

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
/**
 * Option 1: Using a subaccount API key (most common)
 */
async function PayRecipientUsingCellphoneNumber(cell: string) {
  // If your API key was created on the subaccount itself
  const client = new ValrClient({
    apiKey: process.env.VALR_API_KEY!, // Subaccount API key
    apiSecret: process.env.VALR_API_SECRET!, // Subaccount API secret
  });

  // All operations automatically use the subaccount
  const balances = await client.account.getBalances();
  console.log('account balances:');
  balances.forEach((balance) => {
    if (parseFloat(balance.total) > 0) {
      console.log(`  ${balance.currency}: ${balance.total}`);
    }
  });

  const payResult = await client.pay.createPayment({
      amount: "15.13",
      currency: "ZAR",
      recipientCellNumber: cell,
      anonymous: false,
      senderNote: "welcome payment",
      recipientNote: "welcome to VALR"
  })

  console.log({payResult})
  let status = (await client.pay.getPaymentStatus(payResult.transactionId)).status


  while(!["COMPLETE", "CANCELLED"].includes(status)){
      console.log("waiting for payment to be Complete or cancelled");
      await sleep(1000)
      status = (await client.pay.getPaymentStatus(payResult.transactionId)).status
  }
}


// Run examples
// Choose based on your setup:
PayRecipientUsingCellphoneNumber(process.env.VALR_PAY_RECIPIENT_CELLPHONE_NUMBER!).catch(console.error);
