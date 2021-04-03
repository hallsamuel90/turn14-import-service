import { Keys } from '../../../apiUsers/models/apiUser';
import { Turn14RestApiProvider } from '../../../turn14/clients/turn14RestApiProvider';
import ProductSyncJobDataRepository from '../repositories/productSyncJobDataRepository';
import ProductJobMapper from './productJobMapper';
import { JobId } from '../models/productSyncJob';
import Turn14DataExtractor from './turn14DataExtractor';

export interface ProductSyncJobData {
  jobId: JobId;
  turn14Id: string;
  item?: JSON;
  itemData?: JSON;
  itemPricing?: JSON;
  itemInventory?: JSON;
}

export interface EtlDto {
  jobId: JobId;
  siteUrl: string;
  brandId: string;
  turn14Keys: Keys;
  wcKeys: Keys;
}

export default class ETL {
  private readonly turn14DataExtractor: Turn14DataExtractor;

  constructor(turn14DataExtractor: Turn14DataExtractor) {
    this.turn14DataExtractor = turn14DataExtractor;
  }

  async extract(etlDto: EtlDto): Promise<void> {
    await this.turn14DataExtractor.attemptItemExtraction(etlDto);
    await this.turn14DataExtractor.attemptItemDataExtraction(etlDto);
    await this.turn14DataExtractor.attemptItemPricingExtraction(etlDto);

    // TODO: extract -> save products keyed by jobId to db as they come in
    // TODO: transform -> paged results from db to woocommerce products
    // TODO: load -> batch ship products when batch is full
    // TODO: cleanup -> add brandId to list of activeBrands, delete all data
    // associated with jobId
    // const pmgmtDto = new PmgmtDTO(
    //   apiUser.siteUrl,
    //   apiUser.turn14Keys,
    //   apiUser.wcKeys,
    //   this.activeBrandDto.getBrandId()
    // );
    // await this.productMgmtService.importBrandProducts(pmgmtDto);
    // await this.apiUserService.addBrand(
    //   apiUser,
    //   this.activeBrandDto.getBrandId()
    // );
  }
}
