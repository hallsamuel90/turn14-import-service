import { ProductSyncJob } from './productSyncJob';

/**
 * Data structure to queue product sync jobs.
 */
export class ProductSyncQueue {
  private lockStatus = false;
  private jobQueue: ProductSyncJob[] = [];

  public lock(): void {
    this.lockStatus = true;
  }

  public unLock(): void {
    this.lockStatus = false;
  }

  public isLocked(): boolean {
    return this.lockStatus;
  }

  public enqueue(productSyncJob: ProductSyncJob): void {
    this.jobQueue.push(productSyncJob);
  }

  public dequeue(): ProductSyncJob {
    const job = this.jobQueue.pop();

    if (job) {
      return job;
    }

    throw new Error('No jobs exist in the queue.');
  }

  public isEmpty(): boolean {
    return this.jobQueue.length == 0;
  }
}
