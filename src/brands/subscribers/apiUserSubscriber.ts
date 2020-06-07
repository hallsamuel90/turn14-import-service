import { AmqpPro } from '../../util/ampqPro/ampqPro';
import { ApiUserSequence } from '../jobs/apiUserSequence';

/**
 * ApiUserSubscriber.
 *
 * Primary interface with the message broker that delegates events.
 *
 * @author Sam Hall <hallsamuel90@gmail.com>
 */
export class ApiUserSubscriber {
  private static RABBITMQ_URI = process.env.RABBITMQ_URI;
  private static REGISTRATION_CHANNEL = 'apiUserQueue';

  private readonly apiUserSequence: ApiUserSequence;
  private readonly amqpUtil: AmqpPro;

  /**
   * Creates a new instance with the provided parameters.
   *
   * @param {ApiUserSequence} apiUserSequence the handler for incoming messages.
   * @param {AmqpPro} amqpUtil the amqp library for connecting and subscribing to
   * the message broker.
   */
  constructor(apiUserSequence: ApiUserSequence, amqpUtil: AmqpPro) {
    this.apiUserSequence = apiUserSequence;
    this.amqpUtil = amqpUtil;
  }

  /**
   * Subscribes to the channel and kicks off the registration sequence when a
   * message is recieved.
   */
  async subscribeApiUser(): Promise<void> {
    const connection = await this.amqpUtil.connect(
      ApiUserSubscriber.RABBITMQ_URI || ''
    );

    const channel = await this.amqpUtil.createChannel(
      connection,
      ApiUserSubscriber.REGISTRATION_CHANNEL
    );

    this.amqpUtil.subscribe(
      channel,
      ApiUserSubscriber.REGISTRATION_CHANNEL,
      (msg) => {
        this.apiUserSequence.handler(msg);
      }
    );

    console.info('⌚ Waiting for apiUser registered events...');
  }
}
