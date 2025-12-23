import type { CurrencyCode, ISOTimestamp } from './common';

/**
 * Bundle (basket of currencies)
 */
export interface Bundle {
  /** Bundle ID */
  id: string;
  /** Bundle name */
  name: string;
  /** Bundle description */
  description: string;
  /** Currencies and their weights */
  composition: BundleComposition[];
  /** Whether bundle is available */
  available: boolean;
}

/**
 * Bundle composition (currency weight)
 */
export interface BundleComposition {
  /** Currency */
  currency: CurrencyCode;
  /** Weight/percentage in bundle */
  weight: string;
}

/**
 * Buy bundle request
 */
export interface BuyBundleRequest {
  /** Bundle ID */
  bundleId: string;
  /** Amount to invest (in quote currency) */
  amount: string;
  /** Quote currency */
  quoteCurrency: CurrencyCode;
}

/**
 * Bundle order
 */
export interface BundleOrder {
  /** Order ID */
  id: string;
  /** Bundle ID */
  bundleId: string;
  /** Amount invested */
  amount: string;
  /** Status */
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  /** When created */
  createdAt: ISOTimestamp;
}
