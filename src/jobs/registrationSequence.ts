import { Container } from 'typedi';
import { ApiUser } from '../interfaces/iApiUser';
import ApiUserService from '../services/apiUser';
import BrandsService from '../services/brands';

/**
 *
 */
export class RegistrationSequence {
  /**
   * Handler for the Registration Job. Register the site
   * and populates brand data in the brands service
   *
   * @param {ApiUser} apiUser
   */
  async handler(apiUser: ApiUser): Promise<void> {
    console.info('🔨 Registration Sequence Job starting!');
    const apiUserService = Container.get(ApiUserService);
    await apiUserService.create(apiUser);
    // populate brands on registration
    const brandsService = Container.get(BrandsService);
    await brandsService.publish(apiUser.siteUrl);
  }
}
