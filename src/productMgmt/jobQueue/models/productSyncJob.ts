import { ApiUser } from '../../../apiUsers/models/apiUser';
import { ProductSyncJobType } from '../productSyncJobType';
import { v4 as uuid } from 'uuid';

export type JobId = string;
export abstract class ProductSyncJob {
  jobType: ProductSyncJobType;
  id: JobId;

  constructor(jobType: ProductSyncJobType) {
    this.jobType = jobType;
    this.id = uuid();
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
