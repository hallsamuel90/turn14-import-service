import _, { Dictionary } from 'lodash';
import { WcCreateProductDTO } from '../../woocommerce/dtos/wcCreateProductDto';
import { WcUpdateInventoryDTO } from '../../woocommerce/dtos/wcUpdateInventoryDto';
import { WcUpdatePricingDTO } from '../../woocommerce/dtos/wcUpdatePricingDto';

/**
 * PreProcessingFilter filters products based on variety of criteria to avoid
 * duplication and unnecessary updates.
 */
export class PreProcessingFilter {
  /**
   * Filters products who's inventories have not changed, returning those that
   * need to be updated.
   *
   * @param {WcUpdateInventoryDTO[]} wcUpdateInventoryDtos the product dtos to filter.
   * @param { JSON[] } existingWcProducts the existing products to compare against.
   * @returns {WcUpdateInventoryDTO[]} filtered wcUpdateInventoryDtos.
   */
  public filterUnchangedInventory(
    wcUpdateInventoryDtos: WcUpdateInventoryDTO[],
    existingWcProducts: JSON[]
  ): WcUpdateInventoryDTO[] {
    const filteredWcProducts: WcUpdateInventoryDTO[] = [];
    for (const wcUpdateInventoryDto of wcUpdateInventoryDtos) {
      if (this.stockHasChanged(wcUpdateInventoryDto, existingWcProducts)) {
        filteredWcProducts.push(wcUpdateInventoryDto);
      }
    }

    return filteredWcProducts;
  }

  /**
   * Filters products who's pricing have not changed, returning those that
   * need to be updated.
   *
   * @param {WcUpdatePricingDTO[]} wcUpdatePricingDtos the product dtos to filter.
   * @param { JSON[] } existingWcProducts the existing products to compare against.
   * @returns {WcUpdatePricingDTO[]} filtered wcUpdateInventoryDtos.
   */
  public filterUnchangedPricing(
    wcUpdatePricingDtos: WcUpdatePricingDTO[],
    existingWcProducts: JSON[]
  ): WcUpdatePricingDTO[] {
    const filteredWcProducts: WcUpdatePricingDTO[] = [];
    for (const wcUpdatePricingDto of wcUpdatePricingDtos) {
      if (this.pricingHasChanged(wcUpdatePricingDto, existingWcProducts)) {
        filteredWcProducts.push(wcUpdatePricingDto);
      }
    }

    return filteredWcProducts;
  }

  /**
   * Filters out already existing products, returning those that need to be created.
   *
   * @param {WcCreateProductDTO[]} wcProducts the product dtos to filter.
   * @param { JSON[] } existingWcProducts the existing products to compare against.
   * @returns {WcUpdatePricingDTO[]} filtered wcUpdateInventoryDtos.
   */
  public filterExistingProducts(
    wcProducts: WcCreateProductDTO[],
    existingWcProducts: JSON[]
  ): WcCreateProductDTO[] {
    const filteredWcProducts: WcCreateProductDTO[] = [];
    for (const wcProduct of wcProducts) {
      if (!this.doesProductExist(wcProduct, existingWcProducts)) {
        filteredWcProducts.push(wcProduct);
      }
    }

    return filteredWcProducts;
  }

  private stockHasChanged(
    wcUpdateInventoryDto: WcUpdateInventoryDTO,
    wcProducts: JSON[]
  ): boolean {
    const wcProductMap = (_.keyBy(wcProducts, 'sku') as unknown) as Dictionary<
      JSON
    >;
    const existingWcProduct = wcProductMap[wcUpdateInventoryDto.id];

    return (
      wcUpdateInventoryDto.stock_quantity !=
      existingWcProduct?.['stock_quantity']
    );
  }

  private pricingHasChanged(
    wcUpdatePricingDto: WcUpdatePricingDTO,
    wcProducts: JSON[]
  ): boolean {
    const wcProductMap = (_.keyBy(wcProducts, 'sku') as unknown) as Dictionary<
      JSON
    >;
    const existingWcProduct = wcProductMap[wcUpdatePricingDto.id];

    const regularPriceChanged =
      wcUpdatePricingDto.regular_price != existingWcProduct?.['regular_price'];
    const salePriceChanged =
      wcUpdatePricingDto.sale_price != existingWcProduct?.['sale_price'];

    return regularPriceChanged || salePriceChanged;
  }

  private doesProductExist(
    wcProduct: WcCreateProductDTO,
    existingWcProducts: JSON[]
  ): boolean {
    for (const existingWcProduct of existingWcProducts) {
      if (wcProduct.sku === existingWcProduct?.['sku']) {
        return true;
      }
    }

    return false;
  }
}
