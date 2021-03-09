import { expect } from 'chai';
import path from 'path';
import { capture, spy } from 'ts-mockito';
import { PmgmtDTO } from '../../../src/productMgmt/dtos/pmgmtDto';
import { PreProcessingFilter } from '../../../src/productMgmt/services/preProcessingFilter';
import { ProductMgmtService } from '../../../src/productMgmt/services/productMgmtService';
import { WcMapperFactory } from '../../../src/productMgmt/services/wcMapperFactory';
import { Turn14Client } from '../../../src/turn14/clients/turn14Client';
import { Turn14RestApiProvider } from '../../../src/turn14/clients/turn14RestApiProvider';
import { WcClient } from '../../../src/woocommerce/clients/wcClient';
import { WcRestApiProvider } from '../../../src/woocommerce/clients/wcRestApiProvider';

const envPath = path.resolve('.env');
console.log(envPath);
require('dotenv').config({ path: envPath });

const INT_URL: string = process.env.INT_URL ?? '';
const INT_WC_CLIENT: string = process.env.INT_WC_CLIENT ?? '';
const INT_WC_SECRET: string = process.env.INT_WC_SECRET ?? '';
const INT_T14_CLIENT: string = process.env.INT_T14_CLIENT ?? '';
const INT_T14_SECRET: string = process.env.INT_T14_SECRET ?? '';

describe('ProductMgmtService Integration tests', () => {
  let pmgmtService: ProductMgmtService;

  let turn14Client: Turn14Client;
  let wcClient: WcClient;
  let wcMapperFactory: WcMapperFactory;
  let preprocessingFilter: PreProcessingFilter;

  beforeEach(() => {
    turn14Client = new Turn14Client(new Turn14RestApiProvider());

    const wcRestApiProvider = new WcRestApiProvider();
    wcClient = new WcClient(wcRestApiProvider);
    wcMapperFactory = new WcMapperFactory(wcRestApiProvider);
    preprocessingFilter = new PreProcessingFilter();

    pmgmtService = new ProductMgmtService(
      turn14Client,
      wcClient,
      wcMapperFactory,
      preprocessingFilter
    );
  });

  describe('#importBrandProducts', () => {
    it('should not fail when importing products', async () => {
      const pmgmtDto = new PmgmtDTO(
        INT_URL,
        { client: INT_T14_CLIENT, secret: INT_T14_SECRET },
        { client: INT_WC_CLIENT, secret: INT_WC_SECRET },
        '293'
      );

      const spiedWcClient = spy(wcClient);

      await pmgmtService.importBrandProducts(pmgmtDto);

      const [urlArg, keysArg, productsArg] = capture(
        spiedWcClient.postBatchCreateWcProducts
      ).last();

      expect(urlArg).to.eq(INT_URL);
      expect(keysArg.client).to.eq(INT_WC_CLIENT);
      expect(keysArg.secret).to.eq(INT_WC_SECRET);
      expect(productsArg).to.not.be.null; // just testing plumbing
    });
  });
});
