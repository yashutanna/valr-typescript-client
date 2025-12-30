import type { CurrencyPair, CurrencyCode } from './common';

/**
 * Margin information V1
 */
export interface MarginInfoV1 {
  /** Initial margin fraction */
  initialMarginFraction: string;
  /** Total borrowed in reference currency */
  totalBorrowedInReference: string;
  /** Collateralised balances in reference currency */
  collateralisedBalancesInReference: string;
  /** Reference currency */
  referenceCurrency: CurrencyCode;
  /** Initial required in reference currency */
  initialRequiredInReference: string;
  /** Available in reference currency */
  availableInReference: string;
  /** Maintenance margin fraction */
  maintenanceMarginFraction: string;
  /** Auto close margin fraction */
  autoCloseMarginFraction: string;
  /** Total positions at entry in reference currency */
  totalPositionsAtEntryInReference: string;
  /** Total unrealised futures PnL in reference currency */
  totalUnrealisedFuturesPnlInReference: string;
}

/**
 * Margin information V2
 */
export interface MarginInfoV2 {
  /** Initial margin fraction */
  initialMarginFraction: string;
  /** Total leveraged exposure in reference currency */
  totalLeveragedExposureInReference: string;
  /** Collateralized balances in reference currency */
  collateralizedBalancesInReference: string;
  /** Reference currency */
  referenceCurrency: CurrencyCode;
  /** Initial required in reference currency */
  initialRequiredInReference: string;
  /** Available in reference currency */
  availableInReference: string;
  /** Maintenance margin fraction */
  maintenanceMarginFraction: string;
  /** Auto close margin fraction */
  autoCloseMarginFraction: string;
  /** Total positions at entry in reference currency */
  totalPositionsAtEntryInReference: string;
  /** Total unrealised futures PnL in reference currency */
  totalUnrealisedFuturesPnlInReference: string;
  /** Total borrowed in reference currency */
  totalBorrowedInReference: string;
  /** Trade reserved in reference currency */
  tradeReservedInReference: string;
}

/**
 * Account margin status (enabled/disabled)
 */
export interface AccountMarginStatus {
  /** Whether margin trading is enabled */
  marginEnabled: boolean;
  /** Whether account is in liquidation */
  inLiquidation: boolean;
  /** Whether futures trading is enabled */
  futuresEnabled: boolean;
}

/**
 * Enable/disable margin trading request
 */
export interface EnableMarginRequest {
  /** Account status field name */
  accountStatusFieldName: 'MARGIN_ENABLED' | 'FUTURES_ENABLED';
  /** Whether to enable or disable */
  enabled: boolean;
}

/**
 * Leverage information for a currency pair
 */
export interface LeverageInfo {
  /** Currency pair symbol */
  pairSymbol: CurrencyPair;
  /** Leverage multiple */
  leverageMultiple: number;
  /** Initial margin fraction */
  initialMarginFraction: number;
  /** Maintenance margin fraction */
  maintenanceMarginFraction: number;
  /** Auto close margin fraction */
  autoCloseMarginFraction: number;
  /** Risk limit */
  riskLimit: number;
  /** Risk limit currency */
  riskLimitCurrency: CurrencyCode;
}

/**
 * Update leverage request
 */
export interface UpdateLeverageRequest {
  /** Leverage multiple */
  leverageMultiple: number;
}
