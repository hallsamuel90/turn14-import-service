import { expect } from 'chai';
import { PreProcessingFilter } from '../../../src/productMgmt/services/preProcessingFilter';
import { WcCreateProductDTO } from '../../../src/woocommerce/dtos/wcCreateProductDto';
describe('PreProcessingFilter tests', () => {
  let preProcessingFilter: PreProcessingFilter;

  beforeEach(() => {
    preProcessingFilter = new PreProcessingFilter();
  });

  describe('#filterExistingProducts', () => {
    it('should filter out any existing products', () => {
      const fakeCreateProduct1 = new WcCreateProductDTO();
      fakeCreateProduct1.sku = '1';
      const fakeCreateProduct2 = new WcCreateProductDTO();
      fakeCreateProduct2.sku = '2';
      const fakeCreateProducts = [fakeCreateProduct1, fakeCreateProduct2];

      const fakeExistingProduct1 = ({ sku: '1' } as unknown) as JSON;
      const fakeExistingProducts = [fakeExistingProduct1];

      const actual = preProcessingFilter.filterExistingProducts(
        fakeCreateProducts,
        fakeExistingProducts
      );

      expect(actual).to.contain.members([fakeCreateProduct2]);
      expect(actual.length).to.eq(1);
    });

    it('should return an empty array if all products already exist', () => {
      const fakeCreateProduct1 = new WcCreateProductDTO();
      fakeCreateProduct1.sku = '1';
      const fakeCreateProducts = [fakeCreateProduct1];

      const fakeExistingProduct1 = ({ sku: '1' } as unknown) as JSON;
      const fakeExistingProducts = [fakeExistingProduct1];

      const actual = preProcessingFilter.filterExistingProducts(
        fakeCreateProducts,
        fakeExistingProducts
      );

      expect(actual).to.be.an('array').that.is.empty;
    });

    it('should return the all products if they are all new', () => {
      const fakeCreateProduct1 = new WcCreateProductDTO();
      fakeCreateProduct1.sku = '1';
      const fakeCreateProduct2 = new WcCreateProductDTO();
      fakeCreateProduct2.sku = '2';
      const fakeCreateProducts = [fakeCreateProduct1, fakeCreateProduct2];

      const fakeExistingProduct1 = ({ sku: '3' } as unknown) as JSON;
      const fakeExistingProduct2 = ({ sku: '4' } as unknown) as JSON;
      const fakeExistingProducts = [fakeExistingProduct1, fakeExistingProduct2];

      const actual = preProcessingFilter.filterExistingProducts(
        fakeCreateProducts,
        fakeExistingProducts
      );

      expect(actual).to.contain.members([
        fakeCreateProduct1,
        fakeCreateProduct2,
      ]);
      expect(actual.length).to.eq(2);
    });
  });
});
