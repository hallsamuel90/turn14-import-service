import _ from 'lodash';
import { Service } from 'typedi';
import { ApiUser } from '../../apiUsers/models/apiUser';
import { Turn14Client, Turn14Page } from '../../turn14/clients/turn14Client';
import { Turn14RestApi } from '../../turn14/clients/turn14RestApi';
import { WcClient } from '../../woocommerce/clients/wcClient';
import { PmgmtDTO } from '../dtos/pmgmtDto';
import { CreateProductWcMapper } from './createProductWcMapper';
import { PreProcessingFilter } from './preProcessingFilter';
import { WcMapperFactory } from './wcMapperFactory';
import { WcMapperType } from './wcMapperType';

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

    await this.importProducts(pmgmtDto, wcMapper);

    console.info('👍 Import complete!');
  }

  /**
   * Updates a user's active brands' inventory.
   *
   * @param {ApiUser} apiUser the user to update the inventory for.
   */
  public async updateUserActiveInventory(apiUser: ApiUser): Promise<void> {
    console.info('🔨 Update inventory job starting!');

    const activeBrands = apiUser.brandIds;
    for (const activeBrand of activeBrands) {
      const wcMapper = this.wcMapperFactory.getWcMapper(
        WcMapperType.CREATE_PRODUCT,
        apiUser.siteUrl,
        apiUser.wcKeys
      ) as CreateProductWcMapper;

      await this.importProductInventory(
        { ...apiUser, brandId: activeBrand },
        wcMapper
      );
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
      const wcMapper = this.wcMapperFactory.getWcMapper(
        WcMapperType.CREATE_PRODUCT,
        apiUser.siteUrl,
        apiUser.wcKeys
      ) as CreateProductWcMapper;

      await this.importProductPricing(
        { ...apiUser, brandId: activeBrand },
        wcMapper
      );
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
      const wcMapper = this.wcMapperFactory.getWcMapper(
        WcMapperType.CREATE_PRODUCT,
        apiUser.siteUrl,
        apiUser.wcKeys
      ) as CreateProductWcMapper;

      await this.importProducts({ ...apiUser, brandId: brandId }, wcMapper);
    }

    console.info('👍 Product Resync complete!');
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

  private async importProducts(
    pmgmtDto: PmgmtDTO,
    wcMapper: CreateProductWcMapper
  ): Promise<void> {
    await this.importBaseProducts(pmgmtDto, wcMapper);
    await this.importProductData(pmgmtDto, wcMapper);
    await this.importProductPricing(pmgmtDto, wcMapper);
    await this.importProductInventory(pmgmtDto, wcMapper);
  }

  private async importBaseProducts(
    pmgmtDto: PmgmtDTO,
    wcMapper: CreateProductWcMapper
  ): Promise<void> {
    await this.importTurn14(
      pmgmtDto,
      wcMapper,
      this.turn14Client.getBaseProducts
    );
  }

  private async importProductData(
    pmgmtDto: PmgmtDTO,
    wcMapper: CreateProductWcMapper
  ): Promise<void> {
    await this.importTurn14(
      pmgmtDto,
      wcMapper,
      this.turn14Client.getProductData
    );
  }

  private async importProductPricing(
    pmgmtDto: PmgmtDTO,
    wcMapper: CreateProductWcMapper
  ): Promise<void> {
    await this.importTurn14(
      pmgmtDto,
      wcMapper,
      this.turn14Client.getProductPricing
    );
  }

  private async importProductInventory(
    pmgmtDto: PmgmtDTO,
    wcMapper: CreateProductWcMapper
  ): Promise<void> {
    await this.importTurn14(
      pmgmtDto,
      wcMapper,
      this.turn14Client.getProductInventory
    );
  }

  private async importTurn14(
    pmgmtDto: PmgmtDTO,
    wcMapper: CreateProductWcMapper,
    getPagedData: (
      turn14RestApi: Turn14RestApi,
      brandId: string,
      page: number
    ) => Promise<Turn14Page>
  ): Promise<void> {
    const turn14Api = await this.turn14Client.getApi(pmgmtDto.turn14Keys);
    let i = 1;
    while (true) {
      const pageOfTurn14Items = await getPagedData(
        turn14Api,
        pmgmtDto.brandId,
        i
      );

      const wcProducts = await wcMapper.turn14sToWcs(
        pageOfTurn14Items.turn14Dtos
      );

      await this.wcClient.postBatchCreateWcProducts(
        pmgmtDto.siteUrl,
        pmgmtDto.wcKeys,
        wcProducts
      );

      if (pageOfTurn14Items.pagesLeft === 0) {
        break;
      }

      i = i + 1;
    }
  }
}
