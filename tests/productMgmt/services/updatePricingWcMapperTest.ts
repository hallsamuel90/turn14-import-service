/* eslint-disable @typescript-eslint/camelcase */
import { expect } from 'chai';
import { UpdatePricingWcMapper } from '../../../src/productMgmt/services/updatePricingWcMapper';
import { Turn14FakeData } from './turn14FakeData';
describe('UpdatePricingWcMapper tests', () => {
  let instance: UpdatePricingWcMapper;

  beforeEach(() => {
    instance = new UpdatePricingWcMapper();
  });

  describe('#turn14ToWc', () => {
    it('should return correctly mapped attributes for WcUpdatePricingDTO', async () => {
      const fakeTurn14ProductDto = Turn14FakeData.getFakeTurn14ProductDTO();
      const fakeTurn14ProductDtoRegularPrice = '12.36'; // see above method for sample data.
      const fakeWcId = '55';

      const wcUpdatePricingDto = instance.turn14ToWc(
        fakeTurn14ProductDto,
        fakeWcId
      );

      expect(wcUpdatePricingDto.id).to.equal(fakeWcId);
      expect(wcUpdatePricingDto.regular_price).to.equal(
        fakeTurn14ProductDtoRegularPrice
      );
      expect(wcUpdatePricingDto.sale_price).to.equal('');
    });
  });
});
