import { ProductSyncManager } from '../../../src/productMgmt/services/productSyncManager';
import { ProductSyncQueueService } from '../../../src/productMgmt/services/productSyncQueueService';
import {
  instance,
  mock,
  when,
  resetCalls,
  verify,
  anyOfClass,
} from 'ts-mockito';
import { ProductSyncJob } from '../../../src/productMgmt/models/productSyncJob';
import { ProductSyncQueue } from '../../../src/productMgmt/models/productSyncQueue';
import { ProductSyncJobMarshaller } from '../../../src/productMgmt/services/productSyncJobMarshaller';
import { ProductSyncJobType } from '../../../src/productMgmt/models/proudctSyncJobType';

describe('ProductSyncManager tests', () => {
  let productSyncManager: ProductSyncManager;

  const mockProductSyncQueueService: ProductSyncQueueService = mock(
    ProductSyncQueueService
  );
  const mockProductSyncJobMarshller: ProductSyncJobMarshaller = mock(
    ProductSyncJobMarshaller
  );

  beforeEach(() => {
    const mockProductSyncQueueServiceInstance = instance(
      mockProductSyncQueueService
    );

    const mockProductSyncJobMarshllerInstance = instance(
      mockProductSyncJobMarshller
    );

    productSyncManager = new ProductSyncManager(
      mockProductSyncQueueServiceInstance,
      mockProductSyncJobMarshllerInstance
    );

    resetCalls(mockProductSyncQueueService);
    resetCalls(mockProductSyncJobMarshller);
  });

  describe('#processJob', async () => {
    it('should process the job if the queue is unlocked and not empty', async () => {
      const fakeJob = new ProductSyncJob(ProductSyncJobType.UPDATE_INVENTORY);

      const jobQueue = new ProductSyncQueue();
      jobQueue.enqueue(fakeJob);

      when(mockProductSyncQueueService.readProductSyncQueue()).thenReturn(
        jobQueue
      );

      await productSyncManager.processJob();

      verify(mockProductSyncJobMarshller.marshallJob(fakeJob)).called();
    });

    it('should not process the job if the queue is locked', async () => {
      const jobQueue = new ProductSyncQueue();
      jobQueue.lock();

      when(mockProductSyncQueueService.readProductSyncQueue()).thenReturn(
        jobQueue
      );

      await productSyncManager.processJob();

      verify(
        mockProductSyncJobMarshller.marshallJob(anyOfClass(ProductSyncJob))
      ).never();
    });

    it('should not process the job if the queue is empty', async () => {
      const jobQueue = new ProductSyncQueue();

      when(mockProductSyncQueueService.readProductSyncQueue()).thenReturn(
        jobQueue
      );

      await productSyncManager.processJob();

      verify(
        mockProductSyncJobMarshller.marshallJob(anyOfClass(ProductSyncJob))
      ).never();
    });

    it('should not process the job if the queue is empty and locked', async () => {
      const jobQueue = new ProductSyncQueue();
      jobQueue.lock();

      when(mockProductSyncQueueService.readProductSyncQueue()).thenReturn(
        jobQueue
      );

      await productSyncManager.processJob();

      verify(
        mockProductSyncJobMarshller.marshallJob(anyOfClass(ProductSyncJob))
      ).never();
    });
  });
});
