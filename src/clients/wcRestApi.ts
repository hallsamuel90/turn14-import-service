import axios, { AxiosInstance } from 'axios';
import https from 'https';
import _, { Dictionary } from 'lodash';
import WcBatchDTO from '../woocommerce/wcBatchDTO';
import WcCategoryDTO from '../woocommerce/wcCategoryDto';

const BATCH_PRODUCTS_RESOURCE = 'wp-json/wc/v3/products/batch';
const PRODUCT_CATEOGORIES_RESOURCE = 'wp-json/wc/v3/products/categories';
/**
 * WooCommerce Rest Api Client
 */
export default class WcRestApi {
  axiosClient: AxiosInstance;

  /**
   *
   * @param {string} wcUrl
   * @param {string} wcClient
   * @param {string} wcSecret
   */
  constructor(wcUrl: string, wcClient: string, wcSecret: string) {
    this.axiosClient = axios.create({
      baseURL: wcUrl,
      auth: {
        username: wcClient,
        password: wcSecret,
      },
      // TODO: remove
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    });
  }

  /**
   * Batch creates, updates, and deletes woocomerce products, limited to 100 at a time
   *
   * @param {WcBatchDTO} wcProducts
   * @return {Promise<JSON>} response
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
   * Fetches categories from woocommerce
   *
   * @return {Promise<Dictionary<JSON>>} response
   */
  async fetchCategories(): Promise<Dictionary<JSON>> {
    try {
      const response = await this.axiosClient.get(PRODUCT_CATEOGORIES_RESOURCE);
      return _.keyBy(response.data, 'name');
    } catch (e) {
      console.error('🔥 ' + e);
    }
  }

  /**
   * Creates a new woocommerce category
   *
   * @param {WcCategoryDTO} wcCategoryDto
   * @return {Promise<JSON>} response
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
