/**
 * WooCommerce Product Dimensions Data Transfer Object
 */
export default class WcDimensionsDTO {
  length: string;
  width: string;
  height: string;
  /**
   *
   */
  constructor() {
    this.length = '';
    this.width = '';
    this.height = '';
  }
}
