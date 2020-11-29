import { Service } from 'typedi';
import { ProductSyncQueue } from '../models/productSyncQueue';

@Service()
export class ProductSyncQueueRepository {
  private productSyncQueue: ProductSyncQueue = new ProductSyncQueue();

  public save(productSyncQueue: ProductSyncQueue): void {
    this.productSyncQueue = productSyncQueue;
  }

  public fetchQueue(): ProductSyncQueue {
    return this.productSyncQueue;
  }
}
