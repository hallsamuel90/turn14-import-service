import { anyOfClass, instance, mock, verify, when } from 'ts-mockito';
import chaiAsPromised from 'chai-as-promised';
import chai from 'chai';
import { ApiUser } from '../../../../src/apiUsers/models/apiUser';
import { ApiUserService } from '../../../../src/apiUsers/services/apiUserService';
import { ActiveBrandDTO } from '../../../../src/productMgmt/dtos/activeBrandDto';
import { PmgmtDTO } from '../../../../src/productMgmt/dtos/pmgmtDto';
import { ImportProductsJob } from '../../../../src/productMgmt/jobQueue/models/importProductsJob';
import { ProductMgmtService } from '../../../../src/productMgmt/services/productMgmtService';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('ImportProductsJob tests', () => {
  let importProductsJob: ImportProductsJob;

  const mockApiUserService = mock(ApiUserService);
  const mockPmgmtService = mock(ProductMgmtService);
  const mockActiveBrandDto = mock(ActiveBrandDTO);

  beforeEach(() => {
    importProductsJob = new ImportProductsJob(
      instance(mockApiUserService),
      instance(mockPmgmtService),
      instance(mockActiveBrandDto)
    );
  });

  describe('#run', async () => {
    it('should reject with Error if user cannot be found', async () => {
      when(mockApiUserService.retrieve('fakeUserId')).thenReject(
        Error('Could not retrieve apiusers')
      );

      when(mockActiveBrandDto.getUserId()).thenReturn('fakeUserId');
      when(mockActiveBrandDto.getBrandId()).thenReturn('fakeBrandId');
      when(mockActiveBrandDto.isActive()).thenReturn(true);

      expect(importProductsJob.run()).to.be.rejectedWith(Error);
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

      when(mockActiveBrandDto.getUserId()).thenReturn('fakeUserId');
      when(mockActiveBrandDto.getBrandId()).thenReturn('fakeBrandId');
      when(mockActiveBrandDto.isActive()).thenReturn(true);

      await importProductsJob.run();

      verify(
        mockPmgmtService.importBrandProducts(anyOfClass(PmgmtDTO))
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

      when(mockActiveBrandDto.getUserId()).thenReturn('fakeUserId');
      when(mockActiveBrandDto.getBrandId()).thenReturn('fakeBrandId');
      when(mockActiveBrandDto.isActive()).thenReturn(true);

      await importProductsJob.run();

      verify(mockApiUserService.addBrand(fakeApiUser, 'fakeBrandId')).once();

      verify(mockPmgmtService.importBrandProducts(anyOfClass(PmgmtDTO))).once();
    });
  });
});
