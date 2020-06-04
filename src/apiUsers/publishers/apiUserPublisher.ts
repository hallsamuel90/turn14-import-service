import { Service } from 'typedi';
import { AmqpPro } from '../../util/ampqPro/ampqPro';
import { ApiUser } from '../models/apiUser';

/**
 * ApiUserPublisher.
 *
 * @author Sam Hall <hallsamuel90@gmail.com>
 */
@Service()
export class ApiUserPublisher {
  private RABBITMQ_URI = process.env.RABBITMQ_URI;
  private static readonly API_USER_CHANNEL = 'apiUserQueue';

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
   * Publishes an ApiUser to the message broker.
   *
   * @param {ApiUser} apiUser the api user to publish.
   */
  async publishApiUser(apiUser: ApiUser): Promise<void> {
    const connection = await this.amqpUtil.connect(this.RABBITMQ_URI || '');

    const channel = await this.amqpUtil.createChannel(
      connection,
      ApiUserPublisher.API_USER_CHANNEL
    );

    this.amqpUtil.publish(channel, ApiUserPublisher.API_USER_CHANNEL, apiUser);
  }
}
