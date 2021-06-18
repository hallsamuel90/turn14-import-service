import { ProductSyncJobScheduler } from '../jobQueue/productSyncJobScheduler';

export default async (
  productSyncJobScheduler: ProductSyncJobScheduler = new ProductSyncJobScheduler()
): Promise<void> => {
  await productSyncJobScheduler.scheduleProductResync();
  await productSyncJobScheduler.scheduleInventoryUpdate();
  await productSyncJobScheduler.schedulePricingUpdate();
  // productSyncJobScheduler.scheduleRemoveStaleProducts();
};
