import { expect } from 'chai';
import { WcCategoriesCache } from '../../../src/productMgmt/caches/wcCategoriesCache';
import { CreateProductWcMapper } from '../../../src/productMgmt/services/createProductWcMapper';
import { WcRestApiProvider } from '../../../src/woocommerce/clients/wcRestApiProvider';
import { Turn14FakeData } from '../../../tests/productMgmt/services/turn14FakeData';
import path from 'path';

const envPath = path.resolve('.env');
console.log(envPath);
require('dotenv').config({ path: envPath });

const INT_URL: string = process.env.INT_URL ?? '';
const INT_WC_CLIENT: string = process.env.INT_WC_CLIENT ?? '';
const INT_WC_SECRET: string = process.env.INT_WC_SECRET ?? '';

describe.skip('CreateProductWcMapper Integration tests', () => {
  let createProductWcMapper: CreateProductWcMapper;

  const wcRestApiProvider = new WcRestApiProvider();

  beforeEach(() => {
    const wcRestApi = wcRestApiProvider.getWcRestApi(
      INT_URL,
      INT_WC_CLIENT,
      INT_WC_SECRET
    );
    const wcCache = new WcCategoriesCache(wcRestApi);

    createProductWcMapper = new CreateProductWcMapper(wcCache);
  });

  describe.skip('#turn14ToWc', () => {
    it('should not fail when communicating with an active WooCommerce site', async () => {
      const fakeTurn14ProductDto = Turn14FakeData.getFakeTurn14ProductDTO();

      const wcCreateProductDto = await createProductWcMapper.turn14ToWc(
        fakeTurn14ProductDto
      );

      expect(wcCreateProductDto.attributes).to.not.be.null;
    });
  });
});
