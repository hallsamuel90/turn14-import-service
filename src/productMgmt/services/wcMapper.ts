/* eslint-disable @typescript-eslint/camelcase */
import _ from 'lodash';
import { Turn14ProductDTO } from '../../turn14/dtos/turn14ProductDto';
import { WcCategoriesCache } from '../caches/wcCategoriesCache';
import { WcImageDTO } from '../../woocommerce/dtos/wcImageDto';
import { WcCreateProductDTO } from '../../woocommerce/dtos/wcCreateProductDto';
const MAP = 'MAP';
const RETAIL = 'Retail';
const JOBBER = 'Jobber';
const DESCRIPTION = 'Market Description';
const PRIMARY_IMAGE = 'Photo - Primary';
/**
 * WcMapper maps Turn14 attributes to create WooCommerce products.
 *
 * @author Sam Hall <hallsamuel90@gmail.com>
 */
export class WcMapper {
  private categoriesCache: WcCategoriesCache;
  /**
   * Creates a new instance of WcMapper with the provided WcCategoriesCache.
   *
   * @param {WcCategoriesCache} categoriesCache categoriesCache helps map to
   * existing categories or create new if necessary.
   */
  constructor(categoriesCache: WcCategoriesCache) {
    this.categoriesCache = categoriesCache;
  }

  /**
   * Converts a Turn14ProductDTO into a WcCreateProductDTO.
   *
   * @param {Turn14ProductDTO} turn14ProductDto the turn14 product to be
   * converted.
   * @returns {Promise<WcCreateProductDTO>} converted woocommerce product.
   */
  async turn14ToWc(
    turn14ProductDto: Turn14ProductDTO
  ): Promise<WcCreateProductDTO> {
    const wcProduct = new WcCreateProductDTO();
    // attributes
    const itemAttributes = turn14ProductDto.item['attributes'];
    wcProduct.name = itemAttributes.product_name;
    wcProduct.sku = itemAttributes.mfr_part_number;
    wcProduct.shortDescription = itemAttributes.part_description;
    const category = await this.categoriesCache.getCategory(
      itemAttributes.category
    );
    if (category) {
      wcProduct.categories.push();
    }
    const subCategory = await this.categoriesCache.getSubCategory(
      itemAttributes.subcategory,
      itemAttributes.category
    );
    if (subCategory) {
      wcProduct.categories.push(subCategory);
    }
    const brandCategory = await this.categoriesCache.getCategory(
      itemAttributes.brand
    );
    if (brandCategory) {
      wcProduct.categories.push(brandCategory);
    }
    if (
      Array.isArray(itemAttributes.dimensions) &&
      itemAttributes.dimensions.length
    ) {
      wcProduct.dimensions.length = itemAttributes.dimensions[0]['length'];
      wcProduct.dimensions.width = itemAttributes.dimensions[0]['width'];
      wcProduct.dimensions.height = itemAttributes.dimensions[0]['height'];
      wcProduct.weight = itemAttributes.dimensions[0]['weight'];
    }

    // media
    const itemData = turn14ProductDto.itemData;
    if (itemData['descriptions']) {
      const descriptions = _.keyBy(
        turn14ProductDto.itemData['descriptions'],
        'type'
      );
      if (descriptions[DESCRIPTION]) {
        wcProduct.description = descriptions[DESCRIPTION].description;
      }
    }
    if (itemData['files']) {
      const files = _.keyBy(
        turn14ProductDto.itemData['files'],
        'media_content'
      );
      if (files[PRIMARY_IMAGE]) {
        const imageLinks = files[PRIMARY_IMAGE].links;
        wcProduct.images.push(new WcImageDTO(_.last(imageLinks)['url']));
      }
      // TODO: other types of photos ie Photo - Mounted
    } else if (itemAttributes.thumbnail) {
      wcProduct.images.push(new WcImageDTO(itemAttributes.thumbnail));
    }

    // pricing
    const itemPricing = turn14ProductDto.itemPricing['attributes'];
    const priceLists = _.keyBy(itemPricing.pricelists, 'name');
    if (priceLists[RETAIL] && priceLists[MAP]) {
      wcProduct.regular_price = priceLists[RETAIL].price;
      wcProduct.sale_price = priceLists[MAP].price;
    } else if (priceLists[RETAIL]) {
      wcProduct.regular_price = priceLists[RETAIL].price;
    } else if (priceLists[MAP]) {
      wcProduct.regular_price = priceLists[MAP].price;
    } else if (priceLists[JOBBER]) {
      wcProduct.regular_price = priceLists[JOBBER].price;
    }

    // inventory
    if (turn14ProductDto.itemInventory) {
      const itemInventory = turn14ProductDto.itemInventory['attributes'];
      let totalStock = 0;
      const warehouseStock = itemInventory['inventory'];
      if (warehouseStock != undefined) {
        for (const stock in warehouseStock) {
          if (warehouseStock[stock] > 0) {
            totalStock = totalStock + Number(stock);
          }
        }
      }
      const manufacturerStock = itemInventory['manufacturer'];
      if (manufacturerStock != undefined) {
        for (const stock in manufacturerStock) {
          if (manufacturerStock[stock] > 0) {
            totalStock = totalStock + Number(stock);
          }
        }
      }
      wcProduct.manage_stock = true;
      wcProduct.backorders = 'notify';
      wcProduct.stock_quantity = totalStock;
    } else {
      // TODO: add special order attribute
    }

    // TODO add brand attribute, turn14 id attribute
    // TODO add fitment to special attribute
    return wcProduct;
  }
}
