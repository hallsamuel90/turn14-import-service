import { Service } from 'typedi';
import { ProductSyncQueue } from '../models/productSyncQueue';

@Service()
export class ProductSyncQueueRepository {
  private productSyncQueue: ProductSyncQueue = new ProductSyncQueue();

  public async save(productSyncQueue: ProductSyncQueue): Promise<void> {
    this.productSyncQueue = productSyncQueue;

    return Promise.resolve();
  }

  public async fetchQueue(): Promise<ProductSyncQueue> {
    return this.productSyncQueue;
  }
}
