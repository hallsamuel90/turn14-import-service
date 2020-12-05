/* eslint-disable @typescript-eslint/camelcase */
import axios, { AxiosError, AxiosInstance } from 'axios';
import https from 'https';
import _, { Dictionary } from 'lodash';
import { WcBatchDTO } from '../dtos/wcBatchDto';
import { WcCategoryDTO } from '../dtos/wcCategoryDto';
import { WcError } from '../errors/wcError';

/**
 * WooCommerceRestApi.
 *
 * Client for communicating with the WooCommerce api.
 *
 * @author Sam Hall <hallsamuel90@gmail.com>
 */
export class WcRestApi {
  private static PRODUCTS_RESOURCE = 'wp-json/wc/v3/products';
  private static BATCH_PRODUCTS_RESOURCE = 'wp-json/wc/v3/products/batch';
  private static PRODUCT_CATEOGORIES_RESOURCE =
    'wp-json/wc/v3/products/categories';
  private static BRANDS_RESOURCE = 'wp-json/wc/v3/brands';

  private axiosClient: AxiosInstance;

  /**
   * Creates a new instance of WcRestApi with the provided parameters.
   *
   * @param {string} wcUrl the target url of the woocommerce store.
   * @param {string} wcClient the client key for communicating with the api.
   * @param {string} wcSecret the secret key for communicating with the api.
   */
  constructor(wcUrl: string, wcClient: string, wcSecret: string) {
    this.axiosClient = axios.create({
      baseURL: wcUrl,
      auth: {
        username: wcClient,
        password: wcSecret,
      },
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    });
  }

  /**
   * Batch creates, updates, and deletes woocomerce products,
   * limited to 100 at a time.
   *
   * @param {WcBatchDTO} wcProducts the products to be sent to the store.
   * @returns {Promise<JSON>} the response from woocommerce.
   */
  public async batchModifyProducts(wcProducts: WcBatchDTO): Promise<void> {
    try {
      await this.axiosClient.post(
        WcRestApi.BATCH_PRODUCTS_RESOURCE,
        wcProducts
      );
    } catch (e) {
      console.error('🔥 ' + e);
    }
  }

  /**
   * Fetches all products of a given brand from woocommerce.
   *
   * @returns {Promise<Dictionary<JSON>>} the response from woocommerce.
   * @param {string} brandId the id of the brand.
   */
  public async fetchAllProductsByBrand(brandId: string): Promise<JSON[]> {
    let allData: JSON[] = [];

    let pageNumber = 1;
    while (true) {
      const pageData = await this.fetchProductsByBrand(brandId, pageNumber);

      if (!Array.isArray(pageData) || !pageData.length) {
        break;
      }

      allData = allData.concat(pageData);
      pageNumber++;
    }

    return allData;
  }

  /**
   * Fetches all products of a particular brand.
   *
   * @param {string} brandId the unique id of the brand.
   * @param {number} pageNumber the page number for pagination.
   * @returns {Promise<JSON[]>} the response from woocommerce.
   */
  public async fetchProductsByBrand(
    brandId: string,
    pageNumber: number
  ): Promise<JSON[]> {
    try {
      const response = await this.axiosClient.get(WcRestApi.PRODUCTS_RESOURCE, {
        params: {
          brand_id: brandId,
          page: pageNumber,
        },
      });

      return response.data;
    } catch (e) {
      throw this.buildWcError(e);
    }
  }

  /**
   * Fetches all categories from woocommerce and returns them as
   * a map of name:category
   *
   * @returns {Promise<Dictionary<JSON>>} the response from woocommerce.
   */
  public async fetchAllCategories(): Promise<Dictionary<JSON>> {
    let allData: JSON[] = [];
    let i = 1;
    while (true) {
      const pageData = await this.fetchCategories(i);
      if (!Array.isArray(pageData) || !pageData.length) {
        break;
      }
      allData = allData.concat(pageData);
      i++;
    }

    return _.keyBy(allData, 'name');
  }

  /**
   * Fetches categories from woocommerce
   *
   * @param {number} pageNumber the page number to query.
   * @returns {Promise<JSON[]>} the response from woocommerce.
   */
  public async fetchCategories(pageNumber: number): Promise<JSON[]> {
    try {
      const response = await this.axiosClient.get(
        WcRestApi.PRODUCT_CATEOGORIES_RESOURCE,
        {
          params: {
            page: pageNumber,
          },
        }
      );

      return response.data;
    } catch (e) {
      throw this.buildWcError(e);
    }
  }

  /**
   * Creates a new woocommerce category
   *
   * @param {WcCategoryDTO} wcCategoryDto the data transfer creation object.
   * @returns {Promise<JSON>} the response from woocommerce or an empy response
   * if there is an error.
   */
  public async createCategory(wcCategoryDto: WcCategoryDTO): Promise<JSON> {
    try {
      const response = await this.axiosClient.post(
        WcRestApi.PRODUCT_CATEOGORIES_RESOURCE,
        wcCategoryDto
      );
      return response.data;
    } catch (e) {
      throw this.buildWcError(e);
    }
  }

  /**
   * Fetches all brands from woocommerce and returns them as
   * a map of name:brand
   *
   * @returns {Promise<Dictionary<JSON>>} the response from woocommerce.
   */
  public async fetchAllBrands(): Promise<Dictionary<JSON>> {
    // currently brands is not paginated, so pass page 1 only.
    const pageData = await this.fetchBrands(1);

    return _.keyBy(pageData, 'name');
  }

  /**
   * Fetches all brands. Requires the QuadLayers Perfect WooCommerce Brands
   * Plugin: https://github.com/quadlayers/perfect-woocommerce-brands
   *
   * @param {number} pageNumber the page of paginated brands.
   * @returns {JSON[]} of existing brands.
   */
  public async fetchBrands(pageNumber: number): Promise<JSON[]> {
    try {
      const response = await this.axiosClient.get(WcRestApi.BRANDS_RESOURCE, {
        params: {
          page: pageNumber,
        },
      });
      return response.data;
    } catch (e) {
      throw this.buildWcError(e);
    }
  }

  /**
   * Creates a new Brand using the provided brandName. Requires the QuadLayers
   * Perfect WooCommerce Brands Plugin:
   * https://github.com/quadlayers/perfect-woocommerce-brands
   *
   * @param {string} brandName the name of the brand to create.
   * @returns {Promise<JSON>} the response containing the created brands data.
   */
  public async createBrand(brandName: string): Promise<JSON> {
    try {
      const response = await this.axiosClient.post(WcRestApi.BRANDS_RESOURCE, {
        name: brandName,
        slug: brandName,
      });
      return response.data;
    } catch (e) {
      throw this.buildWcError(e);
    }
  }

  private buildWcError(e: AxiosError): WcError {
    const errorJsonString = JSON.stringify(e.toJSON());

    return new WcError(
      `Something went wrong communicating with WooCommerce. ${errorJsonString}`
    );
  }
}
