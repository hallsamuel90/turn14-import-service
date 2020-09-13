import { WcProductDTO } from '../../woocommerce/dtos/wcProductDto';
import { Turn14ProductDTO } from '../../turn14/dtos/turn14ProductDto';
import { WcPricingDTO } from '../../woocommerce/dtos/wcPricingDto';
import _ from 'lodash';

export abstract class WcMapper {
  private static MAP = 'MAP';
  private static RETAIL = 'Retail';
  private static JOBBER = 'Jobber';

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

  protected turn14PricingToWc(itemPricing: JSON): WcPricingDTO {
    const wcPricing = new WcPricingDTO();

    const priceList = itemPricing?.['pricelists'];
    if (priceList) {
      const priceListsByName = _.keyBy(itemPricing?.['pricelists'], 'name');

      wcPricing.regularPrice = this.turn14PricingToWcRegularPrice(
        priceListsByName
      );

      wcPricing.salePrice = this.turn14PricingToWcSalePrice(priceListsByName);
    }

    return wcPricing;
  }

  private turn14PricingToWcRegularPrice(
    priceListsByName: _.Dictionary<JSON>
  ): string {
    let regularPrice = '';

    if (priceListsByName[WcMapper.RETAIL] && priceListsByName[WcMapper.MAP]) {
      regularPrice = priceListsByName[WcMapper.RETAIL]?.['price'];
    } else if (priceListsByName[WcMapper.RETAIL]) {
      regularPrice = priceListsByName[WcMapper.RETAIL]?.['price'];
    } else if (priceListsByName[WcMapper.MAP]) {
      regularPrice = priceListsByName[WcMapper.MAP]?.['price'];
    } else if (priceListsByName[WcMapper.JOBBER]) {
      regularPrice = priceListsByName[WcMapper.JOBBER]?.['price'];
    }

    return regularPrice;
  }

  private turn14PricingToWcSalePrice(
    priceListsByName: _.Dictionary<JSON>
  ): string {
    let salePrice = '';

    if (priceListsByName[WcMapper.RETAIL] && priceListsByName[WcMapper.MAP]) {
      salePrice = priceListsByName[WcMapper.MAP]?.['price'];
    }

    return salePrice;
  }
}
