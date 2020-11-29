import { ApiUser } from '../../../apiUsers/models/apiUser';
import { ProductSyncJobType } from '../productSyncJobType';

export abstract class ProductSyncJob {
  private readonly jobType: ProductSyncJobType;

  constructor(jobType: ProductSyncJobType) {
    this.jobType = jobType;
  }

  public getJobType(): ProductSyncJobType {
    return this.jobType;
  }

  public abstract run(): Promise<void>;

  protected userHasActiveBrands(apiUser: ApiUser): boolean {
    const brandIds = apiUser?.brandIds;

    if (brandIds) {
      return brandIds.length > 0;
    }

    return false;
  }
}
