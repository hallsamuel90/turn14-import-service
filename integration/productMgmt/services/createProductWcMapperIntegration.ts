import { expect } from 'chai';
import { WcCategoriesCache } from '../../../src/productMgmt/caches/wcCategoriesCache';
import { CreateProductWcMapper } from '../../../src/productMgmt/services/createProductWcMapper';
import { WcRestApiProvider } from '../../../src/woocommerce/clients/wcRestApiProvider';
import { Turn14FakeData } from '../../../tests/productMgmt/services/turn14FakeData';

describe('CreateProductWcMapper Integration tests', () => {
  // can't get env variables to load. Should be replaced at some point with env
  const INT_TEST_URL = 'https://198.199.75.46';
  const INT_TEST_WCCLIENT = 'ck_894e4efda107f6b0b0ee0834dde813f0c8577d6c';
  const INT_TEST_WCSECRET = 'cs_20b5258134aee26a76c7c33fc1992956774516f8';

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
