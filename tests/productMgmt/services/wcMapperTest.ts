/* eslint-disable @typescript-eslint/camelcase */
import { expect } from 'chai';
import { anyString, mock, when } from 'ts-mockito';
import { WcCategoriesCache } from '../../../src/productMgmt/caches/wcCategoriesCache';
import { WcMapper } from '../../../src/productMgmt/services/wcMapper';
import { WcCategoryIdDTO } from '../../../src/woocommerce/dtos/wcCategoryIdDto';
import { WcMapperTestUtil } from './wcMapperTestUtil';

describe('WcMapper tests', () => {
  let instance: WcMapper;

  beforeEach(() => {
    const fakeCategoryId = 5;
    const fakeWcCategoryIdDto = new WcCategoryIdDTO(fakeCategoryId);
    const mockWcCategoriesCache: WcCategoriesCache = mock(WcCategoriesCache);

    when(mockWcCategoriesCache.getCategory(anyString())).thenResolve(
      fakeWcCategoryIdDto
    );

    when(
      mockWcCategoriesCache.getSubCategory(anyString(), anyString())
    ).thenResolve(fakeWcCategoryIdDto);

    instance = new WcMapper(mockWcCategoriesCache);
  });

  describe('#turn14ToWc', () => {
    it('should not return null', () => {
      const fakeTurn14ProductDto = WcMapperTestUtil.getFakeTurn14ProductDTO();

      const wcCreateProductDto = instance.turn14ToWc(fakeTurn14ProductDto);

      expect(wcCreateProductDto).to.not.be.null;
    });

    // TODO other tests.
    // it('should return a correctly mapped WcCreateProductDTO', () => {});
  });
});
