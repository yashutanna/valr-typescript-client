import { describe, it, expect, beforeEach } from 'vitest';
import { ValrClient } from '../../src/client/ValrClient';
import { ValrConfigurationError } from '../../src/errors/ValrError';

describe('ValrClient', () => {
  describe('constructor', () => {
    it('should create client without credentials for public API', () => {
      const client = new ValrClient();
      expect(client).toBeDefined();
      expect(client.public).toBeDefined();
    });

    it('should create client with valid credentials', () => {
      const client = new ValrClient({
        apiKey: 'b9fb68df5485639d03c3171cf6e49b89e52fd78d5c313819b9c592b59c689f33',
        apiSecret: '4961b74efac86b25cce8fbe4c9811c4c7a787b7a5996660afcc2e287ad864363',
      });

      expect(client).toBeDefined();
      expect(client.public).toBeDefined();
      expect(client.account).toBeDefined();
      expect(client.trading).toBeDefined();
    });

    it('should throw error if only API key is provided', () => {
      expect(() => {
        new ValrClient({
          apiKey: 'b9fb68df5485639d03c3171cf6e49b89e52fd78d5c313819b9c592b59c689f33',
        });
      }).toThrow(ValrConfigurationError);
    });

    it('should throw error if only API secret is provided', () => {
      expect(() => {
        new ValrClient({
          apiSecret: '4961b74efac86b25cce8fbe4c9811c4c7a787b7a5996660afcc2e287ad864363',
        });
      }).toThrow(ValrConfigurationError);
    });

    it('should throw error for invalid API key format', () => {
      expect(() => {
        new ValrClient({
          apiKey: 'invalid',
          apiSecret: '4961b74efac86b25cce8fbe4c9811c4c7a787b7a5996660afcc2e287ad864363',
        });
      }).toThrow();
    });

    it('should accept custom base URL', () => {
      const customUrl = 'https://custom.api.valr.com';
      const client = new ValrClient({
        baseURL: customUrl,
      });

      expect(client).toBeDefined();
    });

    it('should accept custom timeout', () => {
      const client = new ValrClient({
        timeout: 60000,
      });

      expect(client).toBeDefined();
    });

    it('should accept subaccount ID', () => {
      const client = new ValrClient({
        apiKey: 'b9fb68df5485639d03c3171cf6e49b89e52fd78d5c313819b9c592b59c689f33',
        apiSecret: '4961b74efac86b25cce8fbe4c9811c4c7a787b7a5996660afcc2e287ad864363',
        subaccountId: '12345',
      });

      expect(client.getSubaccountId()).toBe('12345');
    });
  });

  describe('API groups', () => {
    let client: ValrClient;

    beforeEach(() => {
      client = new ValrClient({
        apiKey: 'b9fb68df5485639d03c3171cf6e49b89e52fd78d5c313819b9c592b59c689f33',
        apiSecret: '4961b74efac86b25cce8fbe4c9811c4c7a787b7a5996660afcc2e287ad864363',
      });
    });

    it('should have all API groups initialized', () => {
      expect(client.public).toBeDefined();
      expect(client.account).toBeDefined();
      expect(client.trading).toBeDefined();
      expect(client.wallets).toBeDefined();
      expect(client.futures).toBeDefined();
      expect(client.margin).toBeDefined();
      expect(client.loans).toBeDefined();
      expect(client.stake).toBeDefined();
      expect(client.pay).toBeDefined();
      expect(client.bundles).toBeDefined();
      expect(client.health).toBeDefined();
    });
  });

  describe('subaccount management', () => {
    let client: ValrClient;

    beforeEach(() => {
      client = new ValrClient({
        apiKey: 'b9fb68df5485639d03c3171cf6e49b89e52fd78d5c313819b9c592b59c689f33',
        apiSecret: '4961b74efac86b25cce8fbe4c9811c4c7a787b7a5996660afcc2e287ad864363',
      });
    });

    it('should set subaccount ID', () => {
      client.setSubaccountId('12345');
      expect(client.getSubaccountId()).toBe('12345');
    });

    it('should clear subaccount ID', () => {
      client.setSubaccountId('12345');
      expect(client.getSubaccountId()).toBe('12345');

      client.setSubaccountId(undefined);
      expect(client.getSubaccountId()).toBeUndefined();
    });

    it('should start with undefined subaccount ID if not provided', () => {
      expect(client.getSubaccountId()).toBeUndefined();
    });

    it('should start with provided subaccount ID', () => {
      const clientWithSub = new ValrClient({
        apiKey: 'b9fb68df5485639d03c3171cf6e49b89e52fd78d5c313819b9c592b59c689f33',
        apiSecret: '4961b74efac86b25cce8fbe4c9811c4c7a787b7a5996660afcc2e287ad864363',
        subaccountId: '67890',
      });

      expect(clientWithSub.getSubaccountId()).toBe('67890');
    });
  });
});
