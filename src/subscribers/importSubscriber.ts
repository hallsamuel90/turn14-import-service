import amqp from 'amqplib';
import { Container } from 'typedi';
import ImportBrandsSequence from '../jobs/importBrandsSequence';

/**
 *
 */
export default class ImportSubscriber {
  /**
   * Connects and subscribes to the channel.
   * If it is not available, retry at a set interval
   */
  async subscribeImportBrandsSequence(): Promise<void> {
    const RECONNECT_INTERVAL = 5;
    try {
      const connection = await amqp.connect(process.env.RABBITMQ_URI);
      const channel = await connection.createChannel();
      await channel.assertQueue('importBrandsQueue');
      const importBrandsSequence = Container.get(ImportBrandsSequence);
      channel.consume('importBrandsQueue', (message) => {
        importBrandsSequence.handler(JSON.parse(message.content.toString()));
        channel.ack(message);
      });
      console.info('⌚ Waiting for job requests...');
    } catch (e) {
      console.error('🔥 ' + e);
      console.log('💪 Retrying in ' + RECONNECT_INTERVAL + ' seconds...');
      setTimeout(() => {
        this.subscribeImportBrandsSequence();
      }, 5000);
    }
  }
}
