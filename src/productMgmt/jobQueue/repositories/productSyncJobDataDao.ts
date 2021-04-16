import mongoose, { Document } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

import { ProductSyncJobData, Turn14DataType } from '../services/etl';
import { JobId } from '../models/productSyncJob';

interface ProductSyncJobDataDocument extends ProductSyncJobData, Document {}

const ProductSyncJobDataModel = new mongoose.Schema({
  jobId: String,
  turn14Id: String,
  type: String,
  data: Object,
});
ProductSyncJobDataModel.plugin(mongoosePaginate);

const ProductSyncJobDataClient = mongoose.model<ProductSyncJobDataDocument>(
  'ProductSyncJobData',
  ProductSyncJobDataModel
);

export default class ProductSyncJobDataDao {
  public async saveAll(
    productSyncJobData: ProductSyncJobData[]
  ): Promise<void> {
    try {
      await ProductSyncJobDataClient.collection.insertMany(productSyncJobData);
    } catch (e) {
      console.error('failed to save product sync job data');
    }
  }

  public async findAllByJobId(
    jobId: JobId,
    pageNumber = 1,
    type?: Turn14DataType
  ): Promise<ProductSyncJobData[]> {
    const result = await ProductSyncJobDataClient.paginate(
      { jobId },
      { page: pageNumber, lean: true }
    );

    return result.docs;
  }

  public async findAllByTurn14Id(
    turn14Id: string
  ): Promise<ProductSyncJobData[]> {
    const results = await ProductSyncJobDataClient.find({ turn14Id })
      .lean()
      .exec();

    return results;
  }

  public async deleteAllByJobId(jobId: JobId): Promise<void> {
    await ProductSyncJobDataClient.deleteMany({ jobId });
  }
}
