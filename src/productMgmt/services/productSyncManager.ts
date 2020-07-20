import { ProductSyncQueueService } from './productSyncQueueService';
import { ProductSyncJob } from '../models/productSyncJob';
import { ProductSyncJobMarshaller } from './productSyncJobMarshaller';

/**
 * Orchestrates the product synchronization jobs.
 */
export class ProductSyncManager {
  private readonly productSyncQueueService: ProductSyncQueueService;
  private readonly productSyncJobMarshller: ProductSyncJobMarshaller;

  constructor(
    productSyncQueueService: ProductSyncQueueService,
    productSyncJobMarshller: ProductSyncJobMarshaller
  ) {
    this.productSyncQueueService = productSyncQueueService;
    this.productSyncJobMarshller = productSyncJobMarshller;
  }

  /**
   * Kicks off jobs as they are available on the queue.
   */
  public async processJob(): Promise<void> {
    const jobQueue = this.productSyncQueueService.readProductSyncQueue();

    if (!jobQueue.isEmpty() && !jobQueue.isLocked()) {
      this.productSyncQueueService.lockQueue();

      const job = jobQueue.dequeue();
      await this.marshallJob(job);

      this.productSyncQueueService.unlockQueue();
    }
  }

  private async marshallJob(job: ProductSyncJob): Promise<void> {
    try {
      await this.productSyncJobMarshller.marshallJob(job);
    } catch (e) {
      console.error('🔥' + e);
    }
  }
}
