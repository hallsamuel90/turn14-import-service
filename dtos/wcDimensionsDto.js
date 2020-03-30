/**
 * WooCommerce Product Dimensions Data Transfer Object
 */
class WcDimensionsDTO {
  /**
   *
   */
  constructor() {
    this.length = '';
    this.width = '';
    this.height = '';
  }

  /**
   * Returns JSON
   *
   * @return {JSON}
   */
  toJSON() {
    return {
      length: this.length,
      width: this.width,
      height: this.height,
    };
  }
}

module.exports = WcDimensionsDTO;
