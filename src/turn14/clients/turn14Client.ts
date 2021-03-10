import _, { Dictionary } from 'lodash';
import { Service } from 'typedi';
import { Keys } from '../../apiUsers/models/apiUser';
import { Turn14RestApi } from './turn14RestApi';
import { Turn14RestApiProvider } from './turn14RestApiProvider';
import { Turn14ProductDTO } from '../dtos/turn14ProductDto';
import { Turn14Brand } from '../interfaces/turn14Brand';

/**
 * Turn14Client for retrieving data from Turn14.
 */
@Service()
export class Turn14Client {
  private readonly turn14RestApiProvider: Turn14RestApiProvider;

  constructor(turn14RestApiProvider: Turn14RestApiProvider) {
    this.turn14RestApiProvider = turn14RestApiProvider;
  }

  /**
   * Fetch the brands from the turn14 api.
   *
   * @param {Keys} turn14Keys the api keys needed to access Turn14.
   * @returns {Turn14Brand[]} a list of turn14 brands.
   */
  public async getBrands(turn14Keys: Keys): Promise<Turn14Brand[]> {
    const turn14RestApi: Turn14RestApi = await this.turn14RestApiProvider.getTurn14RestApi(
      turn14Keys.client,
      turn14Keys.secret
    );

    return ((await turn14RestApi.fetchBrands()) as unknown) as Turn14Brand[];
  }

  /**
   * Gets all Turn14 Products for a given brand.
   *
   * @param {Keys} turn14Keys the api keys needed to access Turn14.
   * @param {string} brandId the id of the brand to retrieve products.
   * @returns {Promise<Turn14ProductDTO[]>} a list of Turn14 products.
   */
  public async getProductsByBrand(
    turn14Keys: Keys,
    brandId: string
  ): Promise<Turn14ProductDTO[]> {
    const turn14RestApi: Turn14RestApi = await this.turn14RestApiProvider.getTurn14RestApi(
      turn14Keys.client,
      turn14Keys.secret
    );

    return await this.getAllBrandProductData(turn14RestApi, Number(brandId));
  }

  private async getAllBrandProductData(
    turn14RestApi: Turn14RestApi,
    brandId: number
  ): Promise<Turn14ProductDTO[]> {
    const items = await turn14RestApi.fetchAllBrandItems(brandId);
    const itemsSorted = this.sortDataById(items);

    const itemData = await turn14RestApi.fetchAllBrandItemsData(brandId);
    const itemDataById = this.mapDataById(itemData);

    const itemPricing = await turn14RestApi.fetchAllBrandPricing(brandId);
    const itemPricingById = this.mapDataById(itemPricing);

    const itemInventory = await turn14RestApi.fetchAllBrandInventory(brandId);
    const itemInventoryById = this.mapDataById(itemInventory);

    const turn14ProductDtos: Turn14ProductDTO[] = [];
    for (const item of itemsSorted) {
      const itemId = item['id'];
      const turn14ProductDto = new Turn14ProductDTO(
        item,
        itemDataById[itemId],
        itemPricingById[itemId],
        itemInventoryById[itemId]
      );

      turn14ProductDtos.push(turn14ProductDto);
    }

    return turn14ProductDtos;
  }

  private sortDataById(turn14ProductData: JSON[]): JSON[] {
    return _.sortBy(turn14ProductData, 'id');
  }

  private mapDataById(jsonData: JSON[]): Dictionary<JSON> {
    return _.keyBy(jsonData, 'id');
  }
}
