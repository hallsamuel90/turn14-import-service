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
   * @param {JSON} jsonMsg the data transfer object that
   * contains the brand's active state.
   */
  async handler(jsonMsg: JSON): Promise<void> {
    const brandDto = this.convertJson(jsonMsg);
    const job = this.productSyncJobFactory.createFromBrandDto(brandDto);

    await this.productSyncQueueService.enqueue(job);
  }

  private convertJson(msg: JSON): ActiveBrandDTO {
    return new ActiveBrandDTO(
      msg?.['userId'],
      msg?.['brandId'],
      msg?.['active']
    );
  }
}
