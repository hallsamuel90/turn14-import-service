import { Inject, Service } from 'typedi';
import { ApiUser } from '../models/apiUser';
import { ApiUserService } from '../services/apiUserService';
import { ApiUserPublisher } from '../publishers/apiUserPublisher';

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
  private readonly apiUserPublisher: ApiUserPublisher;

  /**
   * Registers the apiUser (site) and sends an event to populate brand data in
   * the brands service.
   *
   * @param {ApiUser} apiUser the api user to be registered.
   */
  async handler(apiUser: ApiUser): Promise<void> {
    console.info('🔨 Registration Sequence Job starting!');
    await this.apiUserService.create(apiUser);

    this.apiUserPublisher.publishApiUser(apiUser);
  }
}
