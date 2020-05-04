import { Service } from 'typedi';
import { ApiUser } from '../interfaces/iApiUser';
import ApiUserModel from '../models/apiUser';

/**
 *
 */
@Service()
export class ApiUserService {
  /**
   *
   * @param {ApiUser} apiUserDTO
   */
  async create(apiUserDTO: ApiUser): Promise<void> {
    let apiUser: ApiUser;
    try {
      apiUser = new ApiUserModel(apiUserDTO);
      await apiUser.save();
    } catch (e) {
      console.error('🔥 error: ' + e);
      throw e;
    }
  }

  /**
   *
   * @param {string} userId
   */
  async retrieve(userId: string): Promise<ApiUser> {
    let apiUser;
    try {
      apiUser = ApiUserModel.findOne({ userId: userId });
    } catch (e) {
      console.error('🔥 error: ' + e);
    }
    return apiUser;
  }
}
