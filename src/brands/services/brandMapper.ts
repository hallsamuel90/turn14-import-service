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
