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

  /**
   * Getter for item
   * @return {JSON} item
   */
  getItem() {
    return this.item;
  }

  /**
   * Getter for item data
   * @return {JSON} item data
   */
  getItemData() {
    return this.itemData;
  }

  /**
   * Getter for item pricing
   * @return {JSON} item pricing
   */
  getItemPricing() {
    return this.itemPricing;
  }

  /**
   * Getter for item inventory
   * @return {JSON} item inventory
   */
  getItemInventory() {
    return this.itemInventory;
  }
}

module.exports = Turn14ProductDTO;

