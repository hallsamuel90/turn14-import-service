/**
 * Turn14 Product Data Transfer Object
 */
export class Turn14ProductDTO {
  item?: JSON;
  itemData?: JSON;
  itemPricing?: JSON;
  itemInventory?: JSON;

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
