const WcCategoryDTO = require('../dtos/wcCategoryDto');

/**
 *
 */
class WcCategoriesCache {
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
  async initCache(wcRestApi) {
    this.cache = await wcRestApi.fetchCategories();
  }

  /**
   * Fetches the categoryId from the cache, if it does not exist a new one is created
   *
   * @param {string} categoryName
   * @return {int} categoryId
   */
  async getCategory(categoryName) {
    const category = this.cache[categoryName];
    if (category) {
      return category.id;
    }
    const newCategory = await this.wcRestApi.createCategory(
      new WcCategoryDTO(categoryName)
    );
    this.cache[newCategory.name] = newCategory;
    return newCategory.id;
  }

  /**
   * Fetches the sub category from the cache, if it does not exist a new one is created
   *
   * @param {string} subCategoryName
   * @param {string} parentCategoryName
   * @return {int} categoryId
   */
  async getSubCategory(subCategoryName, parentCategoryName) {
    const subCategory = this.cache[subCategoryName];
    if (subCategory) {
      return subCategory.id;
    }

    const parentCategoryId = await this.getCategory(parentCategoryName);
    const newSubCategory = await this.wcRestApi.createCategory(
      new WcCategoryDTO(subCategoryName, parentCategoryId)
    );
    this.cache[newSubCategory.name] = newSubCategory;
    return newSubCategory.id;
  }
}

module.exports = WcCategoriesCache;
