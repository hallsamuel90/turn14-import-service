import { Turn14RestApiProvider } from '../../../turn14/clients/turn14RestApiProvider';
import { Turn14ProductDTO } from '../../../turn14/dtos/turn14ProductDto';
import ProductSyncJobDataDao from '../repositories/productSyncJobDataDao';
import { EtlDto, ProductSyncJobData, Turn14DataType } from './etl';
import ProductJobMapper from './productJobMapper';

export default class Turn14DataExtractor {
  turn14RestApiProvider: Turn14RestApiProvider;
  productJobMapper: ProductJobMapper;
  productSyncJobDataDao: ProductSyncJobDataDao;

  constructor(
    turn14RestApiProvider: Turn14RestApiProvider,
    productSyncJobDataDao: ProductSyncJobDataDao,
    productJobMapper: ProductJobMapper = new ProductJobMapper()
  ) {
    this.turn14RestApiProvider = turn14RestApiProvider;
    this.productSyncJobDataDao = productSyncJobDataDao;
    this.productJobMapper = productJobMapper;
  }

  public async attemptItemExtraction(etlDto: EtlDto): Promise<void> {
    try {
      await this.extractItems(etlDto);
    } catch (e) {
      console.error(
        `failed to extract items for ${etlDto.brandId}, some products will be missing.`
      );
    }
  }

  public async attemptItemDataExtraction(etlDto: EtlDto): Promise<void> {
    try {
      await this.extractItemsData(etlDto);
    } catch (e) {
      console.error(
        `failed to extract items data for ${etlDto.brandId}, some products data may be missing.`
      );
    }
  }

  public async attemptItemPricingExtraction(etlDto: EtlDto): Promise<void> {
    try {
      await this.extractItemsPricing(etlDto);
    } catch (e) {
      console.error(
        `failed to extract items for ${etlDto.brandId}, some products prices will be missing.`
      );
    }
  }

  public async attemptItemInventoryExtraction(etlDto: EtlDto): Promise<void> {
    try {
      await this.extractItemsInventory(etlDto);
    } catch (e) {
      console.error(
        `failed to extract items for ${etlDto.brandId}, some products prices will be missing.`
      );
    }
  }

  public async getEnrichedTurn14Data(
    jobId: string,
    pageNumber: number
  ): Promise<Turn14ProductDTO[]> {
    const items = await this.productSyncJobDataDao.findAllByJobId(
      jobId,
      pageNumber
    );

    const enrichedProducts: Turn14ProductDTO[] = [];

    for (const item of items) {
      const enrichedProduct = {
        item: item.data,
      };

      const itemDataPricingInventory = await this.productSyncJobDataDao.findAllByTurn14Id(
        item.turn14Id
      );
      for (const i of itemDataPricingInventory) {
        if (i.type === Turn14DataType.ITEM_DATA) {
          enrichedProduct['itemData'] = i.data;
        } else if (i.type === Turn14DataType.ITEM_INVENTORY) {
          enrichedProduct['itemInventory'] = i.data;
        } else if (i.type === Turn14DataType.ITEM_PRICING) {
          enrichedProduct['itemPricing'] = i.data;
        }
      }

      enrichedProducts.push(enrichedProduct);
    }

    return enrichedProducts;
  }

  public async deleteExtractedData(jobId: string): Promise<void> {
    await this.productSyncJobDataDao.deleteAllByJobId(jobId);
  }

  private async extractItems(etlDto: EtlDto): Promise<void> {
    const turn14RestApi = await this.turn14RestApiProvider.getTurn14RestApi(
      etlDto.turn14Keys.client,
      etlDto.turn14Keys.secret
    );

    let i = 1;
    while (true) {
      const responseData = await turn14RestApi.getRequest(
        `items/brand/${etlDto.brandId}`,
        i
      );

      const productData: ProductSyncJobData[] = this.productJobMapper.mapJobData(
        responseData,
        etlDto
      );

      await this.productSyncJobDataDao.saveAll(productData);

      if (this.isDonePaging(i, responseData['meta'])) {
        break;
      }

      i++;
    }
  }

  private async extractItemsData(etlDto: EtlDto): Promise<void> {
    const turn14RestApi = await this.turn14RestApiProvider.getTurn14RestApi(
      etlDto.turn14Keys.client,
      etlDto.turn14Keys.secret
    );

    let i = 1;
    while (true) {
      const responseData = await turn14RestApi.getRequest(
        `items/data/brand/${etlDto.brandId}`,
        i
      );

      const productData: ProductSyncJobData[] = this.productJobMapper.mapJobData(
        responseData,
        etlDto
      );

      await this.productSyncJobDataDao.saveAll(productData);

      if (this.isDonePaging(i, responseData['meta'])) {
        break;
      }

      i++;
    }
  }

  private async extractItemsPricing(etlDto: EtlDto): Promise<void> {
    const turn14RestApi = await this.turn14RestApiProvider.getTurn14RestApi(
      etlDto.turn14Keys.client,
      etlDto.turn14Keys.secret
    );

    let i = 1;
    while (true) {
      const responseData = await turn14RestApi.getRequest(
        `pricing/brand/${etlDto.brandId}`,
        i
      );

      const productData: ProductSyncJobData[] = this.productJobMapper.mapJobData(
        responseData,
        etlDto
      );

      await this.productSyncJobDataDao.saveAll(productData);

      if (this.isDonePaging(i, responseData['meta'])) {
        break;
      }

      i++;
    }
  }

  private async extractItemsInventory(etlDto: EtlDto): Promise<void> {
    const turn14RestApi = await this.turn14RestApiProvider.getTurn14RestApi(
      etlDto.turn14Keys.client,
      etlDto.turn14Keys.secret
    );

    let i = 1;
    while (true) {
      const responseData = await turn14RestApi.getRequest(
        `inventory/brand/${etlDto.brandId}`,
        i
      );

      const productData: ProductSyncJobData[] = this.productJobMapper.mapJobData(
        responseData,
        etlDto
      );

      await this.productSyncJobDataDao.saveAll(productData);

      if (this.isDonePaging(i, responseData['meta'])) {
        break;
      }

      i++;
    }
  }

  private isDonePaging(i: number, meta: JSON): boolean {
    return i == meta['total_pages'];
  }
}
