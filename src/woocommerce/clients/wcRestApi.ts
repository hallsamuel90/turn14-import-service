import axios, { AxiosInstance } from 'axios';
import https from 'https';
import _, { Dictionary } from 'lodash';
import { WcBatchDTO } from '../dtos/wcBatchDto';
import { WcCategoryDTO } from '../dtos/wcCategoryDto';

const BATCH_PRODUCTS_RESOURCE = 'wp-json/wc/v3/products/batch';
const PRODUCT_CATEOGORIES_RESOURCE = 'wp-json/wc/v3/products/categories';
/**
 * WooCommerceRestApi.
 *
 * Client for communicating with the WooCommerce api.
 *
 * @author Sam Hall <hallsamuel90@gmail.com>
 */
export class WcRestApi {
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
      // TODO: remove in production. skips ssl for local dev -SH
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
   * @returns {Promise<JSON>} response from woocommerce api.
   */
  async createProducts(wcProducts: WcBatchDTO): Promise<JSON> {
    try {
      const response = await this.axiosClient.post(
        BATCH_PRODUCTS_RESOURCE,
        wcProducts
      );
      return response.data;
    } catch (e) {
      console.error('🔥 ' + e);
    }
  }

  /**
   * Fetches all products of a particular brand.
   *
   * @param brandId the unique id of the brand.
   * @returns TODO some data object.
   */
  async fetchProductsByBrand(brandId: string) {
    throw new Error('Method not implemented.');
  }

  /**
   * Fetches all categories from woocommerce and returns them as
   * a map of name:category
   *
   * @returns {Promise<Dictionary<JSON>>} response
   */
  async fetchAllCategories(): Promise<Dictionary<JSON>> {
    let allData = [];
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
   * @param {number} pageNumber
   * @returns {Promise<JSON[]>} response
   */
  async fetchCategories(pageNumber: number): Promise<JSON[]> {
    try {
      const response = await this.axiosClient.get(
        PRODUCT_CATEOGORIES_RESOURCE,
        {
          params: {
            page: pageNumber,
          },
        }
      );
      return response.data;
    } catch (e) {
      console.error('🔥 ' + e);
    }
  }

  /**
   * Creates a new woocommerce category
   *
   * @param {WcCategoryDTO} wcCategoryDto
   * @returns {Promise<JSON>} response
   */
  async createCategory(wcCategoryDto: WcCategoryDTO): Promise<JSON> {
    try {
      const response = await this.axiosClient.post(
        PRODUCT_CATEOGORIES_RESOURCE,
        wcCategoryDto
      );
      return response.data;
    } catch (e) {
      console.error('🔥 ' + e);
    }
  }
}
