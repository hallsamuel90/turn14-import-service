import { ApiUser } from '../../../apiUsers/models/apiUser';
import { ApiUserService } from '../../../apiUsers/services/apiUserService';
import { ActiveBrandDTO } from '../../dtos/activeBrandDto';
import { PmgmtDTO } from '../../dtos/pmgmtDto';
import { ProductMgmtService } from '../../services/productMgmtService';
import { ProductSyncJobType } from '../productSyncJobType';
import { ProductSyncJob } from './productSyncJob';

/**
 * ImportProductJob imports products from Turn14 into the user's WooCommerce
 * store.
 */
export class ImportProductsJob extends ProductSyncJob {
  private readonly apiUserService: ApiUserService;
  private readonly productMgmtService: ProductMgmtService;
  private readonly activeBrandDto: ActiveBrandDTO;

  constructor(
    apiUserService: ApiUserService,
    productMgmtService: ProductMgmtService,
    activeBrandDto: ActiveBrandDTO
  ) {
    super(ProductSyncJobType.IMPORT_BRAND);
    this.apiUserService = apiUserService;
    this.productMgmtService = productMgmtService;
    this.activeBrandDto = activeBrandDto;
  }

  public async run(): Promise<void> {
    const apiUser = await this.apiUserService.retrieve(
      this.activeBrandDto.getUserId()
    );
    const brandIds = apiUser.brandIds;

    await this.importProductsIfNotInStore(brandIds, apiUser);
  }

  private async importProductsIfNotInStore(
    brandIds: string[],
    apiUser: ApiUser
  ): Promise<void> {
    if (this.brandIsActiveAndNotYetImported(this.activeBrandDto, brandIds)) {
      await this.etl(apiUser);
    } else {
      console.warn(
        `Brand Id ${this.activeBrandDto.getBrandId()} has already been imported. Skipping import...`
      );
    }
  }

  private async etl(apiUser: ApiUser): Promise<void> {
    // TODO: extract -> save products keyed by jobId to db as they come in

    // TODO: transform -> paged results from db to woocommerce products

    // TODO: load -> batch ship products when batch is full

    // TODO: cleanup -> add brandId to list of activeBrands, delete all data
    // associated with jobId

    const pmgmtDto = new PmgmtDTO(
      apiUser.siteUrl,
      apiUser.turn14Keys,
      apiUser.wcKeys,
      this.activeBrandDto.getBrandId()
    );
    await this.productMgmtService.importBrandProducts(pmgmtDto);

    await this.apiUserService.addBrand(
      apiUser,
      this.activeBrandDto.getBrandId()
    );
  }

  private brandIsActiveAndNotYetImported(
    activeBrandDto: ActiveBrandDTO,
    brandIds: string[]
  ): boolean {
    return (
      activeBrandDto.isActive() &&
      !brandIds.includes(activeBrandDto.getBrandId())
    );
  }
}
