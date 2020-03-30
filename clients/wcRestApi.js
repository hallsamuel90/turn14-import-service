const axios = require('axios');
const https = require('https');
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
   * Batch creates, updates, and deletes Woocomerce products, limited to 100 at a time
   *
   * @param {WcProductDTO[]} wcProducts
   * @return {Promise<JSON>} response
   */
  async createProducts(wcProducts) {
    const BATCH_PRODUCTS_RESOURCE = 'wp-json/wc/v3/products/batch';
    try {
      const response = await this.axiosClient.post(
        BATCH_PRODUCTS_RESOURCE,
        wcProducts
      );
      console.log(response);
      return response;
    } catch (e) {
      console.error('🔥 ' + e);
    }
  }
}

module.exports = WcRestApi;
