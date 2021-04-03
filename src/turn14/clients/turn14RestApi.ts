import { AxiosResponse } from 'axios';
import { RateLimitedAxiosInstance } from 'axios-rate-limit';

/**
 * Turn14RestApi.
 *
 * Client for communication with the turn14 api.
 *
 * @author Sam Hall <hallsamuel90@gmail.com>
 */
export class Turn14RestApi {
  private readonly axiosClient: RateLimitedAxiosInstance;

  constructor(axiosClient: RateLimitedAxiosInstance) {
    this.axiosClient = axiosClient;
  }

  /**
   * Fetches all brands.
   *
   * @returns {Promise<JSON[]>} of brands.
   */
  public async fetchBrands(): Promise<JSON[]> {
    const BRANDS_RESOURCE = 'brands';

    return await this.getRequest(BRANDS_RESOURCE)?.['data'];
  }

  /**
   * Fetches all items for a given brand.
   *
   * @param {number} brandId the id of the brand to retrieve items for.
   * @returns {Promise<JSON[]>} of brand items.
   */
  public async fetchAllBrandItems(brandId: number): Promise<JSON[]> {
    const BRAND_ITEMS_RESOURCE = `items/brand/${brandId}`;

    return await this.getAllPagedData(BRAND_ITEMS_RESOURCE);
  }

  /**
   * Fetches all item data for a given brand.
   *
   * @param {number} brandId the id of the brand to retrieve item data for.
   * @returns {Promise<JSON[]>} of brand items data.
   */
  public async fetchAllBrandItemsData(brandId: number): Promise<JSON[]> {
    const BRAND_ITEMS_DATA_RESOURCE = `items/data/brand/${brandId}`;

    return await this.getAllPagedData(BRAND_ITEMS_DATA_RESOURCE);
  }

  /**
   * Fetches all pricing data for a given brand.
   *
   * @param {number} brandId the id of the brand to retrieve pricing for.
   * @returns {Promise<JSON[]>} of brand pricing.
   */
  public async fetchAllBrandPricing(brandId: number): Promise<JSON[]> {
    const BRAND_PRICING_RESOURCE = `pricing/brand/${brandId}`;

    return await this.getAllPagedData(BRAND_PRICING_RESOURCE);
  }

  /**
   * Fetches all inventory for a given brand.
   *
   * @param {number} brandId the id of the brand to retrieve inventory for.
   * @returns {Promise<JSON[]>} of brand inventory.
   */
  public async fetchAllBrandInventory(brandId: number): Promise<JSON[]> {
    const BRAND_INVENTORY_RESOURCE = `inventory/brand/${brandId}`;

    return await this.getAllPagedData(BRAND_INVENTORY_RESOURCE);
  }

  private async getAllPagedData(resource: string): Promise<JSON[]> {
    let allData: JSON[] = [];
    let i = 1;
    while (true) {
      const responseData = await this.getRequest(resource, i);

      allData = allData.concat(responseData['data']);

      if (this.isDonePaging(i, responseData['meta'])) {
        break;
      }

      i++;
    }

    return allData;
  }

  public async getRequest(resource: string): Promise<JSON>;

  public async getRequest(resource: string, pageNumber: number): Promise<JSON>;

  public async getRequest(
    resource: string,
    pageNumber?: number
  ): Promise<JSON> {
    try {
      const response = await this.get(pageNumber, resource);

      return response.data;
    } catch (e) {
      const errorJsonString = JSON.stringify(e.toJSON());

      console.error(
        `Something went wrong communicating with Turn14. ${errorJsonString}`
      );

      return {} as JSON;
    }
  }

  private async get(
    pageNumber: number | undefined,
    resource: string
  ): Promise<AxiosResponse<JSON>> {
    let response: AxiosResponse<JSON>;
    if (pageNumber) {
      response = await this.axiosClient.get(resource, {
        params: {
          page: pageNumber,
        },
      });
    } else {
      response = await this.axiosClient.get(resource);
    }

    return response;
  }

  private isDonePaging(i: number, meta: JSON): boolean {
    return i == meta['total_pages'];
  }
}
