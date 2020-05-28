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
   * @param {Function} callback the callback function to perform on consecutive
   * @param {number} [reconnectInterval=5] the amount of time (in seconds) to wait to attempt
   * a reconnect if previous attempt failed.
   * retries.
   * @returns {Promise<Connection>} the message broker connection.
   */
  async connect(
    amqpUri: string,
    callback: Function,
    reconnectInterval?: number
  ): Promise<Connection> {
    try {
      return await amqp.connect(amqpUri);
    } catch (e) {
      console.error('🔥 ' + e);

      reconnectInterval = this.validateReconnectInterval(reconnectInterval);
      this.retryConnect(reconnectInterval, callback);
    } finally {
      throw new AmpqProError(
        `connect(), Something went wrong, could not connect to ${amqpUri}`
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
    } finally {
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
   * @param {number} reconnectInterval the amount of time (in seconds)to wait
   * before attempting a reconnect.
   * @param {Function} callback the function to perform on retry attempt.
   */
  private retryConnect(reconnectInterval: number, callback: Function): void {
    console.log('💪 Retrying in ' + reconnectInterval + ' seconds...');
    setTimeout(() => {
      callback();
    }, reconnectInterval * 1000);
  }
}
