import { ProductSyncJob } from './productSyncJob';
import { ProductSyncJobType } from '../productSyncJobType';
import { ApiUserService } from '../../../apiUsers/services/apiUserService';
import { PmgmtDTO } from '../../dtos/pmgmtDto';
import { ProductMgmtService } from '../../services/productMgmtService';
import { ApiUser } from '../../../apiUsers/models/apiUser';
import { JobDto } from '../types';

/**
 * DeleteProductsJob removes a user's products for a particular brand from the
 * WooCommerce store.
 */
export class DeleteProductsJob extends ProductSyncJob {
  private readonly apiUserService: ApiUserService;
  private readonly productMgmtService: ProductMgmtService;
  private readonly jobDto: JobDto;

  constructor(
    apiUserService: ApiUserService,
    productMgmtService: ProductMgmtService,
    jobDto: JobDto
  ) {
    super(ProductSyncJobType.REMOVE_BRAND);
    this.apiUserService = apiUserService;
    this.productMgmtService = productMgmtService;
    this.jobDto = jobDto;
  }

  public async run(): Promise<void> {
    const apiUser = await this.apiUserService.retrieve(this.jobDto.userId);
    const brandIds = apiUser.brandIds;

    await this.deleteProductsIfInStore(brandIds, apiUser);
  }

  private async deleteProductsIfInStore(
    brandIds: string[],
    apiUser: ApiUser
  ): Promise<void> {
    if (this.brandIsNotActiveInStore(this.jobDto, brandIds)) {
      console.warn(
        `Brand Id ${this.jobDto.brandId} is not currently active. Skipping removal...`
      );

      return;
    }

    const pmgmtDto = new PmgmtDTO(
      apiUser.siteUrl,
      apiUser.turn14Keys,
      apiUser.wcKeys,
      this.jobDto.brandId
    );
    await this.productMgmtService.deleteBrandProducts(pmgmtDto);

    await this.apiUserService.removeBrand(apiUser, this.jobDto.brandId);
  }

  private brandIsNotActiveInStore(jobDto: JobDto, brandIds: string[]): boolean {
    return !jobDto.active && !brandIds.includes(jobDto.brandId);
  }
}
