import { Service } from 'typedi';
import { ApiUser } from '../../apiUsers/models/apiUser';
import { Turn14Client } from '../../turn14/clients/turn14Client';
import { BrandDTO } from '../dtos/brandDto';
import { BrandMapper } from './brandMapper';

/**
 * BrandsService retrieves brands from Turn14 and coverts them into the appropriate
 * format.
 */
@Service()
export class BrandsService {
  private readonly turn14Client: Turn14Client;
  private readonly brandMapper: BrandMapper;

  constructor(turn14Client: Turn14Client, brandMapper: BrandMapper) {
    this.turn14Client = turn14Client;
    this.brandMapper = brandMapper;
  }

  /**
   * Retrieves a list of brands from Turn14 and converts them into the
   * appropriate format.
   *
   * @param {ApiUser} apiUser the api user used for identification.
   * @returns {Promise<BrandDTO[]>} a list of brands for the user.
   */
  public async retrieveBrands(apiUser: ApiUser): Promise<BrandDTO[]> {
    const turn14Brands = await this.turn14Client.getBrands(apiUser.turn14Keys);

    return this.brandMapper.turn14ToBrands(
      apiUser.userId,
      apiUser.siteUrl,
      turn14Brands
    );
  }
}
