import { ValrClient } from '../src';

/**
 * Example 1: View futures positions and information
 */
async function viewFuturesPositions() {
  const client = new ValrClient({
    apiKey: process.env.VALR_API_KEY!,
    apiSecret: process.env.VALR_API_SECRET!,
  });

  try {
    console.log('=== Futures Positions ===\n');

    // Get all open positions
    const positions = await client.futures.getOpenPositions();

    if (positions.length === 0) {
      console.log('No open futures positions');
    } else {
      console.log(`You have ${positions.length} open position(s):\n`);

      positions.forEach((position, index) => {
        console.log(`Position ${index + 1}:`);
        console.log(`  Pair: ${position.currencyPair}`);
        console.log(`  Side: ${position.side}`);
        console.log(`  Quantity: ${position.quantity}`);
        console.log(`  Entry Price: ${position.entryPrice}`);
        console.log(`  Mark Price: ${position.markPrice}`);
        console.log(`  Liquidation Price: ${position.liquidationPrice}`);
        console.log(`  Unrealized PnL: ${position.unrealizedPnl}`);
        console.log(`  Realized PnL: ${position.realizedPnl}`);
        console.log(`  Leverage: ${position.leverage}x`);
        console.log(`  Margin: ${position.margin}`);
        console.log('');
      });
    }

    // Get closed positions summary
    const closedSummary = await client.futures.getClosedPositionsSummary();
    console.log(`\nClosed positions summary:`);
    closedSummary.forEach((summary) => {
      console.log(`  ${summary.currencyPair}:`);
      console.log(`    Realized PnL: ${summary.realizedPnl}`);
      console.log(`    Total Funding: ${summary.totalFunding}`);
      console.log(`    Positions Closed: ${summary.positionCount}`);
    });
  } catch (error: any) {
    console.error('Error:', error.message);
  }
}

/**
 * Example 2: Manage leverage settings
 */
async function manageLeverage() {
  const client = new ValrClient({
    apiKey: process.env.VALR_API_KEY!,
    apiSecret: process.env.VALR_API_SECRET!,
  });

  try {
    console.log('=== Leverage Management ===\n');

    const pair = 'BTCUSDTPERP';

    // Get current leverage info
    const leverageInfo = await client.futures.getLeverageInfo(pair);
    console.log(`Current leverage for ${pair}:`);
    console.log(`  Current: ${leverageInfo.leverageMultiple}x`);
    console.log(`  Maximum: ${leverageInfo.maxLeverageMultiple}x\n`);

    // Get available leverage options
    const options = await client.public.getAvailableLeverageOptions(pair);
    console.log(`Available leverage options:`);
    options.forEach((option) => {
      console.log(`  ${option.leverageMultiple}x:`);
      console.log(`    Initial Margin: ${(option.initialMarginFraction * 100).toFixed(2)}%`);
      console.log(`    Maintenance Margin: ${(option.maintenanceMarginFraction * 100).toFixed(2)}%`);
      console.log(`    Risk Limit: ${option.riskLimitValue}`);
    });

    // Update leverage (example - commented out for safety)
    // const newLeverage = 3;
    // console.log(`\nUpdating leverage to ${newLeverage}x...`);
    // const updated = await client.futures.updateLeverage(pair, {
    //   leverageMultiple: newLeverage,
    // });
    // console.log(`✓ Leverage updated to ${updated.leverageMultiple}x`);
  } catch (error: any) {
    console.error('Error:', error.message);
  }
}

/**
 * Example 3: View funding history
 */
async function viewFundingHistory() {
  const client = new ValrClient({
    apiKey: process.env.VALR_API_KEY!,
    apiSecret: process.env.VALR_API_SECRET!,
  });

  try {
    console.log('=== Funding History ===\n');

    const pair = 'BTCUSDTPERP';

    // Get public funding rate history
    const publicHistory = await client.public.getFundingRateHistory(pair);
    console.log(`Latest funding rates for ${pair}:`);
    publicHistory.slice(0, 5).forEach((rate) => {
      console.log(`  ${rate.fundingTime}: ${(parseFloat(rate.fundingRate) * 100).toFixed(4)}%`);
    });

    // Get your funding payments
    const fundingPayments = await client.futures.getFundingHistory({
      currencyPair: pair,
      skip: 0,
      limit: 10,
    });

    console.log(`\nYour recent funding payments:`);
    fundingPayments.forEach((payment) => {
      console.log(`  ${payment.fundingTime}:`);
      console.log(`    Rate: ${(parseFloat(payment.fundingRate) * 100).toFixed(4)}%`);
      console.log(`    Amount: ${payment.fundingAmount}`);
      console.log(`    Position Size: ${payment.positionSize}`);
    });
  } catch (error: any) {
    console.error('Error:', error.message);
  }
}

/**
 * Example 4: Futures information and contract details
 */
async function viewFuturesInfo() {
  const client = new ValrClient();

  try {
    console.log('=== Futures Contract Information ===\n');

    // Get all futures contracts info
    const futuresInfo = await client.public.getFuturesInfo();

    console.log(`Available futures contracts:\n`);
    futuresInfo.forEach((info) => {
      console.log(`${info.currencyPair}:`);
      console.log(`  Estimated Funding Rate: ${(parseFloat(info.estimatedFundingRate) * 100).toFixed(4)}%`);
      console.log(`  Open Interest: ${info.openInterest}`);
      console.log(`  Next Funding: ${new Date(info.nextFundingRun).toLocaleString()}`);
      console.log(`  Next PnL Run: ${new Date(info.nextPnlRun).toLocaleString()}`);
      console.log('');
    });
  } catch (error: any) {
    console.error('Error:', error.message);
  }
}

/**
 * Example 5: Position history and analysis
 */
async function analyzePositionHistory() {
  const client = new ValrClient({
    apiKey: process.env.VALR_API_KEY!,
    apiSecret: process.env.VALR_API_SECRET!,
  });

  try {
    console.log('=== Position History Analysis ===\n');

    const pair = 'BTCUSDTPERP';

    // Get closed positions for a specific pair
    const closedPositions = await client.futures.getClosedPositions(pair);

    if (closedPositions.length === 0) {
      console.log(`No closed positions for ${pair}`);
      return;
    }

    console.log(`Analyzing ${closedPositions.length} closed positions for ${pair}:\n`);

    let totalPnl = 0;
    let winCount = 0;
    let lossCount = 0;

    closedPositions.forEach((position, index) => {
      const pnl = parseFloat(position.realizedPnl);
      totalPnl += pnl;

      if (pnl > 0) winCount++;
      else if (pnl < 0) lossCount++;

      console.log(`Position ${index + 1}:`);
      console.log(`  Side: ${position.side}`);
      console.log(`  Entry: ${position.entryPrice}`);
      console.log(`  Exit: ${position.exitPrice}`);
      console.log(`  Quantity: ${position.quantity}`);
      console.log(`  PnL: ${position.realizedPnl} ${pnl > 0 ? '✓' : '✗'}`);
      console.log(`  Duration: ${new Date(position.openedAt).toLocaleString()} → ${new Date(position.closedAt).toLocaleString()}`);
      console.log('');
    });

    console.log('=== Summary ===');
    console.log(`Total Positions: ${closedPositions.length}`);
    console.log(`Wins: ${winCount}`);
    console.log(`Losses: ${lossCount}`);
    console.log(`Win Rate: ${((winCount / closedPositions.length) * 100).toFixed(2)}%`);
    console.log(`Total PnL: ${totalPnl.toFixed(2)}`);
    console.log(`Average PnL: ${(totalPnl / closedPositions.length).toFixed(2)}`);
  } catch (error: any) {
    console.error('Error:', error.message);
  }
}

// Run examples
// Uncomment the example you want to run:

viewFuturesPositions().catch(console.error);
// manageLeverage().catch(console.error);
// viewFundingHistory().catch(console.error);
// viewFuturesInfo().catch(console.error);
// analyzePositionHistory().catch(console.error);
