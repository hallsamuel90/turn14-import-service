import { anyOfClass, instance, mock, verify, when } from 'ts-mockito';
import chaiAsPromised from 'chai-as-promised';
import chai from 'chai';
import { ApiUser } from '../../../../src/apiUsers/models/apiUser';
import { ApiUserService } from '../../../../src/apiUsers/services/apiUserService';
import { PmgmtDTO } from '../../../../src/productMgmt/dtos/pmgmtDto';
import { DeleteProductsJob } from '../../../../src/productMgmt/jobQueue/models/deleteProductsJob';
import { ProductMgmtService } from '../../../../src/productMgmt/services/productMgmtService';
import { ProductSyncJobType } from '../../../../src/productMgmt/jobQueue/productSyncJobType';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('DeleteProductsJob tests', () => {
  let deleteProductsJob: DeleteProductsJob;

  const mockApiUserService = mock(ApiUserService);
  const mockPmgmtService = mock(ProductMgmtService);

  beforeEach(() => {
    deleteProductsJob = new DeleteProductsJob(
      instance(mockApiUserService),
      instance(mockPmgmtService),
      {
        userId: 'fakeUserId',
        brandId: 'fakeBrandId',
        jobType: ProductSyncJobType.REMOVE_BRAND,
        active: false,
      }
    );
  });

  describe('#run', async () => {
    it('should reject with Error if user cannot be found', async () => {
      when(mockApiUserService.retrieve('fakeUserId')).thenReject(
        Error('Could not retrieve apiusers')
      );

      expect(deleteProductsJob.run()).to.be.rejectedWith(Error);
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

      await deleteProductsJob.run();

      verify(
        mockPmgmtService.deleteBrandProducts(anyOfClass(PmgmtDTO))
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

      await deleteProductsJob.run();

      verify(mockApiUserService.removeBrand(fakeApiUser, 'fakeBrandId')).once();

      verify(mockPmgmtService.deleteBrandProducts(anyOfClass(PmgmtDTO))).once();
    });
  });
});
