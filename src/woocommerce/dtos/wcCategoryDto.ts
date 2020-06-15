/**
 * WooCommerce Category Data Transfer Object
 */
export class WcCategoryDTO {
  name: string;
  parent: number;

  /**
   * Default constructor
   *
   * @param {string} name
   * @param {number} parent optional
   */
  constructor(name: string, parent = 0) {
    this.name = name;
    this.parent = parent;
  }
}
