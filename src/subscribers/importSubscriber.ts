import amqp from 'amqplib';
import { Container } from 'typedi';
import ImportBrandsSequence from '../jobs/importBrandsSequence';

/**
 *
 */
export default class ImportSubscriber {
  /**
   *
   */
  async subscribeImportBrandsSequence(): Promise<void> {
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
      console.error('🔥 error: ' + e);
    }
  }
}
