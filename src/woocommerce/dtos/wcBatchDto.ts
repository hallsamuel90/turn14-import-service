import { WcCreateProductDTO } from './wcCreateProductDto';
import { WcUpdateProductDTO } from './wcUpdateProductDto';

/**
 * WooCommerce Batch Operations Data Transfer Object
 */
export class WcBatchDTO {
  create: WcCreateProductDTO[];
  update: WcUpdateProductDTO[];
  delete: number[];

  constructor() {
    this.create = [];
    this.update = [];
    this.delete = [];
  }

  /**
   * Determines the total number of objects.
   *
   * @returns {number} total number of objects
   */
  public totalSize(): number {
    return this.create.length + this.update.length + this.delete.length;
  }

  /**
   * Resets the batch of products.
   */
  public reset(): void {
    this.create = [];
    this.update = [];
    this.delete = [];
  }
}
