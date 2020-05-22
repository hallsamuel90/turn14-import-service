import { Inject, Service } from 'typedi';
import { ApiUser } from '../interfaces/iApiUser';
import { ApiUserService } from '../services/apiUser';
import { BrandsService } from '../services/brands';

/**
 *
 */
@Service()
export class RegistrationSequence {
  @Inject()
  private readonly apiUserService: ApiUserService;

  @Inject()
  private readonly brandsService: BrandsService;

  /**
   * Handler for the Registration Job. Register the site
   * and populates brand data in the brands service
   *
   * @param {ApiUser} apiUser
   */
  async handler(apiUser: ApiUser): Promise<void> {
    console.info('🔨 Registration Sequence Job starting!');
    await this.apiUserService.create(apiUser);
    // populate brands on registration
    await this.brandsService.publish(apiUser.userId);
  }
}
