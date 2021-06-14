import { ProductSyncJobType } from './productSyncJobType';

export interface JobDto {
  userId: string;
  brandId: string;
  jobType: ProductSyncJobType;
  active?: boolean;
}
