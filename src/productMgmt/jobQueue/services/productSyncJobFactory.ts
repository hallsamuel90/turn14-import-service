import { Service } from 'typedi';
import { ApiUserService } from '../../../apiUsers/services/apiUserService';
import { ActiveBrandDTO } from '../../dtos/activeBrandDto';
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

  public createFromBrandDto(activeBrandDto: ActiveBrandDTO): ProductSyncJob {
    if (activeBrandDto.isActive()) {
      return new ImportProductsJob(
        this.apiUserService,
        getEtlService(ProductSyncJobType.IMPORT_BRAND),
        activeBrandDto
      );
    }

    return new DeleteProductsJob(
      this.apiUserService,
      this.pmgmtService,
      activeBrandDto
    );
  }

  public createFromJobType(jobType: ProductSyncJobType): ProductSyncJob {
    switch (jobType) {
      case ProductSyncJobType.UPDATE_INVENTORY:
        return new UpdateInventoryJob(
          this.apiUserService,
          getEtlService(jobType)
        );
      case ProductSyncJobType.UPDATE_PRICING:
        return new UpdatePricingJob(this.apiUserService, this.pmgmtService);
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
        return new ProductsResyncJob(
          this.apiUserService,
          getEtlService(jobType)
        );
      default:
        throw new ProductSyncJobError(
          `Cannot create job with unknown type: ${jobType}`
        );
    }
  }
}
