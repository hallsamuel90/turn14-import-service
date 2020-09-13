import { ProductSyncQueueService } from './productSyncQueueService';
import { ProductSyncJob } from '../models/productSyncJob';
import { ProductSyncJobType } from '../models/proudctSyncJobType';
import { Service } from 'typedi';

/**
 * Schedules various cron jobs via adding them to the queue.
 */
@Service()
export class ProductSyncJobScheduler {
  private static ONE_HOUR_SEC = 3600; // 3600 sec in 1 hour.

  private static UPDATE_INVENTORY_SEC = ProductSyncJobScheduler.ONE_HOUR_SEC;
  private static UPDATE_PRICING_SEC = 24 * ProductSyncJobScheduler.ONE_HOUR_SEC;

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

    this.pushUpdateInventoryJob();

    setInterval(() => {
      this.pushUpdateInventoryJob();
    }, ProductSyncJobScheduler.UPDATE_INVENTORY_SEC * 1000);
  }

  /**
   * Schedules the pricing update job to run once per day.
   */
  public async schedulePricingUpdate(): Promise<void> {
    console.info(
      `⏲️  Scheduling pricing updates for all users every ${ProductSyncJobScheduler.UPDATE_PRICING_SEC} seconds.`
    );

    this.pushUpdatePricingJob();

    setInterval(() => {
      this.pushUpdatePricingJob();
    }, ProductSyncJobScheduler.UPDATE_PRICING_SEC * 1000);
  }

  private pushUpdateInventoryJob(): void {
    const inventoryUpdateJob = new ProductSyncJob(
      ProductSyncJobType.UPDATE_INVENTORY
    );

    this.productSyncQueueService.enqueue(inventoryUpdateJob);
  }

  private pushUpdatePricingJob(): void {
    const pricingUpdateJob = new ProductSyncJob(
      ProductSyncJobType.UPDATE_PRICING
    );

    this.productSyncQueueService.enqueue(pricingUpdateJob);
  }
}
