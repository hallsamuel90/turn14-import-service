const WcProductDto = require('../dtos/wcProductDto');
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
   */
  async turn14ToWc(turn14ProductDto) {
    const wcProduct = new WcProductDto();
    // console.info('👍 Import complete!');
    return wcProduct;
  }
}
module.exports = WcMappingService;
