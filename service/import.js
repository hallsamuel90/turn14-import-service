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
    // validate credentials, if invalid throw up, error

    // loop brands, import items, media, pricing, inventory

    // every 50 items, send to WC
    console.info('👍 Import complete!');
  }
}

module.exports = ImportService;
