import { Channel, Connection } from './ampqProTypes';

/**
 * AmqpPro.
 *
 * Interface defines methods for connecting, subscribing, and publishing to a
 * message broker.
 *
 * @author Sam Hall <hallsamuel90@gmail.com>
 */
export interface AmqpPro {
  /**
   * Connect to the message broker and return the connection. Attempts a
   * reconnect in a set interval until a connection is achieved.
   *
   * Implementers are expected to define a default reconnectInterval such that
   * the reconnectInterval parameter is optional.
   *
   * @param {string} amqpUri the uri in which to connect to.
   * @param {number} reconnectInterval the amount of time (in seconds) to wait
   * to attempt a reconnect if previous attempt failed.
   * @returns {Promise<Connection>} the message broker connection.
   */
  connect(amqpUri: string, reconnectInterval?: number): Promise<Connection>;

  /**
   * Creates and returns a new channel on the provided connection.
   *
   * @param {Connection} connection the connection to the message broker.
   * @param {string} channelName the name of the channel to create.
   * @returns {Promise<Channel>} the created channel.
   */
  createChannel(connection: Connection, channelName: string): Promise<Channel>;

  /**
   * Subscribes to a channel and processes incoming messages using the
   * provided callback.
   *
   * @param {Channel} channel the message broker channel to subscribe.
   * @param {string} channelName the name of the message broker channel.
   * @param {Function} callback the callback function to perfrom on incoming messages.
   */
  subscribe(channel: Channel, channelName: string, callback: Function): void;

  /**
   * Publishes the provided payload to the specified channel.
   *
   * @template T
   * @param {Channel} channel the channel to publish the payload to.
   * @param {string} channelName the name of the channel.
   * @param {T} payload the payload to publish.
   */
  publish<T>(channel: Channel, channelName: string, payload: T): void;
}
