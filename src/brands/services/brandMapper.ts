import { Service } from 'typedi';
import { BrandDTO } from '../dtos/brandDto';
import { Turn14Brand } from '../../turn14/interfaces/turn14Brand';

/**
 * BrandMapper.
 */
@Service()
export class BrandMapper {
  /**
   * Converts a list of turn14 brands into the brands service brand object.
   *
   * @param {string} userId the id of the user (foreign key).
   * @param {string} siteUrl the url of the user's site.
   * @param {Turn14Brand[]} turn14Brands the list of turn14 brands to be converted.
   * @returns {BrandDTO[]} a list of converted brands.
   */
  turn14ToBrands(
    userId: string,
    siteUrl: string,
    turn14Brands: Turn14Brand[]
  ): BrandDTO[] {
    const brands: BrandDTO[] = [];

    for (const turn14Brand of turn14Brands) {
      const brand = this.turn14ToBrand(userId, siteUrl, turn14Brand);
      brands.push(brand);
    }

    return brands;
  }

  private turn14ToBrand(
    userId: string,
    siteUrl: string,
    turn14Brand: Turn14Brand
  ): BrandDTO {
    const currentDate = new Date();

    return new BrandDTO(
      userId,
      siteUrl,
      turn14Brand.id,
      turn14Brand.attributes.name,
      false,
      currentDate,
      currentDate
    );
  }
}
