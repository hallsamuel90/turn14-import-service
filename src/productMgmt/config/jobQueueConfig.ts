import { ProductSyncJobPoller } from '../services/productSyncJobPoller';
import Container from 'typedi';
import { ProductSyncJobScheduler } from '../services/productSyncJobScheduler';

export default (): void => {
  const productSyncJobPoller = Container.get(ProductSyncJobPoller);
  productSyncJobPoller.pollJobQueue();

  const productSyncJobScheduler = Container.get(ProductSyncJobScheduler);
  productSyncJobScheduler.scheduleInventoryUpdate();
  productSyncJobScheduler.schedulePricingUpdate();
};
