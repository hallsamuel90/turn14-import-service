import { expect } from 'chai';
import path from 'path';
import { ApiUser } from '../../../src/apiUsers/models/apiUser';
import { BrandMapper } from '../../../src/brands/services/brandMapper';
import { BrandsService } from '../../../src/brands/services/brandsService';
import { Turn14Client } from '../../../src/turn14/clients/turn14Client';
import { Turn14RestApiProvider } from '../../../src/turn14/clients/turn14RestApiProvider';

const envPath = path.resolve('.env');
console.log(envPath);
require('dotenv').config({ path: envPath });

const { INT_T14_CLIENT, INT_T14_SECRET } = process.env;

describe('BrandsService Integration Tests', () => {
  describe.skip('retrieveBrands should', () => {
    it('return the list of brands', async () => {
      const turn14RestApiProvider: Turn14RestApiProvider = new Turn14RestApiProvider();
      const turn14Client: Turn14Client = new Turn14Client(
        turn14RestApiProvider
      );
      const brandsService: BrandsService = new BrandsService(
        turn14Client,
        new BrandMapper()
      );

      const apiUser = ({
        userId: 'fakeUserId',
        siteUrl: 'fakeSiteUrl',
        turn14Keys: {
          client: INT_T14_CLIENT as string,
          secret: INT_T14_SECRET as string,
        },
        wcKeys: {
          client: 'fakeClient',
          secret: 'fakeSecret',
        },
        brandIds: [],
      } as unknown) as ApiUser;

      const brands = await brandsService.retrieveBrands(apiUser);

      expect(brands).to.not.be.empty;
    });
  });
});
