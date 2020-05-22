import { Inject, Service } from 'typedi';
import { Turn14RestApi } from '../clients/turn14RestApi';
import { WcRestApi } from '../clients/wcRestApi';
import { PmgmtDTO } from '../dtos/pmgmtDto';
import { WcBatchDTO } from '../woocommerce/dtos/wcBatchDto';
import { WcMappingService } from '../woocommerce/services/wcMappingService';

/**
 * TODO:
 */
@Service()
export class PmgmtService {
  BATCH_SIZE = 5; // default 50

  @Inject()
  private readonly wcMappingService: WcMappingService;

  /**
   * Imports brand products into WC Store
   *
   * @param {PmgmtDTO} pmgmtDto
   */
  async import(pmgmtDto: PmgmtDTO): Promise<void> {
    const turn14RestApi = new Turn14RestApi(
      pmgmtDto.turn14Keys.client,
      pmgmtDto.turn14Keys.secret
    );
    const wcRestApi = new WcRestApi(
      pmgmtDto.siteUrl,
      pmgmtDto.wcKeys.client,
      pmgmtDto.wcKeys.secret
    );
    await this.wcMappingService.initCache(wcRestApi);

    await turn14RestApi.authenticate();
    const wcProducts = new WcBatchDTO();
    const turn14Products = await turn14RestApi.fetchAllBrandData(
      Number(pmgmtDto.brandId)
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
    console.info('👍 Import complete!');
  }

  /**
   *
   * @param {PmgmtDTO} pmgmtDto
   */
  delete(pmgmtDto: PmgmtDTO): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
