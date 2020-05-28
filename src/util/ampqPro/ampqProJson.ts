import { AmqpPro } from './ampqPro';
import { Channel } from './ampqProTypes';

/**
 * AmqpProJson.
 *
 * Provides methods for connecting to an AMQP message broker using JSON as the
 * communication method. Features built in reconnect logic.
 *
 * @author Sam Hall <hallsamuel90@gmail.com>
 * @see AmqpPro
 */
export class AmqpProJson extends AmqpPro {
  /**
   * Subscribes to a channel and processes incoming messages as JSON using the
   * provided callback.
   *
   * @param {Channel} channel the message broker channel to subscribe.
   * @param {string} channelName the name of the message broker channel.
   * @param {Function} callback the callback function to perfrom on incoming messages.
   */
  subscribe(channel: Channel, channelName: string, callback: Function): void {
    channel.consume(channelName, (message) => {
      if (message != null) {
        callback(JSON.parse(message.content.toString()));
        channel.ack(message);
      }
    });
  }

  /**
   * Publishes the provided payload as JSON to the specified channel.
   *
   * @template T
   * @param {Channel} channel the channel to publish the payload to.
   * @param {string} channelName the name of the channel.
   * @param {T} payload the payload to publish.
   */
  publish<T>(channel: Channel, channelName: string, payload: T): void {
    channel.sendToQueue(channelName, Buffer.from(JSON.stringify(payload)));
  }
}
