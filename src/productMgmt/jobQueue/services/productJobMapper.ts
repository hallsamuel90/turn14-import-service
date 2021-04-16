import { EtlDto, ProductSyncJobData } from './etl';

export default class ProductJobMapper {
  public mapJobData(responseData: JSON, etlDto: EtlDto): ProductSyncJobData[] {
    const productData: ProductSyncJobData[] = [];

    const products = responseData?.['data'] || [];
    for (const product of products) {
      productData.push({
        jobId: etlDto.jobId,
        turn14Id: product?.['id'],
        type: product?.['type'],
        data: product,
      });
    }

    return productData;
  }
}
