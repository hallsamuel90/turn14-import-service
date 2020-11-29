import { expect } from 'chai';
import { instance, mock } from 'ts-mockito';
import { ApiUserService } from '../../../../src/apiUsers/services/apiUserService';
import { ActiveBrandDTO } from '../../../../src/productMgmt/dtos/activeBrandDto';
import { ProductSyncJobError } from '../../../../src/productMgmt/jobQueue/errors/productSyncJobError';
import { DeleteProductsJob } from '../../../../src/productMgmt/jobQueue/models/deleteProductsJob';
import { ImportAddedProductsJob } from '../../../../src/productMgmt/jobQueue/models/importAddedProductsJob';
import { ImportProductsJob } from '../../../../src/productMgmt/jobQueue/models/importProductsJob';
import { RemoveStaleProductsJob } from '../../../../src/productMgmt/jobQueue/models/removeStaleProductsJob';
import { UpdateInventoryJob } from '../../../../src/productMgmt/jobQueue/models/updateInventoryJob';
import { UpdatePricingJob } from '../../../../src/productMgmt/jobQueue/models/updatePricingJob';
import { ProductSyncJobType } from '../../../../src/productMgmt/jobQueue/productSyncJobType';
import { ProductSyncJobFactory } from '../../../../src/productMgmt/jobQueue/services/productSyncJobFactory';
import { ProductMgmtService } from '../../../../src/productMgmt/services/productMgmtService';

describe('ProductSyncJobFactory tests', () => {
  let productSyncJobFactory: ProductSyncJobFactory;

  beforeEach(() => {
    const mockApiUserService = mock(ApiUserService);
    const mockPmgmtService = mock(ProductMgmtService);

    productSyncJobFactory = new ProductSyncJobFactory(
      instance(mockApiUserService),
      instance(mockPmgmtService)
    );
  });

  describe('#createFromBrandDto', () => {
    it('should return import job when the brand is active', () => {
      const activeBrandDto = new ActiveBrandDTO(
        'fakeUserId',
        'fakeBrandId',
        true
      );

      const actualJob = productSyncJobFactory.createFromBrandDto(
        activeBrandDto
      );

      expect(actualJob).to.be.instanceOf(ImportProductsJob);
    });

    it('should return delete job when the brand is inactive', () => {
      const activeBrandDto = new ActiveBrandDTO(
        'fakeUserId',
        'fakeBrandId',
        false
      );

      const actualJob = productSyncJobFactory.createFromBrandDto(
        activeBrandDto
      );

      expect(actualJob).to.be.instanceOf(DeleteProductsJob);
    });
  });

  describe('#createFromJobType', () => {
    it('should return update inventory job based on job type', () => {
      const actualJob = productSyncJobFactory.createFromJobType(
        ProductSyncJobType.UPDATE_INVENTORY
      );

      expect(actualJob).to.be.instanceOf(UpdateInventoryJob);
    });

    it('should return update pricing job based on job type', () => {
      const actualJob = productSyncJobFactory.createFromJobType(
        ProductSyncJobType.UPDATE_PRICING
      );

      expect(actualJob).to.be.instanceOf(UpdatePricingJob);
    });

    it('should return import added products job based on job type', () => {
      const actualJob = productSyncJobFactory.createFromJobType(
        ProductSyncJobType.IMPORT_ADDED_PRODUCTS
      );

      expect(actualJob).to.be.instanceOf(ImportAddedProductsJob);
    });

    it('should return remove stale products job based on job type', () => {
      const actualJob = productSyncJobFactory.createFromJobType(
        ProductSyncJobType.REMOVE_STALE_PRODUCTS
      );

      expect(actualJob).to.be.instanceOf(RemoveStaleProductsJob);
    });

    it('should throw an error if invalid type', () => {
      expect(
        productSyncJobFactory.createFromJobType.bind(
          productSyncJobFactory,
          5000
        )
      ).to.throw(ProductSyncJobError);
    });
  });
});
