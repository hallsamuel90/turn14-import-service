import { ProductSyncQueue } from '../models/productSyncQueue';

export interface ProductSyncQueueRepository {
  save: (productSyncQueue: ProductSyncQueue) => Promise<void>;
  fetchQueue: () => Promise<ProductSyncQueue>;
}
