import amqp from 'amqplib';
import { Container } from 'typedi';
import { RegistrationSequence } from '../jobs/registrationSequence';
/**
 *
 */
export default class RegistrationSubscriber {
  /**
   * Connects and subscribes to the channel.
   * If it is not available, retry at a set interval
   */
  async subscribeRegistrationSequence(): Promise<void> {
    const RECONNECT_INTERVAL = 5;
    try {
      const connection = await amqp.connect(process.env.RABBITMQ_URI);
      const channel = await connection.createChannel();
      await channel.assertQueue('registerApiQueue');
      const registrationSequence = Container.get(RegistrationSequence);
      channel.consume('registerApiQueue', (message) => {
        registrationSequence.handler(JSON.parse(message.content.toString()));
        channel.ack(message);
      });
      console.info('⌚ Waiting for registration job requests...');
    } catch (e) {
      console.error('🔥 ' + e);
      console.log('💪 Retrying in ' + RECONNECT_INTERVAL + ' seconds...');
      setTimeout(() => {
        this.subscribeRegistrationSequence();
      }, RECONNECT_INTERVAL * 1000);
    }
  }
}
