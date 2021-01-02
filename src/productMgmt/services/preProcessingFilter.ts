import _, { Dictionary } from 'lodash';
import { Turn14ProductDTO } from '../../turn14/dtos/turn14ProductDto';
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
   * @returns {WcCreateProductDTO[]} filtered wcCreateProductsDtos.
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

  /**
   * Filters out products that are still carried, returning those that are deemed
   * stale.
   *
   * @param {Turn14ProductDTO[]} turn14Products the products that turn14 carries.
   * @param { JSON[] } existingWcProducts the existing products to compare against.
   * @returns {number[]} the id's of the products that are no longer carried.
   */
  public filterCarriedProducts(
    turn14Products: Turn14ProductDTO[],
    existingWcProducts: JSON[]
  ): number[] {
    const turn14ProductsBySku: Dictionary<Turn14ProductDTO> = this.keyProductsByMfrPartNumber(
      turn14Products
    );

    const removedProducts: number[] = [];
    for (const existingWcProduct of existingWcProducts) {
      if (!this.doesTurn14Carry(turn14ProductsBySku, existingWcProduct)) {
        removedProducts.push(existingWcProduct['id']);
      }
    }

    return removedProducts;
  }

  /**
   * Filters out products that have not been changed, returns those that have.
   *
   * @param {WcCreateProductDTO[]} wcCreateProductsDtos the product dtos to filter.
   * @param { JSON[] } existingWcProducts the existing products to compare against.
   * @returns {WcCreateProductDTO[]} filtered wcCreateProductsDtos.
   */
  public filterUnchangedProducts(
    wcCreateProductsDtos: WcCreateProductDTO[],
    existingWcProducts: JSON[]
  ): WcCreateProductDTO[] {
    const filteredWcProducts: WcCreateProductDTO[] = [];
    for (const wcProduct of wcCreateProductsDtos) {
      if (this.productHasChanged(wcProduct, existingWcProducts)) {
        filteredWcProducts.push(wcProduct);
      }
    }

    return filteredWcProducts;
  }

  private productHasChanged(
    wcProduct: WcCreateProductDTO,
    existingWcProducts: JSON[]
  ): boolean {
    const existingWcProductMap = (_.keyBy(
      existingWcProducts,
      'sku'
    ) as unknown) as Dictionary<JSON>;

    const existingProduct = existingWcProductMap[wcProduct.sku];
    if (!existingProduct) {
      return true;
    }

    return !(
      wcProduct.name == this.sanitizeName(existingProduct?.['name']) &&
      wcProduct.type == existingProduct?.['type'] &&
      wcProduct.regular_price == existingProduct?.['regular_price'] &&
      wcProduct.sale_price == existingProduct?.['sale_price'] &&
      wcProduct.weight == existingProduct?.['weight'] &&
      wcProduct.manage_stock == existingProduct?.['manage_stock'] &&
      wcProduct.backorders == existingProduct?.['backorders'] &&
      wcProduct.backorders_allowed == existingProduct?.['backorders_allowed']
    );
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

  private doesTurn14Carry(
    turn14ProductsBySku: Dictionary<Turn14ProductDTO>,
    wcProduct: JSON
  ): boolean {
    return turn14ProductsBySku[wcProduct['sku']] != undefined;
  }

  private keyProductsByMfrPartNumber(
    turn14Products: Turn14ProductDTO[]
  ): _.Dictionary<Turn14ProductDTO> {
    return _.keyBy(turn14Products, (turn14ProductDto) => {
      return turn14ProductDto.item?.['attributes']?.['mfr_part_number'];
    }) as Dictionary<Turn14ProductDTO>;
  }

  private sanitizeName(name: string): string {
    return name.replace('&amp;', '&');
  }
}
