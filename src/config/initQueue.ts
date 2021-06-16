import { ProductSyncQueue } from '../productMgmt/jobQueue/models/productSyncQueue';
import { ProductSyncQueueRepositoryMongo } from '../productMgmt/jobQueue/repositories';

export const createQueueIfDoesNotExist = async (): Promise<void> => {
  const queueRepo = new ProductSyncQueueRepositoryMongo();
  try {
    await queueRepo.fetchQueue();
  } catch (e) {
    console.info('initializing queue...');
    await queueRepo.save(new ProductSyncQueue());
  }
};
