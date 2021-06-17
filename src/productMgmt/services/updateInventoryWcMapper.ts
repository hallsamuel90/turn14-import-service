import { Turn14ProductDTO } from '../../turn14/dtos/turn14ProductDto';
import { WcUpdateInventoryDTO } from '../../woocommerce/dtos/wcUpdateInventoryDto';
import { WcCategoriesCache } from '../caches/wcCategoriesCache';
import { WcMapper } from './wcMapper';
import pMap from 'p-map';
export class UpdateInventoryWcMapper extends WcMapper {
  private readonly categoriesCache: WcCategoriesCache;

  constructor(categoriesCache: WcCategoriesCache) {
    super();

    this.categoriesCache = categoriesCache;
  }

  public async turn14sToWcs(
    turn14Products: Turn14ProductDTO[]
  ): Promise<WcUpdateInventoryDTO[]> {
    const wcProducts: WcUpdateInventoryDTO[] = [];

    await pMap(
      turn14Products,
      async (turn14Product) => {
        try {
          const wcProduct = await this.turn14ToWc(turn14Product);
          wcProducts.push(wcProduct);
        } catch (e) {
          console.error(`Something went wrong mapping the inventory ${e}`);
        }
      },
      { concurrency: 5 }
    );

    return wcProducts;
  }

  public async turn14ToWc(
    turn14ProductDto: Turn14ProductDTO
  ): Promise<WcUpdateInventoryDTO> {
    const wcProductId = await this.categoriesCache.getProductIdFromSku(
      turn14ProductDto?.item?.['attributes']?.['mfr_part_number']
    );
    const itemInventory = turn14ProductDto?.itemInventory?.['attributes'];
    const inventoryQuantity = this.calculateTurn14StockQuantity(itemInventory);

    return new WcUpdateInventoryDTO(wcProductId, inventoryQuantity);
  }
}
