import Container from 'typedi';
import { ProductSyncJobFactory } from '../services/productSyncJobFactory';
import { JobDto } from '../types';
import { ProductSyncJob } from './productSyncJob';

/**
 * Data structure to queue product sync jobs.
 */
export class ProductSyncQueue {
  lockStatus: boolean;
  jobQueue: JobDto[];

  constructor(lockStatus = false, jobQueue: JobDto[] = []) {
    this.lockStatus = lockStatus;
    this.jobQueue = jobQueue;
  }

  public lock(): void {
    this.lockStatus = true;
  }

  public unLock(): void {
    this.lockStatus = false;
  }

  public isLocked(): boolean {
    return this.lockStatus;
  }

  public enqueue(...jobDtos: JobDto[]): void {
    this.jobQueue.push(...jobDtos);
  }

  public dequeue(): ProductSyncJob {
    const job = this.jobQueue.shift();

    if (!job) {
      throw new Error('No jobs exist in the queue.');
    }

    return Container.get(ProductSyncJobFactory).create(job);
  }

  public isEmpty(): boolean {
    return this.jobQueue.length == 0;
  }
}
