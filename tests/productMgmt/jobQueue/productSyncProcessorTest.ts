import { instance, mock, resetCalls, verify, when } from 'ts-mockito';
import { ProductSyncJob } from '../../../src/productMgmt/jobQueue/models/productSyncJob';
import { ProductSyncJobProcessor } from '../../../src/productMgmt/jobQueue/productSyncJobProcessor';
import { ProductSyncQueueService } from '../../../src/productMgmt/jobQueue/services/productSyncQueueService';

describe('ProductSyncJobProcessor tests', () => {
  let productSyncJobProcessor: ProductSyncJobProcessor;

  const mockProductSyncQueueService: ProductSyncQueueService = mock(
    ProductSyncQueueService
  );

  beforeEach(() => {
    const mockProductSyncQueueServiceInstance = instance(
      mockProductSyncQueueService
    );

    productSyncJobProcessor = new ProductSyncJobProcessor(
      mockProductSyncQueueServiceInstance
    );
  });

  afterEach(() => {
    resetCalls(mockProductSyncQueueService);
  });

  describe('#processJob', async () => {
    it('should process the job if the queue is available', async () => {
      const mockJob = mock<ProductSyncJob>();

      when(mockProductSyncQueueService.isLocked()).thenReturn(false);
      when(mockProductSyncQueueService.isEmpty()).thenReturn(false);
      when(mockProductSyncQueueService.dequeue()).thenReturn(instance(mockJob));

      await productSyncJobProcessor.processJob();

      verify(mockJob.run()).called();
    });

    it('should not process the job if the queue is locked', async () => {
      const mockJob = mock<ProductSyncJob>();

      when(mockProductSyncQueueService.isEmpty()).thenReturn(false);
      when(mockProductSyncQueueService.isLocked()).thenReturn(true);
      when(mockProductSyncQueueService.dequeue()).thenReturn(instance(mockJob));

      await productSyncJobProcessor.processJob();

      verify(mockJob.run()).never();
    });

    it('should not process the job if the queue is empty', async () => {
      const mockJob = mock<ProductSyncJob>();

      when(mockProductSyncQueueService.isEmpty()).thenReturn(true);
      when(mockProductSyncQueueService.isLocked()).thenReturn(false);
      when(mockProductSyncQueueService.dequeue()).thenReturn(instance(mockJob));

      await productSyncJobProcessor.processJob();

      verify(mockJob.run()).never();
    });
  });
});
