import { ProductSyncJobPoller } from '../jobQueue/productSyncJobPoller';

export default (): void => {
  const productSyncJobPoller = new ProductSyncJobPoller();
  productSyncJobPoller.pollJobQueue();
};
