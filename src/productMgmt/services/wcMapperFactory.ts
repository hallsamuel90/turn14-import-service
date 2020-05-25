import { WcCategoriesCache } from '../caches/wcCategoriesCache';
import { WcMapper } from './wcMapper';

/**
 * WcMapperFactory.
 *
 * @author Sam Hall <hallsamuel90@gmail.com>
 */
export class WcMapperFactory {
  /**
   * Creates and returns a new instance of WcMapper with the provided
   * WcCategoriesCache.
   *
   * @param {WcCategoriesCache} categoriesCache cache of categories for use in
   * creating woocommerce products.
   * @returns {WcMapper} created instance.
   */
  getWcMapper(categoriesCache: WcCategoriesCache): WcMapper {
    return new WcMapper(categoriesCache);
  }
}
