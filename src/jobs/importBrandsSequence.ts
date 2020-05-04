import { Inject, Service } from 'typedi';
import { ImportBrandsDTO } from '../dtos/importBrandsDto';
import { ImportService } from '../services/import';

/**
 *
 */
@Service()
export class ImportBrandsSequence {
  @Inject()
  private readonly importService: ImportService;

  /**
   * Handler for the Import Brands Job
   *
   * @param {ImportBrandsDTO} importBrandsDTO
   */
  handler(importBrandsDTO: ImportBrandsDTO): void {
    console.info('🔨 Import Brands Sequence Job starting!');
    this.importService.import(importBrandsDTO);
  }
}
