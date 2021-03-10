/* eslint-disable @typescript-eslint/camelcase */
import _ from 'lodash';
import { Turn14ProductDTO } from '../../turn14/dtos/turn14ProductDto';
import { WcCategoryIdDTO } from '../../woocommerce/dtos/wcCategoryIdDto';
import { WcCreateProductDTO } from '../../woocommerce/dtos/wcCreateProductDto';
import { WcImageDTO } from '../../woocommerce/dtos/wcImageDto';
import { WcCategoriesCache } from '../caches/wcCategoriesCache';
import { WcMapper } from './wcMapper';

/**
 * WcMapper maps Turn14 attributes to create WooCommerce products.
 *
 * @author Sam Hall <hallsamuel90@gmail.com>
 */
export class CreateProductWcMapper extends WcMapper {
  private static DESCRIPTION = 'Market Description';
  private static SHORT_DESCRIPTION = 'Product Description - Short';
  private static FITMENT = 'Application Summary';
  private static PRIMARY_IMAGE = 'Photo - Primary';

  private categoriesCache: WcCategoriesCache;

  private static readonly IMAGE_SIZE_THRESHOLD = 3000;

  /**
   * Creates a new instance of WcMapper with the provided WcCategoriesCache.
   *
   * @param {WcCategoriesCache} categoriesCache categoriesCache helps map to
   * existing categories or create new if necessary.
   */
  constructor(categoriesCache: WcCategoriesCache) {
    super();

    this.categoriesCache = categoriesCache;
  }

  /**
   * Converts a list of Turn14ProductDTO into wcCreateProductDTOs.
   *
   * @param {Turn14ProductDTO[]} turn14Products the turn14 products to be converted.
   * @returns {Promise<WcCreateProductDTO[]>} converted woocommerce products.
   */
  public async turn14sToWcs(
    turn14Products: Turn14ProductDTO[]
  ): Promise<WcCreateProductDTO[]> {
    const wcProducts: WcCreateProductDTO[] = [];
    for (const turn14Product of turn14Products) {
      const wcProduct = await this.turn14ToWc(turn14Product);
      wcProducts.push(wcProduct);
    }

    return wcProducts;
  }

  /**
   * Converts a Turn14ProductDTO into a WcCreateProductDTO.
   *
   * @param {Turn14ProductDTO} turn14ProductDto the turn14 product to be
   * converted.
   * @returns {Promise<WcCreateProductDTO>} converted woocommerce product.
   */
  public async turn14ToWc(
    turn14ProductDto: Turn14ProductDTO
  ): Promise<WcCreateProductDTO> {
    const wcProduct = new WcCreateProductDTO();

    const itemAttributes = turn14ProductDto?.item?.['attributes'];
    if (itemAttributes) {
      const wcProductAttributes = this.turn14AttributesToWc(itemAttributes);
      wcProduct.name = wcProductAttributes.short_description;
      wcProduct.sku = wcProductAttributes.sku;
      wcProduct.brand_id = wcProductAttributes.brand_id;
      wcProduct.short_description = wcProductAttributes.short_description;
      wcProduct.dimensions.length = wcProductAttributes.dimensions.length;
      wcProduct.dimensions.width = wcProductAttributes.dimensions.width;
      wcProduct.dimensions.height = wcProductAttributes.dimensions.height;
      wcProduct.weight = wcProductAttributes.weight;
    }

    wcProduct.brands = await this.turn14BrandToWc(itemAttributes?.['brand']);
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
      wcProduct.regular_price = wcPricing.regularPrice;
      wcProduct.sale_price = wcPricing.salePrice;
    }

    const itemInventory = turn14ProductDto?.itemInventory;
    if (itemInventory) {
      const wcInventory = this.turn14InventoryToWc(itemInventory);
      wcProduct.manage_stock = wcInventory?.manage_stock;
      wcProduct.backorders = wcInventory?.backorders;
      wcProduct.backorders_allowed = wcInventory?.backorders_allowed;
      wcProduct.stock_quantity = wcInventory?.stock_quantity;
    }

    return wcProduct;
  }

  private turn14AttributesToWc(itemAttributes): WcCreateProductDTO {
    const wcProductAttributes = new WcCreateProductDTO();

    wcProductAttributes.name = itemAttributes?.product_name;
    wcProductAttributes.sku = itemAttributes?.mfr_part_number;
    wcProductAttributes.brand_id = itemAttributes?.brand_id;
    wcProductAttributes.short_description = itemAttributes?.part_description;
    wcProductAttributes.dimensions.length =
      itemAttributes?.dimensions[0]?.length;
    wcProductAttributes.dimensions.width = itemAttributes?.dimensions[0]?.width;
    wcProductAttributes.dimensions.height =
      itemAttributes?.dimensions[0]?.height;
    wcProductAttributes.weight = itemAttributes?.dimensions[0]?.weight;

    return wcProductAttributes;
  }

  private async turn14BrandToWc(brandName: string): Promise<number[]> {
    const brandId = await this.categoriesCache.getBrand(brandName);

    return [brandId];
  }

  private async turn14CategoriesToWc(
    itemAttributes: JSON
  ): Promise<WcCategoryIdDTO[]> {
    const wcCategoryDtos: WcCategoryIdDTO[] = [];
    const category = await this.categoriesCache.getCategory(
      itemAttributes?.['category']
    );

    if (category) {
      wcCategoryDtos.push(category);
    }

    const subCategory = await this.categoriesCache.getSubCategory(
      itemAttributes?.['subcategory'],
      itemAttributes?.['category']
    );

    if (subCategory) {
      wcCategoryDtos.push(subCategory);
    }

    return wcCategoryDtos;
  }

  private turn14DescriptionToWc(turn14Media: JSON): string {
    if (turn14Media['descriptions']) {
      const descriptions = _.keyBy(turn14Media['descriptions'], 'type');

      if (descriptions[CreateProductWcMapper.DESCRIPTION]) {
        return descriptions[CreateProductWcMapper.DESCRIPTION].description;
      } else if (descriptions[CreateProductWcMapper.SHORT_DESCRIPTION]) {
        return descriptions[CreateProductWcMapper.SHORT_DESCRIPTION]
          .description;
      }
    }

    return '';
  }

  private turn14FitmentToWc(turn14Media: JSON): string {
    if (turn14Media['descriptions']) {
      const descriptions = _.keyBy(turn14Media['descriptions'], 'type');

      if (descriptions[CreateProductWcMapper.FITMENT]) {
        return descriptions[CreateProductWcMapper.FITMENT].description;
      }
    }

    return '';
  }

  private turn14ImagesToWc(
    itemAttributes: JSON,
    turn14Media: JSON
  ): WcImageDTO[] {
    const wcImageDtos: WcImageDTO[] = [];

    if (this.hasValidPrimaryImage(turn14Media)) {
      wcImageDtos.push(new WcImageDTO(this.getPrimaryImageLink(turn14Media)));
    } else if (this.hasThumbnail(itemAttributes)) {
      wcImageDtos.push(new WcImageDTO(this.getThumbnailLink(itemAttributes)));
    }

    return wcImageDtos;
  }

  private turn14InventoryToWc(itemInventory: JSON): WcCreateProductDTO {
    const wcInventory = new WcCreateProductDTO();
    wcInventory.manage_stock = true;
    wcInventory.backorders = 'notify';
    wcInventory.backorders_allowed = true;

    const itemInventoryAttributes = itemInventory?.['attributes'];
    wcInventory.stock_quantity = this.calculateTurn14StockQuantity(
      itemInventoryAttributes
    );

    return wcInventory;
  }

  private getThumbnailLink(itemAttributes: JSON): string {
    return itemAttributes?.['thumbnail'];
  }

  private hasThumbnail(itemAttributes: JSON): boolean {
    return itemAttributes?.['thumbnail'] != null;
  }

  private getPrimaryImageLink(turn14Media: JSON): string {
    if (turn14Media['files']) {
      const files = _.keyBy(turn14Media['files'], 'media_content');
      if (files[CreateProductWcMapper.PRIMARY_IMAGE]) {
        const imageLinks: JSON[] =
          files[CreateProductWcMapper.PRIMARY_IMAGE]?.links;
        const lastLink = _.last(imageLinks);
        if (lastLink != null) {
          if (lastLink?.['height'] < 10000 && lastLink?.['width'] < 10000) {
            return lastLink['url'];
          }
        }
      }
    }

    return '';
  }

  private hasValidPrimaryImage(turn14Media: JSON): boolean {
    if (turn14Media['files']) {
      const files = _.keyBy(turn14Media['files'], 'media_content');
      if (files[CreateProductWcMapper.PRIMARY_IMAGE]) {
        const imageLinks: JSON[] =
          files[CreateProductWcMapper.PRIMARY_IMAGE]?.links;
        const lastLink = _.last(imageLinks);
        if (this.imageIsNotTooBig(lastLink)) {
          return true;
        }
      }
    }

    return false;
  }

  private imageIsNotTooBig(lastLink: JSON | undefined): boolean {
    const result =
      lastLink &&
      lastLink?.['height'] < CreateProductWcMapper.IMAGE_SIZE_THRESHOLD &&
      lastLink?.['width'] < CreateProductWcMapper.IMAGE_SIZE_THRESHOLD;

    if (result == undefined) {
      return false;
    }

    return result;
  }
}
