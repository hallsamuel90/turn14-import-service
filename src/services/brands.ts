import Container from 'typedi';
import Turn14RestApi from '../clients/turn14RestApi';
import { BrandsPublisher } from '../publishers/brandsPublisher';
import BrandMappingService from '../turn14/brandMapping';
import ApiUserService from './apiUser';

/**
 *
 */
export default class BrandsService {
  /**
   *
   * @param {string} siteUrl
   */
  async publish(siteUrl: string): Promise<void> {
    const apiUserService = Container.get(ApiUserService);
    const brandMappingService = Container.get(BrandMappingService);
    const brandsPublisherService = Container.get(BrandsPublisher);
    const apiUser = await apiUserService.retrieve(siteUrl);
    const turn14Client = new Turn14RestApi(
      apiUser.turn14Keys.client,
      apiUser.turn14Keys.secret
    );
    const turn14Brands = await turn14Client.fetchBrands();
    const brands = await brandMappingService.turn14ToBrands(
      siteUrl,
      turn14Brands
    );
    await brandsPublisherService.queuePublishBrandsSequence(brands);
  }
}
