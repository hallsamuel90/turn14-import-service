/* eslint-disable @typescript-eslint/camelcase */
import _ from 'lodash';
import { Turn14ProductDTO } from '../../turn14/dtos/turn14ProductDto';
import { WcCategoryIdDTO } from '../../woocommerce/dtos/wcCategoryIdDto';
import { WcCreateProductDTO } from '../../woocommerce/dtos/wcCreateProductDto';
import { WcImageDTO } from '../../woocommerce/dtos/wcImageDto';
import { WcCategoriesCache } from '../caches/wcCategoriesCache';

/**
 * WcMapper maps Turn14 attributes to create WooCommerce products.
 *
 * @author Sam Hall <hallsamuel90@gmail.com>
 */
export class WcMapper {
  private static MAP = 'MAP';
  private static RETAIL = 'Retail';
  private static JOBBER = 'Jobber';
  private static DESCRIPTION = 'Market Description';
  private static PRIMARY_IMAGE = 'Photo - Primary';

  private categoriesCache: WcCategoriesCache;

  /**
   * Creates a new instance of WcMapper with the provided WcCategoriesCache.
   *
   * @param {WcCategoriesCache} categoriesCache categoriesCache helps map to
   * existing categories or create new if necessary.
   */
  constructor(categoriesCache: WcCategoriesCache) {
    this.categoriesCache = categoriesCache;
  }

  /**
   * Converts a Turn14ProductDTO into a WcCreateProductDTO.
   *
   * @param {Turn14ProductDTO} turn14ProductDto the turn14 product to be
   * converted.
   * @returns {Promise<WcCreateProductDTO>} converted woocommerce product.
   */
  async turn14ToWc(
    turn14ProductDto: Turn14ProductDTO
  ): Promise<WcCreateProductDTO> {
    const wcProduct = new WcCreateProductDTO();

    const itemAttributes = turn14ProductDto?.item['attributes'];
    wcProduct.name = itemAttributes?.product_name;
    wcProduct.sku = itemAttributes?.mfr_part_number;
    wcProduct.brand_id = itemAttributes?.brand_id;
    wcProduct.shortDescription = itemAttributes?.part_description;
    wcProduct.dimensions.length = itemAttributes?.dimensions[0]?.length;
    wcProduct.dimensions.width = itemAttributes?.dimensions[0]?.width;
    wcProduct.dimensions.height = itemAttributes?.dimensions[0]?.height;
    wcProduct.weight = itemAttributes?.dimensions[0]?.weight;

    wcProduct.categories = await this.turn14CategoriesToWc(itemAttributes);

    const itemMedia = turn14ProductDto?.itemData;
    wcProduct.description = this.turn14DescriptionToWc(itemMedia);
    wcProduct.images = this.turn14ImagesToWc(itemAttributes, itemMedia);

    const itemPricing = turn14ProductDto?.itemPricing['attributes'];
    wcProduct.regular_price = this.turn14PricingToWcRegularPrice(itemPricing);
    wcProduct.sale_price = this.turn14PricingToWcSalePrice(itemPricing);

    const wcInventory = this.turn14InventoryToWc(
      turn14ProductDto?.itemInventory
    );
    wcProduct.manage_stock = wcInventory?.manage_stock;
    wcProduct.backorders = wcInventory?.backorders;
    wcProduct.stock_quantity = wcInventory?.stock_quantity;

    // TODO add fitment to special attribute
    return wcProduct;
  }

  async turn14CategoriesToWc(itemAttributes): Promise<WcCategoryIdDTO[]> {
    const wcCategoryDtos: WcCategoryIdDTO[] = [];
    const category = await this.categoriesCache.getCategory(
      itemAttributes?.category
    );

    if (category) {
      wcCategoryDtos.push(category);
    }

    const subCategory = await this.categoriesCache.getSubCategory(
      itemAttributes?.subcategory,
      itemAttributes?.category
    );

    if (subCategory) {
      wcCategoryDtos.push(subCategory);
    }

    const brandCategory = await this.categoriesCache.getCategory(
      itemAttributes?.brand
    );

    if (brandCategory) {
      wcCategoryDtos.push(brandCategory);
    }

    return wcCategoryDtos;
  }

  turn14DescriptionToWc(turn14Media: JSON): string {
    if (turn14Media['descriptions']) {
      const descriptions = _.keyBy(turn14Media['descriptions'], 'type');

      if (descriptions[WcMapper.DESCRIPTION]) {
        return descriptions[WcMapper.DESCRIPTION].description;
      }
    }

    return '';
  }

  turn14ImagesToWc(itemAttributes, turn14Media: JSON): WcImageDTO[] {
    const wcImageDtos: WcImageDTO[] = [];
    if (turn14Media['files']) {
      const files = _.keyBy(turn14Media['files'], 'media_content');
      if (files[WcMapper.PRIMARY_IMAGE]) {
        const imageLinks: JSON[] = files[WcMapper.PRIMARY_IMAGE]?.links;
        const lastLink = _.last(imageLinks);
        if (lastLink != null) {
          wcImageDtos.push(new WcImageDTO(lastLink['url']));
        }
      }
      // TODO: other types of photos ie Photo - Mounted
    } else if (itemAttributes?.thumbnail) {
      wcImageDtos.push(new WcImageDTO(itemAttributes?.thumbnail));
    }

    return wcImageDtos;
  }

  turn14PricingToWcRegularPrice(itemPricing): string {
    const priceLists = _.keyBy(itemPricing.pricelists, 'name');

    if (priceLists[WcMapper.RETAIL] && priceLists[WcMapper.MAP]) {
      return priceLists[WcMapper.RETAIL].price;
    } else if (priceLists[WcMapper.RETAIL]) {
      return priceLists[WcMapper.RETAIL].price;
    } else if (priceLists[WcMapper.MAP]) {
      return priceLists[WcMapper.MAP].price;
    } else if (priceLists[WcMapper.JOBBER]) {
      return priceLists[WcMapper.JOBBER].price;
    }

    return '';
  }

  turn14PricingToWcSalePrice(itemPricing): string {
    const priceLists = _.keyBy(itemPricing.pricelists, 'name');

    if (priceLists[WcMapper.RETAIL] && priceLists[WcMapper.MAP]) {
      return priceLists[WcMapper.MAP].price;
    }

    return '';
  }

  turn14InventoryToWc(itemInventory: JSON): WcCreateProductDTO {
    const wcInventory = new WcCreateProductDTO();
    if (itemInventory) {
      const itemInventoryAttributes = itemInventory['attributes'];

      wcInventory.manage_stock = true;
      wcInventory.backorders = 'notify';
      wcInventory.stock_quantity = this.getTurn14StockQuantity(
        itemInventoryAttributes
      );
    } else {
      // TODO: add special order attribute
    }

    return wcInventory;
  }

  getTurn14StockQuantity(itemInventory): number {
    let totalStock = 0;

    const warehouseStock = itemInventory?.inventory;
    if (warehouseStock != undefined) {
      for (const stock in warehouseStock) {
        if (warehouseStock[stock] > 0) {
          totalStock = totalStock + Number(stock);
        }
      }
    }

    const manufacturerStock = itemInventory?.manufacturer;
    if (manufacturerStock != undefined) {
      for (const stock in manufacturerStock) {
        if (manufacturerStock[stock] > 0) {
          totalStock = totalStock + Number(stock);
        }
      }
    }

    return totalStock;
  }
}
