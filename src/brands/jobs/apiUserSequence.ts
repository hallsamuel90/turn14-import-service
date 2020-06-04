import { Inject, Service } from 'typedi';
import { ApiUser } from '../../apiUsers/models/apiUser';
import { BrandsPublisher } from '../publishers/brandsPublisher';
import { BrandsService } from '../services/brandsService';

/**
 * ApiUserSequence.
 *
 * Job sequence for when a new ApiUser is recieved.
 *
 * @author Sam Hall <hallsamuel90@gmail.com>
 */
@Service()
export class ApiUserSequence {
  @Inject()
  private readonly brandsService: BrandsService;

  @Inject()
  private readonly brandsPublisher: BrandsPublisher;

  /**
   * The handler for when an apiUser is recieved uses the credentials to fetch
   * brand data from Turn14 and publish it in a common format.
   *
   * @param {ApiUser} apiUser the api user to get brands for.
   */
  async handler(apiUser: ApiUser): Promise<void> {
    const brands = await this.brandsService.retrieveBrands(apiUser);

    this.brandsPublisher.publishBrands(brands);
  }
}
