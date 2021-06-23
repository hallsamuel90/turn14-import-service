import Container, { Service } from 'typedi';
import { ApiUser } from '../../apiUsers/models/apiUser';
import { ApiUserService } from '../../apiUsers/services/apiUserService';
import { JobDto } from './types';
import { ProductSyncJobType } from './productSyncJobType';
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
  private readonly apiUserService: ApiUserService;

  constructor(
    apiUserService: ApiUserService = Container.get(ApiUserService),
    productSyncQueueService: ProductSyncQueueService = new ProductSyncQueueService()
  ) {
    this.apiUserService = apiUserService;
    this.productSyncQueueService = productSyncQueueService;
  }

  /**
   * Schedules the inventory update job to run once per hour.
   */
  public async scheduleInventoryUpdate(): Promise<void> {
    console.info(
      `⏲️  Scheduling inventory updates for all users every ${ProductSyncJobScheduler.ONE_HOUR_SEC} seconds.`
    );

    setInterval(async () => {
      const queueIsBackedUp = await this.productSyncQueueService.isBackedUp(
        ProductSyncJobType.UPDATE_INVENTORY
      );
      if (!queueIsBackedUp) {
        await this.pushJobs(
          ...this.getJobsForUsers(
            await this.apiUserService.retrieveAll(),
            ProductSyncJobType.UPDATE_INVENTORY
          )
        );
      }
    }, ProductSyncJobScheduler.ONE_HOUR_SEC * 1000);
  }

  /**
   * Schedules the pricing update job to run once per day.
   */
  public async schedulePricingUpdate(): Promise<void> {
    console.info(
      `⏲️  Scheduling pricing updates for all users every ${ProductSyncJobScheduler.ONE_DAY_SEC} seconds.`
    );

    setInterval(async () => {
      const queueIsBackedUp = await this.productSyncQueueService.isBackedUp(
        ProductSyncJobType.UPDATE_PRICING
      );
      if (!queueIsBackedUp) {
        await this.pushJobs(
          ...this.getJobsForUsers(
            await this.apiUserService.retrieveAll(),
            ProductSyncJobType.UPDATE_PRICING
          )
        );
      }
    }, ProductSyncJobScheduler.ONE_DAY_SEC * 1000);
  }

  /**
   * Schedules the stale product removal job to run once per day.
   */
  public async scheduleRemoveStaleProducts(): Promise<void> {
    console.info(
      `⏲️  Scheduling stale product removal for all users every ${ProductSyncJobScheduler.ONE_DAY_SEC} seconds.`
    );

    await this.pushJobs(
      ...this.getJobsForUsers(
        await this.apiUserService.retrieveAll(),
        ProductSyncJobType.REMOVE_STALE_PRODUCTS
      )
    );

    setInterval(async () => {
      await this.pushJobs(
        ...this.getJobsForUsers(
          await this.apiUserService.retrieveAll(),
          ProductSyncJobType.REMOVE_STALE_PRODUCTS
        )
      );
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
    if (Boolean(process.env.RESYNC_ON_DEPLOY)) {
      const queueIsBackedUp = await this.productSyncQueueService.isBackedUp(
        ProductSyncJobType.RESYNC_PRODUCTS
      );
      if (!queueIsBackedUp) {
        await this.pushJobs(
          ...this.getJobsForUsers(
            await this.apiUserService.retrieveAll(),
            ProductSyncJobType.RESYNC_PRODUCTS
          )
        );
      }
    }

    setInterval(async () => {
      const queueIsBackedUp = await this.productSyncQueueService.isBackedUp(
        ProductSyncJobType.RESYNC_PRODUCTS
      );
      if (!queueIsBackedUp) {
        await this.pushJobs(
          ...this.getJobsForUsers(
            await this.apiUserService.retrieveAll(),
            ProductSyncJobType.RESYNC_PRODUCTS
          )
        );
      }
    }, ProductSyncJobScheduler.ONE_MONTH);
  }

  private async pushJobs(...jobDtos: JobDto[]): Promise<void> {
    await this.productSyncQueueService.enqueue(...jobDtos);
  }

  private getJobsForUsers(
    users: ApiUser[],
    jobType: ProductSyncJobType
  ): JobDto[] {
    const jobBatches: JobDto[][] = [];
    for (const user of users) {
      jobBatches.push(
        user.brandIds.map((brandId) => {
          return {
            userId: user.userId,
            brandId,
            jobType,
          };
        })
      );
    }

    return ([] as JobDto[]).concat(...jobBatches);
  }
}
