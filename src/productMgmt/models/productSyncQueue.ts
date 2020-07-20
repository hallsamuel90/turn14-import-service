import { ProductSyncJob } from './productSyncJob';
import { ProductSyncQueueError } from '../errors/productSyncQueueError';

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
    if (!this.isLocked()) {
      return this.jobQueue[this.jobQueue.length - 1];
    }

    throw new ProductSyncQueueError('The queue is locked! Cannot dequeue.');
  }

  public isEmpty(): boolean {
    return this.jobQueue.length == 0;
  }
}
