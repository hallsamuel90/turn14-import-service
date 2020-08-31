/* eslint-disable @typescript-eslint/camelcase */

import { WcAttributeDTO } from './wcAttributeDto';
import { WcCategoryDTO } from './wcCategoryDto';
import { WcDimensionsDTO } from './wcDimensionsDto';
import { WcImageDTO } from './wcImageDto';
import { WcUpdateProductDTO } from './wcUpdateProductDto';

/**
 * WooCommerce Update Product Data Transfer Object TODO:
 */
export class WcUpdateFullProductDTO extends WcUpdateProductDTO {
  name: string;
  type: string;
  shortDescription: string;
  description: string;
  sku: string;
  regular_price: string;
  sale_price: string;
  categories: WcCategoryDTO[];
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
   * Initializes the instance to its default state.
   *
   * @param {string} id the id of the wc product.
   */
  constructor(id: string) {
    super(id);

    this.name = '';
    this.type = 'simple';
    this.shortDescription = '';
    this.description = '';
    this.sku = '';
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
