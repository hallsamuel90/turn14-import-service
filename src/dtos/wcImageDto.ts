/**
 * WooCommerce Product Data Transfer Object
 */
export default class WcImageDTO {
  src: string;
  /**
   * Default constructor
   *
   * @param {string} src
   */
  constructor(src: string) {
    this.src = src;
  }
}
