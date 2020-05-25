import { RegistrationSequence } from '../jobs/registrationSequence';
import { AmqpProJson } from '../../util/ampqProJson';
import Container from 'typedi';
import { ApiUserService } from '../services/apiUserService';
import { BrandsService } from '../../brands/services/brandsService';
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
