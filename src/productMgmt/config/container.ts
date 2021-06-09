import Container from 'typedi';
import { ApiUserService } from '../../apiUsers/services/apiUserService';
import { BrandsService } from '../../brands/services/brandsService';
import { Turn14RestApiProvider } from '../../turn14/clients/turn14RestApiProvider';
import { AmqpProJson } from '../../util/ampqPro/ampqProJson';
import { WcRestApiProvider } from '../../woocommerce/clients/wcRestApiProvider';
import { BrandActivationSequence } from '../subscribers/brandActivationSequence';
import { ProductMgmtService } from '../services/productMgmtService';
import { WcMapperFactory } from '../services/wcMapperFactory';
import { ProductSyncJobProcessor } from '../jobQueue/productSyncJobProcessor';
import { ProductSyncQueueService } from '../jobQueue/services/productSyncQueueService';
import { ProductSyncQueueRepositoryMongo } from '../jobQueue/repositories';

/**
 * Configures the container dependencies for the product management module.
 *
 * @author Sam Hall <hallsamuel90@gmail.com>
 */
export default (): void => {
  Container.get(Turn14RestApiProvider);
  Container.get(WcRestApiProvider);
  Container.get(ApiUserService);
  Container.get(ProductMgmtService);
  Container.get(BrandsService);
  Container.get(WcMapperFactory);
  Container.get(BrandActivationSequence);
  Container.get(AmqpProJson);

  Container.get(ProductSyncJobProcessor);
  Container.get(ProductSyncQueueService);
  Container.get(ProductSyncQueueRepositoryMongo);
};
