import { Service } from 'typedi';
import { Keys } from '../../../apiUsers/models/apiUser';
import { WcClient } from '../../../woocommerce/clients/wcClient';
import { CreateProductWcMapper } from '../../services/createProductWcMapper';
import { WcMapperFactory } from '../../services/wcMapperFactory';
import { WcMapperType } from '../../services/wcMapperType';
import { JobId } from '../models/productSyncJob';
import Turn14DataExtractor from './turn14DataExtractor';

export enum Turn14DataType {
  ITEM_BASE = 'Item',
  ITEM_DATA = 'ProductData',
  ITEM_PRICING = 'PricingItem',
  ITEM_INVENTORY = 'InventoryItem',
}

export interface ProductSyncJobData {
  jobId: JobId;
  turn14Id: string;
  type: Turn14DataType;
  data: JSON;
}

export interface EtlDto {
  jobId: JobId;
  siteUrl: string;
  brandId: string;
  turn14Keys: Keys;
  wcKeys: Keys;
}

@Service()
export default class ETL {
  private readonly turn14DataExtractor: Turn14DataExtractor;
  private readonly wcMapperFactory: WcMapperFactory;
  private readonly wcClient: WcClient;

  constructor(
    turn14DataExtractor: Turn14DataExtractor,
    wcMapperFactory: WcMapperFactory,
    wcClient: WcClient
  ) {
    this.turn14DataExtractor = turn14DataExtractor;
    this.wcMapperFactory = wcMapperFactory;
    this.wcClient = wcClient;
  }

  public async extract(etlDto: EtlDto): Promise<void> {
    await this.turn14DataExtractor.attemptItemExtraction(etlDto);
    await this.turn14DataExtractor.attemptItemDataExtraction(etlDto);
    await this.turn14DataExtractor.attemptItemPricingExtraction(etlDto);
    await this.turn14DataExtractor.attemptItemInventoryExtraction(etlDto);
  }

  public async transformLoad(etlDto: EtlDto, pageNumber = 1): Promise<void> {
    const enrichedTurn14Data = await this.turn14DataExtractor.getEnrichedTurn14Data(
      etlDto.jobId,
      pageNumber
    );

    console.info('DEBUGGING enrichedTur14Data');
    console.dir(enrichedTurn14Data);

    if (!enrichedTurn14Data.length) {
      console.warn('enriched products empty, exiting transform/load...');
      return Promise.resolve();
    }

    const wcMapper = this.wcMapperFactory.getWcMapper(
      WcMapperType.CREATE_PRODUCT,
      etlDto.siteUrl,
      etlDto.wcKeys
    ) as CreateProductWcMapper;

    const mappedWcProducts = await wcMapper.turn14sToWcs(enrichedTurn14Data);
    console.info('DEBUGGING mappedWcProducts');
    console.dir(mappedWcProducts);
    const response = await this.wcClient.postBatchCreateWcProducts(
      etlDto.siteUrl,
      etlDto.wcKeys,
      mappedWcProducts
    );

    console.info('DEBUGGING woocommerce response');
    console.dir(response);

    await this.transformLoad(etlDto, pageNumber + 1);
  }

  public async cleanUp(jobId: string): Promise<void> {
    await this.turn14DataExtractor.deleteExtractedData(jobId);
  }
}
