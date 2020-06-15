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

  describe('#turn14AttributesToWc', () => {
    it('should not return null', () => {
      const fakeTurn14ProductDto = WcMapperTestUtil.getFakeTurn14ProductDTO();
      const itemAttributes = fakeTurn14ProductDto?.item['attributes'];

      const wcCreateProductDto = instance.turn14AttributesToWc(itemAttributes);

      expect(wcCreateProductDto).to.not.be.null;
    });

    it('should not die when itemAttributes is undefined', () => {
      const undefinedItemAttributesTurn14ProductDto = WcMapperTestUtil.getUndefinedItemAttributesProductDTO();
      const itemAttributes =
        undefinedItemAttributesTurn14ProductDto?.item['attributes'];

      const wcCreateProductDto = instance.turn14AttributesToWc(itemAttributes);

      expect(wcCreateProductDto).to.not.be.null;
    });

    it('should return correctly mapped attributes for WcCreateProductDTO', async () => {
      const fakeTurn14ProductDto = WcMapperTestUtil.getFakeTurn14ProductDTO();
      const itemAttributes = fakeTurn14ProductDto?.item['attributes'];

      const wcCreateProductDtoAttributes = instance.turn14AttributesToWc(
        itemAttributes
      );

      expect(wcCreateProductDtoAttributes.name).to.equal(
        'DBA 4000 Slot&Drill Rotors'
      );
      expect(wcCreateProductDtoAttributes.type).to.equal('simple');
      expect(wcCreateProductDtoAttributes.shortDescription).to.equal(
        'DBA 92-95 MR-2 Turbo Rear Drilled & Slotted 4000 Series Rotor'
      );
      expect(wcCreateProductDtoAttributes.sku).to.equal('4583XS');
      expect(wcCreateProductDtoAttributes.brand_id).to.equal(18);
      expect(wcCreateProductDtoAttributes.dimensions.length).to.equal(15);
      expect(wcCreateProductDtoAttributes.dimensions.width).to.equal(15);
      expect(wcCreateProductDtoAttributes.dimensions.height).to.equal(4);
      expect(wcCreateProductDtoAttributes.weight).to.equal(13);
    });
  });

  describe('#turn14InventoryToWc', () => {
    it('should not return null', () => {
      const fakeTurn14ProductDto = WcMapperTestUtil.getFakeTurn14ProductDTO();
      const itemInventory = fakeTurn14ProductDto?.itemInventory;

      const wcCreateProductDtoInventory = instance.turn14InventoryToWc(
        itemInventory
      );

      expect(wcCreateProductDtoInventory).to.not.be.null;
    });

    it('should return correctly mapped inventory for WcCreateProductDTO', async () => {
      const fakeTurn14ProductDto = WcMapperTestUtil.getFakeTurn14ProductDTO();
      const itemInventory = fakeTurn14ProductDto?.itemInventory;

      const wcCreateProductDtoInventory = instance.turn14InventoryToWc(
        itemInventory
      );

      expect(wcCreateProductDtoInventory.manage_stock).to.equal(true);
      expect(wcCreateProductDtoInventory.backorders).to.equal('notify');
      expect(wcCreateProductDtoInventory.stock_quantity).to.equal(7);
    });
  });
});
