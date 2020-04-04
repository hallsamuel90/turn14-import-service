import { Dictionary } from 'lodash';
import WcRestApi from '../clients/wcRestApi';
import WcCategoryDTO from '../dtos/wcCategoryDto';

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
  }

  /**
   * Initializes the cache
   *
   * @param {WcRestApi} wcRestApi
   */
  async initCache(wcRestApi: WcRestApi): Promise<void> {
    this.cache = await wcRestApi.fetchCategories();
  }

  /**
   * Fetches the categoryId from the cache, if it does not exist a new one is created
   *
   * @param {string} categoryName
   * @return {number} categoryId
   */
  async getCategory(categoryName: string): Promise<number> {
    const category = this.cache[categoryName];
    if (category) {
      return category['id'];
    }
    const newCategory = await this.wcRestApi.createCategory(
      new WcCategoryDTO(categoryName)
    );
    this.cache[newCategory['name']] = newCategory;
    return newCategory['id'];
  }

  /**
   * Fetches the sub category from the cache, if it does not exist a new one is created
   *
   * @param {string} subCategoryName
   * @param {string} parentCategoryName
   * @return {Promise<number>} categoryId
   */
  async getSubCategory(
    subCategoryName: string,
    parentCategoryName: string
  ): Promise<number> {
    const subCategory = this.cache[subCategoryName];
    if (subCategory) {
      return subCategory['id'];
    }

    const parentCategoryId = await this.getCategory(parentCategoryName);
    const newSubCategory = await this.wcRestApi.createCategory(
      new WcCategoryDTO(subCategoryName, parentCategoryId)
    );
    this.cache[newSubCategory['name']] = newSubCategory;
    return newSubCategory['id'];
  }
}
