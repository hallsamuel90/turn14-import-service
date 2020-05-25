import { Service } from 'typedi';
import { ApiUser } from '../models/apiUser';
import ApiUserModel from '../models/apiUserModel';

/**
 * ApiUsersService.
 *
 * @author Sam Hall <hallsamuel90@gmail.com>
 */
@Service()
export class ApiUserService {
  /**
   * Creates a new ApiUser.
   *
   * @param {ApiUser} apiUserDTO the api user to be created.
   */
  async create(apiUserDTO: ApiUser): Promise<void> {
    let apiUser: ApiUser;
    try {
      apiUser = new ApiUserModel(apiUserDTO);
      await apiUser.save();
    } catch (e) {
      console.error('🔥 ' + e);

      throw new Error('Could not create user ' + apiUserDTO);
    }
  }

  /**
   * Retrieves an ApiUser.
   *
   * @param {string} userId the unique id to identify the user.
   * @returns {ApiUser} the retrieved api user.
   */
  async retrieve(userId: string): Promise<ApiUser> {
    try {
      return ApiUserModel.findOne({ userId: userId });
    } catch (e) {
      console.error('🔥 ' + e);
      throw new Error('Could not retrieve api user with userId: ' + userId);
    }
  }

  /**
   * Updates an ApiUser.
   *
   * @param {string} id the generated id of the api user.
   * @param {ApiUser} apiUser the updated api user object.
   * @returns {Promise<ApiUser>} the updated brand.
   */
  async update(id: string, apiUser: ApiUser): Promise<ApiUser> {
    try {
      // returns brand as it was before update
      const updatedApiUser = await ApiUserModel.findOneAndUpdate(
        { _id: id },
        apiUser
      );

      return updatedApiUser;
    } catch (e) {
      console.error('🔥 ' + e);

      throw new Error('Could not update api user with id: ' + id);
    }
  }
}
