import { Inject, Service } from 'typedi';
import { PmgmtService } from '../services/pmgmt';
import { ActiveBrandDTO } from '../dtos/activeBrandDto';
import { ApiUserService } from '../services/apiUser';
import _ from 'lodash';
import { PmgmtDTO } from '../dtos/pmgmtDto';

/**
 *
 */
@Service()
export class BrandActivationSequence {
  @Inject()
  private readonly apiUserService: ApiUserService;

  @Inject()
  private readonly pmgmtService: PmgmtService;

  /**
   * Handler for the Import Brands Job
   *
   * @param activeBrandDto
   * @param {ActiveBrandDTO} activeBrandDTO
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
        this.pmgmtService.import(pmgmtDto);
      }
    } else {
      if (brandIds.includes(activeBrandDto.brandId)) {
        _.pull(brandIds, activeBrandDto.brandId);
        apiUser.brandIds = brandIds;

        await this.apiUserService.update(apiUser.id, apiUser);
        this.pmgmtService.delete(pmgmtDto);
      }
    }
  }
}
