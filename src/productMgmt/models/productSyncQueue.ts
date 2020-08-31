import { ProductSyncJob } from './productSyncJob';
import { ProductSyncQueueError } from '../errors/productSyncQueueError';
import _ from 'lodash';

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
    if (!this.isLocked() && !this.isEmpty()) {
      return this.popQueue();
    }

    throw new ProductSyncQueueError('The queue is locked! Cannot dequeue.');
  }

  public isEmpty(): boolean {
    return this.jobQueue.length == 0;
  }

  private popQueue(): ProductSyncJob {
    const job = this.jobQueue.pop();

    if (job) {
      return job;
    }

    throw new Error('No jobs exist in the queue.');
  }
}
