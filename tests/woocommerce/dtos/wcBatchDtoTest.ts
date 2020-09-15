import { expect } from 'chai';
import { mock } from 'ts-mockito';
import { WcBatchDTO } from '../../../src/woocommerce/dtos/wcBatchDto';
import { WcCreateProductDTO } from '../../../src/woocommerce/dtos/wcCreateProductDto';
import { WcUpdateProductDTO } from '../../../src/woocommerce/dtos/wcUpdateProductDto';

describe('WcBatchDTO tests', () => {
  let instance: WcBatchDTO;

  beforeEach(() => {
    instance = new WcBatchDTO();
  });

  describe('#totalSize', () => {
    it('should be zero on construction', () => {
      const totalSize = instance.totalSize();

      expect(totalSize).to.equal(0);
    });

    it('should increment when an object is pushed to create', () => {
      instance.create.push(mock(WcCreateProductDTO));
      const totalSize = instance.totalSize();

      expect(totalSize).to.equal(1);
    });

    it('should increment when an object is pushed to update', () => {
      instance.update.push(mock(WcUpdateProductDTO));
      const totalSize = instance.totalSize();

      expect(totalSize).to.equal(1);
    });

    it('should increment when an object is pushed to delete', () => {
      instance.delete.push(1);
      const totalSize = instance.totalSize();

      expect(totalSize).to.equal(1);
    });

    it('should give total count of create, update, and delete', () => {
      instance.create.push(mock(WcCreateProductDTO));
      instance.update.push(mock(WcUpdateProductDTO));
      instance.delete.push(1);
      const totalSize = instance.totalSize();

      expect(totalSize).to.equal(3);
    });
  });

  describe('#reset', () => {
    it('should clear create, update, and delete products', () => {
      instance.create.push(mock(WcCreateProductDTO));
      instance.update.push(mock(WcUpdateProductDTO));
      instance.delete.push(1);
      let totalSize = instance.totalSize();

      expect(totalSize).to.equal(3);

      instance.reset();

      totalSize = instance.totalSize();
      expect(totalSize).to.equal(0);

      expect(instance.create).to.deep.equal([]);
      expect(instance.update).to.deep.equal([]);
      expect(instance.delete).to.deep.equal([]);
    });
  });
});
