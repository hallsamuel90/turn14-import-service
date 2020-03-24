const axios = require('axios');

const BASE_URL = 'https://apitest.turn14.com/v1';

/**
 * Turn14 Rest Api Client
 */
class Turn14RestApi {
  /**
   * Constructs a new Turn14RestApi client
   *
   * @param {string} turn14Client
   * @param {string} turn14Secret
   */
  constructor(turn14Client, turn14Secret) {
    this.turn14Client = turn14Client;
    this.turn14Secret = turn14Secret;
    this.axiosClient = axios.create({
      baseURL: BASE_URL,
    });
  }

  /**
   * Authenticates the Turn14API and attaches the auth token to
   * all subsequent requests
   */
  async authenticate() {
    const TOKEN_RESOURCE = '/token';
    try {
      const response = await this.axiosClient.post(TOKEN_RESOURCE, {
        'grant_type': 'client_credentials',
        'client_id': this.turn14Client,
        'client_secret': this.turn14Secret,
      });
      if (response.status = 200) {
        const token = response.data.access_token;
        this.axiosClient.defaults.headers.common =
          {'Authorization': `Bearer ${token}`};
      }
    } catch (e) {
      console.error('🔥 error: ' + e);
    }
  }

  /**
   * Fetches brand items
   *
   * @param {int} brandId
   * @param {int} pageNumber
   */
  async fetchBrandItems(brandId, pageNumber) {
    const BRAND_ITEMS_RESOURCE = `items/brand/${brandId}`;
    try {
      const response = await this.axiosClient.get(BRAND_ITEMS_RESOURCE, {
        params: {
          page: pageNumber,
        },
      });
      return response.data;
    } catch (e) {
      console.error('🔥 ' + e);
    }
  }

  /**
   *
   * @param {string} brandId
   */
  async fetchBrandItemData(brandId) {

  }

  /**
   *
   * @param {string} brandId
   */
  async fetchBrandPricing(brandId) {

  }

  /**
   *
   * @param {string} brandId
   */
  async fetchBrandInventory(brandId) {

  }
}

module.exports = Turn14RestApi;
