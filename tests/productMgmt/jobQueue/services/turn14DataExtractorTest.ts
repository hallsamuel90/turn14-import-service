/* eslint-disable @typescript-eslint/camelcase */
import { expect } from 'chai';
import { capture, instance, mock, verify, when } from 'ts-mockito';
import Turn14DataExtractor from '../../../../src/productMgmt/jobQueue/services/turn14DataExtractor';
import ProductSyncJobDataDao from '../../../../src/productMgmt/jobQueue/repositories/productSyncJobDataDao';
import { Turn14RestApi } from '../../../../src/turn14/clients/turn14RestApi';
import { Turn14RestApiProvider } from '../../../../src/turn14/clients/turn14RestApiProvider';
import { Turn14DataType } from '../../../../src/productMgmt/jobQueue/services/etl';

const fakeEtlDto = {
  jobId: 'fakeJobId',
  siteUrl: 'http://someSite.com',
  brandId: 'someBrandId',
  turn14Keys: {
    client: 'fakeClient',
    secret: 'fakeSecret',
  },
  wcKeys: {
    client: 'fakeClient',
    secret: 'fakeSecret',
  },
};

describe('Turn14DataExtractor tests', () => {
  let turn14DataExtractor: Turn14DataExtractor;

  let mockTurn14RestApiProvider = mock(Turn14RestApiProvider);
  let mockProductSyncJobDataDao = mock(ProductSyncJobDataDao);

  beforeEach(() => {
    mockTurn14RestApiProvider = mock(Turn14RestApiProvider);
    mockProductSyncJobDataDao = mock(ProductSyncJobDataDao);

    turn14DataExtractor = new Turn14DataExtractor(
      instance(mockTurn14RestApiProvider),
      instance(mockProductSyncJobDataDao)
    );
  });

  describe('attemptExtractItems should', () => {
    it('save the retrieved turn14 items by jobId', async () => {
      const mockTurn14RestApi = mock(Turn14RestApi);
      const mockTurn14RestApiInstance = instance(mockTurn14RestApi);

      when(
        mockTurn14RestApi.getRequest(`items/brand/${fakeEtlDto.brandId}`, 1)
      ).thenResolve(({
        data: [
          {
            id: 'fakeId',
            type: 'Item',
          },
        ],
        meta: {
          total_pages: 1,
        },
      } as unknown) as JSON);

      when(
        mockTurn14RestApiProvider.getTurn14RestApi(
          fakeEtlDto.turn14Keys.client,
          fakeEtlDto.turn14Keys.secret
        )
      ).thenResolve(mockTurn14RestApiInstance);

      await turn14DataExtractor.attemptItemExtraction(fakeEtlDto);

      verify(
        mockTurn14RestApi.getRequest(`items/brand/${fakeEtlDto.brandId}`, 1)
      ).called();

      const [saveArgs] = capture(mockProductSyncJobDataDao.saveAll).last();

      expect(saveArgs[0].jobId).to.eq('fakeJobId');
      expect(saveArgs[0].turn14Id).to.eq('fakeId');
      expect(saveArgs[0].data?.['type']).to.eq('Item');
    });
  });

  describe('attemptExtractItemsData should', () => {
    it('save the itemsData', async () => {
      const mockTurn14RestApi = mock(Turn14RestApi);
      const mockTurn14RestApiInstance = instance(mockTurn14RestApi);

      when(
        mockTurn14RestApi.getRequest(
          `items/data/brand/${fakeEtlDto.brandId}`,
          1
        )
      ).thenResolve(({
        data: [
          {
            id: 'fakeId',
            type: 'ProductData',
          },
        ],
        meta: {
          total_pages: 1,
        },
      } as unknown) as JSON);

      when(
        mockTurn14RestApiProvider.getTurn14RestApi(
          fakeEtlDto.turn14Keys.client,
          fakeEtlDto.turn14Keys.secret
        )
      ).thenResolve(mockTurn14RestApiInstance);

      await turn14DataExtractor.attemptItemDataExtraction(fakeEtlDto);

      verify(
        mockTurn14RestApi.getRequest(
          `items/data/brand/${fakeEtlDto.brandId}`,
          1
        )
      ).called();

      const [saveArgs] = capture(mockProductSyncJobDataDao.saveAll).last();
      expect(saveArgs[0].jobId).to.eq('fakeJobId');
      expect(saveArgs[0].data?.['type']).to.eq('ProductData');
    });
  });

  describe('attemptExtractItemsPricing should', () => {
    it('save the itemsPricing', async () => {
      const mockTurn14RestApi = mock(Turn14RestApi);
      const mockTurn14RestApiInstance = instance(mockTurn14RestApi);

      when(
        mockTurn14RestApi.getRequest(`pricing/brand/${fakeEtlDto.brandId}`, 1)
      ).thenResolve(({
        data: [
          {
            id: 'fakeId',
            type: 'PricingItem',
          },
        ],
        meta: {
          total_pages: 1,
        },
      } as unknown) as JSON);

      when(
        mockTurn14RestApiProvider.getTurn14RestApi(
          fakeEtlDto.turn14Keys.client,
          fakeEtlDto.turn14Keys.secret
        )
      ).thenResolve(mockTurn14RestApiInstance);

      await turn14DataExtractor.attemptItemPricingExtraction(fakeEtlDto);

      verify(
        mockTurn14RestApi.getRequest(`pricing/brand/${fakeEtlDto.brandId}`, 1)
      ).called();

      const [saveArgs] = capture(mockProductSyncJobDataDao.saveAll).last();
      expect(saveArgs[0].jobId).to.eq('fakeJobId');
      expect(saveArgs[0].type).to.eq('PricingItem');
    });
  });

  describe('attemptExtractItemsInventory should', () => {
    it('save the turn14 inventoryItems', async () => {
      const mockTurn14RestApi = mock(Turn14RestApi);
      const mockTurn14RestApiInstance = instance(mockTurn14RestApi);

      when(
        mockTurn14RestApi.getRequest(`inventory/brand/${fakeEtlDto.brandId}`, 1)
      ).thenResolve(({
        data: [
          {
            id: 'fakeId',
            type: 'InventoryItem',
          },
        ],
        meta: {
          total_pages: 1,
        },
      } as unknown) as JSON);

      when(
        mockTurn14RestApiProvider.getTurn14RestApi(
          fakeEtlDto.turn14Keys.client,
          fakeEtlDto.turn14Keys.secret
        )
      ).thenResolve(mockTurn14RestApiInstance);

      await turn14DataExtractor.attemptItemInventoryExtraction(fakeEtlDto);

      verify(
        mockTurn14RestApi.getRequest(`inventory/brand/${fakeEtlDto.brandId}`, 1)
      ).called();

      const [saveArgs] = capture(mockProductSyncJobDataDao.saveAll).last();
      expect(saveArgs[0].jobId).to.eq('fakeJobId');
      expect(saveArgs[0].type).to.eq('InventoryItem');
    });
  });

  describe('getEnrichedTurn14Data should', () => {
    it('return empty list if there are no products', async () => {
      when(
        mockProductSyncJobDataDao.findAllByJobId('fakeJobId', 1)
      ).thenResolve([]);

      const enrichedProducts = await turn14DataExtractor.getEnrichedTurn14Data(
        'fakeJobId',
        1
      );

      verify(mockProductSyncJobDataDao.findAllByJobId('fakeJobId', 1)).called();

      expect(enrichedProducts).to.be.empty;
    });

    it('return items', async () => {
      const jobData = {
        jobId: 'fakeJobId',
        turn14Id: 'fakeTurn14Id',
        type: Turn14DataType.ITEM_BASE,
        data: ({} as unknown) as JSON,
      };

      when(
        mockProductSyncJobDataDao.findAllByJobId('fakeJobId', 1)
      ).thenResolve([jobData]);
      when(
        mockProductSyncJobDataDao.findAllByTurn14Id('fakeTurn14Id')
      ).thenResolve([]);

      const enrichedProducts = await turn14DataExtractor.getEnrichedTurn14Data(
        'fakeJobId',
        1
      );

      verify(mockProductSyncJobDataDao.findAllByJobId('fakeJobId', 1)).called();

      expect(enrichedProducts.length).to.eq(1);
      expect(enrichedProducts[0].item).to.not.be.null;
    });

    it('return itemsData', async () => {
      const jobDataItem = {
        jobId: 'fakeJobId',
        turn14Id: 'fakeTurn14Id',
        type: Turn14DataType.ITEM_BASE,
        data: ({} as unknown) as JSON,
      };

      const jobDataItemData = {
        jobId: 'fakeJobId',
        turn14Id: 'fakeTurn14Id',
        type: Turn14DataType.ITEM_DATA,
        data: ({ id: 'fakeTurn14Id', type: 'ProductData' } as unknown) as JSON,
      };

      when(
        mockProductSyncJobDataDao.findAllByJobId('fakeJobId', 1)
      ).thenResolve([jobDataItem]);

      when(
        mockProductSyncJobDataDao.findAllByTurn14Id('fakeTurn14Id')
      ).thenResolve([jobDataItemData]);

      const enrichedProducts = await turn14DataExtractor.getEnrichedTurn14Data(
        'fakeJobId',
        1
      );

      verify(mockProductSyncJobDataDao.findAllByJobId('fakeJobId', 1)).called();

      expect(enrichedProducts.length).to.eq(1);
      expect(enrichedProducts[0].itemData).to.deep.eq({
        id: 'fakeTurn14Id',
        type: 'ProductData',
      });
    });

    it('return itemsPricing', async () => {
      const jobDataItem = {
        jobId: 'fakeJobId',
        turn14Id: 'fakeTurn14Id',
        type: Turn14DataType.ITEM_BASE,
        data: ({} as unknown) as JSON,
      };

      const jobDataItemPricing = {
        jobId: 'fakeJobId',
        turn14Id: 'fakeTurn14Id',
        type: Turn14DataType.ITEM_PRICING,
        data: ({ id: 'fakeTurn14Id', type: 'PricingItem' } as unknown) as JSON,
      };

      when(
        mockProductSyncJobDataDao.findAllByJobId('fakeJobId', 1)
      ).thenResolve([jobDataItem]);

      when(
        mockProductSyncJobDataDao.findAllByTurn14Id('fakeTurn14Id')
      ).thenResolve([jobDataItemPricing]);

      const enrichedProducts = await turn14DataExtractor.getEnrichedTurn14Data(
        'fakeJobId',
        1
      );

      verify(mockProductSyncJobDataDao.findAllByJobId('fakeJobId', 1)).called();

      expect(enrichedProducts.length).to.eq(1);
      expect(enrichedProducts[0].itemPricing).to.deep.eq({
        id: 'fakeTurn14Id',
        type: 'PricingItem',
      });
    });

    it('return itemsInventory', async () => {
      const jobDataItem = {
        jobId: 'fakeJobId',
        turn14Id: 'fakeTurn14Id',
        type: Turn14DataType.ITEM_BASE,
        data: ({} as unknown) as JSON,
      };

      const jobDataItemInventory = {
        jobId: 'fakeJobId',
        turn14Id: 'fakeTurn14Id',
        type: Turn14DataType.ITEM_INVENTORY,
        data: ({
          id: 'fakeTurn14Id',
          type: 'InventoryItem',
        } as unknown) as JSON,
      };

      when(
        mockProductSyncJobDataDao.findAllByJobId('fakeJobId', 1)
      ).thenResolve([jobDataItem]);

      when(
        mockProductSyncJobDataDao.findAllByTurn14Id('fakeTurn14Id')
      ).thenResolve([jobDataItemInventory]);

      const enrichedProducts = await turn14DataExtractor.getEnrichedTurn14Data(
        'fakeJobId',
        1
      );

      verify(mockProductSyncJobDataDao.findAllByJobId('fakeJobId', 1)).called();

      expect(enrichedProducts.length).to.eq(1);
      expect(enrichedProducts[0].itemInventory).to.deep.eq({
        id: 'fakeTurn14Id',
        type: 'InventoryItem',
      });
    });
  });
});
