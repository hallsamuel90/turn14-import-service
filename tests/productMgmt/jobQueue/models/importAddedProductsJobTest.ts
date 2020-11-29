import { anything, instance, mock, verify, when } from 'ts-mockito';
import { ApiUser } from '../../../../src/apiUsers/models/apiUser';
import { ApiUserService } from '../../../../src/apiUsers/services/apiUserService';
import { ImportAddedProductsJob } from '../../../../src/productMgmt/jobQueue/models/importAddedProductsJob';
import { ProductMgmtService } from '../../../../src/productMgmt/services/productMgmtService';

describe('ImportAddedProductsJob tests', () => {
  let importAddedProductsJob: ImportAddedProductsJob;

  const mockApiUserService = mock(ApiUserService);
  const mockPmgmtService = mock(ProductMgmtService);

  beforeEach(() => {
    importAddedProductsJob = new ImportAddedProductsJob(
      instance(mockApiUserService),
      instance(mockPmgmtService)
    );
  });

  describe('#run', async () => {
    it('should not call productMgmtService if there are not any users.', async () => {
      const emptyApiUsers: ApiUser[] = [];

      when(mockApiUserService.retrieveAll()).thenResolve(emptyApiUsers);

      await importAddedProductsJob.run();

      const anyApiUser = (anything as unknown) as ApiUser;

      verify(mockPmgmtService.importNewProducts(anyApiUser)).never();
    });

    it('should not call productMgmtService if the user does not have any active brands.', async () => {
      const fakeApiUser = ({ brandIds: [] } as unknown) as ApiUser;

      const apiUsers: ApiUser[] = [fakeApiUser];
      when(mockApiUserService.retrieveAll()).thenResolve(apiUsers);

      await importAddedProductsJob.run();

      verify(mockPmgmtService.importNewProducts(fakeApiUser)).never();
    });

    it("should not call productMgmtService if the user's active brands property is missing.", async () => {
      const fakeApiUser = ({} as unknown) as ApiUser;

      const apiUsers: ApiUser[] = [fakeApiUser];
      when(mockApiUserService.retrieveAll()).thenResolve(apiUsers);

      await importAddedProductsJob.run();

      verify(mockPmgmtService.importNewProducts(fakeApiUser)).never();
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

      await importAddedProductsJob.run();

      verify(mockPmgmtService.importNewProducts(fakeApiUser1)).once();
      verify(mockPmgmtService.importNewProducts(fakeApiUser2)).once();
    });
  });
});
