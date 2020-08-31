import { ProductSyncQueueService } from './productSyncQueueService';
import { ProductSyncJob } from '../models/productSyncJob';
import { ProductSyncJobType } from '../models/proudctSyncJobType';
import { Service } from 'typedi';

/**
 * Schedules various cron jobs via adding them to the queue.
 */
@Service()
export class ProductSyncJobScheduler {
  private static UPDATE_INVENTORY_SEC = 3600; // 3600 sec in 1 hour.

  private readonly productSyncQueueService: ProductSyncQueueService;

  constructor(productSyncQueueService: ProductSyncQueueService) {
    this.productSyncQueueService = productSyncQueueService;
  }

  /**
   * Schedules the inventory update job to run once per hour.
   */
  public async scheduleInventoryUpdate(): Promise<void> {
    console.info(
      `⏲️  Scheduling inventory updates for all users every ${ProductSyncJobScheduler.UPDATE_INVENTORY_SEC} seconds.`
    );

    setInterval(() => {
      const inventoryUpdateJob = new ProductSyncJob(
        ProductSyncJobType.UPDATE_INVENTORY
      );

      this.productSyncQueueService.enqueue(inventoryUpdateJob);
    }, ProductSyncJobScheduler.UPDATE_INVENTORY_SEC * 1000);
  }
}
