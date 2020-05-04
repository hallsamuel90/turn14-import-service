import { Inject, Service } from 'typedi';
import { Turn14RestApi } from '../clients/turn14RestApi';
import { BrandsPublisher } from '../publishers/brandsPublisher';
import { BrandMappingService } from '../turn14/services/brandMappingService';
import { ApiUserService } from './apiUser';

/**
 *
 */
@Service()
export class BrandsService {
  @Inject()
  private readonly apiUserService: ApiUserService;

  @Inject()
  private readonly brandMappingService: BrandMappingService;

  @Inject()
  private readonly brandsPublisherService: BrandsPublisher;

  /**
   *
   * @param {string} userId
   */
  async publish(userId: string): Promise<void> {
    const apiUser = await this.apiUserService.retrieve(userId);
    const turn14Client = new Turn14RestApi(
      apiUser.turn14Keys.client,
      apiUser.turn14Keys.secret
    );
    await turn14Client.authenticate();
    const turn14Brands = await turn14Client.fetchBrands();
    const brands = [];
    for (const turn14Brand of turn14Brands) {
      const brand = await this.brandMappingService.turn14ToBrand(
        userId,
        apiUser.siteUrl,
        turn14Brand
      );
      brands.push(brand);
    }
    await this.brandsPublisherService.queuePublishBrandsSequence(brands);
  }
}
