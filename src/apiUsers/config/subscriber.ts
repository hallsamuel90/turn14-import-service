import Container from 'typedi';
import { AmqpProJson } from '../../util/ampqPro/ampqProJson';
import { RegistrationSequence } from '../jobs/registrationSequence';
import { RegistrationSubscriber } from '../subscribers/registrationSubscriber';

/**
 * Configures the subscribers for the apiUsers module.
 *
 * @author Sam Hall <hallsamuel90@gmail.com>
 */
export default (): void => {
  const registrationSequence = Container.get(RegistrationSequence);
  const amqpProJson = Container.get(AmqpProJson);

  const registrationSubscriber = new RegistrationSubscriber(
    registrationSequence,
    amqpProJson
  );

  registrationSubscriber.subscribeRegistrationSequence();
};
