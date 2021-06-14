import { ApiUserService } from '../../../apiUsers/services/apiUserService';
import { ProductSyncJobType } from '../productSyncJobType';
import { Etl } from '../services/etl';
import { JobDto } from '../types';
import { ProductSyncJob } from './productSyncJob';

export class ImportProductsJob extends ProductSyncJob {
  private readonly apiUserService: ApiUserService;
  private readonly etl: Etl;
  private readonly jobDto: JobDto;

  constructor(apiUserService: ApiUserService, etl: Etl, jobDto: JobDto) {
    super(ProductSyncJobType.IMPORT_BRAND);

    this.apiUserService = apiUserService;
    this.etl = etl;
    this.jobDto = jobDto;
  }

  public async run(): Promise<void> {
    const user = await this.apiUserService.retrieve(this.jobDto.userId);

    console.info(
      `Adding brandId: ${this.jobDto.brandId} to user's managed brands...`
    );
    await this.apiUserService.addBrand(user, this.jobDto.brandId);

    const etlDto = {
      jobId: this.id,
      brandId: this.jobDto.brandId,
      turn14Keys: user.turn14Keys,
      wcKeys: user.wcKeys,
      siteUrl: user.siteUrl,
    };

    console.info(`Extracting products for brandId: ${this.jobDto.brandId}...`);
    await this.etl.extract(etlDto);

    console.info(`Transforming products and sending to WooCommerce...`);
    await this.etl.transformLoad(etlDto);

    console.info(`Cleaning up temporary resources...`);
    await this.etl.cleanUp(etlDto.jobId);

    console.info(`Job complete!`);
  }
}
