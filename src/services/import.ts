import { Inject, Service } from 'typedi';
import { Turn14RestApi } from '../clients/turn14RestApi';
import { WcRestApi } from '../clients/wcRestApi';
import { ImportBrandsDTO } from '../dtos/importBrandsDto';
import { WcBatchDTO } from '../woocommerce/dtos/wcBatchDto';
import { WcMappingService } from '../woocommerce/services/wcMappingService';

/**
 * Import Service imports products from Turn14 into WC store
 */
@Service()
export class ImportService {
  BATCH_SIZE = 5; // default 50

  @Inject()
  private readonly wcMappingService: WcMappingService;

  /**
   * Imports brand products into WC Store
   *
   * @param {ImportBrandsDto} importBrandsDto
   */
  async import(importBrandsDto: ImportBrandsDTO): Promise<void> {
    const turn14RestApi = new Turn14RestApi(
      importBrandsDto.turn14Client,
      importBrandsDto.turn14Secret
    );
    const wcRestApi = new WcRestApi(
      importBrandsDto.wcUrl,
      importBrandsDto.wcClient,
      importBrandsDto.wcSecret
    );
    await this.wcMappingService.initCache(wcRestApi);

    await turn14RestApi.authenticate();
    const wcProducts = new WcBatchDTO();
    for (const brandId of importBrandsDto.brandIds) {
      const turn14Products = await turn14RestApi.fetchAllBrandData(
        Number(brandId)
      );
      for (const turn14Product of turn14Products) {
        const wcProduct = await this.wcMappingService.turn14ToWc(turn14Product);
        wcProducts.create.push(wcProduct);
        if (wcProducts.totalSize() == this.BATCH_SIZE) {
          await wcRestApi.createProducts(wcProducts);
          wcProducts.create.length = 0;
          break; // TODO: remove
        }
      }
      break; // TODO: remove
    }
    console.info('👍 Import complete!');
  }
}
