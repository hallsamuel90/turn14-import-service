import { Service } from 'typedi';
import { ApiUser } from '../../apiUsers/models/apiUser';
import { Turn14RestApiProvider } from '../../turn14/clients/turn14RestApiProvider';
import { Turn14Brand } from '../../turn14/interfaces/turn14Brand';
import { BrandDTO } from '../dtos/brandDto';
import { BrandsPublisher } from '../publishers/brandsPublisher';
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
  private readonly brandsPublisherService: BrandsPublisher;

  /**
   * Creates a new instance witht the provided parameters.
   *
   * @param {Turn14RestApiProvider} turn14RestApiProvider the turn14 rest api factory for communciation
   * with the turn14 api.
   * @param {BrandMapper} brandMapper the brand mapping service that converts the
   * turn14 brands into the brands service objects.
   * @param {BrandsPublisher} brandsPublisherService the publisher that sends the data to the
   * brands service.
   */
  constructor(
    turn14RestApiProvider: Turn14RestApiProvider,
    brandMapper: BrandMapper,
    brandsPublisherService: BrandsPublisher
  ) {
    this.turn14RestApiProvider = turn14RestApiProvider;
    this.brandMapper = brandMapper;
    this.brandsPublisherService = brandsPublisherService;
  }

  /**
   * Publishes a list of brands to the brands service.
   *
   * @param {ApiUser} apiUser the api user used for identification.
   */
  async publishBrands(apiUser: ApiUser): Promise<void> {
    const turn14Brands = await this.fetchBrands(apiUser);

    const brands = this.convertBrands(
      apiUser.userId,
      apiUser.siteUrl,
      turn14Brands
    );

    // TODO: should emit event here to remove dependency.
    await this.brandsPublisherService.queuePublishBrandsSequence(brands);
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

  /**
   * Converts a list of turn14 brands into the brands service brand object.
   * // TODO: this should be a public method in the brandMappingService.
   *
   * @param {string} userId the id of the user (foreign key).
   * @param {string} siteUrl the url of the user's site.
   * @param {Turn14Brand[]} turn14Brands the list of turn14 brands to be converted.
   * @returns {BrandDTO[]} a list of converted brands.
   */
  private convertBrands(
    userId: string,
    siteUrl: string,
    turn14Brands: Turn14Brand[]
  ): BrandDTO[] {
    const brands: BrandDTO[] = [];

    for (const turn14Brand of turn14Brands) {
      const brand = this.brandMapper.turn14ToBrand(
        userId,
        siteUrl,
        turn14Brand
      );
      brands.push(brand);
    }

    return brands;
  }
}
