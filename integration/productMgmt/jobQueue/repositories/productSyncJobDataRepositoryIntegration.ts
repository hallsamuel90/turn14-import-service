import mongooseSetup, { disconnect } from '../../../../src/config/mongoose';
describe('ProductSyncJobDataRepository Integration Tests', () => {
  before(async () => {
    await mongooseSetup();
  });

  describe('saveAll should', () => {
    it('saves all to the db', () => {
      console.info('hit the test');
    });
  });

  after(async () => {
    await disconnect();
  });
});
