import { connect } from 'amqplib';
import { Service } from 'typedi';
import { ImportBrandsDTO } from '../dtos/importBrandsDto';

/**
 *
 */
@Service()
export class ImportPublisher {
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
