import Container from 'typedi';
import { AmqpProJson } from '../../util/ampqPro/ampqProJson';
import { ApiUserSequence } from '../jobs/apiUserSequence';
import { ApiUserSubscriber } from '../subscribers/apiUserSubscriber';

/**
 * Configures the subscribers for the brands module.
 *
 * @author Sam Hall <hallsamuel90@gmail.com>
 */
export default (): void => {
  const apiUserSequence = Container.get(ApiUserSequence);
  const amqpProJson = Container.get(AmqpProJson);

  const apiUserSubscriber = new ApiUserSubscriber(apiUserSequence, amqpProJson);

  apiUserSubscriber.subscribeApiUser();
};
