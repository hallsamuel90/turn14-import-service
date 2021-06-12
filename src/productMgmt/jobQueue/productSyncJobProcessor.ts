import { ProductSyncQueueService } from './services/productSyncQueueService';
import { Service } from 'typedi';
import { ProductSyncJob } from './models/productSyncJob';

@Service()
export class ProductSyncJobProcessor {
  private readonly productSyncQueueService: ProductSyncQueueService;

  constructor(
    productSyncQueueService: ProductSyncQueueService = new ProductSyncQueueService()
  ) {
    this.productSyncQueueService = productSyncQueueService;
  }

  /**
   * Kicks off jobs as they are available on the queue.
   */
  public async processJob(): Promise<void> {
    if (await this.queueIsReady()) {
      await this.productSyncQueueService.lockQueue();

      const job = await this.productSyncQueueService.dequeue();
      await this.runJob(job);

      await this.productSyncQueueService.unlockQueue();
    }
  }

  private async queueIsReady(): Promise<boolean> {
    return !(
      (await this.productSyncQueueService.isLocked()) ||
      (await this.productSyncQueueService.isEmpty())
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
