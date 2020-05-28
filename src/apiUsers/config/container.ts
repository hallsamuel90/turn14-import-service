import Container from 'typedi';
import { BrandsService } from '../../brands/services/brandsService';
import { AmqpProJson } from '../../util/ampqPro/ampqProJson';
import { RegistrationSequence } from '../jobs/registrationSequence';
import { ApiUserService } from '../services/apiUserService';
import { RegistrationSubscriber } from '../subscribers/registrationSubscriber';

/**
 * Configures the container dependencies for the apiUsers module.
 *
 * @author Sam Hall <hallsamuel90@gmail.com>
 */
export default (): void => {
  Container.get(ApiUserService);

  Container.get(BrandsService);

  const registrationSequence = Container.get(RegistrationSequence);
  const amqpProJson = new AmqpProJson();
  Container.set(
    RegistrationSubscriber,
    new RegistrationSubscriber(registrationSequence, amqpProJson)
  );
};
