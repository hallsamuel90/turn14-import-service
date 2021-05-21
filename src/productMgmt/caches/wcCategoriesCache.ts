import { Dictionary } from 'lodash';
import { WcRestApi } from '../../woocommerce/clients/wcRestApi';
import { WcCategoryDTO } from '../../woocommerce/dtos/wcCategoryDto';
import { WcCategoryIdDTO } from '../../woocommerce/dtos/wcCategoryIdDto';

/**
 * WcCategoriesCache.
 *
 * @author Sam Hall <hallsamuel90@gmail.com>
 */
export class WcCategoriesCache {
  private readonly wcRestApi: WcRestApi;
  private categories: Dictionary<JSON>;
  private brands: Dictionary<JSON>;

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
  public async getCategory(categoryName: string): Promise<WcCategoryIdDTO> {
    await this.checkCacheInitialized();

    const encodedCategoryName = this.sanitizeName(categoryName);

    let category = this.categories[encodedCategoryName];

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
  public async getSubCategory(
    subCategoryName: string,
    parentCategoryName: string
  ): Promise<WcCategoryIdDTO> {
    await this.checkCacheInitialized();

    const encodedSubCategoryName = this.sanitizeName(subCategoryName);

    let subCategory = this.categories[encodedSubCategoryName];

    if (!subCategory) {
      const encodedParentCategoryName = this.sanitizeName(parentCategoryName);

      const parentCategory = await this.getCategory(encodedParentCategoryName);

      subCategory = await this.createSubCategory(
        subCategoryName,
        parentCategory.id
      );
    }

    return new WcCategoryIdDTO(subCategory['id']);
  }

  /**
   * Fetches the brand from the cache, if it does not exist a new one is created
   *
   * @param {string} brandName the name of the brand.
   * @returns {Promise<number>} the brand id.
   */
  public async getBrand(brandName: string): Promise<number> {
    await this.checkCacheInitialized();

    const sanitizedBrandName = this.sanitizeName(brandName);

    let brand = this.getBrandFromCache(sanitizedBrandName);
    if (brand) {
      return this.getBrandIdFromBrand(brand);
    }

    brand = await this.createBrand(sanitizedBrandName);
    this.addBrandToCache(brand);

    return this.getBrandIdFromBrand(brand);
  }

  public async getProductIdFromSku(sku: string): Promise<number> {
    const product = await this.wcRestApi.fetchProductBySku(sku);

    return product['id'];
  }

  private getBrandFromCache(sanitizedBrandName: string): JSON | undefined {
    return this.brands[sanitizedBrandName];
  }

  private addBrandToCache(brand: JSON): void {
    this.brands[brand?.['name']] = brand;
  }

  private getBrandIdFromBrand(brand: JSON): number | PromiseLike<number> {
    return brand['term_id'] ? brand?.['term_id'] : brand?.['id'];
  }

  /**
   * Checks to see if the cache has been initialized. If it hasn't initialize
   * it.
   */
  private async checkCacheInitialized(): Promise<void> {
    if (this.categories == null && this.brands == null) {
      await this.initCache();
    }
  }

  /**
   * Initializes the cache.
   */
  private async initCache(): Promise<void> {
    this.categories = await this.getAllCategories();
    this.brands = await this.getAllBrands();
  }

  private async getAllCategories(): Promise<Dictionary<JSON>> {
    try {
      return await this.wcRestApi.fetchAllCategories();
    } catch (e) {
      console.error('🔥 ' + e);
    }

    return {};
  }

  private async getAllBrands(): Promise<Dictionary<JSON>> {
    try {
      return await this.wcRestApi.fetchAllBrands();
    } catch (e) {
      console.error('🔥 ' + e);
    }

    return {};
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
      this.categories[newCategory['name']] = newCategory;

      return newCategory;
    } catch (e) {
      console.error(
        `🔥 Failed to create Category with payload: ${categoryName}, and error ${e}`
      );

      return ({ id: 0 } as unknown) as JSON; // 'uncategorized'
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
      this.categories[newSubCategory['name']] = newSubCategory;
      return newSubCategory;
    } catch (e) {
      console.error('🔥 ' + e);

      return ({ id: 0 } as unknown) as JSON; // 'uncategorized'
    }
  }

  private async createBrand(sanitizedBrandName: string): Promise<JSON> {
    try {
      const brand = await this.wcRestApi.createBrand(sanitizedBrandName);

      return brand;
    } catch (e) {
      console.error(
        `🔥 Failed to create brand with payload: ${sanitizedBrandName}, and error ${e}`
      );
    }

    return ({ id: 0 } as unknown) as JSON;
  }

  private sanitizeName(categoryName: string): string {
    if (!categoryName) {
      return '';
    }

    return categoryName.replace('&', '&amp;');
  }
}
