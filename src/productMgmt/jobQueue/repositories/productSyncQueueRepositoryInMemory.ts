import { Service } from 'typedi';
import { ProductSyncQueue } from '../models/productSyncQueue';
import { ProductSyncQueueRepository } from './types';

@Service()
export class ProductSyncQueueRepositoryInMemory
  implements ProductSyncQueueRepository {
  private productSyncQueue: ProductSyncQueue = new ProductSyncQueue();

  public async save(productSyncQueue: ProductSyncQueue): Promise<void> {
    this.productSyncQueue = productSyncQueue;

    return Promise.resolve();
  }

  public async fetchQueue(): Promise<ProductSyncQueue> {
    return this.productSyncQueue;
  }
}
