import { ProductSyncJobScheduler } from '../jobQueue/productSyncJobScheduler';

export default async (): Promise<void> => {
  const productSyncJobScheduler = new ProductSyncJobScheduler();

  await productSyncJobScheduler.scheduleInventoryUpdate();
  await productSyncJobScheduler.schedulePricingUpdate();
  // productSyncJobScheduler.scheduleRemoveStaleProducts();
  await productSyncJobScheduler.scheduleProductResync();
};
