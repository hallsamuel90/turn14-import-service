const Turn14RestApi = require('../clients/turn14RestApi');
/**
 * Import Service imports products from Turn14 into WC store
 */
class ImportService {
  /**
   * Imports brand products into WC Store
   *
   * @param {ImportBrandsDto} importBrandsDto
   */
  async import(importBrandsDto) {
    const turn14RestApi = new Turn14RestApi(importBrandsDto.turn14Client,
        importBrandsDto.turn14Secret);

    await turn14RestApi.authenticate();
    for (const brandId of importBrandsDto.brandIds) {
      const brandItems = await turn14RestApi.fetchAllBrandItems(brandId);
      const brandItemsData =
        await turn14RestApi.fetchBrandItemsData(brandId, 1);
      const brandPricing = await turn14RestApi.fetchBrandPricing(brandId, 1);
      const brandInventory= await turn14RestApi.fetchBrandInventory(brandId, 1);
    };


    // loop brands, import items, media, pricing, inventory

    // every 50 items, send to WC, clear list
    console.info('👍 Import complete!');
  }
}

module.exports = ImportService;
