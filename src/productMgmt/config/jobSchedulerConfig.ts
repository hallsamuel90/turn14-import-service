import Container from 'typedi';
import { ProductSyncJobScheduler } from '../jobQueue/productSyncJobScheduler';

export default (): void => {
  const productSyncJobScheduler = Container.get(ProductSyncJobScheduler);
  productSyncJobScheduler.scheduleInventoryUpdate();
  productSyncJobScheduler.schedulePricingUpdate();
  // productSyncJobScheduler.scheduleRemoveStaleProducts();
  productSyncJobScheduler.scheduleProductResync();
};
