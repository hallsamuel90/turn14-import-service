import { Service } from 'typedi';
import { ProductSyncJobType } from './productSyncJobType';
import { ProductSyncJobFactory } from './services/productSyncJobFactory';
import { ProductSyncQueueService } from './services/productSyncQueueService';

/**
 * Schedules various cron jobs via adding them to the queue.
 */
@Service()
export class ProductSyncJobScheduler {
  private static ONE_HOUR_SEC = 3600; // 3600 sec in 1 hour.
  private static ONE_DAY_SEC = 24 * ProductSyncJobScheduler.ONE_HOUR_SEC;
  private static ONE_MONTH = 2147483647; // max timeout ~ 24.8 days

  private readonly productSyncQueueService: ProductSyncQueueService;
  private readonly productSyncJobFactory: ProductSyncJobFactory;

  constructor(
    productSyncQueueService: ProductSyncQueueService,
    productSyncJobFactory: ProductSyncJobFactory
  ) {
    this.productSyncQueueService = productSyncQueueService;
    this.productSyncJobFactory = productSyncJobFactory;
  }

  /**
   * Schedules the inventory update job to run once per hour.
   */
  public async scheduleInventoryUpdate(): Promise<void> {
    console.info(
      `⏲️  Scheduling inventory updates for all users every ${ProductSyncJobScheduler.ONE_HOUR_SEC} seconds.`
    );

    this.pushJob(ProductSyncJobType.UPDATE_INVENTORY);

    setInterval(() => {
      this.pushJob(ProductSyncJobType.UPDATE_INVENTORY);
    }, ProductSyncJobScheduler.ONE_HOUR_SEC * 1000);
  }

  /**
   * Schedules the pricing update job to run once per day.
   */
  public async schedulePricingUpdate(): Promise<void> {
    console.info(
      `⏲️  Scheduling pricing updates for all users every ${ProductSyncJobScheduler.ONE_DAY_SEC} seconds.`
    );

    this.pushJob(ProductSyncJobType.UPDATE_PRICING);

    setInterval(() => {
      this.pushJob(ProductSyncJobType.UPDATE_PRICING);
    }, ProductSyncJobScheduler.ONE_DAY_SEC * 1000);
  }

  /**
   * Schedules the new product sync job to run once per day.
   */
  public async scheduleNewProductSync(): Promise<void> {
    console.info(
      `⏲️  Scheduling new product sync for all users every ${ProductSyncJobScheduler.ONE_DAY_SEC} seconds.`
    );

    this.pushJob(ProductSyncJobType.IMPORT_ADDED_PRODUCTS);

    setInterval(() => {
      this.pushJob(ProductSyncJobType.IMPORT_ADDED_PRODUCTS);
    }, ProductSyncJobScheduler.ONE_DAY_SEC * 1000);
  }

  /**
   * Schedules the stale product removal job to run once per day.
   */
  public async scheduleRemoveStaleProducts(): Promise<void> {
    console.info(
      `⏲️  Scheduling stale product removal for all users every ${ProductSyncJobScheduler.ONE_DAY_SEC} seconds.`
    );

    this.pushJob(ProductSyncJobType.REMOVE_STALE_PRODUCTS);

    setInterval(() => {
      this.pushJob(ProductSyncJobType.REMOVE_STALE_PRODUCTS);
    }, ProductSyncJobScheduler.ONE_DAY_SEC * 1000);
  }

  /**
   * Schedules a full product resync every month.
   */
  public async scheduleProductResync(): Promise<void> {
    console.info(
      `⏲️  Scheduling product resync for all users every ${
        ProductSyncJobScheduler.ONE_MONTH / 1000
      } seconds.`
    );

    this.pushJob(ProductSyncJobType.RESYNC_PRODUCTS);

    setInterval(() => {
      this.pushJob(ProductSyncJobType.RESYNC_PRODUCTS);
    }, ProductSyncJobScheduler.ONE_MONTH);
  }

  private pushJob(jobType: ProductSyncJobType): void {
    const job = this.productSyncJobFactory.createFromJobType(jobType);

    this.productSyncQueueService.enqueue(job);
  }
}
