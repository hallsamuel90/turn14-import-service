const WcProductDTO = require('../dtos/wcProductDto');
// const _ = require('lodash');
/**
 * Wc Mapping Service maps Turn14 attributes to WcProductDto
 */
class WcMappingService {
  /**
   * Default constructor
   */
  constructor() {
    // get categories as map of {name: Object}
    this.categoriesCache = null;
  }

  /**
   *
   * @param {Turn14ProductDTO} turn14ProductDto
   * @return {WcProductDTO} converted wcProductDto
   */
  turn14ToWc(turn14ProductDto) {
    const wcProduct = new WcProductDTO();
    const itemAttributes = turn14ProductDto.item.attributes;
    wcProduct.name = itemAttributes.product_name;
    wcProduct.sku = itemAttributes.mfr_part_number;
    wcProduct.shortDescription = itemAttributes.part_description;
    // TODO:
    // wcProduct.categories.push(
    //   this.categoriesCache.get(itemAttributes.category)
    // );
    // wcProduct.categories.push(
    //   this.categoriesCache.get(itemAttributes.subCategory)
    // );
    // wcProduct.categories.push(this.categoriesCache.get(itemAttributes.brand));
    wcProduct.dimensions.length = itemAttributes.dimensions[0].length;
    wcProduct.dimensions.width = itemAttributes.dimensions[0].width;
    wcProduct.dimensions.height = itemAttributes.dimensions[0].height;
    wcProduct.weight = itemAttributes.dimensions[0].weight;

    // console.info('👍 Import complete!');
    return wcProduct;
  }
}
module.exports = WcMappingService;
