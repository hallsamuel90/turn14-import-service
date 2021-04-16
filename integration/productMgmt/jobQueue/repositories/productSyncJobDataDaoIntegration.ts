import { expect } from 'chai';
import mongooseSetup, { disconnect } from '../../../../src/config/mongoose';
import ProductSyncJobDataDao from '../../../../src/productMgmt/jobQueue/repositories/productSyncJobDataDao';
import { Turn14DataType } from '../../../../src/productMgmt/jobQueue/services/etl';
describe('ProductSyncJobDataDao Integration Tests', () => {
  before(async () => {
    await mongooseSetup();
  });

  describe('saveAll should', () => {
    it('saves all to the db', async () => {
      const fakeJobData = {
        jobId: 'fakeJobId',
        turn14Id: 'fakeTurn14Id',
        type: Turn14DataType.ITEM_PRICING,
        data: ({
          id: 'fakeId',
          type: 'PricingItem',
        } as unknown) as JSON,
      };

      const productSyncJobDataDao = new ProductSyncJobDataDao();

      await productSyncJobDataDao.saveAll([fakeJobData]);

      const results = await productSyncJobDataDao.findAllByJobId('fakeJobId');

      expect(results[0].jobId).to.eq('fakeJobId');
      expect(results[0].turn14Id).to.eq('fakeTurn14Id');

      await productSyncJobDataDao.deleteAllByJobId('fakeJobId');
    });
  });

  describe('findByTurn14Id should', () => {
    it('return all with turn14Id', async () => {
      const productSyncJobDataDao = new ProductSyncJobDataDao();

      const fakeJobPricing = {
        jobId: 'fakeJobId',
        turn14Id: 'fakeTurn14Id',
        type: Turn14DataType.ITEM_PRICING,
        data: ({
          id: 'fakeTurn14Id',
          type: 'PricingItem',
        } as unknown) as JSON,
      };

      const fakeJobInventory = {
        jobId: 'fakeJobId',
        turn14Id: 'fakeTurn14Id',
        type: Turn14DataType.ITEM_INVENTORY,
        data: ({
          id: 'fakeTurn14Id',
          type: 'InventoryItem',
        } as unknown) as JSON,
      };

      const notRelevantData = {
        jobId: 'fakeJobId',
        turn14Id: 'differentId',
        type: Turn14DataType.ITEM_INVENTORY,
        data: ({
          id: 'differentId',
          type: 'InventoryItem',
        } as unknown) as JSON,
      };
      await productSyncJobDataDao.saveAll([
        fakeJobPricing,
        fakeJobInventory,
        notRelevantData,
      ]);

      const results = await productSyncJobDataDao.findAllByTurn14Id(
        'fakeTurn14Id'
      );

      expect(results.length).to.eq(2);

      await productSyncJobDataDao.deleteAllByJobId('fakeJobId');
    });
  });

  after(async () => {
    await disconnect();
  });
});
