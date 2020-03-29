const Turn14RestApi = require('../clients/turn14RestApi');
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
    await turn14RestApi.authenticate();
    const wcProducts = [];
    for (const brandId of importBrandsDto.brandIds) {
      const turn14Products = await turn14RestApi.fetchAllBrandData(brandId);
      for (const turn14Product of turn14Products) {
        const wcProduct = this.wcMappingService.turn14ToWc(turn14Product);
        wcProducts.push(wcProduct);
        if (wcProducts.length == 50) {
          // batch ship to woocommerce api
          wcProducts.length = 0;
        }
      }
    }
    console.info('👍 Import complete!');
  }
}
module.exports = ImportService;
