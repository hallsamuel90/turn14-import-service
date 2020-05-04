import { connect } from 'amqplib';
import { Service } from 'typedi';
import { BrandDTO } from '../dtos/brandDto';

/**
 *
 */
@Service()
export class BrandsPublisher {
  /**
   *
   * @param {BrandDTO[]} brands
   */
  async queuePublishBrandsSequence(brands: BrandDTO[]): Promise<void> {
    try {
      const connection = await connect(process.env.RABBITMQ_URI);
      const channel = await connection.createChannel();
      await channel.assertQueue('brandsQueue');
      channel.sendToQueue('brandsQueue', Buffer.from(JSON.stringify(brands)));
      console.info('✌️ Publish Brands Sequence Job queued!');
    } catch (e) {
      console.error('🔥 error: ' + e);
    }
  }
}
