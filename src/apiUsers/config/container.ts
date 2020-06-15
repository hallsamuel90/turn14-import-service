import Container from 'typedi';
import { AmqpProJson } from '../../util/ampqPro/ampqProJson';
import { RegistrationSequence } from '../jobs/registrationSequence';
import { ApiUserPublisher } from '../publishers/apiUserPublisher';
import { ApiUserService } from '../services/apiUserService';

/**
 * Configures the container dependencies for the apiUsers module.
 *
 * @author Sam Hall <hallsamuel90@gmail.com>
 */
export default (): void => {
  Container.get(ApiUserService);

  const amqpProJson = Container.get(AmqpProJson);
  Container.set(ApiUserPublisher, new ApiUserPublisher(amqpProJson));
  Container.get(RegistrationSequence);
};
