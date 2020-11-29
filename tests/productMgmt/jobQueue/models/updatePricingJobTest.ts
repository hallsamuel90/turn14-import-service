import { anything, instance, mock, verify, when } from 'ts-mockito';
import { ApiUser } from '../../../../src/apiUsers/models/apiUser';
import { ApiUserService } from '../../../../src/apiUsers/services/apiUserService';
import { ProductMgmtService } from '../../../../src/productMgmt/services/productMgmtService';
import { UpdatePricingJob } from '../../../../src/productMgmt/jobQueue/models/updatePricingJob';

describe('UpdatePricingJob tests', () => {
  let updatePricingJob: UpdatePricingJob;

  const mockApiUserService = mock(ApiUserService);
  const mockPmgmtService = mock(ProductMgmtService);

  beforeEach(() => {
    updatePricingJob = new UpdatePricingJob(
      instance(mockApiUserService),
      instance(mockPmgmtService)
    );
  });

  describe('#run', async () => {
    it('should not call productMgmtService if there are not any users.', async () => {
      const emptyApiUsers: ApiUser[] = [];

      when(mockApiUserService.retrieveAll()).thenResolve(emptyApiUsers);

      await updatePricingJob.run();

      const anyApiUser = (anything as unknown) as ApiUser;

      verify(mockPmgmtService.updateUserActivePricing(anyApiUser)).never();
    });

    it('should not call productMgmtService if the user does not have any active brands.', async () => {
      const fakeApiUser = ({ brandIds: [] } as unknown) as ApiUser;

      const apiUsers: ApiUser[] = [fakeApiUser];
      when(mockApiUserService.retrieveAll()).thenResolve(apiUsers);

      await updatePricingJob.run();

      verify(mockPmgmtService.updateUserActivePricing(fakeApiUser)).never();
    });

    it("should not call productMgmtService if the user's active brands property is missing.", async () => {
      const fakeApiUser = ({} as unknown) as ApiUser;

      const apiUsers: ApiUser[] = [fakeApiUser];
      when(mockApiUserService.retrieveAll()).thenResolve(apiUsers);

      await updatePricingJob.run();

      verify(mockPmgmtService.updateUserActivePricing(fakeApiUser)).never();
    });

    it('should call productMgmtService when a user has active brands to update.', async () => {
      const fakeApiUser = ({
        brandIds: ['fakeBrandId1', 'fakeBrandId2'],
      } as unknown) as ApiUser;

      const apiUsers: ApiUser[] = [fakeApiUser];
      when(mockApiUserService.retrieveAll()).thenResolve(apiUsers);

      await updatePricingJob.run();

      verify(mockPmgmtService.updateUserActivePricing(fakeApiUser)).once();
    });
  });
});
