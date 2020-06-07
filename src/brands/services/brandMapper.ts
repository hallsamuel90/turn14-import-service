import { Service } from 'typedi';
import { BrandDTO } from '../dtos/brandDto';
import { Turn14Brand } from '../../turn14/interfaces/turn14Brand';

/**
 * BrandMapper.
 *
 * @author Sam Hall <hallsamuel90@gmail.com>
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

  /**
   * Converts a Turn14Brand to a BrandDTO.
   *
   * @param {string} userId the unique id of the user.
   * @param {string} siteUrl the unique site url.
   * @param {Turn14Brand} turn14Brand the turn14 brand to be converted.
   * @returns {BrandDTO} the converted brand data transfer object.
   */
  turn14ToBrand(
    userId: string,
    siteUrl: string,
    turn14Brand: Turn14Brand
  ): BrandDTO {
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
