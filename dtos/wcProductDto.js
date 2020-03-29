/**
 * WooCommerce Product Data Transfer Object
 */
class WcProductDTO {
  /**
   *
   */
  constructor() {
    this.name = '';
    this.type = 'simple';
    this.shortDescription = '';
    this.description = '';
    this.sku = '';
    this.regularPrice = '';
    this.salePrice = '';
    this.categories = [];
    this.images = [];
    this.weight = '';
    this.dimensions = null;
    this.manageStock = false;
    this.stockQuantity = null;
    this.stockStatus = 'instock';
    this.backorders = 'no';
    this.backordersAllowed = false;
    this.attributes = [];
  }

  /**
   * @return {JSON}
   */
  toJSON() {
    return {};
  }
}

module.exports = WcProductDTO;
