import { Service } from 'typedi';
import { ProductSyncJobType } from '../jobQueue/productSyncJobType';
import { ProductSyncQueueService } from '../jobQueue/services/productSyncQueueService';
import { JobDto } from '../jobQueue/types';
import { BrandActivationMessage } from './brandActivationSubscriber';

/**
 * BrandActivationSequence.
 *
 * @author Sam Hall <hallsamuel90@gmail.com>
 */
@Service()
export class BrandActivationSequence {
  private readonly productSyncQueueService: ProductSyncQueueService;

  constructor(productSyncQueueService: ProductSyncQueueService) {
    this.productSyncQueueService = productSyncQueueService;
  }

  async handler(message: BrandActivationMessage): Promise<void> {
    await this.productSyncQueueService.enqueue(this.getJobDto(message));
  }

  private getJobDto(message: BrandActivationMessage): JobDto {
    if (message.active) {
      return {
        ...message,
        jobType: ProductSyncJobType.IMPORT_BRAND,
      };
    }

    return {
      ...message,
      jobType: ProductSyncJobType.REMOVE_BRAND,
    };
  }
}
