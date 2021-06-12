import { ProductSyncJobScheduler } from '../jobQueue/productSyncJobScheduler';

export default (): void => {
  const productSyncJobScheduler = new ProductSyncJobScheduler();

  productSyncJobScheduler.scheduleInventoryUpdate();
  productSyncJobScheduler.schedulePricingUpdate();
  // productSyncJobScheduler.scheduleRemoveStaleProducts();
  productSyncJobScheduler.scheduleProductResync();
};
