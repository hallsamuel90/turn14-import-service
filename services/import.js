const Turn14RestApi = require('../clients/turn14RestApi');
const WcRestApi = require('../clients/wcRestApi');
const WcBatchDTO = require('../dtos/wcBatchDTO');
const Container = require('typedi').Container;
const WcMappingService = require('../services/wcMapping');

/**
 * Import Service imports products from Turn14 into WC store
 */
class ImportService {
  /**
   * Default constructor for ImportService, sets an
   * instance of the WcMappingService
   */
  constructor() {
    this.wcMappingService = Container.get(WcMappingService);
    this.BATCH_SIZE = 1;
  }

  /**
   * Imports brand products into WC Store
   *
   * @param {ImportBrandsDto} importBrandsDto
   */
  async import(importBrandsDto) {
    const turn14RestApi = new Turn14RestApi(
      importBrandsDto.turn14Client,
      importBrandsDto.turn14Secret
    );
    const wcRestApi = new WcRestApi(
      importBrandsDto.wcUrl,
      importBrandsDto.wcClient,
      importBrandsDto.wcSecret
    );

    await turn14RestApi.authenticate();
    const wcProducts = new WcBatchDTO();
    for (const brandId of importBrandsDto.brandIds) {
      const turn14Products = await turn14RestApi.fetchAllBrandData(brandId);
      for (const turn14Product of turn14Products) {
        const wcProduct = this.wcMappingService.turn14ToWc(turn14Product);
        wcProducts.create.push(wcProduct);
        if (wcProducts.totalSize() == this.BATCH_SIZE) {
          await wcRestApi.createProducts(wcProducts.toJSON());
          wcProducts.length = 0;
        }
        break; // TODO: remove
      }
      break; // TODO: remove
    }
    console.info('👍 Import complete!');
  }
}
module.exports = ImportService;
