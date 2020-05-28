import amqp from 'amqplib';
import { AmpqProError } from './ampqProError';
import { Channel, Connection } from './ampqProTypes';

/**
 * AmqpPro.
 *
 * Abstraction for connecting, subscribing, and publishing to a message broker.
 *
 * @author Sam Hall <hallsamuel90@gmail.com>
 */
export abstract class AmqpPro {
  private static readonly DEFAULT_RECONNECT_INTERVAL = 5;

  /**
   * Connect to the message broker and return the connection.
   *
   * Attempts a reconnect in a set interval until a connection is achieved.
   *
   * @param {string} amqpUri the uri in which to connect to.
   * @param {number} [reconnectInterval=5] the amount of time (in seconds) to wait to attempt
   * a reconnect if previous attempt failed.
   * retries.
   * @returns {Promise<Connection>} the message broker connection.
   */
  async connect(
    amqpUri: string,
    reconnectInterval?: number
  ): Promise<Connection> {
    try {
      return await amqp.connect(amqpUri);
    } catch (e) {
      console.error('🔥 ' + e);

      reconnectInterval = this.validateReconnectInterval(reconnectInterval);
      this.retryConnect(amqpUri, reconnectInterval);

      throw new AmpqProError(
        `connect(), Something went wrong, it is likely the message broker is
        not available or ${amqpUri} is not a valid address, 💪 Retrying in 
        ${reconnectInterval} seconds...`
      );
    }
  }

  /**
   * Creates and returns a new channel on the provided connection.
   *
   * @param {Connection} connection the connection to the message broker.
   * @param {string} channelName the name of the channel to create.
   * @returns {Promise<Channel>} the created channel.
   */
  async createChannel(
    connection: Connection,
    channelName: string
  ): Promise<Channel> {
    try {
      const channel = await connection.createChannel();
      await channel.assertQueue(channelName);

      return channel;
    } catch (e) {
      console.error('🔥 ' + e);

      throw new AmpqProError(
        `createChannel(), Something went wrong, could not create channel ${channelName}`
      );
    }
  }

  /**
   * Subscribes to a channel and processes incoming messages using the
   * provided callback.
   *
   * @param {Channel} channel the message broker channel to subscribe.
   * @param {string} channelName the name of the message broker channel.
   * @param {Function} callback the callback function to perfrom on incoming messages.
   */
  abstract subscribe(
    channel: Channel,
    channelName: string,
    callback: Function
  ): void;

  /**
   * Publishes the provided payload to the specified channel.
   *
   * @template T
   * @param {Channel} channel the channel to publish the payload to.
   * @param {string} channelName the name of the channel.
   * @param {T} payload the payload to publish.
   */
  abstract publish<T>(channel: Channel, channelName: string, payload: T): void;

  /**
   * Validates the reconnect interval. If one is not specified, return the
   * default.
   *
   * @param {?number} reconnectInterval the reconnect interval to validate. may
   * be null.
   * @returns {number} the default reconnect interval if passed in value is
   * null.
   */
  private validateReconnectInterval(reconnectInterval?: number): number {
    if (reconnectInterval == null) {
      return AmqpPro.DEFAULT_RECONNECT_INTERVAL;
    }

    return reconnectInterval;
  }

  /**
   * Retries the message broker connection.
   *
   * @param {string} amqpUri the uri in which to connect to.
   * @param {number} reconnectInterval the amount of time (in seconds)to wait
   * before attempting a reconnect.
   * @param {Function} callback the function to perform on retry attempt.
   */
  private retryConnect(amqpUri: string, reconnectInterval: number): void {
    setTimeout(() => {
      this.connect(amqpUri, reconnectInterval);
    }, reconnectInterval * 1000);
  }
}
