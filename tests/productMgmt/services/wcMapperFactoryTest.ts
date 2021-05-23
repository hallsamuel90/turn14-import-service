import { expect } from 'chai';
import { WcMapperFactory } from '../../../src/productMgmt/services/wcMapperFactory';
import { WcMapperType } from '../../../src/productMgmt/services/wcMapperType';
import { WcMapperFactoryError } from '../../../src/woocommerce/errors/wcMapperFactoryError';
import { CreateProductWcMapper } from '../../../src/productMgmt/services/createProductWcMapper';
import { UpdateInventoryWcMapper } from '../../../src/productMgmt/services/updateInventoryWcMapper';
import { UpdatePricingWcMapper } from '../../../src/productMgmt/services/updatePricingWcMapper';
import { WcRestApiProvider } from '../../../src/woocommerce/clients/wcRestApiProvider';

describe('WcMapperFactory tests', () => {
  let instance: WcMapperFactory;

  let wcRestApiProvider: WcRestApiProvider;

  beforeEach(() => {
    wcRestApiProvider = new WcRestApiProvider();
    instance = new WcMapperFactory(wcRestApiProvider);
  });

  describe('#getWcMapper', () => {
    it('of type CREATE_PRODUCT should throw if additional parameters are not included', () => {
      expect(
        instance.getWcMapper.bind(instance, WcMapperType.CREATE_PRODUCT)
      ).to.throw(WcMapperFactoryError);
    });

    it('of invalid WcMapperType should throw', () => {
      expect(instance.getWcMapper.bind(instance, 5)).to.throw(
        WcMapperFactoryError
      );
    });

    it('should return an instance of CreateProductWcMapper if params are valid', () => {
      const fakeSiteUrl = 'fakeSiteUrl';
      const fakeKeys = {
        client: 'fakeClient',
        secret: 'fakeSecret',
      };

      const createProductWcMapper = instance.getWcMapper(
        WcMapperType.CREATE_PRODUCT,
        fakeSiteUrl,
        fakeKeys
      );

      expect(createProductWcMapper).to.be.instanceOf(CreateProductWcMapper);
    });

    it('should return an instance of UpdateInventoryWcMapper if params are valid', () => {
      const fakeSiteUrl = 'fakeSiteUrl';
      const fakeKeys = {
        client: 'fakeClient',
        secret: 'fakeSecret',
      };

      const updateInventoryWcMapper = instance.getWcMapper(
        WcMapperType.UPDATE_INVENTORY,
        fakeSiteUrl,
        fakeKeys
      );

      expect(updateInventoryWcMapper).to.be.instanceOf(UpdateInventoryWcMapper);
    });

    it('should return an instance of UpdatePricingWcMapper if params are valid', () => {
      const updateInventoryWcMapper = instance.getWcMapper(
        WcMapperType.UPDATE_PRICING
      );

      expect(updateInventoryWcMapper).to.be.instanceOf(UpdatePricingWcMapper);
    });
  });
});
