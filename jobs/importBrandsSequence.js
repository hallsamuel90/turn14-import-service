const Container = require('typedi').Container;
const ImportService = require('../service/import');

/**
 *
 */
class ImportBrandsSequenceJob {
  /**
   * Handler for the Import Brands Job
   *
   * @param {*} importBrandsDTO
   */
  handler(importBrandsDTO) {
    console.info('🔨 Import Brands Sequence Job starting!');
    const importService = Container.get(ImportService);
    importService.import(importBrandsDTO);
  }
}


module.exports = ImportBrandsSequenceJob;
