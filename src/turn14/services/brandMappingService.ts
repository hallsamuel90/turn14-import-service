import { Service } from 'typedi';
import { BrandDTO } from '../../dtos/brandDto';
import { Turn14Brand } from '../interfaces/iTurn14Brand';

/**
 *
 */
@Service()
export class BrandMappingService {
  /**
   * @param {string} userId
   * @param {string} siteUrl
   * @param {Turn14Brand} turn14Brand
   */
  async turn14ToBrand(
    userId: string,
    siteUrl: string,
    turn14Brand: Turn14Brand
  ): Promise<BrandDTO> {
    const date = new Date();
    return new BrandDTO(
      userId,
      siteUrl,
      turn14Brand.id,
      turn14Brand.attributes.name,
      false,
      date,
      date
    );
  }
}
