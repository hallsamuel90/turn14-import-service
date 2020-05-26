import { Dictionary } from 'lodash';
import { WcRestApi } from '../../woocommerce/clients/wcRestApi';
import { WcCategoryDTO } from '../../woocommerce/dtos/wcCategoryDto';
import { WcCategoryIdDTO } from '../../woocommerce/dtos/wcCategoryIdDto';
import { WcError } from '../../woocommerce/errors/wcError';

/**
 * WcCategoriesCache.
 *
 * @author Sam Hall <hallsamuel90@gmail.com>
 */
export class WcCategoriesCache {
  private cache: Dictionary<JSON>;
  private wcRestApi: WcRestApi;

  /**
   * Creates a new WcCategories cache with the provided WcRestApi.
   *
   * @param {WcRestApi} wcRestApi the wc client to fetch categories.
   */
  constructor(wcRestApi: WcRestApi) {
    this.wcRestApi = wcRestApi;
  }

  /**
   * Fetches the categoryId from the cache, if it does not exist a new one is
   * created.
   *
   * @param {string} categoryName name of the category.
   * @returns {WcCategoryIdDTO} dto containing the category id.
   */
  async getCategory(categoryName: string): Promise<WcCategoryIdDTO> {
    await this.checkCacheInitialized();

    let category = this.cache[categoryName];
    if (!category) {
      category = await this.createCategory(categoryName);
    }

    return new WcCategoryIdDTO(category['id']);
  }

  /**
   * Fetches the sub category from the cache, if it does not exist a new one is created
   *
   * @param {string} subCategoryName the name of the sub category.
   * @param {string} parentCategoryName the name of the parent category.
   * @returns {Promise<WcCategoryIdDTO>} dto containing the category id.
   */
  async getSubCategory(
    subCategoryName: string,
    parentCategoryName: string
  ): Promise<WcCategoryIdDTO> {
    await this.checkCacheInitialized();

    let subCategory = this.cache[subCategoryName];
    if (!subCategory) {
      const parentCategoryId = await this.getCategory(parentCategoryName);

      subCategory = await this.createSubCategory(
        subCategoryName,
        parentCategoryId.id
      );
    }

    return new WcCategoryIdDTO(subCategory['id']);
  }

  /**
   * Checks to see if the cache has been initialized. If it hasn't initialize
   * it.
   */
  private async checkCacheInitialized(): Promise<void> {
    if (this.cache == null) {
      await this.initCache();
    }
  }

  /**
   * Initializes the cache.
   */
  private async initCache(): Promise<void> {
    this.cache = await this.wcRestApi.fetchAllCategories();
  }

  /**
   * Creates a new category and adds it to the cache.
   *
   * @param {string} categoryName the name of the category to create.
   * @returns {Promise<JSON>} the JSON object containing created category.
   */
  private async createCategory(categoryName: string): Promise<JSON> {
    try {
      const newCategory = await this.wcRestApi.createCategory(
        new WcCategoryDTO(categoryName)
      );
      this.cache[newCategory['name']] = newCategory;
      return newCategory;
    } catch (e) {
      console.error('🔥 ' + e);
    } finally {
      throw new WcError(
        'createCategory(), there was an issue communicating with the woocommerce api.'
      );
    }
  }

  /**
   * Creates a new sub category and adds it to the cache.
   *
   * @param {string} subCategoryName the name of the sub category.
   * @param {number} parentCategoryId the unique id of the parent category.
   * @returns {Promise<JSON>} the JSON object containing created sub category.
   */
  private async createSubCategory(
    subCategoryName: string,
    parentCategoryId: number
  ): Promise<JSON> {
    try {
      const newSubCategory = await this.wcRestApi.createCategory(
        new WcCategoryDTO(subCategoryName, parentCategoryId)
      );
      this.cache[newSubCategory['name']] = newSubCategory;
      return newSubCategory;
    } catch (e) {
      console.error('🔥 ' + e);
    } finally {
      throw new WcError(
        'createSubCategory(), there was an issue communicating with the woocommerce api.'
      );
    }
  }
}
