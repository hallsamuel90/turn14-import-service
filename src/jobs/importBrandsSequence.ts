import { Container } from 'typedi';
import ImportBrandsDTO from '../dtos/importBrandsDto';
import ImportService from '../services/import';

/**
 *
 */
export default class ImportBrandsSequenceJob {
  /**
   * Handler for the Import Brands Job
   *
   * @param {ImportBrandsDTO} importBrandsDTO
   */
  handler(importBrandsDTO: ImportBrandsDTO): void {
    console.info('🔨 Import Brands Sequence Job starting!');
    const importService = Container.get(ImportService);
    importService.import(importBrandsDTO);
  }
}
