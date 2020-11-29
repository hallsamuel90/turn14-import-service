import { anything, instance, mock, verify, when } from 'ts-mockito';
import { ApiUser } from '../../../../src/apiUsers/models/apiUser';
import { ApiUserService } from '../../../../src/apiUsers/services/apiUserService';
import { RemoveStaleProductsJob } from '../../../../src/productMgmt/jobQueue/models/removeStaleProductsJob';
import { ProductMgmtService } from '../../../../src/productMgmt/services/productMgmtService';

describe('RemoveStaleProductsProductsJob tests', () => {
  let removeStaleProductsJob: RemoveStaleProductsJob;

  const mockApiUserService = mock(ApiUserService);
  const mockPmgmtService = mock(ProductMgmtService);

  beforeEach(() => {
    removeStaleProductsJob = new RemoveStaleProductsJob(
      instance(mockApiUserService),
      instance(mockPmgmtService)
    );
  });

  describe('#run', async () => {
    it('should not call productMgmtService if there are not any users.', async () => {
      const emptyApiUsers: ApiUser[] = [];

      when(mockApiUserService.retrieveAll()).thenResolve(emptyApiUsers);

      await removeStaleProductsJob.run();

      const anyApiUser = (anything as unknown) as ApiUser;

      verify(mockPmgmtService.removeStaleProducts(anyApiUser)).never();
    });

    it('should not call productMgmtService if the user does not have any active brands.', async () => {
      const fakeApiUser = ({ brandIds: [] } as unknown) as ApiUser;

      const apiUsers: ApiUser[] = [fakeApiUser];
      when(mockApiUserService.retrieveAll()).thenResolve(apiUsers);

      await removeStaleProductsJob.run();

      verify(mockPmgmtService.removeStaleProducts(fakeApiUser)).never();
    });

    it("should not call productMgmtService if the user's active brands property is missing.", async () => {
      const fakeApiUser = ({} as unknown) as ApiUser;

      const apiUsers: ApiUser[] = [fakeApiUser];
      when(mockApiUserService.retrieveAll()).thenResolve(apiUsers);

      await removeStaleProductsJob.run();

      verify(mockPmgmtService.removeStaleProducts(fakeApiUser)).never();
    });

    it('should call productMgmtService when a user has active brands to update.', async () => {
      const fakeApiUser1 = ({
        brandIds: ['fakeBrandId1', 'fakeBrandId2'],
      } as unknown) as ApiUser;

      const fakeApiUser2 = ({
        brandIds: ['fakeBrandId1', 'fakeBrandId2'],
      } as unknown) as ApiUser;

      const apiUsers: ApiUser[] = [fakeApiUser1, fakeApiUser2];
      when(mockApiUserService.retrieveAll()).thenResolve(apiUsers);

      await removeStaleProductsJob.run();

      verify(mockPmgmtService.removeStaleProducts(fakeApiUser1)).once();
      verify(mockPmgmtService.removeStaleProducts(fakeApiUser2)).once();
    });
  });
});
