const amqp = require('amqplib');
const Container = require('typedi').Container;
const ImportBrandsSequence = require('../jobs/importBrandsSequence');

/**
 *
 */
class ImportSubscriber {
  /**
   *
   * @param {*} importBrands
   */
  async subscribeImportBrandsSequence() {
    try {
      const connection = await amqp.connect('amqp://localhost:5672');
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

module.exports = ImportSubscriber;
