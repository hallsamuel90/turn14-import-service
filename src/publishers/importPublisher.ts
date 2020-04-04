import { connect } from 'amqplib';
import ImportBrandsDTO from '../dtos/importBrandsDto';

/**
 *
 */
class ImportPublisher {
  /**
   *
   * @param {ImportBrandsDTO} importBrands
   */
  async queueImportBrandsSequence(
    importBrands: ImportBrandsDTO
  ): Promise<void> {
    try {
      const connection = await connect(process.env.RABBITMQ_URI);
      const channel = await connection.createChannel();
      await channel.assertQueue('importBrandsQueue');
      channel.sendToQueue(
        'importBrandsQueue',
        Buffer.from(JSON.stringify(importBrands))
      );
      console.info('✌️ Import Brands Sequence Job queued!');
    } catch (e) {
      console.error('🔥 error: ' + e);
    }
  }
}

export default ImportPublisher;
