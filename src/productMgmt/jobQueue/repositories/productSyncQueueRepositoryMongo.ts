import mongoose, { Document } from 'mongoose';
import { Service } from 'typedi';
import { ProductSyncQueueRepository } from '.';
import { ProductSyncQueue } from '../models/productSyncQueue';

interface ProductSyncQueueDocument extends ProductSyncQueue, Document {}

const ProductSyncQueueModel = new mongoose.Schema({
  queueId: String,
  lockStatus: Boolean,
  jobQueue: [Object],
});

const productSyncQueueClient = mongoose.model<ProductSyncQueueDocument>(
  'ProductSyncQueue',
  ProductSyncQueueModel
);

const ONLY_QUEUE = 'only-queue';

@Service()
export class ProductSyncQueueRepositoryMongo
  implements ProductSyncQueueRepository {
  public async save(productSyncQueue: ProductSyncQueue): Promise<void> {
    await productSyncQueueClient.findOneAndUpdate(
      { queueId: ONLY_QUEUE },
      productSyncQueue,
      { upsert: true }
    );
  }

  public async fetchQueue(): Promise<ProductSyncQueue> {
    const result = await productSyncQueueClient
      .findOne({
        queueId: ONLY_QUEUE,
      })
      .lean();

    if (!result) {
      throw new Error('Failed to retrieve the queue!');
    }

    return new ProductSyncQueue(result.lockStatus, result.jobQueue);
  }
}
