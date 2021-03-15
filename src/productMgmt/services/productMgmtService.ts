import _ from 'lodash';
import { Service } from 'typedi';
import { ApiUser } from '../../apiUsers/models/apiUser';
import { WcUpdateInventoryDTO } from '../../woocommerce/dtos/wcUpdateInventoryDto';
import { WcUpdatePricingDTO } from '../../woocommerce/dtos/wcUpdatePricingDto';
import { PmgmtDTO } from '../dtos/pmgmtDto';
import { CreateProductWcMapper } from './createProductWcMapper';
import { PreProcessingFilter } from './preProcessingFilter';
import { Turn14Client } from '../../turn14/clients/turn14Client';
import { UpdateInventoryWcMapper } from './updateInventoryWcMapper';
import { UpdatePricingWcMapper } from './updatePricingWcMapper';
import { WcMapperFactory } from './wcMapperFactory';
import { WcMapperType } from './wcMapperType';
import { WcClient } from '../../woocommerce/clients/wcClient';

/**
 * ProductMgmtService.
 *
 * Performs product management functions such as creating, updating, and
 * deleting products from the woocommerce store.
 */
@Service()
export class ProductMgmtService {
  private readonly turn14Client: Turn14Client;
  private readonly wcClient: WcClient;
  private readonly wcMapperFactory: WcMapperFactory;
  private readonly preProcessingFilter: PreProcessingFilter;

  constructor(
    turn14Client: Turn14Client,
    wcClient: WcClient,
    wcMapperFactory: WcMapperFactory,
    preProcessingFilter: PreProcessingFilter
  ) {
    this.turn14Client = turn14Client;
    this.wcClient = wcClient;
    this.wcMapperFactory = wcMapperFactory;
    this.preProcessingFilter = preProcessingFilter;
  }

  /**
   * Imports a Turn14 brand's products into the WC Store.
   *
   * @param {PmgmtDTO} pmgmtDto the product management data transfer object.
   */
  public async importBrandProducts(pmgmtDto: PmgmtDTO): Promise<void> {
    console.info('🔨 Import products job starting!!');

    const wcMapper = this.wcMapperFactory.getWcMapper(
      WcMapperType.CREATE_PRODUCT,
      pmgmtDto.siteUrl,
      pmgmtDto.wcKeys
    ) as CreateProductWcMapper;

    const turn14Products = await this.turn14Client.getProductsByBrand(
      pmgmtDto.turn14Keys,
      pmgmtDto.brandId
    );

    const wcProducts = await wcMapper.turn14sToWcs(turn14Products);

    await this.wcClient.postBatchCreateWcProducts(
      pmgmtDto.siteUrl,
      pmgmtDto.wcKeys,
      wcProducts
    );

    console.info('👍 Import complete!');
  }

  /**
   * Updates a user's active brands' inventory.
   *
   * @param {ApiUser} apiUser the user to update the inventory for.
   */
  public async updateUserActiveInventory(apiUser: ApiUser): Promise<void> {
    console.info('🔨 Upate inventory job starting!');

    const activeBrands = apiUser.brandIds;
    for (const activeBrand of activeBrands) {
      await this.updateInventoryForBrand(apiUser, activeBrand);
    }

    console.info('👍 Inventory update complete!');
  }

  /**
   * Updates a user's active brands' pricing.
   *
   * @param {ApiUser} apiUser the user to update the inventory for.
   */
  public async updateUserActivePricing(apiUser: ApiUser): Promise<void> {
    console.info('🔨 Update pricing job starting!');

    const activeBrands = apiUser.brandIds;
    for (const activeBrand of activeBrands) {
      await this.updatePricingForBrand(apiUser, activeBrand);
    }

    console.info('👍 Pricing update complete!');
  }

  /**
   * Imports newly added products based on a user's active brands.
   *
   * @param {ApiUser} apiUser the user to add new products for.
   */
  public async importNewProducts(apiUser: ApiUser): Promise<void> {
    console.info('🔨 Import new products job starting!');

    const activeBrands = apiUser.brandIds;
    for (const activeBrand of activeBrands) {
      await this.importNewProductsForBrand(apiUser, activeBrand);
    }

    console.info('👍 New product update complete!');
  }

  /**
   * Deletes a brand's products from the WooCommerce store.
   *
   * @param {PmgmtDTO} pmgmtDto the product management object containing keys.
   */
  public async deleteBrandProducts(pmgmtDto: PmgmtDTO): Promise<void> {
    console.info('💥 Delete Products Job starting!');

    const brandProducts = await this.wcClient.getWcProductsByBrand(
      pmgmtDto.siteUrl,
      pmgmtDto.wcKeys,
      pmgmtDto.brandId
    );

    const productIds: number[] = this.extractProductIds(brandProducts);

    this.wcClient.postBatchDeleteWcProducts(
      pmgmtDto.siteUrl,
      pmgmtDto.wcKeys,
      productIds
    );

    console.info('👍 Deletion complete!');
  }

  public async removeStaleProducts(apiUser: ApiUser): Promise<void> {
    console.info('🔨 Stale product deletion job starting!');

    const activeBrands = apiUser.brandIds;
    for (const activeBrand of activeBrands) {
      await this.removeStaleProductsForBrand(apiUser, activeBrand);
    }

    console.info('👍 Stale product removal complete!');
  }

  public async resyncProducts(apiUser: ApiUser): Promise<void> {
    console.info(`🔨 Re-syncing products for ${apiUser.siteUrl}!`);

    for (const brandId of apiUser.brandIds) {
      const turn14Products = await this.turn14Client.getProductsByBrand(
        apiUser.turn14Keys,
        brandId
      );

      console.info(
        `Re-syncing brand: ${turn14Products[0].item?.['attributes']?.['brand']}`
      );

      const wcMapper = this.wcMapperFactory.getWcMapper(
        WcMapperType.CREATE_PRODUCT,
        apiUser.siteUrl,
        apiUser.wcKeys
      ) as CreateProductWcMapper;

      const wcCreateProductsDtos = await wcMapper.turn14sToWcs(turn14Products);

      console.info('successfully mapped products.');

      await this.wcClient.postBatchCreateWcProducts(
        apiUser.siteUrl,
        apiUser.wcKeys,
        wcCreateProductsDtos
      );
    }

    console.info('👍 Product Resync complete!');
  }

  private async updateInventoryForBrand(
    apiUser: ApiUser,
    brandId: string
  ): Promise<void> {
    const turn14Products = await this.turn14Client.getProductsByBrand(
      apiUser.turn14Keys,
      brandId
    );
    const fetchedWcProducts = await this.wcClient.getWcProductsByBrand(
      apiUser.siteUrl,
      apiUser.wcKeys,
      brandId
    );

    const wcMapper = this.wcMapperFactory.getWcMapper(
      WcMapperType.UPDATE_INVENTORY
    ) as UpdateInventoryWcMapper;

    const wcUpdateInventoryDtos: WcUpdateInventoryDTO[] = wcMapper.turn14sToWcs(
      turn14Products,
      fetchedWcProducts
    );

    this.wcClient.postBatchUpdateWcProducts(
      apiUser.siteUrl,
      apiUser.wcKeys,
      wcUpdateInventoryDtos
    );
  }

  private async updatePricingForBrand(
    apiUser: ApiUser,
    brandId: string
  ): Promise<void> {
    const turn14Products = await this.turn14Client.getProductsByBrand(
      apiUser.turn14Keys,
      brandId
    );
    const fetchedWcProducts = await this.wcClient.getWcProductsByBrand(
      apiUser.siteUrl,
      apiUser.wcKeys,
      brandId
    );

    const wcMapper = this.wcMapperFactory.getWcMapper(
      WcMapperType.UPDATE_PRICING
    ) as UpdatePricingWcMapper;

    const wcUpdatePricingDtos: WcUpdatePricingDTO[] = wcMapper.turn14sToWcs(
      turn14Products,
      fetchedWcProducts
    );

    this.wcClient.postBatchUpdateWcProducts(
      apiUser.siteUrl,
      apiUser.wcKeys,
      wcUpdatePricingDtos
    );
  }

  private async importNewProductsForBrand(
    apiUser: ApiUser,
    activeBrand: string
  ): Promise<void> {
    const turn14Products = await this.turn14Client.getProductsByBrand(
      apiUser.turn14Keys,
      activeBrand
    );

    const fetchedWcProducts = await this.wcClient.getWcProductsByBrand(
      apiUser.siteUrl,
      apiUser.wcKeys,
      activeBrand
    );

    const wcMapper = this.wcMapperFactory.getWcMapper(
      WcMapperType.CREATE_PRODUCT,
      apiUser.siteUrl,
      apiUser.wcKeys
    ) as CreateProductWcMapper;

    const wcCreateProductsDtos = await wcMapper.turn14sToWcs(turn14Products);

    const filteredWcCreateProductsDtos = this.preProcessingFilter.filterExistingProducts(
      wcCreateProductsDtos,
      fetchedWcProducts
    );

    await this.wcClient.postBatchCreateWcProducts(
      apiUser.siteUrl,
      apiUser.wcKeys,
      filteredWcCreateProductsDtos
    );
  }

  private async removeStaleProductsForBrand(
    apiUser: ApiUser,
    activeBrand: string
  ): Promise<void> {
    const turn14Products = await this.turn14Client.getProductsByBrand(
      apiUser.turn14Keys,
      activeBrand
    );

    const fetchedWcProducts = await this.wcClient.getWcProductsByBrand(
      apiUser.siteUrl,
      apiUser.wcKeys,
      activeBrand
    );

    const removedProducts = this.preProcessingFilter.filterCarriedProducts(
      turn14Products,
      fetchedWcProducts
    );

    this.wcClient.postBatchDeleteWcProducts(
      apiUser.siteUrl,
      apiUser.wcKeys,
      removedProducts
    );
  }

  private extractProductIds(fetchedWcProducts: JSON[]): number[] {
    return _.map(fetchedWcProducts, 'id');
  }
}
