import { Dictionary } from 'lodash';
import WcRestApi from '../clients/wcRestApi';
import WcCategoryDTO from './wcCategoryDto';
import WcCategoryIdDTO from './wcCategoryIdDtos';

/**
 *
 */
export default class WcCategoriesCache {
  cache: Dictionary<JSON>;
  wcRestApi: WcRestApi;
  /**
   *
   */
  constructor() {
    this.cache;
    this.wcRestApi;
  }

  /**
   * Initializes the cache
   *
   * @param {WcRestApi} wcRestApi
   */
  async initCache(wcRestApi: WcRestApi): Promise<void> {
    this.wcRestApi = wcRestApi;
    this.cache = await this.wcRestApi.fetchCategories();
  }

  /**
   * Fetches the categoryId from the cache, if it does not exist a new one is created
   *
   * @param {string} categoryName
   * @return {WcCategoryIdDTO} categoryId object
   */
  async getCategory(categoryName: string): Promise<WcCategoryIdDTO> {
    const category = this.cache[categoryName];
    if (category) {
      return new WcCategoryIdDTO(category['id']);
    }
    const newCategory = await this.wcRestApi.createCategory(
      new WcCategoryDTO(categoryName)
    );
    this.cache[newCategory['name']] = newCategory;
    return new WcCategoryIdDTO(newCategory['id']);
  }

  /**
   * Fetches the sub category from the cache, if it does not exist a new one is created
   *
   * @param {string} subCategoryName
   * @param {string} parentCategoryName
   * @return {Promise<WcCategoryIdDTO>} categoryId
   */
  async getSubCategory(
    subCategoryName: string,
    parentCategoryName: string
  ): Promise<WcCategoryIdDTO> {
    const subCategory = this.cache[subCategoryName];
    if (subCategory) {
      return new WcCategoryIdDTO(subCategory['id']);
    }

    const parentCategoryId = await this.getCategory(parentCategoryName);
    const newSubCategory = await this.wcRestApi.createCategory(
      new WcCategoryDTO(subCategoryName, parentCategoryId.id)
    );
    this.cache[newSubCategory['name']] = newSubCategory;
    return new WcCategoryIdDTO(newSubCategory['id']);
  }
}
