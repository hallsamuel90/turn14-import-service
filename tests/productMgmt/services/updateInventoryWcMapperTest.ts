/* eslint-disable @typescript-eslint/camelcase */
import { expect } from 'chai';
import { UpdateInventoryWcMapper } from '../../../src/productMgmt/services/updateInventoryWcMapper';
import { WcMapperTestUtil } from './wcMapperTestUtil';
describe('UpdateInventoryWcMapper tests', () => {
  let instance: UpdateInventoryWcMapper;

  beforeEach(() => {
    instance = new UpdateInventoryWcMapper();
  });

  describe('#turn14ToWc', () => {
    it('should return correctly mapped attributes for WcUpdateInventoryDTO', async () => {
      const fakeTurn14ProductDto = WcMapperTestUtil.getFakeTurn14ProductDTO();
      const fakeTurn14ProductDtoInventory = 7; // see above method for sample data.
      const fakeWcId = '55';

      const wcUpdateInventoryDto = instance.turn14ToWc(
        fakeTurn14ProductDto,
        fakeWcId
      );

      expect(wcUpdateInventoryDto.id).to.equal(fakeWcId);
      expect(wcUpdateInventoryDto.stock_quantity).to.equal(
        fakeTurn14ProductDtoInventory
      );
    });
  });
});
