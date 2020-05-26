import { Service } from 'typedi';
import { AmqpPro } from '../../util/ampqPro';
import { BrandDTO } from '../dtos/brandDto';

/**
 * BrandsPublisher.
 *
 * @author Sam Hall <hallsamuel90@gmail.com>
 */
@Service()
export class BrandsPublisher {
  private RABBITMQ_URI = process.env.RABBITMQ_URI;
  private static readonly BRANDS_CHANNEL = 'brandsQueue';

  private readonly amqpUtil: AmqpPro;

  /**
   * Creates a new instance with the provided amqp utilty.
   *
   * @param {AmqpPro} amqpUtil the amqp library for connecting and publishing to
   * the message broker.
   */
  constructor(amqpUtil: AmqpPro) {
    this.amqpUtil = amqpUtil;
  }

  /**
   * Publishes a list of Brands to the message broker.
   *
   * @param {BrandDTO[]} brands the list of brands to publish.
   */
  async queuePublishBrandsSequence(brands: BrandDTO[]): Promise<void> {
    const connection = await this.amqpUtil.connect(
      this.RABBITMQ_URI || '',
      this.queuePublishBrandsSequence
    );

    const channel = await this.amqpUtil.createChannel(
      connection,
      BrandsPublisher.BRANDS_CHANNEL
    );

    this.amqpUtil.publish(channel, BrandsPublisher.BRANDS_CHANNEL, brands);
  }
}
