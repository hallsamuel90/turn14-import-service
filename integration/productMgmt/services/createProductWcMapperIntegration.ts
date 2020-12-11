import { expect } from 'chai';
import { WcCategoriesCache } from '../../../src/productMgmt/caches/wcCategoriesCache';
import { CreateProductWcMapper } from '../../../src/productMgmt/services/createProductWcMapper';
import { WcRestApiProvider } from '../../../src/woocommerce/clients/wcRestApiProvider';
import { Turn14FakeData } from '../../../tests/productMgmt/services/turn14FakeData';

describe('CreateProductWcMapper Integration tests', () => {
  // can't get env variables to load. Should be replaced at some point with env
  const INT_TEST_URL = '';
  const INT_TEST_WCCLIENT = '';
  const INT_TEST_WCSECRET = '';

  let createProductWcMapper: CreateProductWcMapper;

  const wcRestApiProvider = new WcRestApiProvider();

  beforeEach(() => {
    const wcRestApi = wcRestApiProvider.getWcRestApi(
      INT_TEST_URL,
      INT_TEST_WCCLIENT,
      INT_TEST_WCSECRET
    );
    const wcCache = new WcCategoriesCache(wcRestApi);

    createProductWcMapper = new CreateProductWcMapper(wcCache);
  });

  describe('#turn14ToWc', () => {
    it('should not fail when communicating with an active WooCommerce site', async () => {
      const fakeTurn14ProductDto = Turn14FakeData.getFakeTurn14ProductDTO();

      const wcCreateProductDto = await createProductWcMapper.turn14ToWc(
        fakeTurn14ProductDto
      );

      expect(wcCreateProductDto.attributes).to.not.be.null;
    });
  });
});
