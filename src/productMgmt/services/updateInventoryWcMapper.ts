import { WcUpdateInventoryDTO } from '../../woocommerce/dtos/wcUpdateInventoryDto';
import { Turn14ProductDTO } from '../../turn14/dtos/turn14ProductDto';
import { WcMapper } from './wcMapper';

/**
 * @inheritdoc
 */
export class UpdateInventoryWcMapper extends WcMapper {
  /**
   * Converts the turn14 products to the woocommerce update inventory data transfer objects.
   *
   * @param {Turn14ProductDTO[]} turn14Products the turn14 products data.
   * @param {JSON[]} existingWcProducts  the existing woocommerce products used for comparison.
   * @returns {WcUpdateInventoryDTO[]} the update inventory data transfer objects.
   */
  public turn14sToWcs(
    turn14Products: Turn14ProductDTO[],
    existingWcProducts: JSON[]
  ): WcUpdateInventoryDTO[] {
    const turn14ProductsMap = this.mapTurn14ProductsBySku(turn14Products);
    const wcUpdateInventoryDtos: WcUpdateInventoryDTO[] = [];
    for (const existingWcProduct of existingWcProducts) {
      const wcId = existingWcProduct?.['id'];
      const partNumber = existingWcProduct?.['sku'];
      const turn14Product = turn14ProductsMap[partNumber];

      const wcUpdateInventoryDto = this.turn14ToWc(turn14Product, wcId);
      wcUpdateInventoryDtos.push(wcUpdateInventoryDto);
    }

    return wcUpdateInventoryDtos;
  }

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
