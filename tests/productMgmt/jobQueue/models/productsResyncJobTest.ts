import { mock, instance, when, anything, verify } from 'ts-mockito';
import { ApiUser } from '../../../../src/apiUsers/models/apiUser';
import { ApiUserService } from '../../../../src/apiUsers/services/apiUserService';
import ProductsResyncJob from '../../../../src/productMgmt/jobQueue/models/productsResyncJob';
import { ProductMgmtService } from '../../../../src/productMgmt/services/productMgmtService';

describe('RemoveStaleProductsProductsJob tests', () => {
  let productsResyncJob: ProductsResyncJob;

  const mockApiUserService = mock(ApiUserService);
  const mockPmgmtService = mock(ProductMgmtService);

  beforeEach(() => {
    productsResyncJob = new ProductsResyncJob(
      instance(mockApiUserService),
      instance(mockPmgmtService)
    );
  });

  describe('#run', () => {
    it('should not call productMgmtService if there are not any users.', async () => {
      const emptyApiUsers: ApiUser[] = [];

      when(mockApiUserService.retrieveAll()).thenResolve(emptyApiUsers);

      await productsResyncJob.run();

      const anyApiUser = (anything as unknown) as ApiUser;

      verify(mockPmgmtService.resyncProducts(anyApiUser)).never();
    });

    it('should call productMgmtService for each user.', async () => {
      const dummyApiUser1 = ({} as unknown) as ApiUser;
      const dummyApiUser2 = ({} as unknown) as ApiUser;

      const dummyApiUsers: ApiUser[] = [dummyApiUser1, dummyApiUser2];

      when(mockApiUserService.retrieveAll()).thenResolve(dummyApiUsers);

      await productsResyncJob.run();

      verify(mockPmgmtService.resyncProducts(dummyApiUser1)).once();
      verify(mockPmgmtService.resyncProducts(dummyApiUser2)).once();
    });
  });
});
