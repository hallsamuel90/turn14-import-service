/* eslint-disable @typescript-eslint/camelcase */

import { WcAttributeDTO } from './wcAttributeDto';
import { WcCategoryIdDTO } from './wcCategoryIdDto';
import { WcDimensionsDTO } from './wcDimensionsDto';
import { WcImageDTO } from './wcImageDto';
import { WcProductDTO } from './wcProductDto';

export class WcUpdateFullProductDTO extends WcProductDTO {
  id: number;
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
