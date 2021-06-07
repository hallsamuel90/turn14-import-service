import { ProductSyncQueueRepository } from '../repositories/productSyncQueueRepository';
import { Service } from 'typedi';
import { ProductSyncJob } from '../models/productSyncJob';

@Service()
export class ProductSyncQueueService {
  private productSyncQueueRepository: ProductSyncQueueRepository;

  constructor(productSyncQueueRepository: ProductSyncQueueRepository) {
    this.productSyncQueueRepository = productSyncQueueRepository;
  }

  public async lockQueue(): Promise<void> {
    const jobQueue = await this.productSyncQueueRepository.fetchQueue();

    jobQueue.lock();

    await this.productSyncQueueRepository.save(jobQueue);
  }

  public async unlockQueue(): Promise<void> {
    const jobQueue = await this.productSyncQueueRepository.fetchQueue();

    jobQueue.unLock();

    await this.productSyncQueueRepository.save(jobQueue);
  }

  public async enqueue(productSyncJob: ProductSyncJob): Promise<void> {
    const jobQueue = await this.productSyncQueueRepository.fetchQueue();

    jobQueue.enqueue(productSyncJob);

    await this.productSyncQueueRepository.save(jobQueue);
  }

  public async dequeue(): Promise<ProductSyncJob> {
    const jobQueue = await this.productSyncQueueRepository.fetchQueue();
    const job = jobQueue.dequeue();

    await this.productSyncQueueRepository.save(jobQueue);

    return job;
  }

  public async isLocked(): Promise<boolean> {
    const jobQueue = await this.productSyncQueueRepository.fetchQueue();

    return jobQueue.isLocked();
  }

  public async isEmpty(): Promise<boolean> {
    const jobQueue = await this.productSyncQueueRepository.fetchQueue();

    return jobQueue.isEmpty();
  }
}
