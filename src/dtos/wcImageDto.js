/**
 * WooCommerce Product Data Transfer Object
 */
class WcImageDTO {
  /**
   * Default constructor
   *
   * @param {string} src
   */
  constructor(src) {
    this.src = src;
  }

  /**
   * @return {JSON}
   */
  toJSON() {
    return {
      src: this.src,
    };
  }
}

module.exports = WcImageDTO;
