/* eslint-disable @typescript-eslint/camelcase */
import { anything, instance, mock, verify, when } from 'ts-mockito';
import ETL from '../../../../src/productMgmt/jobQueue/services/etl';
import Turn14DataExtractor from '../../../../src/productMgmt/jobQueue/services/turn14DataExtractor';
import { CreateProductWcMapper } from '../../../../src/productMgmt/services/createProductWcMapper';
import { WcMapperFactory } from '../../../../src/productMgmt/services/wcMapperFactory';
import { WcMapperType } from '../../../../src/productMgmt/services/wcMapperType';
import { Turn14ProductDTO } from '../../../../src/turn14/dtos/turn14ProductDto';
import { WcClient } from '../../../../src/woocommerce/clients/wcClient';
import { WcCreateProductDTO } from '../../../../src/woocommerce/dtos/wcCreateProductDto';

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

describe('ETL tests', () => {
  let etl: ETL;

  let mockTurn14DataExtractor = mock(Turn14DataExtractor);
  let mockWcMapperFactory = mock(WcMapperFactory);
  let mockWcClient = mock(WcClient);

  beforeEach(() => {
    mockTurn14DataExtractor = mock(Turn14DataExtractor);
    mockWcMapperFactory = mock(WcMapperFactory);
    mockWcClient = mock(WcClient);

    etl = new ETL(
      instance(mockTurn14DataExtractor),
      instance(mockWcMapperFactory),
      instance(mockWcClient)
    );
  });

  describe('extract should', () => {
    it('extract turn14 items', async () => {
      await etl.extract(fakeEtlDto);

      verify(
        mockTurn14DataExtractor.attemptItemExtraction(fakeEtlDto)
      ).called();
    });

    it('extract turn14 items data', async () => {
      await etl.extract(fakeEtlDto);

      verify(
        mockTurn14DataExtractor.attemptItemDataExtraction(fakeEtlDto)
      ).called();
    });

    it('extract turn14 items inventory', async () => {
      await etl.extract(fakeEtlDto);

      verify(
        mockTurn14DataExtractor.attemptItemInventoryExtraction(fakeEtlDto)
      ).called();
    });

    it('extract turn14 items pricing', async () => {
      await etl.extract(fakeEtlDto);

      verify(
        mockTurn14DataExtractor.attemptItemPricingExtraction(fakeEtlDto)
      ).called();
    });
  });

  describe('transformLoad should', () => {
    it('exit if all data has been processed', async () => {
      when(
        mockTurn14DataExtractor.getEnrichedTurn14Data(fakeEtlDto.jobId, 1)
      ).thenResolve([]);
      await etl.transformLoad(fakeEtlDto);

      verify(
        mockWcMapperFactory.getWcMapper(WcMapperType.CREATE_PRODUCT)
      ).never();

      verify(
        mockWcClient.postBatchCreateWcProducts(
          fakeEtlDto.siteUrl,
          fakeEtlDto.wcKeys,
          anything()
        )
      ).never();
    });

    it('process all of the data', async () => {
      const dummyTurn14ProductDto = {} as Turn14ProductDTO;
      const dummyWcProduct = {} as WcCreateProductDTO;

      const dummyTurn14ProductDtos = [dummyTurn14ProductDto];
      when(
        mockTurn14DataExtractor.getEnrichedTurn14Data(fakeEtlDto.jobId, 1)
      ).thenResolve(dummyTurn14ProductDtos);
      when(
        mockTurn14DataExtractor.getEnrichedTurn14Data(fakeEtlDto.jobId, 2)
      ).thenResolve([]);

      const mockWcMapper = mock(CreateProductWcMapper);
      when(
        mockWcMapperFactory.getWcMapper(
          WcMapperType.CREATE_PRODUCT,
          fakeEtlDto.siteUrl,
          fakeEtlDto.wcKeys
        )
      ).thenReturn(instance(mockWcMapper));

      const dummyWcProducts = [dummyWcProduct];
      when(mockWcMapper.turn14sToWcs(dummyTurn14ProductDtos)).thenResolve(
        dummyWcProducts
      );

      await etl.transformLoad(fakeEtlDto);

      verify(
        mockWcClient.postBatchCreateWcProducts(
          fakeEtlDto.siteUrl,
          fakeEtlDto.wcKeys,
          dummyWcProducts
        )
      ).once();
    });
  });
});
