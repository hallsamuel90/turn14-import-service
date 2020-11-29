import { ProductSyncQueueRepository } from '../repositories/productSyncQueueRepository';
import { Service } from 'typedi';
import { ProductSyncJob } from '../models/productSyncJob';

/**
 * Service class for operations on ProductSyncQueue
 */
@Service()
export class ProductSyncQueueService {
  private productSyncQueueRepository: ProductSyncQueueRepository;

  constructor(productSyncQueueRepository: ProductSyncQueueRepository) {
    this.productSyncQueueRepository = productSyncQueueRepository;
  }

  public lockQueue(): void {
    const jobQueue = this.productSyncQueueRepository.fetchQueue();

    jobQueue.lock();

    this.productSyncQueueRepository.save(jobQueue);
  }

  public unlockQueue(): void {
    const jobQueue = this.productSyncQueueRepository.fetchQueue();

    jobQueue.unLock();

    this.productSyncQueueRepository.save(jobQueue);
  }

  public enqueue(productSyncJob: ProductSyncJob): void {
    const jobQueue = this.productSyncQueueRepository.fetchQueue();

    jobQueue.enqueue(productSyncJob);

    this.productSyncQueueRepository.save(jobQueue);
  }

  public dequeue(): ProductSyncJob {
    const jobQueue = this.productSyncQueueRepository.fetchQueue();
    const job = jobQueue.dequeue();

    this.productSyncQueueRepository.save(jobQueue);

    return job;
  }

  public isLocked(): boolean {
    const jobQueue = this.productSyncQueueRepository.fetchQueue();

    return jobQueue.isLocked();
  }

  public isEmpty(): boolean {
    const jobQueue = this.productSyncQueueRepository.fetchQueue();

    return jobQueue.isEmpty();
  }
}
