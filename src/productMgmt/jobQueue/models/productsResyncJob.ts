import { ApiUser } from '../../../apiUsers/models/apiUser';
import { ApiUserService } from '../../../apiUsers/services/apiUserService';
import { ProductSyncJobType } from '../productSyncJobType';
import ETL from '../services/etl';
import { ProductSyncJob } from './productSyncJob';

export class ProductsResyncJob extends ProductSyncJob {
  private readonly apiUserService: ApiUserService;
  private readonly etl: ETL;

  constructor(apiUserService: ApiUserService, etl: ETL) {
    super(ProductSyncJobType.RESYNC_PRODUCTS);
    this.apiUserService = apiUserService;
    this.etl = etl;
  }

  public async run(): Promise<void> {
    const users = await this.apiUserService.retrieveAll();

    for (const user of users) {
      await this.resyncProductsForUser(user);
    }
  }

  private async resyncProductsForUser(user: ApiUser): Promise<void> {
    for (const brandId of user.brandIds) {
      const etlDto = {
        jobId: this.id,
        brandId: brandId,
        turn14Keys: user.turn14Keys,
        wcKeys: user.wcKeys,
        siteUrl: user.siteUrl,
      };

      console.info(`Extracting products for brandId: ${brandId}...`);
      await this.etl.extract(etlDto);

      console.info(`Transforming products and sending to WooCommerce...`);
      await this.etl.transformLoad(etlDto);

      console.info(`Cleaning up temporary resources...`);
      await this.etl.cleanUp(etlDto.jobId);

      console.info(`Job complete!`);
    }
  }
}
