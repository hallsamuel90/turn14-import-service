const amqp = require('amqplib');

/**
 *
 */
class ImportPublisher {
  /**
   *
   * @param {JSON} importBrands
   */
  async queueImportBrandsSequence(importBrands) {
    try {
      const connection = await amqp.connect(process.env.RABBITMQ_URI);
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

module.exports = ImportPublisher;
