import { ApiUser } from '../../../apiUsers/models/apiUser';
import { ApiUserService } from '../../../apiUsers/services/apiUserService';
import { ProductMgmtService } from '../../services/productMgmtService';
import { ProductSyncJobType } from '../productSyncJobType';
import { ProductSyncJob } from './productSyncJob';

/**
 * Updates the WooCommerce store products' inventory.
 */
export class UpdateInventoryJob extends ProductSyncJob {
  private readonly apiUserService: ApiUserService;
  private readonly productMgmtService: ProductMgmtService;

  constructor(
    apiUserService: ApiUserService,
    productMgmtService: ProductMgmtService
  ) {
    super(ProductSyncJobType.UPDATE_INVENTORY);
    this.apiUserService = apiUserService;
    this.productMgmtService = productMgmtService;
  }

  public async run(): Promise<void> {
    const apiUsers = await this.apiUserService.retrieveAll();

    await this.updateAllUserInventory(apiUsers);
  }

  private async updateAllUserInventory(apiUsers: ApiUser[]): Promise<void> {
    for (const apiUser of apiUsers) {
      await this.updateUserInventory(apiUser);
    }
  }

  private async updateUserInventory(apiUser: ApiUser): Promise<void> {
    if (this.userHasActiveBrands(apiUser)) {
      await this.productMgmtService.updateUserActiveInventory(apiUser);
    }
  }
}
