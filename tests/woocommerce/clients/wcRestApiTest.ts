import axios from 'axios';
import rateLimit from 'axios-rate-limit';
import { expect } from 'chai';
import { WcRestApi } from '../../../src/woocommerce/clients/wcRestApi';

describe('WcRestApitests', () => {
  describe('#construction', () => {
    it('should create a new WcRestApi', () => {
      const axiosClient = axios.create();
      const ratLimitedAxios = rateLimit(axiosClient, {
        maxRPS: 4,
      });

      const wcRestApi = new WcRestApi(ratLimitedAxios);
      expect(wcRestApi).to.be.instanceOf(WcRestApi);
    });
  });
});
