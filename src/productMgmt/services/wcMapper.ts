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
  private static FITMENT = 'Application Summary';
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
  async turn14ToCreateWc(
    turn14ProductDto: Turn14ProductDTO
  ): Promise<WcCreateProductDTO> {
    const wcProduct = new WcCreateProductDTO();

    const itemAttributes = turn14ProductDto?.item?.['attributes'];
    if (itemAttributes) {
      const wcProductAttributes = this.turn14AttributesToWc(itemAttributes);
      wcProduct.name = wcProductAttributes.name;
      wcProduct.sku = wcProductAttributes.sku;
      wcProduct.brand_id = wcProductAttributes.brand_id;
      wcProduct.shortDescription = wcProductAttributes.shortDescription;
      wcProduct.dimensions.length = wcProductAttributes.dimensions.length;
      wcProduct.dimensions.width = wcProductAttributes.dimensions.width;
      wcProduct.dimensions.height = wcProductAttributes.dimensions.height;
      wcProduct.weight = wcProductAttributes.weight;
    }

    wcProduct.categories = await this.turn14CategoriesToWc(itemAttributes);

    const itemMedia = turn14ProductDto?.itemData;
    if (itemMedia) {
      wcProduct.description = this.turn14DescriptionToWc(itemMedia);
      wcProduct.ymm_fitment = this.turn14FitmentToWc(itemMedia);
      wcProduct.images = this.turn14ImagesToWc(itemAttributes, itemMedia);
    }

    const itemPricing = turn14ProductDto?.itemPricing?.['attributes'];
    if (itemPricing) {
      const wcPricing = this.turn14PricingToWc(itemPricing);
      wcProduct.regular_price = wcPricing.regular_price;
      wcProduct.sale_price = wcPricing.sale_price;
    }

    const itemInventory = turn14ProductDto?.itemInventory;
    if (itemInventory) {
      const wcInventory = this.turn14InventoryToWc(itemInventory);
      wcProduct.manage_stock = wcInventory?.manage_stock;
      wcProduct.backorders = wcInventory?.backorders;
      wcProduct.stock_quantity = wcInventory?.stock_quantity;
    }

    return wcProduct;
  }

  /**
   * Converts turn 14 items attributes into woocommerce format.
   *
   * @param {any} itemAttributes the attributes to be converted.
   * @returns {WcCreateProductDTO} a partially populated WcCreateProductDTO
   * object that only contains the attributes.
   */
  turn14AttributesToWc(itemAttributes): WcCreateProductDTO {
    const wcProductAttributes = new WcCreateProductDTO();

    wcProductAttributes.name = itemAttributes?.product_name;
    wcProductAttributes.sku = itemAttributes?.mfr_part_number;
    wcProductAttributes.brand_id = itemAttributes?.brand_id;
    wcProductAttributes.shortDescription = itemAttributes?.part_description;
    wcProductAttributes.dimensions.length =
      itemAttributes?.dimensions[0]?.length;
    wcProductAttributes.dimensions.width = itemAttributes?.dimensions[0]?.width;
    wcProductAttributes.dimensions.height =
      itemAttributes?.dimensions[0]?.height;
    wcProductAttributes.weight = itemAttributes?.dimensions[0]?.weight;

    return wcProductAttributes;
  }

  /**
   * Converts turn14 attributes into woocommerce categories.
   *
   * @param {any} itemAttributes the itemAttributes that contain the categories.
   * Different categories are created from different attributes.
   * @returns {Promise<WcCategoryIdDTO[]>} a list of data transfer objects that
   * contain the categories in the format woocommerce expects.
   */
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

  /**
   * Converts the turn14 description into woocommerce description.
   *
   * @param {JSON} turn14Media the object that contains the descriptions.
   * @returns {string} the extracted description.
   */
  turn14DescriptionToWc(turn14Media: JSON): string {
    if (turn14Media['descriptions']) {
      const descriptions = _.keyBy(turn14Media['descriptions'], 'type');

      if (descriptions[WcMapper.DESCRIPTION]) {
        return descriptions[WcMapper.DESCRIPTION].description;
      }
    }

    return '';
  }

  /**
   * Maps the turn14 fitment description into woocommerce the ymm_fitment attribute.
   *
   * @param {JSON} turn14Media the object that contains the descriptions.
   * @returns {string} the extracted fitment description.
   */
  turn14FitmentToWc(turn14Media: JSON): string {
    if (turn14Media['descriptions']) {
      const descriptions = _.keyBy(turn14Media['descriptions'], 'type');

      if (descriptions[WcMapper.FITMENT]) {
        return descriptions[WcMapper.FITMENT].description;
      }
    }

    return '';
  }

  /**
   * Converts the turn14 image links into the data transfer object woocommerce
   * expects.
   *
   * @param {any} itemAttributes the itemAttributes contains a thumbnail. If
   * there is not a suitable image in turn14Media, the thumbnail will be used.
   * @param {JSON} turn14Media the object that contains the image links.
   * @returns {WcImageDTO[]} a list of data transfer objects that contain the
   * image links.
   */
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

  turn14PricingToWc(itemPricing) {
    const wcPricing = new WcCreateProductDTO();

    const priceList = itemPricing?.pricelists;
    if (priceList) {
      const priceListsByName = _.keyBy(itemPricing.pricelists, 'name');

      wcPricing.regular_price = this.turn14PricingToWcRegularPrice(
        priceListsByName
      );

      wcPricing.sale_price = this.turn14PricingToWcSalePrice(priceListsByName);
    }

    return wcPricing;
  }

  /**
   * Traverses the turn14 pricing object and determines the regular_price based
   * on available properties.
   *
   * @param {any} priceListsByName the object that contains pricing information.
   * @returns {string} the determined regular price. may return empty string if
   * a price cannot be determined.
   */
  turn14PricingToWcRegularPrice(priceListsByName): string {
    let regularPrice = '';

    if (priceListsByName[WcMapper.RETAIL] && priceListsByName[WcMapper.MAP]) {
      regularPrice = priceListsByName[WcMapper.RETAIL].price;
    } else if (priceListsByName[WcMapper.RETAIL]) {
      regularPrice = priceListsByName[WcMapper.RETAIL].price;
    } else if (priceListsByName[WcMapper.MAP]) {
      regularPrice = priceListsByName[WcMapper.MAP].price;
    } else if (priceListsByName[WcMapper.JOBBER]) {
      regularPrice = priceListsByName[WcMapper.JOBBER].price;
    }

    return regularPrice;
  }

  /**
   * Traverses the turn14 pricing object and determines the sale_price based
   * on available properties.
   *
   * @param {any} priceListsByName the object that contains pricing information.
   * @returns {string} the determined sale price. may return empty string if
   * a price cannot be determined.
   */
  turn14PricingToWcSalePrice(priceListsByName): string {
    let salePrice = '';

    if (priceListsByName[WcMapper.RETAIL] && priceListsByName[WcMapper.MAP]) {
      salePrice = priceListsByName[WcMapper.MAP].price;
    }

    return salePrice;
  }

  /**
   * Traverses the inventory object an determines if the item is regularly
   * carried, its current total stock, and if is available for backorder.
   *
   * @param {JSON} itemInventory the object that contains the inventory.
   * @returns {WcCreateProductDTO} a partially populated WcCreateProductDTO
   * object that only contains the inventory information.
   */
  turn14InventoryToWc(itemInventory: JSON): WcCreateProductDTO {
    const wcInventory = new WcCreateProductDTO();
    if (itemInventory) {
      const itemInventoryAttributes = itemInventory['attributes'];

      if (itemInventoryAttributes) {
        wcInventory.manage_stock = true;
        wcInventory.backorders = 'notify';
        wcInventory.stock_quantity = this.getTurn14StockQuantity(
          itemInventoryAttributes
        );
      }
    } else {
      // TODO: add special order attribute
    }

    return wcInventory;
  }

  /**
   * Looks at the different inventory sources, and determines the
   * combined total stock.
   *
   * @param {JSON} itemInventory the object that contains the inventory.
   * @returns {number} the total stock across sources.
   */
  private getTurn14StockQuantity(itemInventory: JSON): number {
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
