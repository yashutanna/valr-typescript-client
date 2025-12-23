import type { CurrencyPair } from './common';

/**
 * Margin account status
 */
export interface MarginStatus {
  /** Whether margin trading is enabled */
  enabled: boolean;
  /** Total equity (collateral value) */
  totalEquity: string;
  /** Total borrowed */
  totalBorrowed: string;
  /** Available margin */
  availableMargin: string;
  /** Margin used */
  marginUsed: string;
  /** Margin ratio (equity / borrowed) */
  marginRatio: string;
  /** Whether account is in margin call */
  marginCall: boolean;
  /** Liquidation risk level */
  liquidationRisk?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

/**
 * Enable margin trading request
 */
export interface EnableMarginRequest {
  /** Accept terms and conditions */
  acceptTerms: boolean;
}

/**
 * Currency leverage settings
 */
export interface CurrencyLeverageSettings {
  /** Currency pair */
  currencyPair: CurrencyPair;
  /** Leverage multiple */
  leverageMultiple: number;
}
