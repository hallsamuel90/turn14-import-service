import { WcProductDTO } from './wcProductDto';
import { WcUpdateProductDTO } from './wcUpdateProductDTO';

/**
 * WooCommerce Batch Operations Data Transfer Object
 */
export class WcBatchDTO {
  create: WcProductDTO[];
  update: WcUpdateProductDTO[];
  delete: number[];
  /**
   *
   */
  constructor() {
    this.create = [];
    this.update = [];
    this.delete = [];
  }

  /**
   * Determines the total number of objects
   *
   * @return {number} total number of objects
   */
  totalSize(): number {
    return this.create.length + this.update.length + this.delete.length;
  }
}
