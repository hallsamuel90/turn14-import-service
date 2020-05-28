import { expect } from 'chai';
import { mock } from 'ts-mockito';
import { WcCategoriesCache } from '../../../src/productMgmt/caches/wcCategoriesCache';
import { WcMapper } from '../../../src/productMgmt/services/wcMapper';
import { WcMapperProvider } from '../../../src/productMgmt/services/wcMapperProvider';

describe('WcMapperProvider tests', () => {
  let instance: WcMapperProvider;

  beforeEach(() => {
    instance = new WcMapperProvider();
  });

  describe('#getWcRestApi', () => {
    it('should return a new WcMapper', () => {
      const mockWcCategoriesCache: WcCategoriesCache = mock(WcCategoriesCache);

      const wcMapper = instance.getWcMapper(mockWcCategoriesCache);

      expect(wcMapper).to.be.instanceOf(WcMapper);
    });
  });
});
