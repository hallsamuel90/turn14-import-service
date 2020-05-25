import { Inject, Service } from 'typedi';
import { ApiUser } from '../models/apiUser';
import { ApiUserService } from '../services/apiUserService';
import { BrandsService } from '../../brands/services/brandsService';

/**
 * RegistrationSequence.
 *
 * Job sequence for registering a new ApiUser.
 *
 * @author Sam Hall <hallsamuel90@gmail.com>
 * @see ApiUser
 */
@Service()
export class RegistrationSequence {
  @Inject()
  private readonly apiUserService: ApiUserService;

  @Inject()
  private readonly brandsService: BrandsService;

  /**
   * Registers the apiUser (site) and sends an event to populate brand data in
   * the brands service.
   *
   * @param {ApiUser} apiUser the api user to be registered.
   */
  async handler(apiUser: ApiUser): Promise<void> {
    console.info('🔨 Registration Sequence Job starting!');
    await this.apiUserService.create(apiUser);

    // TODO: emit event that a new user has registered. The function call below
    // should subscribe to that event and publish the apiUser (full object) to
    // the brands service. -SH

    await this.brandsService.publishBrands(apiUser);
  }
}
