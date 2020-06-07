import Container from 'typedi';
import { AmqpProJson } from '../../util/ampqPro/ampqProJson';
import { BrandActivationSequence } from '../jobs/brandActivationSequence';
import { BrandActivationSubscriber } from '../subscribers/brandActivationSubscriber';

export default (): void => {
  const brandActivationSequence = Container.get(BrandActivationSequence);
  const amqpProJson = new AmqpProJson();

  const brandActivationSubscriber = new BrandActivationSubscriber(
    brandActivationSequence,
    amqpProJson
  );

  brandActivationSubscriber.subscribeBrandActivationSequence();
};
