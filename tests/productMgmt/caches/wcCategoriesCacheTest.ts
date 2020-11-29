import { expect } from 'chai';
import { instance, mock, when } from 'ts-mockito';
import { WcCategoriesCache } from '../../../src/productMgmt/caches/wcCategoriesCache';
import { WcRestApi } from '../../../src/woocommerce/clients/wcRestApi';
import { WcCategoryIdDTO } from '../../../src/woocommerce/dtos/wcCategoryIdDto';
import { WcCategoriesCacheTestFakeData } from './wcCategoriesCacheTestFakeData';

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
        WcCategoriesCacheTestFakeData.getFakeCategories()
      );

      const wcCategoryIdDto: WcCategoryIdDTO = await wcCategoriesCache.getCategory(
        'fakeCategory'
      );

      expect(wcCategoryIdDto.id).to.equal(15);
    });
  });

  describe('#getBrand', () => {
    it('should create a new brand if it does not exist in the cache', async () => {
      when(mockWcRestApi.fetchAllBrands()).thenResolve(
        WcCategoriesCacheTestFakeData.getFakeBrands()
      );

      when(mockWcRestApi.createBrand('test2')).thenResolve(
        WcCategoriesCacheTestFakeData.getFakeCreateBrand()
      );

      const brandId = await wcCategoriesCache.getBrand('test2');

      expect(brandId).to.equal(35);
    });

    it('should return the brand if it already exists in the cache', async () => {
      when(mockWcRestApi.fetchAllBrands()).thenResolve(
        WcCategoriesCacheTestFakeData.getFakeBrands()
      );

      const brandId = await wcCategoriesCache.getBrand('fakeBrand1');

      expect(brandId).to.equal(156);
    });

    it('should return the brand if it already been previously created', async () => {
      when(mockWcRestApi.fetchAllBrands()).thenResolve(
        WcCategoriesCacheTestFakeData.getFakeBrands()
      );

      when(mockWcRestApi.createBrand('test2')).thenResolve(
        WcCategoriesCacheTestFakeData.getFakeCreateBrand()
      );

      const firstCall = await wcCategoriesCache.getBrand('test2');
      const secondCall = await wcCategoriesCache.getBrand('test2');

      expect(firstCall).to.equal(35);
      expect(secondCall).to.equal(35);
    });
  });
});
