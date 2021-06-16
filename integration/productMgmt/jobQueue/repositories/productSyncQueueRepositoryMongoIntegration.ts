import { expect } from 'chai';
import mongooseSetup, { disconnect } from '../../../../src/config/mongoose';
import { ProductSyncQueue } from '../../../../src/productMgmt/jobQueue/models/productSyncQueue';
import { ProductSyncJobType } from '../../../../src/productMgmt/jobQueue/productSyncJobType';
import { ProductSyncQueueRepositoryMongo } from '../../../../src/productMgmt/jobQueue/repositories/productSyncQueueRepositoryMongo';
import { JobDto } from '../../../../src/productMgmt/jobQueue/types';
import { createQueueIfDoesNotExist } from '../../../../src/config/initQueue';

describe.skip('ProductSyncQueueRepositoryMongo should', () => {
  before(async () => {
    await mongooseSetup();

    await createQueueIfDoesNotExist();
  });

  it('be able fetch the queue', async () => {
    const productSyncQueueRepository = new ProductSyncQueueRepositoryMongo();

    const result = await productSyncQueueRepository.fetchQueue();

    expect(result.isLocked()).to.eq(false);
  });

  it('be able to save the queue', async () => {
    const productSyncQueueRepository = new ProductSyncQueueRepositoryMongo();

    const queue = new ProductSyncQueue();
    queue.enqueue({ jobType: ProductSyncJobType.RESYNC_PRODUCTS } as JobDto);

    await productSyncQueueRepository.save(queue);

    const result = await productSyncQueueRepository.fetchQueue();

    expect(result.isLocked()).to.eq(false);
    expect(result.dequeue().jobType).to.eq(ProductSyncJobType.RESYNC_PRODUCTS);
  });

  after(async () => {
    await disconnect();
  });
});
