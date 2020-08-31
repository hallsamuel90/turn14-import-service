import {
  mock,
  instance,
  verify,
  when,
  anything,
  anyOfClass,
  resetCalls,
} from 'ts-mockito';
import { ProductMgmtService } from '../../../src/productMgmt/services/productMgmtService';
import chaiAsPromised from 'chai-as-promised';
import chai from 'chai';
import { ApiUserService } from '../../../src/apiUsers/services/apiUserService';
import { ProductSyncJobWorker } from '../../../src/productMgmt/services/productSyncJobWorker';
import { ApiUser } from '../../../src/apiUsers/models/apiUser';
import { ActiveBrandDTO } from '../../../src/productMgmt/dtos/activeBrandDto';
import { ProductSyncJobError } from '../../../src/productMgmt/errors/productSyncJobError';
import { PmgmtDTO } from '../../../src/productMgmt/dtos/pmgmtDto';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('ProductSyncJobWorker tests', () => {
  let productSyncJobWorker: ProductSyncJobWorker;

  const mockApiUserService: ApiUserService = mock(ApiUserService);
  const mockProductMgmtService = mock(ProductMgmtService);

  beforeEach(() => {
    const mockApiUserServiceInstance = instance(mockApiUserService);
    const mockProductMgmtServiceInstance = instance(mockProductMgmtService);

    productSyncJobWorker = new ProductSyncJobWorker(
      mockApiUserServiceInstance,
      mockProductMgmtServiceInstance
    );
  });

  afterEach(() => {
    resetCalls(mockApiUserService);
    resetCalls(mockProductMgmtService);
  });

  describe('#importBrand', async () => {
    it('should reject with ProducSyncJobError if user cannot be found', async () => {
      when(mockApiUserService.retrieve('fakeUserId')).thenReject(
        Error('Could not retrieve apiusers')
      );

      const activeBrandDto = new ActiveBrandDTO(
        'fakeUserId',
        'fakeBrandId',
        true
      );

      expect(
        productSyncJobWorker.importBrand(activeBrandDto)
      ).to.be.rejectedWith(ProductSyncJobError);
    });

    it('should not import if the brand has already been imported', async () => {
      const fakeApiUser = ({
        userId: 'fakeUserId',
        siteUrl: 'fakeSiteUrl',
        turn14Keys: { client: 'fakeClient', secret: 'fakeSecret' },
        wcKeys: { client: 'fakeClient', secret: 'fakeSecret' },
        brandIds: ['fakeBrandId'],
      } as unknown) as ApiUser;

      when(mockApiUserService.retrieve('fakeUserId')).thenResolve(fakeApiUser);

      const activeBrandDto = new ActiveBrandDTO(
        'fakeUserId',
        'fakeBrandId',
        true
      );

      productSyncJobWorker.importBrand(activeBrandDto);

      verify(
        mockProductMgmtService.importBrandProducts(anyOfClass(PmgmtDTO))
      ).never();
    });

    it('should import if the brand is active and has not been already imported.', async () => {
      const fakeApiUser = ({
        userId: 'fakeUserId',
        siteUrl: 'fakeSiteUrl',
        turn14Keys: { client: 'fakeClient', secret: 'fakeSecret' },
        wcKeys: { client: 'fakeClient', secret: 'fakeSecret' },
        brandIds: [],
      } as unknown) as ApiUser;

      when(mockApiUserService.retrieve('fakeUserId')).thenResolve(fakeApiUser);

      const activeBrandDto = new ActiveBrandDTO(
        'fakeUserId',
        'fakeBrandId',
        true
      );

      await productSyncJobWorker.importBrand(activeBrandDto);

      verify(
        mockApiUserService.addBrand(fakeApiUser, activeBrandDto.brandId)
      ).once();

      verify(
        mockProductMgmtService.importBrandProducts(anyOfClass(PmgmtDTO))
      ).once();
    });
  });

  describe('#removeBrand', async () => {
    it('should reject with ProducSyncJobError if user cannot be found', async () => {
      when(mockApiUserService.retrieve('fakeUserId')).thenReject(
        Error('Could not retrieve apiusers')
      );

      const activeBrandDto = new ActiveBrandDTO(
        'fakeUserId',
        'fakeBrandId',
        true
      );

      expect(
        productSyncJobWorker.removeBrand(activeBrandDto)
      ).to.be.rejectedWith(ProductSyncJobError);
    });

    it('should not remove if the brand has not been previously imported', async () => {
      const fakeApiUser = ({
        userId: 'fakeUserId',
        siteUrl: 'fakeSiteUrl',
        turn14Keys: { client: 'fakeClient', secret: 'fakeSecret' },
        wcKeys: { client: 'fakeClient', secret: 'fakeSecret' },
        brandIds: [],
      } as unknown) as ApiUser;

      when(mockApiUserService.retrieve('fakeUserId')).thenResolve(fakeApiUser);

      const activeBrandDto = new ActiveBrandDTO(
        'fakeUserId',
        'fakeBrandId',
        false
      );

      productSyncJobWorker.removeBrand(activeBrandDto);

      verify(
        mockProductMgmtService.deleteBrandProducts(anyOfClass(PmgmtDTO))
      ).never();
    });

    it('should remove if the brand is set to not active and has already imported.', async () => {
      const fakeApiUser = ({
        userId: 'fakeUserId',
        siteUrl: 'fakeSiteUrl',
        turn14Keys: { client: 'fakeClient', secret: 'fakeSecret' },
        wcKeys: { client: 'fakeClient', secret: 'fakeSecret' },
        brandIds: ['fakeBrandId'],
      } as unknown) as ApiUser;

      when(mockApiUserService.retrieve('fakeUserId')).thenResolve(fakeApiUser);

      const activeBrandDto = new ActiveBrandDTO(
        'fakeUserId',
        'fakeBrandId',
        false
      );

      await productSyncJobWorker.removeBrand(activeBrandDto);

      verify(
        mockApiUserService.removeBrand(fakeApiUser, activeBrandDto.brandId)
      ).once();

      verify(
        mockProductMgmtService.deleteBrandProducts(anyOfClass(PmgmtDTO))
      ).once();
    });
  });

  describe('#updateAllInventory', async () => {
    it('should not call productMgmtService if there are not any users.', async () => {
      const emptyApiUsers: ApiUser[] = [];

      when(mockApiUserService.retrieveAll()).thenResolve(emptyApiUsers);

      await productSyncJobWorker.updateAllInventory();

      const anyApiUser = (anything as unknown) as ApiUser;

      verify(
        mockProductMgmtService.updateUserActiveInventory(anyApiUser)
      ).never();
    });

    it('should not call productMgmtService if the user does not have any active brands.', async () => {
      const fakeApiUser = ({ brandIds: [] } as unknown) as ApiUser;

      const apiUsers: ApiUser[] = [fakeApiUser];
      when(mockApiUserService.retrieveAll()).thenResolve(apiUsers);

      await productSyncJobWorker.updateAllInventory();

      verify(
        mockProductMgmtService.updateUserActiveInventory(fakeApiUser)
      ).never();
    });

    it("should not call productMgmtService if the user's active brands property is missing.", async () => {
      const fakeApiUser = ({} as unknown) as ApiUser;

      const apiUsers: ApiUser[] = [fakeApiUser];
      when(mockApiUserService.retrieveAll()).thenResolve(apiUsers);

      await productSyncJobWorker.updateAllInventory();

      verify(
        mockProductMgmtService.updateUserActiveInventory(fakeApiUser)
      ).never();
    });

    it('should call productMgmtService when a user has active brands to update.', async () => {
      const fakeApiUser = ({
        brandIds: ['fakeBrandId1', 'fakeBrandId2'],
      } as unknown) as ApiUser;

      const apiUsers: ApiUser[] = [fakeApiUser];
      when(mockApiUserService.retrieveAll()).thenResolve(apiUsers);

      await productSyncJobWorker.updateAllInventory();

      verify(
        mockProductMgmtService.updateUserActiveInventory(fakeApiUser)
      ).once();
    });
  });
});
