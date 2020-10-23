import { Turn14ProductDTO } from '../../turn14/dtos/turn14ProductDto';
import { WcMapper } from './wcMapper';
import { WcUpdatePricingDTO } from '../../woocommerce/dtos/wcUpdatePricingDto';

/**
 * @inheritdoc
 */
export class UpdatePricingWcMapper extends WcMapper {
  /**
   * Converts the turn14 product to the woocommerce update pricing data transfer object.
   *
   * @param {Turn14ProductDTO} turn14Products the turn14 product data.
   * @param {JSON[]} existingWcProducts the existing woocommerce products used for comparison.
   * @returns {WcUpdatePricingDTO} the update pricing data transfer object.
   */
  public turn14sToWcs(
    turn14Products: Turn14ProductDTO[],
    existingWcProducts: JSON[]
  ): WcUpdatePricingDTO[] {
    const turn14ProductsMap = this.mapTurn14ProductsBySku(turn14Products);
    const wcUpdatePricingDtos: WcUpdatePricingDTO[] = [];
    for (const existingWcProduct of existingWcProducts) {
      const wcId = existingWcProduct?.['id'];
      const partNumber = existingWcProduct?.['sku'];
      const turn14Product = turn14ProductsMap[partNumber];

      const wcUpdatePricingDto = this.turn14ToWc(turn14Product, wcId);
      wcUpdatePricingDtos.push(wcUpdatePricingDto);
    }
    return wcUpdatePricingDtos;
  }

  /**
   * Converts the turn14 product to the woocommerce update pricing data transfer object.
   *
   * @param {Turn14ProductDTO} turn14ProductDto the turn14 product data.
   * @param {string} wcProductId the id of the woocommerce product.
   * @returns {WcUpdatePricingDTO} the update pricing data transfer object.
   */
  public turn14ToWc(
    turn14ProductDto: Turn14ProductDTO,
    wcProductId: string
  ): WcUpdatePricingDTO {
    const itemPricing = turn14ProductDto?.itemPricing?.['attributes'];
    const wcPricing = this.turn14PricingToWc(itemPricing);

    const regularPrice = String(wcPricing.regularPrice);
    const salePrice = String(wcPricing.salePrice);

    return new WcUpdatePricingDTO(wcProductId, regularPrice, salePrice);
  }
}
