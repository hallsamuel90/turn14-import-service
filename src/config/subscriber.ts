import Container from 'typedi';
import { RegistrationSubscriber } from '../subscribers/registrationSubscriber';
import { BrandActivationSubscriber } from '../subscribers/brandActivationSubscriber';

export default (): void => {
  const brandActivationSubscriberService = Container.get(
    BrandActivationSubscriber
  );
  brandActivationSubscriberService.subscribeBrandActivationSequence();

  const registrationSubscriberService = Container.get(RegistrationSubscriber);
  registrationSubscriberService.subscribeRegistrationSequence();
};
