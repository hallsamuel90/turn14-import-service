import { Turn14RestApi } from './turn14RestApi';

/**
 * Turn14RestApiFactory.
 *
 * @author Sam Hall <hallsamuel90@gmail.com>
 */
export class Turn14RestApiFactory {
  /**
   * Creates and returns a new instance of Turn14RestApi with the provided
   * parameters.
   *
   * @param {string} client the client key for access to the api.
   * @param {string} secret the secret key for access to the api.
   * @returns {Turn14RestApi} created instance.
   */
  getTurn14RestApi(client: string, secret: string): Turn14RestApi {
    return new Turn14RestApi(client, secret);
  }
}
