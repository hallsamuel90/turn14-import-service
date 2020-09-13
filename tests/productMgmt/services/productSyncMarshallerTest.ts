import { ProductSyncJobMarshaller } from '../../../src/productMgmt/services/productSyncJobMarshaller';
import { mock, instance, verify } from 'ts-mockito';
import { ProductSyncJob } from '../../../src/productMgmt/models/productSyncJob';
import { ProductSyncJobType } from '../../../src/productMgmt/models/proudctSyncJobType';
import { ProductSyncJobError } from '../../../src/productMgmt/errors/productSyncJobError';
import chaiAsPromised from 'chai-as-promised';
import chai from 'chai';
import { ProductSyncJobWorker } from '../../../src/productMgmt/services/productSyncJobWorker';
import { ActiveBrandDTO } from '../../../src/productMgmt/dtos/activeBrandDto';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('ProductSyncMarshaller tests', () => {
  let productSyncJobMarshaller: ProductSyncJobMarshaller;

  const mockProductSyncJobWorker = mock(ProductSyncJobWorker);

  beforeEach(() => {
    const mockProductSyncJobWorkerInstance = instance(mockProductSyncJobWorker);

    productSyncJobMarshaller = new ProductSyncJobMarshaller(
      mockProductSyncJobWorkerInstance
    );
  });

  describe('#marshallJob', async () => {
    it('should marshall IMPORT_BRAND job correctly', async () => {
      const activeBrandDto = new ActiveBrandDTO(
        'fakeUserId',
        'fakeBrandId',
        true
      );

      const fakeImportBrandJob = new ProductSyncJob(
        ProductSyncJobType.IMPORT_BRAND,
        activeBrandDto
      );

      await productSyncJobMarshaller.marshallJob(fakeImportBrandJob);

      verify(mockProductSyncJobWorker.importBrand(activeBrandDto)).called();
    });

    it('should marshall REMOVE_BRAND job correctly', async () => {
      const activeBrandDto = new ActiveBrandDTO(
        'fakeUserId',
        'fakeBrandId',
        true
      );

      const fakeRemoveBrandJob = new ProductSyncJob(
        ProductSyncJobType.REMOVE_BRAND,
        activeBrandDto
      );

      await productSyncJobMarshaller.marshallJob(fakeRemoveBrandJob);

      verify(mockProductSyncJobWorker.removeBrand(activeBrandDto)).called();
    });

    it('should marshall UPDATE_INVENTORY job correctly', async () => {
      const fakeUpdateInventoryJob = new ProductSyncJob(
        ProductSyncJobType.UPDATE_INVENTORY
      );

      await productSyncJobMarshaller.marshallJob(fakeUpdateInventoryJob);

      verify(mockProductSyncJobWorker.updateAllInventory()).once();
    });

    it('should marshall UPDATE_INVENTORY job correctly', async () => {
      const fakeUpdatePricingJob = new ProductSyncJob(
        ProductSyncJobType.UPDATE_PRICING
      );

      await productSyncJobMarshaller.marshallJob(fakeUpdatePricingJob);

      verify(mockProductSyncJobWorker.updateAllPricing()).once();
    });

    it('should reject with ProductSyncJobError if job type is unknown', async () => {
      const invalidJob = new ProductSyncJob(5);

      expect(
        productSyncJobMarshaller.marshallJob(invalidJob)
      ).to.be.rejectedWith(ProductSyncJobError);
    });
  });
});
