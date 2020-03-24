const amqp = require('amqplib');

/**
 *
 */
class ImportPublisher {
  /**
       *
       * @param {*} importBrands
       */
  async queueImportBrandsSequence(importBrands) {
    try {
      const connection = await amqp.connect('amqp://localhost:5672');
      const channel = await connection.createChannel();
      await channel.assertQueue('importBrandsQueue');
      channel.sendToQueue('importBrandsQueue',
          Buffer.from(JSON.stringify(importBrands)));
      console.info('✌️ Import Brands Sequence Job queued!');
    } catch (e) {
      console.error('🔥 error: ' + e);
    }
  }
}

module.exports = ImportPublisher;

