import { ProductSyncQueueRepositoryMongo } from '../../productMgmt/jobQueue/repositories';

const resyncJobs = [
  { userId: '5eebffafdfe151001867698a', brandId: '286', jobType: 6 },
  { userId: '5eebffafdfe151001867698a', brandId: '200', jobType: 6 },
  { userId: '5eebffafdfe151001867698a', brandId: '289', jobType: 6 },
  { userId: '5eebffafdfe151001867698a', brandId: '290', jobType: 6 },
  { userId: '5eebffafdfe151001867698a', brandId: '189', jobType: 6 },
  { userId: '5eebffafdfe151001867698a', brandId: '40', jobType: 6 },
  { userId: '5eebffafdfe151001867698a', brandId: '115', jobType: 6 },
  { userId: '5eebffafdfe151001867698a', brandId: '37', jobType: 6 },
  { userId: '5eebffafdfe151001867698a', brandId: '36', jobType: 6 },
  { userId: '5eebffafdfe151001867698a', brandId: '95', jobType: 6 },
  { userId: '5eebffafdfe151001867698a', brandId: '302', jobType: 6 },
  { userId: '5eebffafdfe151001867698a', brandId: '309', jobType: 6 },
  { userId: '5eebffafdfe151001867698a', brandId: '220', jobType: 6 },
  { userId: '5eebffafdfe151001867698a', brandId: '2', jobType: 6 },
  { userId: '5eebffafdfe151001867698a', brandId: '75', jobType: 6 },
  { userId: '5eebffafdfe151001867698a', brandId: '135', jobType: 6 },
  { userId: '5eebffafdfe151001867698a', brandId: '246', jobType: 6 },
  { userId: '5eebffafdfe151001867698a', brandId: '264', jobType: 6 },
  { userId: '5eebffafdfe151001867698a', brandId: '193', jobType: 6 },
  { userId: '5eebffafdfe151001867698a', brandId: '126', jobType: 6 },
  { userId: '5eebffafdfe151001867698a', brandId: '9', jobType: 6 },
  { userId: '5eebffafdfe151001867698a', brandId: '332', jobType: 6 },
  { userId: '5eebffafdfe151001867698a', brandId: '182', jobType: 6 },
  { userId: '5eebffafdfe151001867698a', brandId: '121', jobType: 6 },
  { userId: '5eebffafdfe151001867698a', brandId: '214', jobType: 6 },
  { userId: '5eebffafdfe151001867698a', brandId: '249', jobType: 6 },
  { userId: '5eebffafdfe151001867698a', brandId: '150', jobType: 6 },
  { userId: '5eebffafdfe151001867698a', brandId: '295', jobType: 6 },
  { userId: '5eebffafdfe151001867698a', brandId: '168', jobType: 6 },
  { userId: '5eebffafdfe151001867698a', brandId: '261', jobType: 6 },
  { userId: '5eebffafdfe151001867698a', brandId: '243', jobType: 6 },
  { userId: '5eebffafdfe151001867698a', brandId: '147', jobType: 6 },
  { userId: '5eebffafdfe151001867698a', brandId: '283', jobType: 6 },
  { userId: '5eebffafdfe151001867698a', brandId: '44', jobType: 6 },
  { userId: '5eebffafdfe151001867698a', brandId: '318', jobType: 6 },
  { userId: '5eebffafdfe151001867698a', brandId: '90', jobType: 6 },
  { userId: '5eebffafdfe151001867698a', brandId: '242', jobType: 6 },
  { userId: '5eebffafdfe151001867698a', brandId: '279', jobType: 6 },
  { userId: '5eebffafdfe151001867698a', brandId: '111', jobType: 6 },
  { userId: '5eebffafdfe151001867698a', brandId: '314', jobType: 6 },
  { userId: '5eebffafdfe151001867698a', brandId: '310', jobType: 6 },
  { userId: '5eebffafdfe151001867698a', brandId: '42', jobType: 6 },
  { userId: '5eebffafdfe151001867698a', brandId: '53', jobType: 6 },
  { userId: '5eebffafdfe151001867698a', brandId: '77', jobType: 6 },
  { userId: '5eebffafdfe151001867698a', brandId: '244', jobType: 6 },
  { userId: '5eebffafdfe151001867698a', brandId: '45', jobType: 6 },
  { userId: '5eebffafdfe151001867698a', brandId: '237', jobType: 6 },
  { userId: '5eebffafdfe151001867698a', brandId: '1', jobType: 6 },
  { userId: '5f4c47b7dfe1510018676a80', brandId: '293', jobType: 6 },
];

export const clearExtraJobs = async (): Promise<void> => {
  const queueRepo = new ProductSyncQueueRepositoryMongo();
  try {
    const queue = await queueRepo.fetchQueue();

    queue.jobQueue = resyncJobs;

    console.info('preserving existing resync jobs');
    await queueRepo.save(queue);
  } catch (e) {
    console.info(`failed to clear extra jobs from the queue with ${e}`);

    throw e;
  }
};
