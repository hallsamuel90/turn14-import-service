import { ApiUserService } from '../../../apiUsers/services/apiUserService';
import { ActiveBrandDTO } from '../../dtos/activeBrandDto';
import { ProductSyncJobType } from '../productSyncJobType';
import { Etl } from '../services/etl';
import { ProductSyncJob } from './productSyncJob';

export class ImportProductsJob extends ProductSyncJob {
  private readonly apiUserService: ApiUserService;
  private readonly etl: Etl;
  private readonly activeBrandDto: ActiveBrandDTO;

  constructor(
    apiUserService: ApiUserService,
    etl: Etl,
    activeBrandDto: ActiveBrandDTO
  ) {
    super(ProductSyncJobType.IMPORT_BRAND);

    this.apiUserService = apiUserService;
    this.etl = etl;
    this.activeBrandDto = activeBrandDto;
  }

  public async run(): Promise<void> {
    const user = await this.apiUserService.retrieve(this.activeBrandDto.userId);

    const etlDto = {
      jobId: this.id,
      brandId: this.activeBrandDto.brandId,
      turn14Keys: user.turn14Keys,
      wcKeys: user.wcKeys,
      siteUrl: user.siteUrl,
    };

    console.info(
      `Extracting products for brandId: ${this.activeBrandDto.brandId}...`
    );
    await this.etl.extract(etlDto);

    console.info(`Transforming products and sending to WooCommerce...`);
    await this.etl.transformLoad(etlDto);

    console.info(`Cleaning up temporary resources...`);
    await this.etl.cleanUp(etlDto.jobId);

    console.info(`Job complete!`);
  }
}
