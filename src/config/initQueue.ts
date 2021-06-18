import { ProductSyncQueue } from '../productMgmt/jobQueue/models/productSyncQueue';
import { ProductSyncQueueRepositoryMongo } from '../productMgmt/jobQueue/repositories';

export const initQueue = async (): Promise<void> => {
  const queueRepo = new ProductSyncQueueRepositoryMongo();
  try {
    const queue = await queueRepo.fetchQueue();

    queue.jobQueue = [];

    console.info('clearing the queue...');
    await queueRepo.save(queue);
  } catch (e) {
    console.info('initializing queue...');
    await queueRepo.save(new ProductSyncQueue());
  }
};
