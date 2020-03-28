const Turn14ProductDTO = require('../dtos/turn14ProductDto');
const axios = require('axios');
const _ = require('lodash');

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
        console.info('🔑 Authenticated Turn14 API!');
        const token = response.data.access_token;
        this.axiosClient.defaults.headers.common =
          {'Authorization': `Bearer ${token}`};
      }
    } catch (e) {
      console.error('🔥 ' + e);
    }
  }

  /**
   * Fetches all brand data
   *
   * @param {int} brandId
   * @return {Promise<Turn14ProductDTO[]>} of all items, data, pricing,
   * and inventory
   */
  async fetchAllBrandData(brandId) {
    const items = await this.fetchAllBrandItems(brandId);
    const itemData = await this.fetchAllBrandItemsData(brandId);
    const itemPricing = await this.fetchAllBrandPricing(brandId);
    const itemInventory = await this.fetchAllBrandInventory(brandId);
    const turn14ProductDtos = [];
    for (const item of items) {
      const itemId = item.id;
      const turn14ProductDto = new Turn14ProductDTO(item, itemData[itemId],
          itemPricing[itemId], itemInventory[itemId]);
      turn14ProductDtos.push(turn14ProductDto);
    }
    return turn14ProductDtos;
  }

  /**
   * Fetches all brand items sorted
   *
   * @param {int} brandId
   * @return {Promise<JSON[]>} of brand items
   */
  async fetchAllBrandItems(brandId) {
    let allData = [];
    let i = 1;
    while (true) {
      const pageData = await this.fetchBrandItems(brandId, i);
      if (!Array.isArray(pageData) || !pageData.length) {
        break;
      }
      allData = allData.concat(pageData);
      i++;
    }
    return _.sortBy(allData, 'id');
  }

  /**
   * Fetches brand items
   *
   * @param {int} brandId
   * @param {int} pageNumber
   * @return {Promise<JSON>}
   */
  async fetchBrandItems(brandId, pageNumber) {
    const BRAND_ITEMS_RESOURCE = `items/brand/${brandId}`;
    try {
      const response = await this.axiosClient.get(BRAND_ITEMS_RESOURCE, {
        params: {
          page: pageNumber,
        },
      });
      return response.data.data;
    } catch (e) {
      if (e.response.status == 401) {
        console.error('🔥 ERROR: Token expired or invalid, ' +
          'attempting to authenticate!');
        await this.authenticate();
        this.fetchBrandItems(brandId, pageNumber);
      } else {
        console.error('🔥 ' + e);
      }
    }
  }

  /**
   * Fetches all brand items data as a map of
   * {'itemId', itemData}
   *
   * @param {int} brandId
   * @return {Promise<Map<string, JSON>>} of brand items data
   */
  async fetchAllBrandItemsData(brandId) {
    let allData = [];
    let i = 1;
    while (true) {
      const pageData = await this.fetchBrandItemsData(brandId, i);
      if (!Array.isArray(pageData) || !pageData.length) {
        break;
      }
      allData = allData.concat(pageData);
      i++;
    }
    return _.keyBy(allData, 'id');
  }

  /**
   * Fetches brand items data
   *
   * @param {int} brandId
   * @param {int} pageNumber
   * @return {Promise<JSON>}
   */
  async fetchBrandItemsData(brandId, pageNumber) {
    const BRAND_ITEMS_RESOURCE = `items/data/brand/${brandId}`;
    try {
      const response = await this.axiosClient.get(BRAND_ITEMS_RESOURCE, {
        params: {
          page: pageNumber,
        },
      });
      return response.data.data;
    } catch (e) {
      if (e.response.status == 401) {
        console.error('🔥 ERROR: Token expired or invalid, ' +
          'attempting to authenticate!');
        await this.authenticate();
        this.fetchBrandItemsData(brandId, pageNumber);
      } else {
        console.error('🔥 ' + e);
      }
    }
  }

  /**
   * Fetches all brand pricing as a map of
   * {'itemId', itemPricing}
   *
   * @param {int} brandId
   * @return {Promise<Map<string, JSON>>} of brand pricing
   */
  async fetchAllBrandPricing(brandId) {
    let allData = [];
    let i = 1;
    while (true) {
      const pageData = await this.fetchBrandPricing(brandId, i);
      if (!Array.isArray(pageData) || !pageData.length) {
        break;
      }
      allData = allData.concat(pageData);
      i++;
    }
    return _.keyBy(allData, 'id');
  }

  /**
   * Fetches brand pricing
   *
   * @param {int} brandId
   * @param {int} pageNumber
   * @return {Promise<JSON>}
   */
  async fetchBrandPricing(brandId, pageNumber) {
    const BRAND_PRICING_RESOURCE = `pricing/brand/${brandId}`;
    try {
      const response = await this.axiosClient.get(BRAND_PRICING_RESOURCE, {
        params: {
          page: pageNumber,
        },
      });
      return response.data.data;
    } catch (e) {
      if (e.response.status == 401) {
        console.error('🔥 ERROR: Token expired or invalid, ' +
            'attempting to authenticate!');
        await this.authenticate();
        this.fetchBrandPricing(brandId, pageNumber);
      } else {
        console.error('🔥 ' + e);
      }
    }
  }

  /**
   * Fetches all brand inventory as a map of
   * {'itemId', itemInventory}
   *
   * @param {int} brandId
   * @return {Promise<Map<string, JSON>>} of brand inventory
   */
  async fetchAllBrandInventory(brandId) {
    let allData = [];
    let i = 1;
    while (true) {
      const pageData = await this.fetchBrandInventory(brandId, i);
      if (!Array.isArray(pageData) || !pageData.length) {
        break;
      }
      allData = allData.concat(pageData);
      i++;
    }
    return _.keyBy(allData, 'id');
  }

  /**
   * Fetches brand inventory
   *
   * @param {int} brandId
   * @param {int} pageNumber
   * @return {Promise<JSON>}
   */
  async fetchBrandInventory(brandId, pageNumber) {
    const BRAND_INVENTORY_RESOURCE = `inventory/brand/${brandId}`;
    try {
      const response = await this.axiosClient.get(BRAND_INVENTORY_RESOURCE, {
        params: {
          page: pageNumber,
        },
      });
      return response.data.data;
    } catch (e) {
      if (e.response.status == 401) {
        console.error('🔥 ERROR: Token expired or invalid, ' +
          'attempting to authenticate!');
        await this.authenticate();
        this.fetchBrandInventory(brandId, pageNumber);
      } else {
        console.error('🔥 ' + e);
      }
    }
  }
}

module.exports = Turn14RestApi;
