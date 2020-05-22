import amqp from 'amqplib';
import { Inject, Service } from 'typedi';
import { BrandActivationSequence } from '../jobs/brandActivationSequence';

/**
 *
 */
@Service()
export class BrandActivationSubscriber {
  @Inject()
  private readonly brandActivationSequence: BrandActivationSequence;
  /**
   * Connects and subscribes to the channel.
   * If it is not available, retry at a set interval
   */
  async subscribeBrandActivationSequence(): Promise<void> {
    const RECONNECT_INTERVAL = 5;
    try {
      const connection = await amqp.connect(process.env.RABBITMQ_URI);
      const channel = await connection.createChannel();
      await channel.assertQueue('activateBrandsQueue');
      channel.consume('activateBrandsQueue', (message) => {
        this.brandActivationSequence.handler(
          JSON.parse(message.content.toString())
        );
        channel.ack(message);
      });
      console.info('⌚ Waiting for brand activation requests...');
    } catch (e) {
      console.error('🔥 ' + e);
      console.log('💪 Retrying in ' + RECONNECT_INTERVAL + ' seconds...');
      setTimeout(() => {
        this.subscribeBrandActivationSequence();
      }, RECONNECT_INTERVAL * 1000);
    }
  }
}
