import { expect } from 'chai';
import { instance, mock, when } from 'ts-mockito';
import { WcCategoriesCache } from '../../../src/productMgmt/caches/wcCategoriesCache';
import { WcRestApi } from '../../../src/woocommerce/clients/wcRestApi';
import { WcCategoryIdDTO } from '../../../src/woocommerce/dtos/wcCategoryIdDto';
import { WcCategoriesCacheTestUtil } from './wcCategoriesCacheTestUtil';

describe('WcCategoriesCache Tests', () => {
  let mockWcRestApi = mock(WcRestApi);
  let wcCategoriesCache: WcCategoriesCache;

  beforeEach(() => {
    mockWcRestApi = mock(WcRestApi);
    wcCategoriesCache = new WcCategoriesCache(instance(mockWcRestApi));
  });

  describe('#getCategory', () => {
    it('should return the category if it already exists in the cache', async () => {
      when(mockWcRestApi.fetchAllCategories()).thenResolve(
        await WcCategoriesCacheTestUtil.getFakeCategories()
      );

      const wcCategoryIdDto: WcCategoryIdDTO = await wcCategoriesCache.getCategory(
        'fakeCategory'
      );

      expect(wcCategoryIdDto.id).to.equal(15);
    });
  });
});
