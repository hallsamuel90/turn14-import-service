import { ProductSyncJobProcessor } from '../../../src/productMgmt/services/productSyncJobProcessor';
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

describe('ProductSyncJobProcessor tests', () => {
  let productSyncJobProcessor: ProductSyncJobProcessor;

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

    productSyncJobProcessor = new ProductSyncJobProcessor(
      mockProductSyncQueueServiceInstance,
      mockProductSyncJobMarshllerInstance
    );
  });

  afterEach(() => {
    resetCalls(mockProductSyncQueueService);
    resetCalls(mockProductSyncJobMarshller);
  });

  describe('#processJob', async () => {
    it('should process the job if the queue is available', async () => {
      const fakeJob = new ProductSyncJob(ProductSyncJobType.UPDATE_INVENTORY);

      when(mockProductSyncQueueService.isLocked()).thenReturn(false);
      when(mockProductSyncQueueService.isEmpty()).thenReturn(false);
      when(mockProductSyncQueueService.dequeue()).thenReturn(fakeJob);

      await productSyncJobProcessor.processJob();

      verify(mockProductSyncJobMarshller.marshallJob(fakeJob)).called();
    });

    it('should not process the job if the queue is locked', async () => {
      const jobQueue = new ProductSyncQueue();
      jobQueue.lock();

      when(mockProductSyncQueueService.isEmpty()).thenReturn(false);
      when(mockProductSyncQueueService.isLocked()).thenReturn(true);

      await productSyncJobProcessor.processJob();

      verify(
        mockProductSyncJobMarshller.marshallJob(anyOfClass(ProductSyncJob))
      ).never();
    });

    it('should not process the job if the queue is empty', async () => {
      const jobQueue = new ProductSyncQueue();
      jobQueue.lock();

      when(mockProductSyncQueueService.isEmpty()).thenReturn(true);
      when(mockProductSyncQueueService.isLocked()).thenReturn(false);

      await productSyncJobProcessor.processJob();

      verify(
        mockProductSyncJobMarshller.marshallJob(anyOfClass(ProductSyncJob))
      ).never();
    });
  });
});
