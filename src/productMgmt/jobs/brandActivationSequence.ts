import { Inject, Service } from 'typedi';
import { ProductMgmtService } from '../services/productMgmtService';
import { ActiveBrandDTO } from '../dtos/activeBrandDto';
import { ApiUserService } from '../../apiUsers/services/apiUserService';
import _ from 'lodash';
import { PmgmtDTO } from '../dtos/pmgmtDto';

/**
 * BrandActivationSequence.
 *
 * @author Sam Hall <hallsamuel90@gmail.com>
 */
@Service()
export class BrandActivationSequence {
  @Inject()
  private readonly apiUserService: ApiUserService;

  @Inject()
  private readonly productMgmtService: ProductMgmtService;

  /**
   * Handler for the product management operations.
   *
   * @param {ActiveBrandDTO} activeBrandDto the data transfer object that
   * contains the brand's active state.
   */
  async handler(activeBrandDto: ActiveBrandDTO): Promise<void> {
    console.info('🔨 Import Brands Sequence Job starting!');

    const apiUser = await this.apiUserService.retrieve(activeBrandDto.userId);
    const brandIds = apiUser.brandIds;

    const pmgmtDto = new PmgmtDTO(
      apiUser.siteUrl,
      apiUser.turn14Keys,
      apiUser.wcKeys,
      activeBrandDto.brandId
    );

    if (activeBrandDto.active) {
      if (!brandIds.includes(activeBrandDto.brandId)) {
        brandIds.push(activeBrandDto.brandId);
        apiUser.brandIds = brandIds;
        await this.apiUserService.update(apiUser.id, apiUser);

        this.productMgmtService.import(pmgmtDto);
      }
    } else {
      if (brandIds.includes(activeBrandDto.brandId)) {
        _.pull(brandIds, activeBrandDto.brandId);
        apiUser.brandIds = brandIds;
        await this.apiUserService.update(apiUser.id, apiUser);

        this.productMgmtService.delete(pmgmtDto);
      }
    }
  }
}
