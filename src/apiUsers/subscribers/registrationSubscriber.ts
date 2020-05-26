import { AmqpPro } from '../../util/ampqPro';
import { RegistrationSequence } from '../jobs/registrationSequence';

/**
 * RegistrationSubscriber.
 *
 * Primary interface with the message broker that delegates events.
 *
 * @author Sam Hall <hallsamuel90@gmail.com>
 */
export class RegistrationSubscriber {
  private static RABBITMQ_URI = process.env.RABBITMQ_URI;
  // TODO: remoce empty string above and  throw in startup process if this is
  // not defined.
  private static REGISTRATION_CHANNEL = 'registerApiQueue';

  private readonly registrationSequence: RegistrationSequence;
  private readonly amqpUtil: AmqpPro;

  /**
   * Creates a new instance with the provided parameters.
   *
   * @param {RegistrationSequence} registrationSequence the handler for incoming messages.
   * @param {AmqpPro} amqpUtil the amqp library for connecting and subscribing to
   * the message broker.
   */
  constructor(registrationSequence: RegistrationSequence, amqpUtil: AmqpPro) {
    this.registrationSequence = registrationSequence;
    this.amqpUtil = amqpUtil;
  }

  /**
   * Subscribes to the channel and kicks off the registration sequence when a
   * message is recieved.
   */
  async subscribeRegistrationSequence(): Promise<void> {
    const connection = await this.amqpUtil.connect(
      RegistrationSubscriber.RABBITMQ_URI || '',
      this.subscribeRegistrationSequence
    );

    const channel = await this.amqpUtil.createChannel(
      connection,
      RegistrationSubscriber.REGISTRATION_CHANNEL
    );

    this.amqpUtil.subscribe(
      channel,
      RegistrationSubscriber.REGISTRATION_CHANNEL,
      this.registrationSequence.handler
    );

    console.info('⌚ Waiting for registration job requests...');
  }
}
