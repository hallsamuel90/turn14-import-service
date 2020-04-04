/**
 * Turn14 Product Data Transfer Object
 */
export default class Turn14ProductDTO {
  item: JSON;
  itemData: JSON;
  itemPricing: JSON;
  itemInventory: JSON;
  /**
   * Constructor for Turn14ProductDTO
   *
   * @param {JSON} item
   * @param {JSON} itemData
   * @param {JSON} itemPricing
   * @param {JSON} itemInventory
   */
  constructor(
    item: JSON,
    itemData: JSON,
    itemPricing: JSON,
    itemInventory: JSON
  ) {
    this.item = item;
    this.itemData = itemData;
    this.itemPricing = itemPricing;
    this.itemInventory = itemInventory;
  }
}
