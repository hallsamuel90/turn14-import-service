import { Turn14ProductDTO } from '../../turn14/dtos/turn14ProductDto';
import { WcMapper } from './wcMapper';
import { WcUpdatePricingDTO } from '../../woocommerce/dtos/wcUpdatePricingDto';
import { WcCategoriesCache } from '../caches/wcCategoriesCache';
import pMap from 'p-map';

export class UpdatePricingWcMapper extends WcMapper {
  private readonly categoriesCache: WcCategoriesCache;

  constructor(categoriesCache: WcCategoriesCache) {
    super();

    this.categoriesCache = categoriesCache;
  }

  public async turn14sToWcs(
    turn14Products: Turn14ProductDTO[]
  ): Promise<WcUpdatePricingDTO[]> {
    const wcUpdatePricingDtos: WcUpdatePricingDTO[] = [];
    await pMap(
      turn14Products,
      async (turn14Product) => {
        try {
          const wcUpdatePricingDto = await this.turn14ToWc(turn14Product);
          wcUpdatePricingDtos.push(wcUpdatePricingDto);
        } catch (e) {
          console.error(`Something went wrong mapping the pricing ${e}`);
        }
      },
      { concurrency: 5 }
    );

    return wcUpdatePricingDtos;
  }

  public async turn14ToWc(
    turn14ProductDto: Turn14ProductDTO
  ): Promise<WcUpdatePricingDTO> {
    const wcProductId = await this.categoriesCache.getProductIdFromSku(
      turn14ProductDto?.item?.['attributes']?.['mfr_part_number']
    );

    const wcPricing = this.turn14PricingToWc(
      turn14ProductDto?.itemPricing?.['attributes']
    );
    const regularPrice = String(wcPricing.regularPrice);
    const salePrice = String(wcPricing.salePrice);

    return new WcUpdatePricingDTO(wcProductId, regularPrice, salePrice);
  }
}
