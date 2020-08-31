import { WcCategoriesCache } from '../caches/wcCategoriesCache';
import { CreateProductWcMapper } from './createProductWcMapper';
import { UpdateInventoryWcMapper } from './updateInventoryWcMapper';
import { WcMapper } from './wcMapper';
import { WcMapperType } from './wcMapperType';
import { Keys } from '../../apiUsers/models/apiUser';
import { WcRestApi } from '../../woocommerce/clients/wcRestApi';
import { WcMapperFactoryError } from '../../woocommerce/errors/wcMapperFactoryError';

/**
 * WcMapperProvider.
 *
 * @author Sam Hall <hallsamuel90@gmail.com>
 */
export class WcMapperFactory {
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
      case WcMapperType.UPDATE_INVENTORY:
        return new UpdateInventoryWcMapper();
      default:
        throw this.invalidFactoryType(wcMapperType);
    }
  }

  private buildCreateProductWcMapper(
    wcSiteUrl: string,
    wcKeys: Keys
  ): CreateProductWcMapper {
    const wcRestClient = new WcRestApi(wcSiteUrl, wcKeys.client, wcKeys.secret);
    const categoriesCache = new WcCategoriesCache(wcRestClient);

    return new CreateProductWcMapper(categoriesCache);
  }

  private invalidFactoryType(wcMapperType: WcMapperType): Error {
    return new WcMapperFactoryError(
      `WcMapperType ${wcMapperType} is invalid for this method.`
    );
  }
}
