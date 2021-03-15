import Container from 'typedi';
import { ProductSyncJobPoller } from '../jobQueue/productSyncJobPoller';
import { ProductSyncJobScheduler } from '../jobQueue/productSyncJobScheduler';

export default (): void => {
  const productSyncJobPoller = Container.get(ProductSyncJobPoller);
  productSyncJobPoller.pollJobQueue();

  const productSyncJobScheduler = Container.get(ProductSyncJobScheduler);
  productSyncJobScheduler.scheduleInventoryUpdate();
  productSyncJobScheduler.schedulePricingUpdate();
  productSyncJobScheduler.scheduleRemoveStaleProducts();
  productSyncJobScheduler.scheduleProductResync();
};
