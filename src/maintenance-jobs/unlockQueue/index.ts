import { ProductSyncQueueService } from '../../productMgmt/jobQueue/services/productSyncQueueService';

export default async (): Promise<void> => {
  const queueService = new ProductSyncQueueService();

  await queueService.unlockQueue();
};
