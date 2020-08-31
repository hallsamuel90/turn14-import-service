import { WcProductDTO } from './wcProductDto';

export abstract class WcUpdateProductDTO extends WcProductDTO {
  id: string;

  constructor(id: string) {
    super();

    this.id = id;
  }
}
