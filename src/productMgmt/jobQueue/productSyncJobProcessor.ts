import { ProductSyncQueueService } from './services/productSyncQueueService';
import { Service } from 'typedi';
import { ProductSyncJob } from './models/productSyncJob';

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
      await this.runJob(job);

      this.productSyncQueueService.unlockQueue();
    }
  }

  private queueIsReady(): boolean {
    return !(
      this.productSyncQueueService.isLocked() ||
      this.productSyncQueueService.isEmpty()
    );
  }

  private async runJob(job: ProductSyncJob): Promise<void> {
    try {
      await job.run();
    } catch (e) {
      console.error(`🔥: ${e}`);
    }
  }
}
