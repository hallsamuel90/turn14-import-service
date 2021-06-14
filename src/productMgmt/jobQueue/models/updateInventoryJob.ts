import { ApiUserService } from '../../../apiUsers/services/apiUserService';
import { ProductSyncJobType } from '../productSyncJobType';
import * as etl from '../services/etl';
import { GetEtlService } from '../services/etl';
import { JobDto } from '../types';
import { ProductSyncJob } from './productSyncJob';

export class UpdateInventoryJob extends ProductSyncJob {
  private readonly jobDto: JobDto;
  private readonly apiUserService: ApiUserService;
  private readonly getEtlService: GetEtlService;

  constructor(
    jobDto: JobDto,
    apiUserService: ApiUserService,
    getEtlService: GetEtlService = etl.getEtlService
  ) {
    super(ProductSyncJobType.UPDATE_INVENTORY);
    this.jobDto = jobDto;
    this.apiUserService = apiUserService;
    this.getEtlService = getEtlService;
  }

  public async run(): Promise<void> {
    const user = await this.apiUserService.retrieve(this.jobDto.userId);

    const etlDto = {
      jobId: this.id,
      brandId: this.jobDto.brandId,
      turn14Keys: user.turn14Keys,
      wcKeys: user.wcKeys,
      siteUrl: user.siteUrl,
    };

    const etl = this.getEtlService(this.jobDto.jobType);

    console.info(
      `Extracting product inventory for brandId: ${this.jobDto.brandId}...`
    );
    await etl.extract(etlDto);

    console.info(
      `Transforming product inventory and sending to WooCommerce...`
    );
    await etl.transformLoad(etlDto);

    console.info(`Cleaning up temporary resources...`);
    await etl.cleanUp(etlDto.jobId);

    console.info(`Update Inventory Job complete!`);
  }
}
