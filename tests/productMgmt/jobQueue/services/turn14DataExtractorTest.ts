/* eslint-disable @typescript-eslint/camelcase */
import { expect } from 'chai';
import { capture, instance, mock, verify, when } from 'ts-mockito';
import Turn14DataExtractor from '../../../../src/productMgmt/jobQueue/services/turn14DataExtractor';
import ProductSyncJobDataRepository from '../../../../src/productMgmt/jobQueue/repositories/productSyncJobDataRepository';
import { Turn14RestApi } from '../../../../src/turn14/clients/turn14RestApi';
import { Turn14RestApiProvider } from '../../../../src/turn14/clients/turn14RestApiProvider';

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
  let mockProductSyncJobDataRepository = mock(ProductSyncJobDataRepository);

  beforeEach(() => {
    mockTurn14RestApiProvider = mock(Turn14RestApiProvider);
    mockProductSyncJobDataRepository = mock(ProductSyncJobDataRepository);

    turn14DataExtractor = new Turn14DataExtractor(
      instance(mockTurn14RestApiProvider),
      instance(mockProductSyncJobDataRepository)
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

      const [saveArgs] = capture(
        mockProductSyncJobDataRepository.saveAll
      ).last();

      expect(saveArgs[0].jobId).to.eq('fakeJobId');
      expect(saveArgs[0].turn14Id).to.eq('fakeId');
      expect(saveArgs[0].item?.['type']).to.eq('Item');
    });

    // test('update the saved turn14 items with items inventory', async () => {});
    // test('update the saved turn14 items with items pricing', async () => {});
  });

  describe('attemptExtractItemsData should', () => {
    it('update the saved turn14 items with itemsData', async () => {
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

      const [updateArgs] = capture(
        mockProductSyncJobDataRepository.batchUpdate
      ).last();
      expect(updateArgs[0].jobId).to.eq('fakeJobId');
      expect(updateArgs[0].itemData?.['type']).to.eq('ProductData');
    });
  });

  describe('attemptExtractItemsPricing should', () => {
    it('update the saved turn14 items with itemsPricing', async () => {
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

      const [updateArgs] = capture(
        mockProductSyncJobDataRepository.batchUpdate
      ).last();
      expect(updateArgs[0].jobId).to.eq('fakeJobId');
      expect(updateArgs[0].itemPricing?.['type']).to.eq('PricingItem');
    });
  });

  describe('attemptExtractItemsInventory should', () => {
    it('update the saved turn14 items with itemsInventory', async () => {
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

      const [updateArgs] = capture(
        mockProductSyncJobDataRepository.batchUpdate
      ).last();
      expect(updateArgs[0].jobId).to.eq('fakeJobId');
      expect(updateArgs[0].itemInventory?.['type']).to.eq('InventoryItem');
    });
  });
});
