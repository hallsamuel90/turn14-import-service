import { Service } from 'typedi';
import { WcClient } from '../../../woocommerce/clients/wcClient';
import { ResyncProductsWcMapper } from '../../services/resyncProductWcMapper';
import { WcMapperFactory } from '../../services/wcMapperFactory';
import { WcMapperType } from '../../services/wcMapperType';
import { Etl, EtlDto } from './etl';
import Turn14DataExtractor from './turn14DataExtractor';

@Service()
export default class ResyncProductsEtl implements Etl {
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

    if (!enrichedTurn14Data.length) {
      console.warn('enriched products empty, exiting transform/load...');
      return Promise.resolve();
    }

    const wcMapper = this.wcMapperFactory.getWcMapper(
      WcMapperType.RESYNC_PRODUCTS,
      etlDto.siteUrl,
      etlDto.wcKeys
    ) as ResyncProductsWcMapper;

    const mappedWcProducts = await wcMapper.turn14sToWcs(enrichedTurn14Data);

    await this.wcClient.postBatchUpdateWcProducts(
      etlDto.siteUrl,
      etlDto.wcKeys,
      mappedWcProducts
    );

    await this.transformLoad(etlDto, pageNumber + 1);
  }

  public async cleanUp(jobId: string): Promise<void> {
    await this.turn14DataExtractor.deleteExtractedData(jobId);
  }
}
