import type {
  CurrencyCode,
  CurrencyPair,
  ISOTimestamp,
  OrderSide,
  PaginationParams,
  CursorPaginationParams,
  TimeRangeParams,
  TransactionType,
  SubaccountId,
} from './common';

/**
 * Account balance
 */
export interface Balance {
  /** Currency code */
  currency: CurrencyCode;
  /** Available balance */
  available: string;
  /** Reserved balance (in open orders, etc.) */
  reserved: string;
  /** Total balance (available + reserved) */
  total: string;
  /** Updated timestamp */
  updatedAt?: ISOTimestamp;
}

/**
 * Transaction history entry
 */
export interface Transaction {
  /** Transaction type */
  transactionType: {
    /** Type code */
    type: TransactionType;
    /** Human-readable description */
    description: string;
  };
  /** Debited currency */
  debitCurrency: CurrencyCode;
  /** Debited amount */
  debitValue: string;
  /** Credited currency */
  creditCurrency: CurrencyCode;
  /** Credited amount */
  creditValue: string;
  /** Fee currency */
  feeCurrency: CurrencyCode;
  /** Fee value */
  feeValue: string;
  /** Event timestamp */
  eventAt: ISOTimestamp;
  /** Additional info (e.g., address, orderId) */
  additionalInfo?: Record<string, any>;
  /** Transaction ID */
  id: string;
}

/**
 * Trade history entry
 */
export interface AccountTrade {
  /** Trade price */
  price: string;
  /** Trade quantity */
  quantity: string;
  /** Currency pair */
  currencyPair: CurrencyPair;
  /** Timestamp of trade */
  tradedAt: ISOTimestamp;
  /** Order side (buy or sell) */
  side: OrderSide;
  /** Sequence ID */
  sequenceId: number;
  /** Trade ID */
  id: string;
  /** Order ID */
  orderId: string;
  /** Quote volume */
  quoteVolume: string;
  /** Fee currency */
  feeCurrency?: CurrencyCode;
  /** Fee amount */
  feeValue?: string;
  /** Taker or maker */
  takerOrMaker?: 'TAKER' | 'MAKER';
  /** Customer order ID if provided */
  customerOrderId?: string;
}

/**
 * Trade fee tier
 */
export interface TradeFee {
  /** Currency pair */
  currencyPair: CurrencyPair;
  /** Maker fee (as decimal, e.g., 0.001 = 0.1%) */
  makerFee: string;
  /** Taker fee (as decimal) */
  takerFee: string;
  /** 30-day volume in ZAR */
  thirtyDayVolume?: string;
}

/**
 * Subaccount information
 */
export interface Subaccount {
  /** Subaccount ID */
  id: SubaccountId;
  /** Subaccount label/name */
  label: string;
  /** When the subaccount was created */
  createdAt: ISOTimestamp;
}

/**
 * API key information
 */
export interface ApiKey {
  /** API key (masked) */
  key: string;
  /** Key label/name */
  label: string;
  /** Permissions */
  permissions: {
    /** View permission */
    view: boolean;
    /** Trade permission */
    trade: boolean;
    /** Transfer permission */
    transfer: boolean;
    /** Withdraw permission */
    withdraw: boolean;
    /** Link bank account permission */
    linkBankAccount: boolean;
  };
  /** When created */
  createdAt: ISOTimestamp;
  /** Last used timestamp */
  lastUsedAt?: ISOTimestamp;
}

/**
 * Query parameters for balances
 */
export interface BalancesParams {
  /** Exclude currencies with zero balance */
  excludeZeroBalances?: boolean;
}

/**
 * Query parameters for transaction history
 */
export interface TransactionHistoryParams extends PaginationParams, CursorPaginationParams, TimeRangeParams {
  /** Filter by transaction types */
  transactionTypes?: TransactionType[];
  /** Filter by currency */
  currency?: CurrencyCode;
}

/**
 * Query parameters for trade history
 */
export interface TradeHistoryParams extends PaginationParams {}

/**
 * Create API key request
 */
export interface CreateApiKeyRequest {
  /** Label for the API key */
  label: string;
  /** Permissions */
  permissions: {
    view?: boolean;
    trade?: boolean;
    transfer?: boolean;
    withdraw?: boolean;
    linkBankAccount?: boolean;
  };
  /** Subaccount ID (if creating key for subaccount) */
  subaccountId?: SubaccountId;
}

/**
 * Create API key response
 */
export interface CreateApiKeyResponse {
  /** API key */
  apiKey: string;
  /** API secret (only returned once!) */
  apiSecret: string;
  /** Key information */
  keyInfo: ApiKey;
}

/**
 * Create subaccount request
 */
export interface CreateSubaccountRequest {
  /** Label for the subaccount */
  label: string;
}

/**
 * Transfer between accounts request
 */
export interface TransferRequest {
  /** Currency to transfer */
  currencyCode: CurrencyCode;
  /** Amount to transfer */
  amount: string;
  /** Source subaccount ID (undefined for primary account) */
  fromId?: SubaccountId;
  /** Destination subaccount ID (undefined for primary account) */
  toId?: SubaccountId;
  /** Borrow on margin for transfer */
  allowBorrow?: boolean;
}
