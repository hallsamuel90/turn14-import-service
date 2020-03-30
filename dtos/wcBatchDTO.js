/**
 * WooCommerce Batch Operations Data Transfer Object
 */
class WcBatchDTO {
  /**
   *
   */
  constructor() {
    /** @type {WcProductDTO[]} */
    this.create = [];
    /** @type {WcUpdateProductDTO[]} */
    this.update = [];
    /** @type {int[]} */
    this.delete = [];
  }

  /**
   * Determines the total number of objects
   * @return {int} total number of objects
   */
  totalSize() {
    return this.create.length + this.update.length + this.delete.length;
  }

  /**
   * @return {JSON}
   */
  toJSON() {
    const createJson = [];
    for (const wcProduct of this.create) {
      createJson.push(wcProduct.toJSON());
    }
    return {
      create: createJson,
      update: this.update,
      delete: this.delete,
    };
  }
}

module.exports = WcBatchDTO;
