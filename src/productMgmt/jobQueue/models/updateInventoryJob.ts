import { ApiUser } from '../../../apiUsers/models/apiUser';
import { ApiUserService } from '../../../apiUsers/services/apiUserService';
import { ProductSyncJobType } from '../productSyncJobType';
import { Etl } from '../services/etl';
import { ProductSyncJob } from './productSyncJob';

export class UpdateInventoryJob extends ProductSyncJob {
  private readonly apiUserService: ApiUserService;
  private readonly etl: Etl;

  constructor(apiUserService: ApiUserService, etl: Etl) {
    super(ProductSyncJobType.UPDATE_INVENTORY);
    this.apiUserService = apiUserService;
    this.etl = etl;
  }

  public async run(): Promise<void> {
    const users = await this.apiUserService.retrieveAll();

    for (const user of users) {
      await this.updateInventoryForUser(user);
    }
  }

  private async updateInventoryForUser(user: ApiUser): Promise<void> {
    for (const brandId of user.brandIds) {
      const etlDto = {
        jobId: this.id,
        brandId: brandId,
        turn14Keys: user.turn14Keys,
        wcKeys: user.wcKeys,
        siteUrl: user.siteUrl,
      };

      console.info(`Extracting product inventory for brandId: ${brandId}...`);
      await this.etl.extract(etlDto);

      console.info(
        `Transforming product inventory and sending to WooCommerce...`
      );
      await this.etl.transformLoad(etlDto);

      console.info(`Cleaning up temporary resources...`);
      await this.etl.cleanUp(etlDto.jobId);

      console.info(`Update Inventory Job complete!`);
    }
  }
}
