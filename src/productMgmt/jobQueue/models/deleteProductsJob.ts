import { ProductSyncJob } from './productSyncJob';
import { ProductSyncJobType } from '../productSyncJobType';
import { ApiUserService } from '../../../apiUsers/services/apiUserService';
import { ActiveBrandDTO } from '../../dtos/activeBrandDto';
import { PmgmtDTO } from '../../dtos/pmgmtDto';
import { ProductMgmtService } from '../../services/productMgmtService';
import { ApiUser } from '../../../apiUsers/models/apiUser';

/**
 * DeleteProductsJob removes a user's products for a particular brand from the
 * WooCommerce store.
 */
export class DeleteProductsJob extends ProductSyncJob {
  private readonly apiUserService: ApiUserService;
  private readonly productMgmtService: ProductMgmtService;
  private readonly activeBrandDto: ActiveBrandDTO;

  constructor(
    apiUserService: ApiUserService,
    productMgmtService: ProductMgmtService,
    activeBrandDto: ActiveBrandDTO
  ) {
    super(ProductSyncJobType.REMOVE_BRAND);
    this.apiUserService = apiUserService;
    this.productMgmtService = productMgmtService;
    this.activeBrandDto = activeBrandDto;
  }

  public async run(): Promise<void> {
    const apiUser = await this.apiUserService.retrieve(
      this.activeBrandDto.getUserId()
    );
    const brandIds = apiUser.brandIds;

    await this.deleteProductsIfInStore(brandIds, apiUser);
  }

  private async deleteProductsIfInStore(
    brandIds: string[],
    apiUser: ApiUser
  ): Promise<void> {
    if (this.brandIsNotActiveInStore(this.activeBrandDto, brandIds)) {
      console.warn(
        `Brand Id ${this.activeBrandDto.getBrandId()} is not currently active. Skipping removal...`
      );

      return;
    }

    const pmgmtDto = new PmgmtDTO(
      apiUser.siteUrl,
      apiUser.turn14Keys,
      apiUser.wcKeys,
      this.activeBrandDto.getBrandId()
    );
    await this.productMgmtService.deleteBrandProducts(pmgmtDto);

    await this.apiUserService.removeBrand(
      apiUser,
      this.activeBrandDto.getBrandId()
    );
  }

  private brandIsNotActiveInStore(
    activeBrandDto: ActiveBrandDTO,
    brandIds: string[]
  ): boolean {
    return (
      !activeBrandDto.isActive() &&
      !brandIds.includes(activeBrandDto.getBrandId())
    );
  }
}
