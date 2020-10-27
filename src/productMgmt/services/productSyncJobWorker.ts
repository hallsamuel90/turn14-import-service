import { ApiUserService } from '../../apiUsers/services/apiUserService';
import { ProductMgmtService } from './productMgmtService';
import { ActiveBrandDTO } from '../dtos/activeBrandDto';
import { PmgmtDTO } from '../dtos/pmgmtDto';
import { ApiUser } from '../../apiUsers/models/apiUser';
import { ProductSyncJobError } from '../errors/productSyncJobError';
import { Service } from 'typedi';

type ProductMgmtServiceCallback = (apiUser: ApiUser) => Promise<void>;

/**
 * Runs jobs.
 */
@Service()
export class ProductSyncJobWorker {
  private apiUserService: ApiUserService;
  private productMgmtService: ProductMgmtService;

  constructor(
    apiUserService: ApiUserService,
    productMgmtService: ProductMgmtService
  ) {
    this.apiUserService = apiUserService;
    this.productMgmtService = productMgmtService;
  }

  /**
   * Imports a brand's products into the store.
   *
   * @param {ActiveBrandDTO} activeBrandDto the brand object to import.
   * @throws {ProductSyncJobError} if cannot run job.
   */
  public async importBrand(activeBrandDto: ActiveBrandDTO): Promise<void> {
    const apiUser = await this.getApiUser(activeBrandDto.userId);

    await this.processBrandImport(apiUser, activeBrandDto);
  }

  /**
   * Removes a brand's products from the store.
   *
   * @param {ActiveBrandDTO} activeBrandDto the brand object to remove.
   * @throws {ProductSyncJobError} if cannot run job.
   */
  public async removeBrand(activeBrandDto: ActiveBrandDTO): Promise<void> {
    const apiUser = await this.getApiUser(activeBrandDto.userId);

    await this.processBrandRemoval(apiUser, activeBrandDto);
  }

  /**
   * Updates the inventory for each apiUser's active brands.
   */
  public async updateAllInventory(): Promise<void> {
    const apiUsers = await this.apiUserService.retrieveAll();

    for (const apiUser of apiUsers) {
      await this.processInventoryUpdate(apiUser);
    }
  }

  /**
   * Updates the pricing for each apiUser's active brands.
   */
  public async updateAllPricing(): Promise<void> {
    const apiUsers = await this.apiUserService.retrieveAll();

    for (const apiUser of apiUsers) {
      await this.processPricingUpdate(apiUser);
    }
  }

  /**
   * Imports newly added products for each apiUser's active brands.
   */
  public async importAllNewProducts(): Promise<void> {
    const apiUsers = await this.apiUserService.retrieveAll();

    for (const apiUser of apiUsers) {
      await this.processImportNewProducts(apiUser);
    }
  }

  /**
   * Removes discontinued or products that are no longer carried for each
   * apiUser's active brands.
   */
  public async removeAllStaleProducts(): Promise<void> {
    const apiUsers = await this.apiUserService.retrieveAll();

    for (const apiUser of apiUsers) {
      await this.processRemoveStaleProducts(apiUser);
    }
  }

  private async getApiUser(userId: string): Promise<ApiUser> {
    try {
      return await this.apiUserService.retrieve(userId);
    } catch (e) {
      throw new ProductSyncJobError(
        `Could not retrieve user with id: ${userId}`
      );
    }
  }

  private async processBrandImport(
    apiUser: ApiUser,
    activeBrandDto: ActiveBrandDTO
  ): Promise<void> {
    const brandIds = apiUser?.brandIds;

    if (this.brandIsActiveAndNotYetImported(activeBrandDto, brandIds)) {
      await this.apiUserService.addBrand(apiUser, activeBrandDto.brandId);

      const pmgmtDto = new PmgmtDTO(
        apiUser.siteUrl,
        apiUser.turn14Keys,
        apiUser.wcKeys,
        activeBrandDto.brandId
      );

      await this.productMgmtService.importBrandProducts(pmgmtDto);
    } else {
      console.warn(
        `Brand Id ${activeBrandDto.brandId} has already been imported. Skipping import...`
      );
    }
  }

  private async processBrandRemoval(
    apiUser: ApiUser,
    activeBrandDto: ActiveBrandDTO
  ): Promise<void> {
    const brandIds = apiUser?.brandIds;

    if (!this.brandIsNotActiveAndAlreadyImported(activeBrandDto, brandIds)) {
      await this.apiUserService.removeBrand(apiUser, activeBrandDto.brandId);

      const pmgmtDto = new PmgmtDTO(
        apiUser.siteUrl,
        apiUser.turn14Keys,
        apiUser.wcKeys,
        activeBrandDto.brandId
      );

      await this.productMgmtService.deleteBrandProducts(pmgmtDto);
    } else {
      console.warn(
        `Brand Id ${activeBrandDto.brandId} is not currently active. Skipping removal...`
      );
    }
  }

  private brandIsActiveAndNotYetImported(
    activeBrandDto: ActiveBrandDTO,
    brandIds: string[]
  ): boolean {
    if (activeBrandDto && brandIds) {
      return (
        activeBrandDto.active && !brandIds.includes(activeBrandDto.brandId)
      );
    }

    return false;
  }

  private brandIsNotActiveAndAlreadyImported(
    activeBrandDto: ActiveBrandDTO,
    brandIds: string[]
  ): boolean {
    if (activeBrandDto && brandIds) {
      return (
        activeBrandDto.active && !brandIds.includes(activeBrandDto.brandId)
      );
    }

    return false;
  }

  private userHasActiveBrands(apiUser: ApiUser): boolean {
    const brandIds = apiUser?.brandIds;

    if (brandIds) {
      return brandIds.length > 0;
    }

    return false;
  }

  private async processInventoryUpdate(apiUser: ApiUser): Promise<void> {
    if (this.userHasActiveBrands(apiUser)) {
      await this.productMgmtService.updateUserActiveInventory(apiUser);
    }
  }

  private async processPricingUpdate(apiUser: ApiUser): Promise<void> {
    if (this.userHasActiveBrands(apiUser)) {
      await this.productMgmtService.updateUserActivePricing(apiUser);
    }
  }

  private async processImportNewProducts(apiUser: ApiUser): Promise<void> {
    if (this.userHasActiveBrands(apiUser)) {
      await this.productMgmtService.importNewProducts(apiUser);
    }
  }

  private async processRemoveStaleProducts(apiUser: ApiUser): Promise<void> {
    if (this.userHasActiveBrands(apiUser)) {
      await this.productMgmtService.removeStaleProducts(apiUser);
    }
  }
}
