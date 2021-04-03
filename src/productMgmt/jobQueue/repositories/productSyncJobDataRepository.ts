import mongoose, { Document } from 'mongoose';
import { ProductSyncJobData } from '../services/etl';
import { JobId } from '../models/productSyncJob';

interface ProductSyncJobDataDocument extends ProductSyncJobData, Document {}

const ProductSyncJobDataModel = new mongoose.Schema({
  jobId: String,
  turn14Id: String,
  item: Object,
  itemData: Object,
  itemPricing: Object,
  itemInventory: Object,
});

const ProductSyncJobDataDao = mongoose.model<ProductSyncJobDataDocument>(
  'ProductSyncJobData',
  ProductSyncJobDataModel
);

export default class ProductSyncJobDataRepository {
  public async saveAll(
    productSyncJobData: ProductSyncJobData[]
  ): Promise<void> {
    try {
      await ProductSyncJobDataDao.collection.insertMany(productSyncJobData);
    } catch (e) {
      console.error('failed to save product sync job data');
    }
  }

  async findAll(
    jobId: JobId,
    turn14Ids: string[]
  ): Promise<ProductSyncJobData[]> {
    return await ProductSyncJobDataDao.find(); // TODO query
  }

  public async batchUpdate(productData: ProductSyncJobData[]): Promise<void> {
    // get records with jobId and turn14Ids[]
    throw new Error('Method not implemented.');
  }
}
