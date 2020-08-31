import { ProductSyncQueueService } from './productSyncQueueService';
import { ProductSyncJob } from '../models/productSyncJob';
import { ProductSyncJobMarshaller } from './productSyncJobMarshaller';
import { Service } from 'typedi';

/**
 * Orchestrates the product synchronization jobs.
 */
@Service()
export class ProductSyncJobProcessor {
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
    if (this.queueIsReady()) {
      this.productSyncQueueService.lockQueue();

      const job = this.productSyncQueueService.dequeue();
      await this.marshallJob(job);

      this.productSyncQueueService.unlockQueue();
    }
  }

  private queueIsReady(): boolean {
    return !(
      this.productSyncQueueService.isLocked() ||
      this.productSyncQueueService.isEmpty()
    );
  }

  private async marshallJob(job: ProductSyncJob): Promise<void> {
    try {
      await this.productSyncJobMarshller.marshallJob(job);
    } catch (e) {
      console.error('🔥' + e);
    }
  }
}
