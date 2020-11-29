/* eslint-disable @typescript-eslint/camelcase */

import _, { Dictionary } from 'lodash';

/**
 * WcCategoriesCacheTestUtil.
 *
 * Provides utility methods for testing WcCategoriesCache.
 *
 * @author Sam Hall <hallsamuel90@gmail.com>
 */
export class WcCategoriesCacheTestFakeData {
  public static getFakeCategories(): Dictionary<JSON> {
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

  public static getFakeBrands(): Dictionary<JSON> {
    const fakeBrands = [
      {
        term_id: 156,
        name: 'fakeBrand1',
        slug: 'fakeBrand1',
        term_group: 0,
        term_taxonomy_id: 156,
        taxonomy: 'pwb-brand',
        description: '',
        parent: 0,
        count: 1,
        filter: 'raw',
        brand_image: false,
        brand_banner: false,
      },
      {
        term_id: 157,
        name: 'fakeBrand2',
        slug: 'fakeBrand2',
        term_group: 0,
        term_taxonomy_id: 157,
        taxonomy: 'pwb-brand',
        description: '',
        parent: 0,
        count: 0,
        filter: 'raw',
        brand_image: false,
        brand_banner: false,
      },
    ];

    const fakBrandsJsonString = JSON.stringify(fakeBrands);
    const fakeBrandsJson = JSON.parse(fakBrandsJsonString);

    return _.keyBy(fakeBrandsJson, 'name');
  }

  public static getFakeCreateBrand(): JSON {
    const fakeBrand = {
      id: 35,
      name: 'test2',
      slug: 'test2',
      description: null,
    };

    const fakBrandJsonString = JSON.stringify(fakeBrand);
    const fakeBrandJson = JSON.parse(fakBrandJsonString);

    return fakeBrandJson;
  }
}
