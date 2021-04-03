import { Turn14RestApiProvider } from '../../../turn14/clients/turn14RestApiProvider';
import ProductSyncJobDataRepository from '../repositories/productSyncJobDataRepository';
import { EtlDto, ProductSyncJobData } from './etl';
import ProductJobMapper from './productJobMapper';

export default class Turn14DataExtractor {
  turn14RestApiProvider: Turn14RestApiProvider;
  productJobMapper: ProductJobMapper;
  productSyncJobDataRepository: ProductSyncJobDataRepository;

  constructor(
    turn14RestApiProvider: Turn14RestApiProvider,
    productSyncJobDataRepository: ProductSyncJobDataRepository,
    productJobMapper: ProductJobMapper = new ProductJobMapper()
  ) {
    this.turn14RestApiProvider = turn14RestApiProvider;
    this.productSyncJobDataRepository = productSyncJobDataRepository;
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

      const productData: ProductSyncJobData[] = this.productJobMapper.mapItems(
        responseData,
        etlDto
      );

      await this.productSyncJobDataRepository.saveAll(productData);

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

      const productData: ProductSyncJobData[] = this.productJobMapper.mapItemsData(
        responseData,
        etlDto
      );

      await this.productSyncJobDataRepository.batchUpdate(productData);

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

      const productData: ProductSyncJobData[] = this.productJobMapper.mapItemsPricing(
        responseData,
        etlDto
      );

      await this.productSyncJobDataRepository.batchUpdate(productData);

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

      const productData: ProductSyncJobData[] = this.productJobMapper.mapItemsInventory(
        responseData,
        etlDto
      );

      await this.productSyncJobDataRepository.batchUpdate(productData);

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
