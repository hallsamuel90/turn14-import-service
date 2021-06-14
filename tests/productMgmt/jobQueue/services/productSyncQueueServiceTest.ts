import { expect } from 'chai';
import { ProductSyncJob } from '../../../../src/productMgmt/jobQueue/models/productSyncJob';
import { ProductSyncJobType } from '../../../../src/productMgmt/jobQueue/productSyncJobType';
import { ProductSyncQueueRepositoryInMemory } from '../../../../src/productMgmt/jobQueue/repositories/productSyncQueueRepositoryInMemory';
import { ProductSyncQueueService } from '../../../../src/productMgmt/jobQueue/services/productSyncQueueService';
import { JobDto } from '../../../../src/productMgmt/jobQueue/types';

describe('ProductSyncQueueService tests', () => {
  let productSyncQueueService: ProductSyncQueueService;

  let inMemoryProductSyncQueueRepository: ProductSyncQueueRepositoryInMemory;

  beforeEach(() => {
    inMemoryProductSyncQueueRepository = new ProductSyncQueueRepositoryInMemory();

    productSyncQueueService = new ProductSyncQueueService(
      inMemoryProductSyncQueueRepository
    );
  });

  describe('#lockQueue', () => {
    it('should lock the queue', async () => {
      expect(await productSyncQueueService.isLocked()).to.be.false;

      await productSyncQueueService.lockQueue();

      expect(await productSyncQueueService.isLocked()).to.be.true;
    });
  });

  describe('#unlockQueue', () => {
    it('should unlock the queue', async () => {
      await productSyncQueueService.lockQueue();
      expect(await productSyncQueueService.isLocked()).to.be.true;

      await productSyncQueueService.unlockQueue();

      expect(await productSyncQueueService.isLocked()).to.be.false;
    });
  });

  describe('#dequeue', async () => {
    it('should return the last item in the queue', async () => {
      await productSyncQueueService.enqueue({
        jobType: ProductSyncJobType.RESYNC_PRODUCTS,
      } as JobDto);

      expect(await productSyncQueueService.isEmpty()).to.be.false;

      const dequeuedJob = await productSyncQueueService.dequeue();

      expect(dequeuedJob).to.be.instanceOf(ProductSyncJob);
      expect(dequeuedJob.jobType).to.be.eq(ProductSyncJobType.RESYNC_PRODUCTS);
    });

    it('should remove the last item in the queue', async () => {
      await productSyncQueueService.enqueue({
        jobType: ProductSyncJobType.UPDATE_INVENTORY,
      } as JobDto);

      expect(await productSyncQueueService.isEmpty()).to.be.false;

      await productSyncQueueService.dequeue();

      expect(await productSyncQueueService.isEmpty()).to.be.true;
    });

    it('should throw an error there are no jobs in the queue', async () => {
      expect(productSyncQueueService.dequeue()).to.be.rejectedWith(Error);
    });
  });
});
