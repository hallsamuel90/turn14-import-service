import Container from 'typedi';
import { ApiUserService } from '../../apiUsers/services/apiUserService';
import { BrandsService } from '../../brands/services/brandsService';
import { Turn14RestApiProvider } from '../../turn14/clients/turn14RestApiProvider';
import { AmqpProJson } from '../../util/ampqPro/ampqProJson';
import { WcRestApiProvider } from '../../woocommerce/clients/wcRestApiProvider';
import { BrandActivationSequence } from '../jobs/brandActivationSequence';
import { ProductMgmtService } from '../services/productMgmtService';
import { WcMapperProvider } from '../services/wcMapperProvider';

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
  Container.get(WcMapperProvider);
  Container.get(BrandActivationSequence);
  Container.get(AmqpProJson);
};
