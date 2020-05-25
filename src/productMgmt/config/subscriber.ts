import Container from 'typedi';
import { BrandActivationSubscriber } from '../subscribers/brandActivationSubscriber';

export default (): void => {
  const brandActivationSubscriberService = Container.get(
    BrandActivationSubscriber
  );

  brandActivationSubscriberService.subscribeBrandActivationSequence();
};
