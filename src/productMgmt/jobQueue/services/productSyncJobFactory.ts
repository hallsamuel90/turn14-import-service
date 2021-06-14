import { Service } from 'typedi';
import { ApiUserService } from '../../../apiUsers/services/apiUserService';
import { ProductMgmtService } from '../../services/productMgmtService';
import { ProductSyncJobError } from '../errors/productSyncJobError';
import { DeleteProductsJob } from '../models/deleteProductsJob';
import { ImportAddedProductsJob } from '../models/importAddedProductsJob';
import { ImportProductsJob } from '../models/importProductsJob';
import { ProductsResyncJob } from '../models/productsResyncJob';
import { ProductSyncJob } from '../models/productSyncJob';
import { RemoveStaleProductsJob } from '../models/removeStaleProductsJob';
import { UpdateInventoryJob } from '../models/updateInventoryJob';
import { UpdatePricingJob } from '../models/updatePricingJob';
import { ProductSyncJobType } from '../productSyncJobType';
import { JobDto } from '../types';
import { getEtlService } from './etl';

@Service()
export class ProductSyncJobFactory {
  private readonly apiUserService: ApiUserService;
  private readonly pmgmtService: ProductMgmtService;

  constructor(
    apiUserService: ApiUserService,
    pmgmtService: ProductMgmtService
  ) {
    this.apiUserService = apiUserService;
    this.pmgmtService = pmgmtService;
  }

  public create(jobDto: JobDto): ProductSyncJob {
    switch (jobDto.jobType) {
      case ProductSyncJobType.UPDATE_INVENTORY:
        return new UpdateInventoryJob(jobDto, this.apiUserService);
      case ProductSyncJobType.UPDATE_PRICING:
        return new UpdatePricingJob(jobDto, this.apiUserService);
      case ProductSyncJobType.IMPORT_ADDED_PRODUCTS:
        return new ImportAddedProductsJob(
          this.apiUserService,
          this.pmgmtService
        );
      case ProductSyncJobType.REMOVE_STALE_PRODUCTS:
        return new RemoveStaleProductsJob(
          this.apiUserService,
          this.pmgmtService
        );
      case ProductSyncJobType.RESYNC_PRODUCTS:
        return new ProductsResyncJob(jobDto, this.apiUserService);
      case ProductSyncJobType.IMPORT_BRAND:
        return new ImportProductsJob(
          this.apiUserService,
          getEtlService(ProductSyncJobType.IMPORT_BRAND),
          jobDto
        );
      case ProductSyncJobType.REMOVE_BRAND:
        return new DeleteProductsJob(
          this.apiUserService,
          this.pmgmtService,
          jobDto
        );
      default:
        throw new ProductSyncJobError(
          `Cannot create job with unknown type: ${jobDto.jobType}`
        );
    }
  }
}
