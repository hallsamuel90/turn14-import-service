import { ProductSyncJobProcessor } from './productSyncJobProcessor';
import { Service } from 'typedi';

@Service()
export class ProductSyncJobPoller {
  private static POLL_INTERVAL_SEC = 10;

  private readonly productSyncJobProcessor: ProductSyncJobProcessor;

  constructor(productSyncJobProcessor: ProductSyncJobProcessor) {
    this.productSyncJobProcessor = productSyncJobProcessor;
  }

  public async pollJobQueue(): Promise<void> {
    console.info(
      `⏲️  Polling the job queue every ${ProductSyncJobPoller.POLL_INTERVAL_SEC} seconds.`
    );

    setInterval(() => {
      this.productSyncJobProcessor.processJob();
    }, ProductSyncJobPoller.POLL_INTERVAL_SEC * 1000);
  }
}
