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
      const etlDto = { jobId: this.id, brandId: brandId, ...user };
      await this.etl.extract(etlDto);

      await this.etl.transformLoad(etlDto);

      await this.etl.cleanUp(etlDto.jobId);
    }
  }
}
