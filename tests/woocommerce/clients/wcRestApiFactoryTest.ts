import { expect } from 'chai';
import { WcRestApi } from '../../../src/woocommerce/clients/wcRestApi';
import { WcRestApiFactory } from '../../../src/woocommerce/clients/wcRestApiFactory';

describe('WcRestApiFactory tests', () => {
  let instance: WcRestApiFactory;

  beforeEach(() => {
    instance = new WcRestApiFactory();
  });

  describe('#getWcRestApi', () => {
    it('should return a new WcRestApi', () => {
      const fakeTargetUrl = 'fakeTargetUrl';
      const fakeClient = 'fakeClient';
      const fakeSecret = 'fakeSecret';

      const wcRestApi = instance.getWcRestApi(
        fakeTargetUrl,
        fakeClient,
        fakeSecret
      );

      expect(wcRestApi).to.be.instanceOf(WcRestApi);
    });
  });
});
