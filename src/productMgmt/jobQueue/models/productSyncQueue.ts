import Container from 'typedi';
import { ActiveBrandDTO } from '../../dtos/activeBrandDto';
import { ProductSyncJobType } from '../productSyncJobType';
import { ProductSyncJobFactory } from '../services/productSyncJobFactory';
import { ProductSyncJob } from './productSyncJob';

/**
 * Data structure to queue product sync jobs.
 */
export class ProductSyncQueue {
  lockStatus: boolean;
  jobQueue: (ProductSyncJobType | ActiveBrandDTO)[];

  constructor(
    lockStatus = false,
    jobQueue: (ProductSyncJobType | ActiveBrandDTO)[] = []
  ) {
    this.lockStatus = lockStatus;
    this.jobQueue = jobQueue;
  }

  public lock(): void {
    this.lockStatus = true;
  }

  public unLock(): void {
    this.lockStatus = false;
  }

  public isLocked(): boolean {
    return this.lockStatus;
  }

  public enqueue(jobArgs: ProductSyncJobType | ActiveBrandDTO): void {
    this.jobQueue.push(jobArgs);
  }

  public dequeue(): ProductSyncJob {
    const job = this.jobQueue.pop();

    if (!job) {
      throw new Error('No jobs exist in the queue.');
    }

    if (this.isActiveBrandDto(job)) {
      return Container.get(ProductSyncJobFactory).createFromBrandDto(job);
    }

    return Container.get(ProductSyncJobFactory).createFromJobType(job);
  }

  public isEmpty(): boolean {
    return this.jobQueue.length == 0;
  }

  private isActiveBrandDto(
    job: ProductSyncJobType | ActiveBrandDTO
  ): job is ActiveBrandDTO {
    return (job as ActiveBrandDTO).active !== undefined;
  }
}
