import { WcProductDTO } from '../../woocommerce/dtos/wcProductDto';
import { Turn14ProductDTO } from '../../turn14/dtos/turn14ProductDto';

export abstract class WcMapper {
  abstract turn14ToWc(
    turn14ProductDto: Turn14ProductDTO,
    wcId?: string
  ): WcProductDTO;

  protected calculateTurn14StockQuantity(itemInventory: JSON): number {
    let totalStock = 0;

    const warehouseStock = itemInventory['inventory'];
    if (warehouseStock) {
      for (const warehouseLocation in warehouseStock) {
        if (warehouseStock[warehouseLocation] > 0) {
          totalStock = totalStock + warehouseStock[warehouseLocation];
        }
      }
    }

    const manufacturerStock = itemInventory['manufacturer'];
    if (manufacturerStock?.stock > 0) {
      totalStock = totalStock + manufacturerStock.stock;
    }

    return totalStock;
  }
}
