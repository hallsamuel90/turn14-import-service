import _ from 'lodash';
import { Inject, Service } from 'typedi';
import { Keys } from '../../apiUsers/models/apiUser';
import { Turn14RestApi } from '../../turn14/clients/turn14RestApi';
import { Turn14RestApiProvider } from '../../turn14/clients/turn14RestApiProvider';
import { Turn14ProductDTO } from '../../turn14/dtos/turn14ProductDto';
import { WcRestApi } from '../../woocommerce/clients/wcRestApi';
import { WcRestApiProvider } from '../../woocommerce/clients/wcRestApiProvider';
import { WcBatchDTO } from '../../woocommerce/dtos/wcBatchDto';
import { WcCategoriesCache } from '../caches/wcCategoriesCache';
import { PmgmtDTO } from '../dtos/pmgmtDto';
import { WcMapper } from './wcMapper';
import { WcMapperProvider } from './wcMapperProvider';

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
  private readonly wcMapperProvider: WcMapperProvider;

  /**
   * Imports a Turn14 brand's products into the WC Store.
   *
   * @param {PmgmtDTO} pmgmtDto the product management data transer object.
   */
  async import(pmgmtDto: PmgmtDTO): Promise<void> {
    const turn14Products = await this.getTurn14ProductsByBrand(
      pmgmtDto.turn14Keys,
      pmgmtDto.brandId
    );

    console.info(
      `🔨 Import Products Job starting! Only ${turn14Products.length} products to go!`
    );

    const wcRestApi: WcRestApi = this.wcRestApiProvider.getWcRestApi(
      pmgmtDto.siteUrl,
      pmgmtDto.wcKeys.client,
      pmgmtDto.wcKeys.secret
    );

    const wcCategoriesCache = new WcCategoriesCache(wcRestApi);
    const wcMapper: WcMapper = this.wcMapperProvider.getWcMapper(
      wcCategoriesCache
    );

    const wcProducts = new WcBatchDTO();
    for (const turn14Product of turn14Products) {
      const wcProduct = await wcMapper.turn14ToCreateWc(turn14Product);
      wcProducts.create.push(wcProduct);

      if (wcProducts.totalSize() == this.BATCH_SIZE) {
        await wcRestApi.createProducts(wcProducts);
        wcProducts.create.length = 0;
      }
    }

    if (wcProducts.totalSize() > 0) {
      await wcRestApi.createProducts(wcProducts);
    }

    console.info('👍 Import complete!');
  }

  /**
   * Deletes a brand's products from the WooCommerce store.
   *
   * @param {PmgmtDTO} pmgmtDto the product management object containing keys.
   */
  async delete(pmgmtDto: PmgmtDTO): Promise<void> {
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

      if (wcProducts.totalSize() == this.BATCH_SIZE) {
        await wcRestApi.deleteProducts(wcProducts);
        wcProducts.delete.length = 0;
      }
    }
    console.info('👍 Deletion complete!');
  }

  /**
   * Fetches turn14 products from the api using the supplied brandId.
   *
   * @param {Keys} turn14Keys the keys for access to the turn14 api.
   * @param {string} brandId the id for the products to be retrieved.
   * @returns {Turn14ProductDTO[]} a list of turn14 products.
   */
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
}
