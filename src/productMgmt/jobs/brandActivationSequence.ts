import { Service } from 'typedi';
import { ActiveBrandDTO } from '../dtos/activeBrandDto';
import { ProductSyncQueueService } from '../services/productSyncQueueService';
import { ProductSyncJob } from '../models/productSyncJob';
import { ProductSyncJobType } from '../models/proudctSyncJobType';

/**
 * BrandActivationSequence.
 *
 * @author Sam Hall <hallsamuel90@gmail.com>
 */
@Service()
export class BrandActivationSequence {
  private readonly productSyncQueueService: ProductSyncQueueService;

  /**
   *
   * @param productSyncQueueService
   */
  constructor(productSyncQueueService: ProductSyncQueueService) {
    this.productSyncQueueService = productSyncQueueService;
  }

  /**
   * Handler for the product management operations.
   *
   * @param {ActiveBrandDTO} activeBrandDto the data transfer object that contains the brand's active state.
   */
  async handler(activeBrandDto: ActiveBrandDTO): Promise<void> {
    const jobType = this.determineJobType(activeBrandDto);

    const activateBrandJob = new ProductSyncJob(jobType, activeBrandDto);
    this.productSyncQueueService.enqueue(activateBrandJob);
  }

  private determineJobType(activeBrandDto: ActiveBrandDTO): ProductSyncJobType {
    if (activeBrandDto.active) {
      return ProductSyncJobType.IMPORT_BRAND;
    }

    return ProductSyncJobType.REMOVE_BRAND;
  }
}
