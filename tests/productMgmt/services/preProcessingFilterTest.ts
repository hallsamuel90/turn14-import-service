/* eslint-disable @typescript-eslint/camelcase */
import { expect } from 'chai';
import { PreProcessingFilter } from '../../../src/productMgmt/services/preProcessingFilter';
import { WcCreateProductDTO } from '../../../src/woocommerce/dtos/wcCreateProductDto';
import { WcUpdateInventoryDTO } from '../../../src/woocommerce/dtos/wcUpdateInventoryDto';
import { Turn14FakeData } from './turn14FakeData';

describe('PreProcessingFilter tests', () => {
  let preProcessingFilter: PreProcessingFilter;

  beforeEach(() => {
    preProcessingFilter = new PreProcessingFilter();
  });

  describe('#filterUnchangedInventory', () => {
    it("should filter out any products who's inventories have not changed", () => {
      const fakeUpdateInventoryProduct1 = new WcUpdateInventoryDTO('1', 3);
      const fakeUpdateInventoryProduct2 = new WcUpdateInventoryDTO('2', 4);

      const fakeUpdateInventoryProducts = [
        fakeUpdateInventoryProduct1,
        fakeUpdateInventoryProduct2,
      ];

      const fakeExistingProduct1 = ({
        sku: '1',
        stock_quantity: 3,
      } as unknown) as JSON;
      const fakeExistingProducts = [fakeExistingProduct1];

      const actual = preProcessingFilter.filterUnchangedInventory(
        fakeUpdateInventoryProducts,
        fakeExistingProducts
      );

      expect(actual).to.contain.members([fakeUpdateInventoryProduct2]);
      expect(actual.length).to.eq(1);
    });
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

  describe('#filterCarriedProducts', () => {
    it('should return an empty array if all products are carried', () => {
      const fakeTurn14Product1 = Turn14FakeData.getFakeTurn14ProductDTO('mf01');
      const fakeTurn14Product2 = Turn14FakeData.getFakeTurn14ProductDTO('mf02');
      const fakeTurn14Products = [fakeTurn14Product1, fakeTurn14Product2];

      const fakeExistingProduct1 = ({
        id: '1',
        sku: 'mf01',
      } as unknown) as JSON;
      const fakeExistingProduct2 = ({
        id: '2',
        sku: 'mf02',
      } as unknown) as JSON;
      const fakeExistingProducts = [fakeExistingProduct1, fakeExistingProduct2];

      const actual = preProcessingFilter.filterCarriedProducts(
        fakeTurn14Products,
        fakeExistingProducts
      );

      expect(actual).to.be.an('array').that.is.empty;
    });

    it('should return the all products if they are all no longer carried', () => {
      const fakeTurn14Products = [];

      const fakeExistingProduct1 = ({
        id: '1',
        sku: 'mf01',
      } as unknown) as JSON;
      const fakeExistingProduct2 = ({
        id: '2',
        sku: 'mf02',
      } as unknown) as JSON;
      const fakeExistingProducts = [fakeExistingProduct1, fakeExistingProduct2];

      const actual = preProcessingFilter.filterCarriedProducts(
        fakeTurn14Products,
        fakeExistingProducts
      );

      expect(actual).to.contain.members(['1', '2']);
      expect(actual.length).to.eq(2);
    });

    it('should filter out any products that are no longer carried', () => {
      const fakeTurn14Product1 = Turn14FakeData.getFakeTurn14ProductDTO('mf01');
      const fakeTurn14Products = [fakeTurn14Product1];

      const fakeExistingProduct1 = ({
        id: '1',
        sku: 'mf01',
      } as unknown) as JSON;
      const fakeExistingProduct2 = ({
        id: '2',
        sku: 'mf02',
      } as unknown) as JSON;
      const fakeExistingProducts = [fakeExistingProduct1, fakeExistingProduct2];

      const actual = preProcessingFilter.filterCarriedProducts(
        fakeTurn14Products,
        fakeExistingProducts
      );

      expect(actual).to.contain.members(['2']);
      expect(actual.length).to.eq(1);
    });
  });
});
