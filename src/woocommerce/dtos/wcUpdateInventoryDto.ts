/* eslint-disable @typescript-eslint/camelcase */
import { WcUpdateProductDTO } from './wcUpdateProductDto';

export class WcUpdateInventoryDTO extends WcUpdateProductDTO {
  stock_quantity: number;

  constructor(id: string, stock_quantity: number) {
    super(id);

    this.stock_quantity = stock_quantity;
  }
}
