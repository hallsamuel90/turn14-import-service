/**
 * Turn14 Product Data Transfer Object
 */
class Turn14ProductDTO {
  /**
   * Constructor for Turn14ProductDTO
   *
   * @param {JSON} item
   * @param {JSON} itemData
   * @param {JSON} itemPricing
   * @param {JSON} itemInventory
   */
  constructor(item, itemData, itemPricing, itemInventory) {
    this.item = item;
    this.itemData = itemData;
    this.itemPricing = itemPricing;
    this.itemInventory = itemInventory;
  }
}

module.exports = Turn14ProductDTO;
