import { ProductSyncQueue } from '../models/productSyncQueue';

/**
 * Service class for operations on ProductSyncQueue
 */
export class ProductSyncQueueService {
  public lockQueue(): void {
    const jobQueue = this.readProductSyncQueue();

    jobQueue.lock();

    // repo.save;
  }

  public unlockQueue(): void {
    const jobQueue = this.readProductSyncQueue();

    jobQueue.unLock();

    // repo.save;
  }

  /**
   * Fetches the product sync job queue.
   *
   * @returns {ProductSyncQueue} the queue.
   */
  public readProductSyncQueue(): ProductSyncQueue {
    // repo.findIt

    return new ProductSyncQueue();
  }
}
