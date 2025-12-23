import { describe, it, expect } from 'vitest';
import { RequestSigner } from '../../src/auth/RequestSigner';

describe('RequestSigner', () => {
  describe('signRequest', () => {
    it('should generate correct signature for GET request (VALR test vector 1)', () => {
      // Test vector from VALR API documentation
      const apiSecret = '4961b74efac86b25cce8fbe4c9811c4c7a787b7a5996660afcc2e287ad864363';
      const timestamp = 1558014486185;
      const verb = 'GET';
      const path = '/v1/account/balances';
      const expectedSignature = '9d52c181ed69460b49307b7891f04658e938b21181173844b5018b2fe783a6d4c62b8e67a03de4d099e7437ebfabe12c56233b73c6a0cc0f7ae87e05f6289928';

      const signature = RequestSigner.signRequest({
        apiSecret,
        timestamp,
        verb,
        path,
      });

      expect(signature).toBe(expectedSignature);
    });

    it('should generate correct signature for POST request (VALR test vector 2)', () => {
      // Test vector from VALR API documentation
      const apiSecret = '4961b74efac86b25cce8fbe4c9811c4c7a787b7a5996660afcc2e287ad864363';
      const timestamp = 1558017528946;
      const verb = 'POST';
      const path = '/v1/orders/market';
      const body = '{"customerOrderId":"ORDER-000001","pair":"BTCUSDC","side":"BUY","quoteAmount":"80000"}';
      const expectedSignature = '09f536e3dfdad58443f16010a97a0a21ad27486b7b8d6d4103170d885410ed77f037f1fa628474190d4f5c08ca12c1acc850901f1c2e75c6d906ec3b32b008d0';

      const signature = RequestSigner.signRequest({
        apiSecret,
        timestamp,
        verb,
        path,
        body,
      });

      expect(signature).toBe(expectedSignature);
    });

    it('should handle uppercase HTTP verbs', () => {
      const apiSecret = '4961b74efac86b25cce8fbe4c9811c4c7a787b7a5996660afcc2e287ad864363';
      const timestamp = 1558014486185;

      const sig1 = RequestSigner.signRequest({
        apiSecret,
        timestamp,
        verb: 'GET',
        path: '/v1/account/balances',
      });

      const sig2 = RequestSigner.signRequest({
        apiSecret,
        timestamp,
        verb: 'get',
        path: '/v1/account/balances',
      });

      expect(sig1).toBe(sig2);
    });

    it('should include subaccountId in signature when provided', () => {
      const apiSecret = '4961b74efac86b25cce8fbe4c9811c4c7a787b7a5996660afcc2e287ad864363';
      const timestamp = 1558014486185;
      const verb = 'GET';
      const path = '/v1/account/balances';

      const sig1 = RequestSigner.signRequest({
        apiSecret,
        timestamp,
        verb,
        path,
      });

      const sig2 = RequestSigner.signRequest({
        apiSecret,
        timestamp,
        verb,
        path,
        subaccountId: '12345',
      });

      // Signatures should be different when subaccountId is included
      expect(sig1).not.toBe(sig2);
    });
  });

  describe('getTimestamp', () => {
    it('should return a valid timestamp', () => {
      const timestamp = RequestSigner.getTimestamp();
      expect(timestamp).toBeGreaterThan(0);
      expect(Number.isInteger(timestamp)).toBe(true);
    });

    it('should return current time in milliseconds', () => {
      const before = Date.now();
      const timestamp = RequestSigner.getTimestamp();
      const after = Date.now();

      expect(timestamp).toBeGreaterThanOrEqual(before);
      expect(timestamp).toBeLessThanOrEqual(after);
    });
  });

  describe('validateCredentials', () => {
    it('should accept valid API key and secret', () => {
      const apiKey = 'b9fb68df5485639d03c3171cf6e49b89e52fd78d5c313819b9c592b59c689f33';
      const apiSecret = '4961b74efac86b25cce8fbe4c9811c4c7a787b7a5996660afcc2e287ad864363';

      expect(() => {
        RequestSigner.validateCredentials(apiKey, apiSecret);
      }).not.toThrow();
    });

    it('should reject empty API key', () => {
      const apiSecret = '4961b74efac86b25cce8fbe4c9811c4c7a787b7a5996660afcc2e287ad864363';

      expect(() => {
        RequestSigner.validateCredentials('', apiSecret);
      }).toThrow('Invalid API key');
    });

    it('should reject empty API secret', () => {
      const apiKey = 'b9fb68df5485639d03c3171cf6e49b89e52fd78d5c313819b9c592b59c689f33';

      expect(() => {
        RequestSigner.validateCredentials(apiKey, '');
      }).toThrow('Invalid API secret');
    });

    it('should reject API key with wrong length', () => {
      const apiKey = 'tooshort';
      const apiSecret = '4961b74efac86b25cce8fbe4c9811c4c7a787b7a5996660afcc2e287ad864363';

      expect(() => {
        RequestSigner.validateCredentials(apiKey, apiSecret);
      }).toThrow('must be 64 characters long');
    });

    it('should reject API key with non-hex characters', () => {
      const apiKey = 'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz';
      const apiSecret = '4961b74efac86b25cce8fbe4c9811c4c7a787b7a5996660afcc2e287ad864363';

      expect(() => {
        RequestSigner.validateCredentials(apiKey, apiSecret);
      }).toThrow('must be hexadecimal');
    });
  });
});
