import Container from 'typedi';
import { Keys } from '../../../apiUsers/models/apiUser';
import { JobId } from '../models/productSyncJob';
import { ProductSyncJobType } from '../productSyncJobType';
import ImportProductsEtl from './importProductsEtl';

export enum Turn14DataType {
  ITEM_BASE = 'Item',
  ITEM_DATA = 'ProductData',
  ITEM_PRICING = 'PricingItem',
  ITEM_INVENTORY = 'InventoryItem',
}

export interface ProductSyncJobData {
  jobId: JobId;
  turn14Id: string;
  type: Turn14DataType;
  data: JSON;
}

export interface EtlDto {
  jobId: JobId;
  siteUrl: string;
  brandId: string;
  turn14Keys: Keys;
  wcKeys: Keys;
}

export interface Etl {
  extract(etlDto: EtlDto): Promise<void>;
  transformLoad(etlDto: EtlDto, pageNumber?: number): Promise<void>;
  cleanUp(jobId: string): Promise<void>;
}

export const getEtlService = (type: ProductSyncJobType): Etl => {
  return Container.get(ImportProductsEtl);
};
