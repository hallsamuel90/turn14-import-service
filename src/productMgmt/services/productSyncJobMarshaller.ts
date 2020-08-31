import { ProductSyncJob } from '../models/productSyncJob';
import { ProductSyncJobType } from '../models/proudctSyncJobType';
import { ProductSyncJobError } from '../errors/productSyncJobError';
import { ProductSyncJobWorker } from './productSyncJobWorker';
import { ActiveBrandDTO } from '../dtos/activeBrandDto';
import { Service } from 'typedi';

@Service()
export class ProductSyncJobMarshaller {
  private readonly productSyncJobWorker: ProductSyncJobWorker;

  constructor(productSyncJobWorker: ProductSyncJobWorker) {
    this.productSyncJobWorker = productSyncJobWorker;
  }

  /**
   * Marshalls the job based on type to the correct caller.
   *
   * @param {ProductSyncJob} job the job to be executed by the correct caller.
   * @throws {ProductSyncJobError} if the job cannot be processed.
   */
  public async marshallJob(job: ProductSyncJob): Promise<void> {
    const jobType = job.getJobType();
    let activeBrandDto: ActiveBrandDTO;

    switch (jobType) {
      case ProductSyncJobType.IMPORT_BRAND:
        activeBrandDto = job.getArgs()[0] as ActiveBrandDTO;

        await this.productSyncJobWorker.importBrand(activeBrandDto);
        break;
      case ProductSyncJobType.REMOVE_BRAND:
        activeBrandDto = job.getArgs()[0] as ActiveBrandDTO;

        await this.productSyncJobWorker.removeBrand(activeBrandDto);
        break;
      case ProductSyncJobType.UPDATE_INVENTORY:
        await this.productSyncJobWorker.updateAllInventory();
        break;
      default:
        throw new ProductSyncJobError(
          'Cannot run job with unknown type: ' + jobType
        );
    }
  }
}
