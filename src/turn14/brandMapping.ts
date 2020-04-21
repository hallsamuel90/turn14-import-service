import BrandDTO from '../dtos/brandDto';
import { Turn14Brand } from './iTurn14Brand';

/**
 *
 */
export default class BrandMappingService {
  /**
   * @param {string} siteUrl
   * @param {Turn14Brand[]} turn14Brands
   */
  async turn14ToBrands(
    siteUrl: string,
    turn14Brands: Turn14Brand[]
  ): Promise<BrandDTO[]> {
    const brands: BrandDTO[] = [];
    for (const turn14Brand of turn14Brands) {
      //   brands.push(new BrandDTO(siteUrl, turn14Brand.));
    }
    return brands;
  }
}
