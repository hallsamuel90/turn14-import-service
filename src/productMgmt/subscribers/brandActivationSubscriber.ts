import { AmqpPro } from '../../util/ampqPro';
import { BrandActivationSequence } from '../jobs/brandActivationSequence';

/**
 * BrandActivationSubscriber.
 *
 * @author Sam Hall <hallsamuel90@gmail.com>
 */
export class BrandActivationSubscriber {
  private RABBITMQ_URI = process.env.RABBITMQ_URI;
  private static readonly ACTIVATE_BRANDS_CHANNEL = 'activateBrandsQueue';

  private readonly brandActivationSequence: BrandActivationSequence;
  private readonly amqpUtil: AmqpPro;

  /**
   * Creates a new instance with the provided parameters.
   *
   * @param {BrandActivationSequence} brandActivationSequence the handler for incoming messages.
   * @param {AmqpPro} amqpUtil the amqp utility library for connecting and subscribing to
   * the message broker.
   */
  constructor(
    brandActivationSequence: BrandActivationSequence,
    amqpUtil: AmqpPro
  ) {
    this.brandActivationSequence = brandActivationSequence;
    this.amqpUtil = amqpUtil;
  }

  /**
   * Subscribes to the channel and kicks off the brand activation sequence when
   * a message is recieved.
   */
  async subscribeBrandActivationSequence(): Promise<void> {
    const connection = await this.amqpUtil.connect(
      this.RABBITMQ_URI || '',
      this.subscribeBrandActivationSequence
    );

    const channel = await this.amqpUtil.createChannel(
      connection,
      BrandActivationSubscriber.ACTIVATE_BRANDS_CHANNEL
    );

    this.amqpUtil.subscribe(
      channel,
      BrandActivationSubscriber.ACTIVATE_BRANDS_CHANNEL,
      this.brandActivationSequence.handler
    );

    console.info('⌚ Waiting for brand activation requests...');
  }
}
