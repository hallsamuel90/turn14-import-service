import { expect } from 'chai';
import { mock } from 'ts-mockito';
import { ProductSyncJob } from '../../../../src/productMgmt/jobQueue/models/productSyncJob';
import { ProductSyncQueueRepositoryInMemory } from '../../../../src/productMgmt/jobQueue/repositories/productSyncQueueRepositoryInMemory';
import { ProductSyncQueueService } from '../../../../src/productMgmt/jobQueue/services/productSyncQueueService';

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
      const mockEnqueuedJob = mock(ProductSyncJob);
      await productSyncQueueService.enqueue(mockEnqueuedJob);

      expect(await productSyncQueueService.isEmpty()).to.be.false;

      const mockDequeuedJob = await productSyncQueueService.dequeue();

      expect(mockDequeuedJob).to.be.equal(mockEnqueuedJob);
    });

    it('should remove the last item in the queue', async () => {
      const mockEnqueuedJob = mock(ProductSyncJob);
      await productSyncQueueService.enqueue(mockEnqueuedJob);

      expect(await productSyncQueueService.isEmpty()).to.be.false;

      await productSyncQueueService.dequeue();

      expect(await productSyncQueueService.isEmpty()).to.be.true;
    });

    it('should throw an error there are no jobs in the queue', async () => {
      expect(productSyncQueueService.dequeue()).to.be.rejectedWith(Error);
    });
  });
});
