const Container = require('typedi').Container;
const ImportService = require('../services/import');

/**
 *
 */
class ImportBrandsSequenceJob {
  /**
   * Handler for the Import Brands Job
   *
   * @param {ImportBrandsDTO} importBrandsDTO
   */
  handler(importBrandsDTO) {
    console.info('🔨 Import Brands Sequence Job starting!');
    const importService = Container.get(ImportService);
    importService.import(importBrandsDTO);
  }
}


module.exports = ImportBrandsSequenceJob;
