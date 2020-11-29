import { ApiUser } from '../../../apiUsers/models/apiUser';
import { ApiUserService } from '../../../apiUsers/services/apiUserService';
import { ProductMgmtService } from '../../services/productMgmtService';
import { ProductSyncJobType } from '../productSyncJobType';
import { ProductSyncJob } from './productSyncJob';

/**
 * Updates the pricing for products in the WooCommerce store.
 */
export class UpdatePricingJob extends ProductSyncJob {
  private readonly apiUserService: ApiUserService;
  private readonly productMgmtService: ProductMgmtService;

  constructor(
    apiUserService: ApiUserService,
    productMgmtService: ProductMgmtService
  ) {
    super(ProductSyncJobType.UPDATE_PRICING);
    this.apiUserService = apiUserService;
    this.productMgmtService = productMgmtService;
  }

  public async run(): Promise<void> {
    const apiUsers = await this.apiUserService.retrieveAll();

    await this.updatePricingForAllUsers(apiUsers);
  }

  private async updatePricingForAllUsers(apiUsers: ApiUser[]): Promise<void> {
    for (const apiUser of apiUsers) {
      await this.updatePricingForUser(apiUser);
    }
  }

  private async updatePricingForUser(apiUser: ApiUser): Promise<void> {
    if (this.userHasActiveBrands(apiUser)) {
      await this.productMgmtService.updateUserActivePricing(apiUser);
    }
  }
}
