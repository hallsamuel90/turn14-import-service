import { Service } from 'typedi';
import { ActiveBrandDTO } from '../dtos/activeBrandDto';
import { ProductSyncJobFactory } from '../jobQueue/services/productSyncJobFactory';
import { ProductSyncQueueService } from '../jobQueue/services/productSyncQueueService';

/**
 * BrandActivationSequence.
 *
 * @author Sam Hall <hallsamuel90@gmail.com>
 */
@Service()
export class BrandActivationSequence {
  private readonly productSyncQueueService: ProductSyncQueueService;
  private readonly productSyncJobFactory: ProductSyncJobFactory;

  /**
   * @param productSyncQueueService
   * @param productSyncJobFactory
   */
  constructor(
    productSyncQueueService: ProductSyncQueueService,
    productSyncJobFactory: ProductSyncJobFactory
  ) {
    this.productSyncQueueService = productSyncQueueService;
    this.productSyncJobFactory = productSyncJobFactory;
  }

  /**
   * Handler for the product management operations.
   *
   * @param {ActiveBrandDTO} activeBrandDto the data transfer object that
   * contains the brand's active state.
   */
  async handler(activeBrandDto: ActiveBrandDTO): Promise<void> {
    const job = this.productSyncJobFactory.createFromBrandDto(activeBrandDto);
    this.productSyncQueueService.enqueue(job);
  }
}
