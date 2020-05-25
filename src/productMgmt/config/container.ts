import Container from 'typedi';
import { ProductMgmtService } from '../services/productMgmtService';
import { BrandActivationSequence } from '../jobs/brandActivationSequence';
import { WcMapperFactory } from '../services/wcMapperFactory';
import { ApiUserService } from '../../apiUsers/services/apiUserService';
import { BrandsService } from '../../brands/services/brandsService';
import { AmqpProJson } from '../../util/ampqProJson';
import { BrandActivationSubscriber } from '../subscribers/brandActivationSubscriber';
import { Turn14RestApiFactory } from '../../turn14/clients/turn14RestApiFactory';
import { WcRestApiFactory } from '../../woocommerce/clients/wcRestApiFactory';

/**
 * Configures the container dependencies for the product management module.
 *
 * @author Sam Hall <hallsamuel90@gmail.com>
 */
export default (): void => {
  Container.get(Turn14RestApiFactory);

  Container.get(WcRestApiFactory);

  Container.get(ApiUserService);

  Container.get(BrandsService);

  Container.set(WcMapperFactory, new WcMapperFactory());

  Container.get(ProductMgmtService);

  const brandActivationSequence = Container.get(BrandActivationSequence);
  const amqpProJson = new AmqpProJson();
  Container.set(
    BrandActivationSubscriber,
    new BrandActivationSubscriber(brandActivationSequence, amqpProJson)
  );
};
