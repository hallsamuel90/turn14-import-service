/**
 * WooCommerce Category Data Transfer Object
 */
class WcCategoryDTO {
  /**
   * Default constructor
   *
   * @param {string} name
   * @param {int} parent optional
   */
  constructor(name, parent = 0) {
    this.name = name;
    this.parent = parent;
  }

  /**
   * @return {JSON}
   */
  toJSON() {
    return {
      name: this.name,
      parent: this.parent,
    };
  }
}

module.exports = WcCategoryDTO;
