import { ProductSyncQueue } from '../models/productSyncQueue';
import { Service } from 'typedi';

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
