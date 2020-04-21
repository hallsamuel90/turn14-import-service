/* eslint-disable @typescript-eslint/camelcase */
import axios, { AxiosInstance } from 'axios';
import _, { Dictionary } from 'lodash';
import { Turn14Brand } from '../turn14/iTurn14Brand';
import Turn14ProductDTO from '../turn14/turn14ProductDto';

const BASE_URL = 'https://apitest.turn14.com/v1';
const INVALID_CREDENTIALS =
  '🔥 ERROR: Token expired or invalid, attempting to authenticate!';

/**
 * Turn14 Rest Api Client
 */
export default class Turn14RestApi {
  turn14Client: string;
  turn14Secret: string;
  axiosClient: AxiosInstance;

  /**
   * Constructs a new Turn14RestApi client
   *
   * @param {string} turn14Client
   * @param {string} turn14Secret
   */
  constructor(turn14Client: string, turn14Secret: string) {
    this.turn14Client = turn14Client;
    this.turn14Secret = turn14Secret;
    this.axiosClient = axios.create({
      baseURL: BASE_URL,
    });
  }

  /**
   * Authenticates the Turn14API and attaches the auth token to
   * all subsequent requests
   *
   * @return {Promise<void>}
   */
  async authenticate(): Promise<void> {
    const TOKEN_RESOURCE = '/token';
    try {
      const response = await this.axiosClient.post(TOKEN_RESOURCE, {
        grant_type: 'client_credentials',
        client_id: this.turn14Client,
        client_secret: this.turn14Secret,
      });
      if (response.status == 200) {
        console.info('🔑 Authenticated Turn14 API!');
        const token = response.data.access_token;
        this.axiosClient.defaults.headers.common = {
          Authorization: `Bearer ${token}`,
        };
      }
    } catch (e) {
      console.error('🔥 ' + e);
    }
  }

  /**
   * Fetches all brand data
   *
   * @param {number} brandId
   * @return {Promise<Turn14ProductDTO[]>} of all items, data, pricing,
   * and inventory
   */
  async fetchAllBrandData(brandId: number): Promise<Turn14ProductDTO[]> {
    const items = await this.fetchAllBrandItems(brandId);
    const itemData = await this.fetchAllBrandItemsData(brandId);
    const itemPricing = await this.fetchAllBrandPricing(brandId);
    const itemInventory = await this.fetchAllBrandInventory(brandId);
    const turn14ProductDtos = [];
    for (const item of items) {
      const itemId = item['id'];
      const turn14ProductDto = new Turn14ProductDTO(
        item,
        itemData[itemId],
        itemPricing[itemId],
        itemInventory[itemId]
      );
      turn14ProductDtos.push(turn14ProductDto);
    }
    return turn14ProductDtos;
  }

  /**
   * Fetches all brand items sorted
   *
   * @param {number} brandId
   * @return {Promise<JSON[]>} of brand items
   */
  async fetchAllBrandItems(brandId: number): Promise<JSON[]> {
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
   * @param {number} brandId
   * @param {number} pageNumber
   * @return {Promise<JSON>}
   */
  async fetchBrandItems(brandId: number, pageNumber: number): Promise<JSON> {
    const BRAND_ITEMS_RESOURCE = `items/brand/${brandId}`;
    try {
      const response = await this.axiosClient.get(BRAND_ITEMS_RESOURCE, {
        params: {
          page: pageNumber,
        },
      });
      return response.data.data;
    } catch (e) {
      if (e.response.status != undefined) {
        if (e.response.status == 401) {
          console.error(INVALID_CREDENTIALS);
          await this.authenticate();
          this.fetchBrandItems(brandId, pageNumber);
        }
      } else {
        console.error('🔥 ' + e);
      }
    }
  }

  /**
   * Fetches all brand items data as a map of
   * {'itemId', itemData}
   *
   * @param {number} brandId
   * @return {Promise<Dictionary<JSON>>} of brand items data
   */
  async fetchAllBrandItemsData(brandId: number): Promise<Dictionary<JSON>> {
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
   * @param {number} brandId
   * @param {number} pageNumber
   * @return {Promise<JSON>}
   */
  async fetchBrandItemsData(
    brandId: number,
    pageNumber: number
  ): Promise<JSON> {
    const BRAND_ITEMS_RESOURCE = `items/data/brand/${brandId}`;
    try {
      const response = await this.axiosClient.get(BRAND_ITEMS_RESOURCE, {
        params: {
          page: pageNumber,
        },
      });
      return response.data.data;
    } catch (e) {
      if (e.response.status != undefined) {
        if (e.response.status == 401) {
          console.error(INVALID_CREDENTIALS);
          await this.authenticate();
          this.fetchBrandItems(brandId, pageNumber);
        }
      } else {
        console.error('🔥 ' + e);
      }
    }
  }

  /**
   * Fetches all brand pricing as a map of
   * {'itemId', itemPricing}
   *
   * @param {number} brandId
   * @return {Promise<Dictionary<JSON>>} of brand pricing
   */
  async fetchAllBrandPricing(brandId: number): Promise<Dictionary<JSON>> {
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
   * @param {number} brandId
   * @param {number} pageNumber
   * @return {Promise<JSON>}
   */
  async fetchBrandPricing(brandId: number, pageNumber: number): Promise<JSON> {
    const BRAND_PRICING_RESOURCE = `pricing/brand/${brandId}`;
    try {
      const response = await this.axiosClient.get(BRAND_PRICING_RESOURCE, {
        params: {
          page: pageNumber,
        },
      });
      return response.data.data;
    } catch (e) {
      if (e.response.status != undefined) {
        if (e.response.status == 401) {
          console.error(INVALID_CREDENTIALS);
          await this.authenticate();
          this.fetchBrandItems(brandId, pageNumber);
        }
      } else {
        console.error('🔥 ' + e);
      }
    }
  }

  /**
   * Fetches all brand inventory as a map of
   * {'itemId', itemInventory}
   *
   * @param {number} brandId
   * @return {Promise<Dictionary<JSON>>} of brand inventory
   */
  async fetchAllBrandInventory(brandId: number): Promise<Dictionary<JSON>> {
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
   * @param {number} brandId
   * @param {number} pageNumber
   * @return {Promise<JSON>}
   */
  async fetchBrandInventory(
    brandId: number,
    pageNumber: number
  ): Promise<JSON> {
    const BRAND_INVENTORY_RESOURCE = `inventory/brand/${brandId}`;
    try {
      const response = await this.axiosClient.get(BRAND_INVENTORY_RESOURCE, {
        params: {
          page: pageNumber,
        },
      });
      return response.data.data;
    } catch (e) {
      if (e.response.status != undefined) {
        if (e.response.status == 401) {
          console.error(INVALID_CREDENTIALS);
          await this.authenticate();
          this.fetchBrandItems(brandId, pageNumber);
        }
      } else {
        console.error('🔥 ' + e);
      }
    }
  }

  /**
   * Fetches brands
   *
   * @return {Promise<Turn14Brand[]>}
   */
  async fetchBrands(): Promise<Turn14Brand[]> {
    const BRANDS_RESOURCE = `brands`;
    try {
      const response = await this.axiosClient.get(BRANDS_RESOURCE);
      return response.data.data;
    } catch (e) {
      if (e.response.status != undefined) {
        if (e.response.status == 401) {
          console.error(INVALID_CREDENTIALS);
          await this.authenticate();
          this.fetchBrands();
        }
      } else {
        console.error('🔥 ' + e);
      }
    }
  }
}
