import { ApiUser } from '../../../apiUsers/models/apiUser';
import { ApiUserService } from '../../../apiUsers/services/apiUserService';
import { ProductMgmtService } from '../../services/productMgmtService';
import { ProductSyncJobType } from '../productSyncJobType';
import { ProductSyncJob } from './productSyncJob';

/**
 * Removes products that are discontinued or no longer carried from the
 * WooCommerce store.
 */
export class RemoveStaleProductsJob extends ProductSyncJob {
  private readonly apiUserService: ApiUserService;
  private readonly productMgmtService: ProductMgmtService;

  constructor(
    apiUserService: ApiUserService,
    productMgmtService: ProductMgmtService
  ) {
    super(ProductSyncJobType.REMOVE_STALE_PRODUCTS);
    this.apiUserService = apiUserService;
    this.productMgmtService = productMgmtService;
  }

  public async run(): Promise<void> {
    const apiUsers = await this.apiUserService.retrieveAll();

    await this.removeStaleProductsForAllUsers(apiUsers);
  }

  private async removeStaleProductsForAllUsers(
    apiUsers: ApiUser[]
  ): Promise<void> {
    for (const apiUser of apiUsers) {
      await this.removeStaleProductsForUser(apiUser);
    }
  }

  private async removeStaleProductsForUser(apiUser: ApiUser): Promise<void> {
    if (this.userHasActiveBrands(apiUser)) {
      await this.productMgmtService.removeStaleProducts(apiUser);
    }
  }
}
