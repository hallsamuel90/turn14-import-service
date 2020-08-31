import { WcUpdateInventoryDTO } from '../../woocommerce/dtos/wcUpdateInventoryDto';
import { Turn14ProductDTO } from '../../turn14/dtos/turn14ProductDto';
import { WcMapper } from './wcMapper';

/**
 *
 */
export class UpdateInventoryWcMapper extends WcMapper {
  /**
   * Converts the turn14 product to the woocommerce update inventory data transfer object.
   *
   * @param {Turn14ProductDTO} turn14ProductDto the turn14 product data.
   * @param {string} wcProductId the id of the woocommerce product.
   * @returns {WcUpdateInventoryDTO} the update inventory data transfer object.
   */
  public turn14ToWc(
    turn14ProductDto: Turn14ProductDTO,
    wcProductId: string
  ): WcUpdateInventoryDTO {
    const itemIventory = turn14ProductDto?.itemInventory?.['attributes'];
    const inventoryQuantity = this.calculateTurn14StockQuantity(itemIventory);

    return new WcUpdateInventoryDTO(wcProductId, inventoryQuantity);
  }
}
