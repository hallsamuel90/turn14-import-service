import { ApiUser } from '../../../apiUsers/models/apiUser';
import { ApiUserService } from '../../../apiUsers/services/apiUserService';
import { ProductMgmtService } from '../../services/productMgmtService';
import { ProductSyncJobType } from '../productSyncJobType';
import { ProductSyncJob } from './productSyncJob';

export class ImportAddedProductsJob extends ProductSyncJob {
  private readonly apiUserService: ApiUserService;
  private readonly productMgmtService: ProductMgmtService;

  constructor(
    apiUserService: ApiUserService,
    productMgmtService: ProductMgmtService
  ) {
    super(ProductSyncJobType.IMPORT_ADDED_PRODUCTS);
    this.apiUserService = apiUserService;
    this.productMgmtService = productMgmtService;
  }

  public async run(): Promise<void> {
    const apiUsers = await this.apiUserService.retrieveAll();

    await this.importAddedProductsForAllUsers(apiUsers);
  }

  private async importAddedProductsForAllUsers(
    apiUsers: ApiUser[]
  ): Promise<void> {
    for (const apiUser of apiUsers) {
      await this.importAddedProductsForUser(apiUser);
    }
  }

  private async importAddedProductsForUser(apiUser: ApiUser): Promise<void> {
    if (this.userHasActiveBrands(apiUser)) {
      await this.productMgmtService.importNewProducts(apiUser);
    }
  }
}
