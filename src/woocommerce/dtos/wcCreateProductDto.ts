/* eslint-disable @typescript-eslint/camelcase */

import { WcAttributeDTO } from './wcAttributeDto';
import { WcCategoryIdDTO } from './wcCategoryIdDto';
import { WcDimensionsDTO } from './wcDimensionsDto';
import { WcImageDTO } from './wcImageDto';
import { WcProductDTO } from './wcProductDto';

/**
 * WooCommerceCreateProductDTO.
 *
 * Data transfer object used for woocommerce product creation. Data attributes
 * are in camel_case as that is the format expected by woocommerce.
 *
 * @author Sam Hall <hallsamuel90@gmail.com>
 */
export class WcCreateProductDTO extends WcProductDTO {
  name: string;
  type: string;
  short_description: string;
  description: string;
  sku: string;
  brand_id: number;
  brands: number[];
  ymm_fitment: string;
  regular_price: string;
  sale_price: string;
  categories: WcCategoryIdDTO[];
  images: WcImageDTO[];
  weight: string;
  dimensions: WcDimensionsDTO;
  manage_stock: boolean;
  stock_quantity: number;
  stock_status: string;
  backorders: string;
  backorders_allowed: boolean;
  attributes: WcAttributeDTO[];

  /**
   * Creates a new instance and sets the initial state.
   */
  constructor() {
    super();

    this.name = '';
    this.type = 'simple';
    this.short_description = '';
    this.description = '';
    this.sku = '';
    this.brands = [];
    this.regular_price = '';
    this.sale_price = '';
    this.categories = [];
    this.images = [];
    this.weight = '';
    this.dimensions = new WcDimensionsDTO();
    this.manage_stock = false;
    this.stock_quantity = 0;
    this.stock_status = 'instock';
    this.backorders = 'no';
    this.backorders_allowed = false;
    this.attributes = [];
  }
}
