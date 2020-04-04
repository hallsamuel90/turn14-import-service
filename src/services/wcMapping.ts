/* eslint-disable @typescript-eslint/camelcase */
import _ from 'lodash';
import WcCategoriesCache from '../cache/wcCategoriesCache';
import WcRestApi from '../clients/wcRestApi';
import Turn14ProductDTO from '../dtos/turn14ProductDto';
import WcImageDTO from '../dtos/wcImageDto';
import WcProductDTO from '../dtos/wcProductDto';
const MAP = 'MAP';
const RETAIL = 'Retail';
const JOBBER = 'Jobber';
const DESCRIPTION = 'Market Description';
const PRIMARY_IMAGE = 'Photo - Primary';
/**
 * Wc Mapping Service maps Turn14 attributes to WcProductDto
 */
export default class WcMappingService {
  categoriesCache: WcCategoriesCache;
  /**
   * Default constructor
   */
  constructor() {
    this.categoriesCache;
  }

  /**
   *
   * @param {WcRestApi} wcRestApi
   */
  async initCache(wcRestApi: WcRestApi): Promise<void> {
    this.categoriesCache = new WcCategoriesCache();
    await this.categoriesCache.initCache(wcRestApi);
  }

  /**
   *
   * @param {Turn14ProductDTO} turn14ProductDto
   * @return {Promise<WcProductDTO>} converted wcProductDto
   */
  async turn14ToWc(turn14ProductDto: Turn14ProductDTO): Promise<WcProductDTO> {
    const wcProduct = new WcProductDTO();
    // attributes
    const itemAttributes = turn14ProductDto.item['attributes'];
    wcProduct.name = itemAttributes.product_name;
    wcProduct.sku = itemAttributes.mfr_part_number;
    wcProduct.shortDescription = itemAttributes.part_description;
    // wcProduct.categories.push(
    //   await this.categoriesCache.getCategory(itemAttributes.category)
    // );
    // wcProduct.categories.push(
    //   await this.categoriesCache.getSubCategory(
    //     itemAttributes.subCategory,
    //     itemAttributes.category
    //   )
    // );
    // wcProduct.categories.push(
    //   await this.categoriesCache.getCategory(itemAttributes.brand)
    // );
    wcProduct.dimensions.length = itemAttributes.dimensions[0].length;
    wcProduct.dimensions.width = itemAttributes.dimensions[0].width;
    wcProduct.dimensions.height = itemAttributes.dimensions[0].height;
    wcProduct.weight = itemAttributes.dimensions[0].weight;

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
