const axios = require('axios');
const https = require('https');
const _ = require('lodash');

const BATCH_PRODUCTS_RESOURCE = 'wp-json/wc/v3/products/batch';
const PRODUCT_CATEOGORIES_RESOURCE = 'wp-json/wc/v3/products/categories';
/**
 * WooCommerce Rest Api Client
 */
class WcRestApi {
  /**
   *
   * @param {string} wcUrl
   * @param {string} wcClient
   * @param {string} wcSecret
   */
  constructor(wcUrl, wcClient, wcSecret) {
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
   * @param {WcProductDTO[]} wcProducts
   * @return {Promise<JSON>} response
   */
  async createProducts(wcProducts) {
    try {
      const response = await this.axiosClient.post(
        BATCH_PRODUCTS_RESOURCE,
        wcProducts
      );
      return response;
    } catch (e) {
      console.error('🔥 ' + e);
    }
  }

  /**
   * Fetches categories from woocommerce
   *
   * @return {Promise<JSON>} response
   */
  async fetchCategories() {
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
  async createCategory(wcCategoryDto) {
    try {
      const response = await this.axiosClient.post(
        PRODUCT_CATEOGORIES_RESOURCE,
        wcCategoryDto
      );
      return response;
    } catch (e) {
      console.error('🔥 ' + e);
    }
  }
}

module.exports = WcRestApi;
