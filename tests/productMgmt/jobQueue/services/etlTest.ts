// /* eslint-disable @typescript-eslint/camelcase */
// import { expect } from 'chai';
// import { capture, instance, mock, verify, when } from 'ts-mockito';
// import ETL from '../../../../src/productMgmt/jobQueue/models/etl';
// import ProductSyncJobDataRepository from '../../../../src/productMgmt/jobQueue/repositories/productSyncJobDataRepository';
// import { Turn14RestApi } from '../../../../src/turn14/clients/turn14RestApi';
// import { Turn14RestApiProvider } from '../../../../src/turn14/clients/turn14RestApiProvider';

// const fakeEtlDto = {
//   jobId: 'fakeJobId',
//   siteUrl: 'http://someSite.com',
//   brandId: 'someBrandId',
//   turn14Keys: {
//     client: 'fakeClient',
//     secret: 'fakeSecret',
//   },
//   wcKeys: {
//     client: 'fakeClient',
//     secret: 'fakeSecret',
//   },
// };

// describe('ETL tests', () => {
//   let etl: ETL;

//   let mockTurn14RestApiProvider = mock(Turn14RestApiProvider);
//   let mockProductSyncJobDataRepository = mock(ProductSyncJobDataRepository);

//   beforeEach(() => {
//     mockTurn14RestApiProvider = mock(Turn14RestApiProvider);
//     mockProductSyncJobDataRepository = mock(ProductSyncJobDataRepository);

//     etl = new ETL(
//       instance(mockTurn14RestApiProvider),
//       instance(mockProductSyncJobDataRepository)
//     );
//   });

//   describe('extract should', () => {
//     it('save the retrieved turn14 items by jobId', async () => {
//       const mockTurn14RestApi = mock(Turn14RestApi);
//       const mockTurn14RestApiInstance = instance(mockTurn14RestApi);

//       when(
//         mockTurn14RestApi.getRequest(`items/brand/${fakeEtlDto.brandId}`, 1)
//       ).thenResolve(({
//         data: [
//           {
//             id: 'fakeId',
//             type: 'Item',
//           },
//         ],
//         meta: {
//           total_pages: 1,
//         },
//       } as unknown) as JSON);

//       when(
//         mockTurn14RestApiProvider.getTurn14RestApi(
//           fakeEtlDto.turn14Keys.client,
//           fakeEtlDto.turn14Keys.secret
//         )
//       ).thenResolve(mockTurn14RestApiInstance);

//       await etl.extract(fakeEtlDto);

//       verify(
//         mockTurn14RestApi.getRequest(`items/brand/${fakeEtlDto.brandId}`, 1)
//       ).called();

//       const [saveArgs] = capture(
//         mockProductSyncJobDataRepository.saveAll
//       ).last();

//       expect(saveArgs[0].jobId).to.eq('fakeJobId');
//       expect(saveArgs[0].turn14Id).to.eq('fakeId');
//       expect(saveArgs[0].item?.['type']).to.eq('Item');
//     });

//     it('update the saved turn14 items with itemsData', async () => {
//       const mockTurn14RestApi = mock(Turn14RestApi);
//       const mockTurn14RestApiInstance = instance(mockTurn14RestApi);

//       when(
//         mockTurn14RestApi.getRequest(
//           `items/data/brand/${fakeEtlDto.brandId}`,
//           1
//         )
//       ).thenResolve(({
//         data: [
//           {
//             id: 'fakeId',
//             type: 'ProductData',
//           },
//         ],
//         meta: {
//           total_pages: 1,
//         },
//       } as unknown) as JSON);

//       when(
//         mockTurn14RestApiProvider.getTurn14RestApi(
//           fakeEtlDto.turn14Keys.client,
//           fakeEtlDto.turn14Keys.secret
//         )
//       ).thenResolve(mockTurn14RestApiInstance);

//       await etl.extract(fakeEtlDto);

//       verify(
//         mockTurn14RestApi.getRequest(
//           `items/data/brand/${fakeEtlDto.brandId}`,
//           1
//         )
//       ).called();

//       const [updateArgs] = capture(
//         mockProductSyncJobDataRepository.batchUpdate
//       ).last();
//       expect(updateArgs[0].jobId).to.eq('fakeJobId');
//       expect(updateArgs[0].itemData?.['type']).to.eq('ProductData');
//     });

//     it('update the saved turn14 items with itemsPricing', async () => {
//       const mockTurn14RestApi = mock(Turn14RestApi);
//       const mockTurn14RestApiInstance = instance(mockTurn14RestApi);

//       when(
//         mockTurn14RestApi.getRequest(`pricing/brand/${fakeEtlDto.brandId}`, 1)
//       ).thenResolve(({
//         data: [
//           {
//             id: 'fakeId',
//             type: 'PricingItem',
//           },
//         ],
//         meta: {
//           total_pages: 1,
//         },
//       } as unknown) as JSON);

//       when(
//         mockTurn14RestApiProvider.getTurn14RestApi(
//           fakeEtlDto.turn14Keys.client,
//           fakeEtlDto.turn14Keys.secret
//         )
//       ).thenResolve(mockTurn14RestApiInstance);

//       await etl.extract(fakeEtlDto);

//       verify(
//         mockTurn14RestApi.getRequest(
//           `items/data/brand/${fakeEtlDto.brandId}`,
//           1
//         )
//       ).called();

//       const [updateArgs] = capture(
//         mockProductSyncJobDataRepository.batchUpdate
//       ).last();
//       expect(updateArgs[0].jobId).to.eq('fakeJobId');
//       expect(updateArgs[0].itemData?.['type']).to.eq('PricingItem');
//     });

//     // test('update the saved turn14 items with items inventory', async () => {});
//     // test('update the saved turn14 items with items pricing', async () => {});
//   });
// });
