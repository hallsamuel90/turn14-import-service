const WcDimensionsDTO = require('../dtos/wcDimensionsDto');
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
    this.dimensions = new WcDimensionsDTO();
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
    return {
      name: this.name,
      type: this.type,
      short_description: this.shortDescription,
      // description: this.description,
      // sku: this.sku,
      // regular_price: this.regularPrice,
      // sale_price: this.salePrice,
      // categories: this.categories,
      // images: this.images,
      // weight: this.weight,
      // dimensions: this.dimensions.toJSON(),
      // manage_stock: this.manageStock,
      // stock_quantity: this.stockQuantity,
      // stock_status: this.stockStatus,
      // backorders: this.backorders,
      // backorders_allowed: this.backordersAllowed,
      // attributes: this.attributes,
    };
  }
}

module.exports = WcProductDTO;
