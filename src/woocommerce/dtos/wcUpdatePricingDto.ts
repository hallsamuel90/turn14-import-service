/* eslint-disable @typescript-eslint/camelcase */
import { WcUpdateProductDTO } from './wcUpdateProductDto';

export class WcUpdatePricingDTO extends WcUpdateProductDTO {
  regular_price: string;
  sale_price: string;

  constructor(id: string, regularPrice: string, salePrice: string) {
    super(id);

    this.regular_price = regularPrice;
    this.sale_price = salePrice;
  }
}
