import Container from 'typedi';
import { Keys } from '../../../apiUsers/models/apiUser';
import { JobId } from '../models/productSyncJob';
import { ProductSyncJobType } from '../productSyncJobType';
import ImportProductsEtl from './importProductsEtl';
import ResyncProductsEtl from './resyncProductsEtl';
import UpdateInventoryEtl from './updateInventoryEtl';
import UpdatePricingEtl from './updatePricingEtl';

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
  switch (type) {
    case ProductSyncJobType.IMPORT_BRAND:
      return Container.get(ImportProductsEtl);
    case ProductSyncJobType.RESYNC_PRODUCTS:
      return Container.get(ResyncProductsEtl);
    case ProductSyncJobType.UPDATE_INVENTORY:
      return Container.get(UpdateInventoryEtl);
    case ProductSyncJobType.UPDATE_PRICING:
      return Container.get(UpdatePricingEtl);
    default:
      throw Error(`${type} is not a valid job type`);
  }
};

export type GetEtlService = typeof getEtlService;
