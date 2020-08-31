import { ProductSyncQueueService } from '../../../src/productMgmt/services/productSyncQueueService';
import { ProductSyncQueueRepository } from '../../../src/productMgmt/repositories/productSyncQueueRepository';
import { mock } from 'ts-mockito';
import { expect } from 'chai';
import { ProductSyncJob } from '../../../src/productMgmt/models/productSyncJob';

describe('ProductSyncJobProcessor tests', () => {
  let productSyncQueueService: ProductSyncQueueService;

  let inMemoryProductSyncQueueRepository: ProductSyncQueueRepository;

  beforeEach(() => {
    inMemoryProductSyncQueueRepository = new ProductSyncQueueRepository();

    productSyncQueueService = new ProductSyncQueueService(
      inMemoryProductSyncQueueRepository
    );
  });

  describe('#lockQueue', () => {
    it('should lock the queue', () => {
      expect(productSyncQueueService.isLocked()).to.be.false;

      productSyncQueueService.lockQueue();

      expect(productSyncQueueService.isLocked()).to.be.true;
    });
  });

  describe('#unlockQueue', () => {
    it('should unlock the queue', () => {
      productSyncQueueService.lockQueue();
      expect(productSyncQueueService.isLocked()).to.be.true;

      productSyncQueueService.unlockQueue();

      expect(productSyncQueueService.isLocked()).to.be.false;
    });
  });

  describe('#dequeue', () => {
    it('should return the last item in the queue', () => {
      const mockEnqueuedJob = mock(ProductSyncJob);
      productSyncQueueService.enqueue(mockEnqueuedJob);

      expect(productSyncQueueService.isEmpty()).to.be.false;

      const mockDequeuedJob = productSyncQueueService.dequeue();

      expect(mockDequeuedJob).to.be.equal(mockEnqueuedJob);
    });

    it('should remove the last item in the queue', () => {
      const mockEnqueuedJob = mock(ProductSyncJob);
      productSyncQueueService.enqueue(mockEnqueuedJob);

      expect(productSyncQueueService.isEmpty()).to.be.false;

      productSyncQueueService.dequeue();

      expect(productSyncQueueService.isEmpty()).to.be.true;
    });
  });
});
