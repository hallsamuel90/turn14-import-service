import { EtlDto, ProductSyncJobData } from './etl';

export default class ProductJobMapper {
  public mapItemsInventory(
    responseData: JSON,
    etlDto: EtlDto
  ): ProductSyncJobData[] {
    const productData: ProductSyncJobData[] = [];

    const products = responseData?.['data'] || [];
    for (const product of products) {
      productData.push({
        jobId: etlDto.jobId,
        turn14Id: product?.['id'],
        itemInventory: product,
      });
    }

    return productData;
  }

  public mapItemsPricing(
    responseData: JSON,
    etlDto: EtlDto
  ): ProductSyncJobData[] {
    const productData: ProductSyncJobData[] = [];

    const products = responseData?.['data'] || [];
    for (const product of products) {
      productData.push({
        jobId: etlDto.jobId,
        turn14Id: product?.['id'],
        itemPricing: product,
      });
    }

    return productData;
  }

  public mapItemsData(
    responseData: JSON,
    etlDto: EtlDto
  ): ProductSyncJobData[] {
    const productData: ProductSyncJobData[] = [];

    const products = responseData?.['data'] || [];
    for (const product of products) {
      productData.push({
        jobId: etlDto.jobId,
        turn14Id: product?.['id'],
        itemData: product,
      });
    }

    return productData;
  }

  public mapItems(responseData: JSON, etlDto: EtlDto): ProductSyncJobData[] {
    const productData: ProductSyncJobData[] = [];

    const products = responseData?.['data'] || [];
    for (const product of products) {
      productData.push({
        jobId: etlDto.jobId,
        turn14Id: product?.['id'],
        item: product,
      });
    }

    return productData;
  }
}
