import { expect } from 'chai';
import { BrandMapper } from '../../../src/brands/services/brandMapper';
import { Turn14FakeData } from '../../productMgmt/services/turn14FakeData';

describe('BrandMapper tests', () => {
  let brandMapper: BrandMapper;

  describe('#turn14ToBrands', () => {
    beforeEach(() => {
      brandMapper = new BrandMapper();
    });

    it('should convert the turn14 objects into the expected format', () => {
      const fakeUserId = 'fakeUserId';
      const fakeSiteUrl = 'https://fakeSiteUrl.com';
      const fakeBrands = Turn14FakeData.getFakeBrands();

      const actualBrands = brandMapper.turn14ToBrands(
        fakeUserId,
        fakeSiteUrl,
        fakeBrands
      );

      const actualBrand = actualBrands[0];

      expect(actualBrand.getUserId()).to.eq(fakeUserId);
      expect(actualBrand.getSiteId()).to.eq(fakeSiteUrl);
      expect(actualBrand.getBrandId()).to.eq('212');
      expect(actualBrand.getBrandName()).to.eq('ACL');
      expect(actualBrand.isActive()).to.eq(false);

      expect(actualBrands.length).to.eq(1);
    });
  });
});
