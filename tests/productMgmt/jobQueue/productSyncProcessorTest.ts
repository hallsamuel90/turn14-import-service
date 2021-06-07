import { instance, mock, resetCalls, verify, when } from 'ts-mockito';
import { ProductSyncJob } from '../../../src/productMgmt/jobQueue/models/productSyncJob';
import { ProductSyncJobProcessor } from '../../../src/productMgmt/jobQueue/productSyncJobProcessor';
import { ProductSyncQueueService } from '../../../src/productMgmt/jobQueue/services/productSyncQueueService';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const resolvableInstance = <T extends {}>(mock: T) =>
  new Proxy<T>(instance(mock), {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    get(target, name: PropertyKey) {
      if (
        ['Symbol(Symbol.toPrimitive)', 'then', 'catch'].includes(
          name.toString()
        )
      ) {
        return undefined;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (target as any)[name];
    },
  });

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

      when(mockProductSyncQueueService.isLocked()).thenResolve(false);
      when(mockProductSyncQueueService.isEmpty()).thenResolve(false);
      when(mockProductSyncQueueService.dequeue()).thenResolve(
        resolvableInstance(mockJob)
      );

      await productSyncJobProcessor.processJob();

      verify(mockJob.run()).called();
    });

    it('should not process the job if the queue is locked', async () => {
      const mockJob = mock<ProductSyncJob>();

      when(mockProductSyncQueueService.isEmpty()).thenResolve(false);
      when(mockProductSyncQueueService.isLocked()).thenResolve(true);
      when(mockProductSyncQueueService.dequeue()).thenResolve(
        resolvableInstance(mockJob)
      );

      await productSyncJobProcessor.processJob();

      verify(mockJob.run()).never();
    });

    it('should not process the job if the queue is empty', async () => {
      const mockJob = mock<ProductSyncJob>();

      when(mockProductSyncQueueService.isEmpty()).thenResolve(true);
      when(mockProductSyncQueueService.isLocked()).thenResolve(false);
      when(mockProductSyncQueueService.dequeue()).thenResolve(
        resolvableInstance(mockJob)
      );

      await productSyncJobProcessor.processJob();

      verify(mockJob.run()).never();
    });

    it('should unlock the queue if the job dies', async () => {
      const mockJob = mock<ProductSyncJob>();
      when(mockJob.run()).thenReject(Error());

      when(mockProductSyncQueueService.isLocked()).thenResolve(false);
      when(mockProductSyncQueueService.isEmpty()).thenResolve(false);
      when(mockProductSyncQueueService.dequeue()).thenResolve(
        resolvableInstance(mockJob)
      );

      await productSyncJobProcessor.processJob();

      verify(mockJob.run()).called();

      verify(mockProductSyncQueueService.unlockQueue()).once();
    });
  });
});
