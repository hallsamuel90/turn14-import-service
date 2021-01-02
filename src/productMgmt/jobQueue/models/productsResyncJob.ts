import { ApiUserService } from '../../../apiUsers/services/apiUserService';
import { ProductMgmtService } from '../../services/productMgmtService';
import { ProductSyncJobType } from '../productSyncJobType';
import { ProductSyncJob } from './productSyncJob';

export class ProductsResyncJob extends ProductSyncJob {
  private readonly apiUserService: ApiUserService;
  private readonly productMgmtService: ProductMgmtService;

  constructor(
    apiUserService: ApiUserService,
    productMgmtService: ProductMgmtService
  ) {
    super(ProductSyncJobType.RESYNC_PRODUCTS);
    this.apiUserService = apiUserService;
    this.productMgmtService = productMgmtService;
  }

  public async run(): Promise<void> {
    const users = await this.apiUserService.retrieveAll();

    for (const user of users) {
      await this.productMgmtService.resyncProducts(user);
    }
  }
}
