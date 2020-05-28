import Container from 'typedi';
import { BrandActivationSubscriber } from '../subscribers/brandActivationSubscriber';

export default (): void => {
  const brandActivationSubscriber = Container.get(BrandActivationSubscriber);

  brandActivationSubscriber.subscribeBrandActivationSequence();
};
