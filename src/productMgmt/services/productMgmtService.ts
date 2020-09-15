import _, { Dictionary } from 'lodash';
import { Inject, Service } from 'typedi';
import { Keys, ApiUser } from '../../apiUsers/models/apiUser';
import { Turn14RestApi } from '../../turn14/clients/turn14RestApi';
import { Turn14RestApiProvider } from '../../turn14/clients/turn14RestApiProvider';
import { Turn14ProductDTO } from '../../turn14/dtos/turn14ProductDto';
import { WcRestApi } from '../../woocommerce/clients/wcRestApi';
import { WcRestApiProvider } from '../../woocommerce/clients/wcRestApiProvider';
import { WcBatchDTO } from '../../woocommerce/dtos/wcBatchDto';
import { PmgmtDTO } from '../dtos/pmgmtDto';
import { CreateProductWcMapper } from './createProductWcMapper';
import { WcMapperFactory } from './wcMapperFactory';
import { WcMapperType } from './wcMapperType';
import { UpdateInventoryWcMapper } from './updateInventoryWcMapper';
import { WcUpdateInventoryDTO } from '../../woocommerce/dtos/wcUpdateInventoryDto';
import { UpdatePricingWcMapper } from './updatePricingWcMapper';
import { WcUpdatePricingDTO } from '../../woocommerce/dtos/wcUpdatePricingDto';

/**
 * ProductMgmtService.
 *
 * Performs product management functions such as creating, updating, and
 * deleting products from the woocommerce store.
 *
 * @author Sam Hall <hallsamuel90@gmail.com>
 */
@Service()
export class ProductMgmtService {
  BATCH_SIZE = 50;

  @Inject()
  private readonly turn14RestApiProvider: Turn14RestApiProvider;

  @Inject()
  private readonly wcRestApiProvider: WcRestApiProvider;

  @Inject()
  private readonly wcMapperFactory: WcMapperFactory;

  /**
   * Imports a Turn14 brand's products into the WC Store.
   *
   * @param {PmgmtDTO} pmgmtDto the product management data transer object.
   */
  public async importBrandProducts(pmgmtDto: PmgmtDTO): Promise<void> {
    const turn14Products = await this.getTurn14ProductsByBrand(
      pmgmtDto.turn14Keys,
      pmgmtDto.brandId
    );

    console.info(
      `🔨 Import products job starting! Only ${turn14Products.length} products to go!`
    );

    const wcRestApi: WcRestApi = this.wcRestApiProvider.getWcRestApi(
      pmgmtDto.siteUrl,
      pmgmtDto.wcKeys.client,
      pmgmtDto.wcKeys.secret
    );

    const wcMapper = this.wcMapperFactory.getWcMapper(
      WcMapperType.CREATE_PRODUCT,
      pmgmtDto.siteUrl,
      pmgmtDto.wcKeys
    ) as CreateProductWcMapper;

    const wcProducts = new WcBatchDTO();
    for (const turn14Product of turn14Products) {
      const wcProduct = await wcMapper.turn14ToWc(turn14Product);
      wcProducts.create.push(wcProduct);

      if (this.batchIsFull(wcProducts)) {
        await this.pushWcProducts(wcProducts, wcRestApi);

        wcProducts.reset();
      }
    }

    await this.pushRemainingProducts(wcProducts, wcRestApi);

    console.info('👍 Import complete!');
  }

  /**
   * Updates a user's active brands' inventory.
   *
   * @param {ApiUser} apiUser the user to update the inventory for.
   */
  public async updateUserActiveInventory(apiUser: ApiUser): Promise<void> {
    const activeBrands = apiUser.brandIds;

    if (activeBrands.length) {
      await this.updateInventories(apiUser, activeBrands);
    }
  }

  /**
   * Updates a user's active brands' pricing.
   *
   * @param {ApiUser} apiUser the user to update the inventory for.
   */
  public async updateUserActivePricing(apiUser: ApiUser): Promise<void> {
    const activeBrands = apiUser.brandIds;

    if (activeBrands.length) {
      await this.updatePricings(apiUser, activeBrands);
    }
  }

  /**
   * Deletes a brand's products from the WooCommerce store.
   *
   * @param {PmgmtDTO} pmgmtDto the product management object containing keys.
   */
  public async deleteBrandProducts(pmgmtDto: PmgmtDTO): Promise<void> {
    const wcRestApi = this.wcRestApiProvider.getWcRestApi(
      pmgmtDto.siteUrl,
      pmgmtDto.wcKeys.client,
      pmgmtDto.wcKeys.secret
    );

    const brandProducts = await wcRestApi.fetchAllProductsByBrand(
      pmgmtDto.brandId
    );

    console.info(
      `💥 Delete Products Job starting! Only ${brandProducts.length} products to go!`
    );

    const productIds = _.map(brandProducts, 'id');

    const wcProducts = new WcBatchDTO();
    for (const productId of productIds) {
      wcProducts.delete.push(productId);

      if (this.batchIsFull(wcProducts)) {
        await this.pushWcProducts(wcProducts, wcRestApi);

        wcProducts.reset();
      }
    }

    this.pushRemainingProducts(wcProducts, wcRestApi);

    console.info('👍 Deletion complete!');
  }

  private async getTurn14ProductsByBrand(
    turn14Keys: Keys,
    brandId: string
  ): Promise<Turn14ProductDTO[]> {
    const turn14RestApi: Turn14RestApi = this.turn14RestApiProvider.getTurn14RestApi(
      turn14Keys.client,
      turn14Keys.secret
    );

    await turn14RestApi.authenticate();

    const turn14Products = await turn14RestApi.fetchAllBrandData(
      Number(brandId)
    );

    return turn14Products;
  }

  private async pushRemainingProducts(
    wcProducts: WcBatchDTO,
    wcRestApi: WcRestApi
  ): Promise<void> {
    if (wcProducts.totalSize() > 0) {
      await this.pushWcProducts(wcProducts, wcRestApi);
    }
  }

  private async pushWcProducts(
    wcProducts: WcBatchDTO,
    wcRestApi: WcRestApi
  ): Promise<void> {
    try {
      await wcRestApi.batchModifyProducts(wcProducts);
    } catch (e) {
      console.error('🔥 ' + e);
    }
  }

  private async updateInventories(
    apiUser: ApiUser,
    activeBrands: string[]
  ): Promise<void> {
    for (const activeBrand of activeBrands) {
      await this.updateBrandInventory(apiUser, activeBrand);
    }
  }

  private async updateBrandInventory(
    apiUser: ApiUser,
    brandId: string
  ): Promise<void> {
    const turn14Products = await this.getTurn14ProductsByBrand(
      apiUser.turn14Keys,
      brandId
    );
    const turn14ProductsMap = this.mapProductsBySku(turn14Products);

    console.info(
      `🔨 Upate inventory job starting! Only ${turn14Products.length} products to go!`
    );

    const wcRestApi = this.wcRestApiProvider.getWcRestApi(
      apiUser.siteUrl,
      apiUser.wcKeys.client,
      apiUser.wcKeys.secret
    );
    const wcBrandProducts = await wcRestApi.fetchAllProductsByBrand(brandId);

    const wcMapper = this.wcMapperFactory.getWcMapper(
      WcMapperType.UPDATE_INVENTORY
    ) as UpdateInventoryWcMapper;

    const wcProducts = new WcBatchDTO();
    for (const wcProduct of wcBrandProducts) {
      const wcId = wcProduct?.['id'];
      const partNumber = wcProduct?.['sku'];
      const turn14Product = turn14ProductsMap[partNumber];

      const wcUpdateInventoryDto = wcMapper.turn14ToWc(turn14Product, wcId);

      if (this.stockHasChanged(wcUpdateInventoryDto, wcProduct)) {
        wcProducts.update.push(wcUpdateInventoryDto);
      }

      if (this.batchIsFull(wcProducts)) {
        await this.pushWcProducts(wcProducts, wcRestApi);

        wcProducts.reset();
      }
    }

    await this.pushRemainingProducts(wcProducts, wcRestApi);

    console.info('👍 Inventory update complete!');
  }

  private mapProductsBySku(
    turn14Products: Turn14ProductDTO[]
  ): Dictionary<Turn14ProductDTO> {
    return (_.keyBy(
      turn14Products,
      'item.attributes.mfr_part_number'
    ) as unknown) as Dictionary<Turn14ProductDTO>;
  }

  private batchIsFull(wcProductBatch: WcBatchDTO): boolean {
    return wcProductBatch.totalSize() == this.BATCH_SIZE;
  }

  private storeCarriesStock(wcProduct: JSON): boolean {
    return wcProduct?.['manage_stock'];
  }

  private stockHasChanged(
    wcUpdateInventoryDto: WcUpdateInventoryDTO,
    wcProduct: JSON
  ): boolean {
    return wcUpdateInventoryDto.stock_quantity != wcProduct?.['stock_quantity'];
  }

  private async updatePricings(
    apiUser: ApiUser,
    activeBrands: string[]
  ): Promise<void> {
    for (const activeBrand of activeBrands) {
      await this.updateBrandPricing(apiUser, activeBrand);
    }
  }

  private async updateBrandPricing(
    apiUser: ApiUser,
    brandId: string
  ): Promise<void> {
    const turn14Products = await this.getTurn14ProductsByBrand(
      apiUser.turn14Keys,
      brandId
    );
    const turn14ProductsMap = this.mapProductsBySku(turn14Products);

    console.info(
      `🔨 Upate pricing job starting! Only ${turn14Products.length} products to go!`
    );

    const wcRestApi = this.wcRestApiProvider.getWcRestApi(
      apiUser.siteUrl,
      apiUser.wcKeys.client,
      apiUser.wcKeys.secret
    );
    const wcBrandProducts = await wcRestApi.fetchAllProductsByBrand(brandId);

    const wcMapper = this.wcMapperFactory.getWcMapper(
      WcMapperType.UPDATE_PRICING
    ) as UpdatePricingWcMapper;

    const wcProducts = new WcBatchDTO();
    for (const wcProduct of wcBrandProducts) {
      const wcId = wcProduct?.['id'];
      const partNumber = wcProduct?.['sku'];
      const turn14Product = turn14ProductsMap[partNumber];

      const wcUpdatePricingDto = wcMapper.turn14ToWc(turn14Product, wcId);

      if (this.pricingHasChanged(wcUpdatePricingDto, wcProduct)) {
        wcProducts.update.push(wcUpdatePricingDto);
      }

      if (this.batchIsFull(wcProducts)) {
        await this.pushWcProducts(wcProducts, wcRestApi);

        wcProducts.reset();
      }
    }

    await this.pushRemainingProducts(wcProducts, wcRestApi);

    console.info('👍 Pricing update complete!');
  }

  private pricingHasChanged(
    wcUpdatePricingDto: WcUpdatePricingDTO,
    wcProduct: JSON
  ): boolean {
    const regularPriceChanged =
      wcUpdatePricingDto.regular_price != wcProduct?.['regular_price'];
    const salePriceChanged =
      wcUpdatePricingDto.sale_price != wcProduct?.['sale_price'];

    return regularPriceChanged || salePriceChanged;
  }
}
