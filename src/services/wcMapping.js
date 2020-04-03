const WcProductDTO = require('../dtos/wcProductDto');
const WcImageDTO = require('../dtos/wcImageDto');
const WcCategoriesCache = require('../cache/wcCategoriesCache');
const _ = require('lodash');

const MAP = 'MAP';
const RETAIL = 'Retail';
const JOBBER = 'Jobber';
const DESCRIPTION = 'Market Description';
PRIMARY_IMAGE = 'Photo - Primary';
/**
 * Wc Mapping Service maps Turn14 attributes to WcProductDto
 */
class WcMappingService {
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
  async initCache(wcRestApi) {
    this.categoriesCache = new WcCategoriesCache();
    await this.categoriesCache.initCache(wcRestApi);
  }

  /**
   *
   * @param {Turn14ProductDTO} turn14ProductDto
   * @return {WcProductDTO} converted wcProductDto
   */
  async turn14ToWc(turn14ProductDto) {
    const wcProduct = new WcProductDTO();
    // attributes
    const itemAttributes = turn14ProductDto.item.attributes;
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
        turn14ProductDto.itemData.descriptions,
        'type'
      );
      if (descriptions[DESCRIPTION]) {
        wcProduct.description = descriptions[DESCRIPTION].description;
      }
    }
    if (itemData['files']) {
      const files = _.keyBy(turn14ProductDto.itemData.files, 'media_content');
      if (files[PRIMARY_IMAGE]) {
        const imageLinks = files[PRIMARY_IMAGE].links;
        wcProduct.images.push(new WcImageDTO(_.last(imageLinks).url));
      }
      // TODO: other types of photos ie Photo - Mounted
    } else if (itemAttributes.thumbnail) {
      wcProduct.images.push(new WcImageDTO(itemAttributes.thumbnail));
    }

    // pricing
    const itemPricing = turn14ProductDto.itemPricing.attributes;
    const priceLists = _.keyBy(itemPricing.pricelists, 'name');
    if (priceLists[RETAIL] && priceLists[MAP]) {
      wcProduct.regularPrice = priceLists[RETAIL].price;
      wcProduct.salePrice = priceLists[MAP].price;
    } else if (priceLists[RETAIL]) {
      wcProduct.regularPrice = priceLists[RETAIL].price;
    } else if (priceLists[MAP]) {
      wcProduct.regularPrice = priceLists[MAP].price;
    } else if (priceLists[JOBBER]) {
      wcProduct.regularPrice = priceLists[JOBBER].price;
    }

    // inventory
    if (turn14ProductDto.itemInventory) {
      const itemInventory = turn14ProductDto.itemInventory.attributes;
      let totalStock = 0;
      const warehouseStock = itemInventory['inventory'];
      if (warehouseStock != undefined) {
        for (const stock in warehouseStock) {
          if (warehouseStock[stock] > 0) {
            totalStock = totalStock + stock;
          }
        }
      }
      const manufacturerStock = itemInventory['manufacturer'];
      if (manufacturerStock != undefined) {
        for (const stock in manufacturerStock) {
          if (manufacturerStock[stock] > 0) {
            totalStock = totalStock + stock;
          }
        }
      }
      wcProduct.manageStock = true;
      wcProduct.backorders = 'notify';
      wcProduct.stockQuantity = totalStock;
    } else {
      // TODO: add special order attribute
    }

    // TODO add brand attribute, turn14 id attribute
    // TODO add fitment to special attribute
    return wcProduct;
  }
}
module.exports = WcMappingService;
