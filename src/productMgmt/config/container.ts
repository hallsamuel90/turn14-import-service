import Container from 'typedi';
import { ApiUserService } from '../../apiUsers/services/apiUserService';
import { BrandsService } from '../../brands/services/brandsService';
import { Turn14RestApiProvider } from '../../turn14/clients/turn14RestApiProvider';
import { AmqpProJson } from '../../util/ampqPro/ampqProJson';
import { WcRestApiProvider } from '../../woocommerce/clients/wcRestApiProvider';
import { BrandActivationSequence } from '../jobs/brandActivationSequence';
import { ProductMgmtService } from '../services/productMgmtService';
import { WcMapperProvider } from '../services/wcMapperProvider';
import { BrandActivationSubscriber } from '../subscribers/brandActivationSubscriber';

/**
 * Configures the container dependencies for the product management module.
 *
 * @author Sam Hall <hallsamuel90@gmail.com>
 */
export default (): void => {
  Container.get(Turn14RestApiProvider);

  Container.get(WcRestApiProvider);

  Container.get(ApiUserService);

  Container.get(BrandsService);

  Container.set(WcMapperProvider, new WcMapperProvider());

  Container.get(ProductMgmtService);

  const brandActivationSequence = Container.get(BrandActivationSequence);
  const amqpProJson = new AmqpProJson();
  Container.set(
    BrandActivationSubscriber,
    new BrandActivationSubscriber(brandActivationSequence, amqpProJson)
  );
};
