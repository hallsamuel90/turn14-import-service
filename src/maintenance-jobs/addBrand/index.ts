import Container from 'typedi';
import { ApiUserService } from '../../apiUsers/services/apiUserService';

const userId = '607cf9fffba48b001856150c'; // change here
const brandId = '42'; // change here
const apiUserService = Container.get(ApiUserService);

export default async (): Promise<void> => {
  try {
    const user = await apiUserService.retrieve(userId);
    console.info(`Adding brandId: ${brandId} to user's managed brands...`);

    await apiUserService.addBrand(user, brandId);
  } catch (e) {
    console.error(`something went wrong adding the brand... ${e}`);
  }

  console.info('add brand job completed successfully!');
};
