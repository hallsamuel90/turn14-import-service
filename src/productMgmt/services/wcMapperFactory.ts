import { WcCategoriesCache } from '../caches/wcCategoriesCache';
import { CreateProductWcMapper } from './createProductWcMapper';
import { UpdateInventoryWcMapper } from './updateInventoryWcMapper';
import { WcMapper } from './wcMapper';
import { WcMapperType } from './wcMapperType';
import { Keys } from '../../apiUsers/models/apiUser';
import { WcMapperFactoryError } from '../../woocommerce/errors/wcMapperFactoryError';
import { UpdatePricingWcMapper } from './updatePricingWcMapper';
import { Service } from 'typedi';
import { WcRestApiProvider } from '../../woocommerce/clients/wcRestApiProvider';
import { ResyncProductsWcMapper } from './resyncProductWcMapper';

/**
 * WcMapperProvider.
 *
 * @author Sam Hall <hallsamuel90@gmail.com>
 */
@Service()
export class WcMapperFactory {
  private readonly wcRestApiProvider: WcRestApiProvider;

  constructor(wcRestApiProvider: WcRestApiProvider) {
    this.wcRestApiProvider = wcRestApiProvider;
  }

  public getWcMapper(wcMapperType: WcMapperType): WcMapper;

  public getWcMapper(
    wcMapperType: WcMapperType,
    wcSiteUrl: string,
    wcKeys: Keys
  ): WcMapper;

  public getWcMapper(
    wcMapperType: WcMapperType,
    wcSiteUrl?: string,
    wcKeys?: Keys
  ): WcMapper {
    switch (wcMapperType) {
      case WcMapperType.CREATE_PRODUCT:
        if (wcSiteUrl != undefined && wcKeys != undefined) {
          return this.buildCreateProductWcMapper(wcSiteUrl, wcKeys);
        }

        throw new WcMapperFactoryError(
          'wcSiteUrl and wcKeys cannot be undefined.'
        );
      case WcMapperType.RESYNC_PRODUCTS:
        if (wcSiteUrl != undefined && wcKeys != undefined) {
          return this.buildResyncProductsWcMapper(wcSiteUrl, wcKeys);
        }

        throw new WcMapperFactoryError(
          'wcSiteUrl and wcKeys cannot be undefined.'
        );
      case WcMapperType.UPDATE_INVENTORY:
        return new UpdateInventoryWcMapper();
      case WcMapperType.UPDATE_PRICING:
        return new UpdatePricingWcMapper();
      default:
        throw this.invalidFactoryType(wcMapperType);
    }
  }

  private buildCreateProductWcMapper(
    wcSiteUrl: string,
    wcKeys: Keys
  ): CreateProductWcMapper {
    const wcRestClient = this.wcRestApiProvider.getWcRestApi(
      wcSiteUrl,
      wcKeys.client,
      wcKeys.secret
    );
    const categoriesCache = new WcCategoriesCache(wcRestClient);

    return new CreateProductWcMapper(categoriesCache);
  }

  private buildResyncProductsWcMapper(
    wcSiteUrl: string,
    wcKeys: Keys
  ): WcMapper {
    const wcRestClient = this.wcRestApiProvider.getWcRestApi(
      wcSiteUrl,
      wcKeys.client,
      wcKeys.secret
    );
    const categoriesCache = new WcCategoriesCache(wcRestClient);

    return new ResyncProductsWcMapper(categoriesCache);
  }

  private invalidFactoryType(wcMapperType: WcMapperType): Error {
    return new WcMapperFactoryError(
      `WcMapperType ${wcMapperType} is invalid for this method.`
    );
  }
}
