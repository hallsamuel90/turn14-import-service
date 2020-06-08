/* eslint-disable @typescript-eslint/camelcase */

import _, { Dictionary } from 'lodash';

/**
 * WcCategoriesCacheTestUtil.
 *
 * Provides utility methods for testing WcCategoriesCache.
 *
 * @author Sam Hall <hallsamuel90@gmail.com>
 */
export class WcCategoriesCacheTestUtil {
  public static async getFakeCategories(): Promise<Dictionary<JSON>> {
    const fakeCategories = [
      {
        id: 15,
        name: 'fakeCategory',
        slug: 'fakeCategory',
        parent: 11,
        description: '',
        display: 'default',
        image: [],
        menu_order: 0,
        count: 4,
        _links: {
          self: [
            {
              href: 'https://example.com/wp-json/wc/v3/products/categories/15',
            },
          ],
          collection: [
            {
              href: 'https://example.com/wp-json/wc/v3/products/categories',
            },
          ],
          up: [
            {
              href: 'https://example.com/wp-json/wc/v3/products/categories/11',
            },
          ],
        },
      },
    ];

    const fakCategoriesJsonString = JSON.stringify(fakeCategories);
    const fakeCategoriesJson = JSON.parse(fakCategoriesJsonString);

    return _.keyBy(fakeCategoriesJson, 'name');
  }
}
