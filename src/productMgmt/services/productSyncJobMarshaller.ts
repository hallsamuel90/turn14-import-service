import { ProductSyncJob } from '../models/productSyncJob';
import { ProductSyncJobType } from '../models/proudctSyncJobType';
import { ProductSyncJobError } from '../errors/productSyncJobError';
import { Inject } from 'typedi';
import { ProductMgmtService } from './productMgmtService';

export class ProductSyncJobMarshaller {
  @Inject()
  private readonly productMgmtService: ProductMgmtService;

  /**
   * Marshalls the job based on type to the correct caller.
   *
   * @param {ProductSyncJob} job the job to be executed by the correct caller.
   * @throws {ProductSyncJobError} if the job cannot be processed.
   */
  public async marshallJob(job: ProductSyncJob): Promise<void> {
    const jobType = job.getJobType();

    if (jobType == ProductSyncJobType.UPDATE_INVENTORY) {
      await this.productMgmtService.updateInventory();
    } else {
      throw new ProductSyncJobError(
        'Cannot run job with unknown type: ' + jobType
      );
    }
  }
}
