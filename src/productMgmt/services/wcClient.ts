import { Keys } from '../../apiUsers/models/apiUser';
import { WcRestApi } from '../../woocommerce/clients/wcRestApi';
import { WcRestApiProvider } from '../../woocommerce/clients/wcRestApiProvider';
import { WcBatchDTO } from '../../woocommerce/dtos/wcBatchDto';
import { WcCreateProductDTO } from '../../woocommerce/dtos/wcCreateProductDto';
import { WcUpdateProductDTO } from '../../woocommerce/dtos/wcUpdateProductDto';

export class WcClient {
  private static readonly DEFAULT_BATCH_SIZE = 50;

  private readonly wcRestApiProvider: WcRestApiProvider;

  constructor(wcRestApiProvider: WcRestApiProvider) {
    this.wcRestApiProvider = wcRestApiProvider;
  }

  public async getWcProductsByBrand(
    siteUrl: string,
    wcApiKeys: Keys,
    activeBrand: string
  ): Promise<JSON[]> {
    const wcRestApi = this.wcRestApiProvider.getWcRestApi(
      siteUrl,
      wcApiKeys.client,
      wcApiKeys.secret
    );

    return await wcRestApi.fetchAllProductsByBrand(activeBrand);
  }

  public async postBatchCreateWcProducts(
    siteUrl: string,
    wcApiKeys: Keys,
    wcCreateProductDtos: WcCreateProductDTO[]
  ): Promise<void> {
    const wcRestApi = this.wcRestApiProvider.getWcRestApi(
      siteUrl,
      wcApiKeys.client,
      wcApiKeys.secret
    );

    const productBatch = new WcBatchDTO();
    for (const wcProduct of wcCreateProductDtos) {
      productBatch.create.push(wcProduct);

      if (this.batchIsFull(productBatch)) {
        await this.pushWcProducts(productBatch, wcRestApi);

        productBatch.reset();
      }
    }

    await this.pushRemainingProducts(productBatch, wcRestApi);
  }

  public async postBatchDeleteWcProducts(
    siteUrl: string,
    wcApiKeys: Keys,
    productIds: number[]
  ): Promise<void> {
    const wcRestApi = this.wcRestApiProvider.getWcRestApi(
      siteUrl,
      wcApiKeys.client,
      wcApiKeys.secret
    );

    const productBatch = new WcBatchDTO();
    for (const productId of productIds) {
      productBatch.delete.push(productId);

      if (this.batchIsFull(productBatch)) {
        await this.pushWcProducts(productBatch, wcRestApi);

        productBatch.reset();
      }
    }

    await this.pushRemainingProducts(productBatch, wcRestApi);
  }

  public async postBatchUpdateWcProducts(
    siteUrl: string,
    wcApiKeys: Keys,
    wcUpdateProductDtos: WcUpdateProductDTO[]
  ): Promise<void> {
    const wcRestApi = this.wcRestApiProvider.getWcRestApi(
      siteUrl,
      wcApiKeys.client,
      wcApiKeys.secret
    );

    const productBatch = new WcBatchDTO();
    for (const wcUpdateProductDto of wcUpdateProductDtos) {
      productBatch.update.push(wcUpdateProductDto);

      if (this.batchIsFull(productBatch)) {
        await this.pushWcProducts(productBatch, wcRestApi);

        productBatch.reset();
      }
    }

    await this.pushRemainingProducts(productBatch, wcRestApi);
  }

  private batchIsFull(wcProductBatch: WcBatchDTO): boolean {
    return wcProductBatch.totalSize() == WcClient.DEFAULT_BATCH_SIZE;
  }

  private async pushWcProducts(
    wcProducts: WcBatchDTO,
    wcRestApi: WcRestApi
  ): Promise<void> {
    try {
      await wcRestApi.batchModifyProducts(wcProducts);
    } catch (e) {
      console.error('🔥 ' + e);
    }
  }

  private async pushRemainingProducts(
    wcProducts: WcBatchDTO,
    wcRestApi: WcRestApi
  ): Promise<void> {
    if (wcProducts.totalSize() > 0) {
      await this.pushWcProducts(wcProducts, wcRestApi);
    }
  }
}
