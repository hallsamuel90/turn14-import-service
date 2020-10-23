import { Service } from 'typedi';
import { Keys } from '../../apiUsers/models/apiUser';
import { Turn14RestApi } from '../../turn14/clients/turn14RestApi';
import { Turn14RestApiProvider } from '../../turn14/clients/turn14RestApiProvider';
import { Turn14ProductDTO } from '../../turn14/dtos/turn14ProductDto';

/**
 * Turn14Client for retrieving data from Turn14.
 */
@Service()
export class Turn14Client {
  private readonly turn14RestApiProvider: Turn14RestApiProvider;

  constructor(turn14RestApiProvider: Turn14RestApiProvider) {
    this.turn14RestApiProvider = turn14RestApiProvider;
  }

  /**
   * Gets all Turn14 Products for a given brand.
   *
   * @param {Keys} turn14Keys the api keys needed to access Turn14.
   * @param {string} brandId the id of the brand to retrieve products.
   * @returns {Promise<Turn14ProductDTO[]>} a list of Turn14 products.
   */
  public async getTurn14ProductsByBrand(
    turn14Keys: Keys,
    brandId: string
  ): Promise<Turn14ProductDTO[]> {
    const turn14RestApi: Turn14RestApi = this.turn14RestApiProvider.getTurn14RestApi(
      turn14Keys.client,
      turn14Keys.secret
    );

    await turn14RestApi.authenticate();

    const turn14Products = await turn14RestApi.fetchAllBrandData(
      Number(brandId)
    );

    return turn14Products;
  }
}
