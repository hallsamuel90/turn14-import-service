import {
  ProductSyncQueueRepository,
  ProductSyncQueueRepositoryMongo,
} from '../repositories';
import Container, { Service } from 'typedi';
import { ProductSyncJob } from '../models/productSyncJob';
import { JobDto } from '../types';
import { ProductSyncJobType } from '../productSyncJobType';

@Service()
export class ProductSyncQueueService {
  private productSyncQueueRepository: ProductSyncQueueRepository;

  constructor(
    productSyncQueueRepository: ProductSyncQueueRepository = Container.get(
      ProductSyncQueueRepositoryMongo
    )
  ) {
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

  public async enqueue(...jobDtos: JobDto[]): Promise<void> {
    console.log(`adding job to the queue`);
    const jobQueue = await this.productSyncQueueRepository.fetchQueue();

    jobQueue.enqueue(...jobDtos);

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

  public async isBackedUp(jobType: ProductSyncJobType): Promise<boolean> {
    const jobQueue = await this.productSyncQueueRepository.fetchQueue();

    const filtered = jobQueue.jobQueue.filter((job) => job.jobType === jobType);

    return filtered.length > 0;
  }
}
