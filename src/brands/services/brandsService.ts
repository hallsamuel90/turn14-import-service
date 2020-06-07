import { Service } from 'typedi';
import { ApiUser } from '../../apiUsers/models/apiUser';
import { Turn14RestApiProvider } from '../../turn14/clients/turn14RestApiProvider';
import { Turn14Brand } from '../../turn14/interfaces/turn14Brand';
import { BrandDTO } from '../dtos/brandDto';
import { BrandMapper } from './brandMapper';

/**
 * BrandsService.
 *
 * Facade for fetching turn14 brands, converting them, and publishing to the
 * brands service.
 *
 * @author Sam Hall <hallsamuel90@gmail.com>
 */
@Service()
export class BrandsService {
  private readonly turn14RestApiProvider: Turn14RestApiProvider;
  private readonly brandMapper: BrandMapper;

  /**
   * Creates a new instance witht the provided parameters.
   *
   * @param {Turn14RestApiProvider} turn14RestApiProvider the turn14 rest api factory for communciation
   * with the turn14 api.
   * @param {BrandMapper} brandMapper the brand mapping service that converts the
   * turn14 brands into the brands service objects.
   */
  constructor(
    turn14RestApiProvider: Turn14RestApiProvider,
    brandMapper: BrandMapper
  ) {
    this.turn14RestApiProvider = turn14RestApiProvider;
    this.brandMapper = brandMapper;
  }

  /**
   * Retrieves a list of brands from Turn14 and converts them into the
   * appropriate format.
   *
   * @param {ApiUser} apiUser the api user used for identification.
   */
  async retrieveBrands(apiUser: ApiUser): Promise<BrandDTO[]> {
    const turn14Brands = await this.fetchBrands(apiUser);

    return this.brandMapper.turn14ToBrands(
      apiUser.userId,
      apiUser.siteUrl,
      turn14Brands
    );
  }

  /**
   * Fetch the brands from the turn14 api.
   *
   * @param {ApiUser} apiUser the api user which contains the api keys.
   * @returns {Turn14Brand[]} a list of turn14 brands.
   */
  private async fetchBrands(apiUser: ApiUser): Promise<Turn14Brand[]> {
    const turn14Client = this.turn14RestApiProvider.getTurn14RestApi(
      apiUser.turn14Keys.client,
      apiUser.turn14Keys.secret
    );

    await turn14Client.authenticate();

    return await turn14Client.fetchBrands();
  }
}
