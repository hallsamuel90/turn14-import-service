import amqp from 'amqplib';
import { Inject, Service } from 'typedi';
import { ImportBrandsSequence } from '../jobs/importBrandsSequence';

/**
 *
 */
@Service()
export class ImportSubscriber {
  @Inject()
  private readonly importBrandsSequence: ImportBrandsSequence;
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
      channel.consume('importBrandsQueue', (message) => {
        this.importBrandsSequence.handler(
          JSON.parse(message.content.toString())
        );
        channel.ack(message);
      });
      console.info('⌚ Waiting for import job requests...');
    } catch (e) {
      console.error('🔥 ' + e);
      console.log('💪 Retrying in ' + RECONNECT_INTERVAL + ' seconds...');
      setTimeout(() => {
        this.subscribeImportBrandsSequence();
      }, RECONNECT_INTERVAL * 1000);
    }
  }
}
