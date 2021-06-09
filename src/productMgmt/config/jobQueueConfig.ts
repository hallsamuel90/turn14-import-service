import Container from 'typedi';
import { ProductSyncJobPoller } from '../jobQueue/productSyncJobPoller';

export default (): void => {
  const productSyncJobPoller = Container.get(ProductSyncJobPoller);
  productSyncJobPoller.pollJobQueue();
};
