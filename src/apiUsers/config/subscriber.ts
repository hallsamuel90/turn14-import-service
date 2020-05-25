import Container from 'typedi';
import { RegistrationSubscriber } from '../subscribers/registrationSubscriber';

/**
 * Configures the subscribers for the apiUsers module.
 *
 * @author Sam Hall <hallsamuel90@gmail.com>
 */
export default (): void => {
  const registrationSubscriberService = Container.get(RegistrationSubscriber);
  registrationSubscriberService.subscribeRegistrationSequence();
};
