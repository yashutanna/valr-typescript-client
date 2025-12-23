import type { HttpClient } from '../utils/http';
import type {
  StakeRequest,
  UnstakeRequest,
  EarnBalance,
  EarnRate,
  EarnReward,
  EarnHistoryItem,
  EarnBalancesParams,
  EarnRatesParams,
  EarnRewardsParams,
  EarnHistoryParams,
} from '../types';

/**
 * Staking API methods - Staking and Lending (requires authentication)
 *
 * VALR offers two types of earning opportunities:
 * - STAKE: Lock crypto to earn rewards
 * - LEND: Lend crypto to earn interest
 */
export class StakeAPI {
  constructor(private http: HttpClient) {}

  /**
   * Stake/Lock cryptocurrency to earn rewards
   *
   * @param request - Stake request with currency, amount, and earn type
   * @returns Promise that resolves when stake is successful
   *
   * @example
   * ```typescript
   * await client.stake.stake({
   *   currencySymbol: 'ETH',
   *   amount: '1.5',
   *   earnType: 'STAKE'
   * });
   * ```
   */
  async stake(request: StakeRequest): Promise<void> {
    await this.http.post('/v1/staking/stake', request);
  }

  /**
   * Unstake/Unlock cryptocurrency
   *
   * @param request - Unstake request with currency, amount, and earn type
   * @returns Promise that resolves when unstake is successful
   *
   * @example
   * ```typescript
   * await client.stake.unstake({
   *   currencySymbol: 'ETH',
   *   amount: '1.5',
   *   earnType: 'STAKE'
   * });
   * ```
   */
  async unstake(request: UnstakeRequest): Promise<void> {
    await this.http.post('/v1/staking/un-stake', request);
  }

  /**
   * Get earn balances for a specific earn type
   *
   * @param params - Optional parameters (earnType filter)
   * @returns Promise resolving to array of earn balances
   *
   * @example
   * ```typescript
   * // Get staking balances
   * const stakingBalances = await client.stake.getBalances({ earnType: 'STAKE' });
   *
   * // Get lending balances
   * const lendingBalances = await client.stake.getBalances({ earnType: 'LEND' });
   * ```
   */
  async getBalances(params?: EarnBalancesParams): Promise<EarnBalance[]> {
    const response = await this.http.get<EarnBalance[]>('/v1/staking/balances', { params });
    return response.data;
  }

  /**
   * Get all earn balances
   *
   * @param params - Optional parameters (earnType filter)
   * @returns Promise resolving to array of all earn balances
   *
   * @example
   * ```typescript
   * const allBalances = await client.stake.getAllBalances({ earnType: 'LEND' });
   * ```
   */
  async getAllBalances(params?: EarnBalancesParams): Promise<EarnBalance[]> {
    const response = await this.http.get<EarnBalance[]>('/v1/staking/balances/all', { params });
    return response.data;
  }

  /**
   * Get current earning rates for available currencies
   *
   * @param params - Optional parameters (earnType filter)
   * @returns Promise resolving to array of earn rates
   *
   * @example
   * ```typescript
   * // Get staking rates
   * const stakingRates = await client.stake.getRates({ earnType: 'STAKE' });
   *
   * // Get lending rates
   * const lendingRates = await client.stake.getRates({ earnType: 'LEND' });
   * ```
   */
  async getRates(params?: EarnRatesParams): Promise<EarnRate[]> {
    const response = await this.http.get<EarnRate[]>('/v1/staking/rates', { params });
    return response.data;
  }

  /**
   * Get earn rewards history for a specific currency
   *
   * @param params - Query parameters including currency symbol
   * @returns Promise resolving to array of earn rewards
   *
   * @example
   * ```typescript
   * const rewards = await client.stake.getRewards({
   *   currencySymbol: 'ETH',
   *   earnType: 'LEND',
   *   skip: 0,
   *   limit: 100
   * });
   * ```
   */
  async getRewards(params: EarnRewardsParams): Promise<EarnReward[]> {
    const response = await this.http.get<EarnReward[]>('/v1/staking/rewards', { params });
    return response.data;
  }

  /**
   * Get earn transaction history (stakes and unstakes)
   *
   * @param params - Query parameters including currency symbol
   * @returns Promise resolving to array of earn history items
   *
   * @example
   * ```typescript
   * const history = await client.stake.getHistory({
   *   currencySymbol: 'ETH',
   *   earnType: 'STAKE',
   *   skip: 0,
   *   limit: 100
   * });
   * ```
   */
  async getHistory(params: EarnHistoryParams): Promise<EarnHistoryItem[]> {
    const response = await this.http.get<EarnHistoryItem[]>('/v1/staking/history', { params });
    return response.data;
  }
}
