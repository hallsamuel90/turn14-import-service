import { ProductSyncQueueService } from './services/productSyncQueueService';
import { Service } from 'typedi';

/**
 * Orchestrates the product synchronization jobs.
 */
@Service()
export class ProductSyncJobProcessor {
  private readonly productSyncQueueService: ProductSyncQueueService;

  constructor(productSyncQueueService: ProductSyncQueueService) {
    this.productSyncQueueService = productSyncQueueService;
  }

  /**
   * Kicks off jobs as they are available on the queue.
   */
  public async processJob(): Promise<void> {
    if (this.queueIsReady()) {
      this.productSyncQueueService.lockQueue();

      const job = this.productSyncQueueService.dequeue();
      await job.run();

      this.productSyncQueueService.unlockQueue();
    }
  }

  private queueIsReady(): boolean {
    return !(
      this.productSyncQueueService.isLocked() ||
      this.productSyncQueueService.isEmpty()
    );
  }
}
