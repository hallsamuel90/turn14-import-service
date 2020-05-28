import { expect } from 'chai';
import { WcRestApi } from '../../../src/woocommerce/clients/wcRestApi';
import { WcRestApiProvider } from '../../../src/woocommerce/clients/wcRestApiProvider';

describe('WcRestApiProvider tests', () => {
  let instance: WcRestApiProvider;

  beforeEach(() => {
    instance = new WcRestApiProvider();
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
