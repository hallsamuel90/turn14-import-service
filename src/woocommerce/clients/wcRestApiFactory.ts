import { WcRestApi } from './wcRestApi';

/**
 * WcRestApiFactory.
 *
 * @author Sam Hall <hallsamuel90@gmail.com>
 */
export class WcRestApiFactory {
  /**
   * Creates and returns a new instance of WcRestApi with the provided
   * parameters.
   *
   * @param {string} wcTargetUrl the target url to invoke.
   * @param {string} wcClient the client key for access to the api.
   * @param {string} wcSecret the secret key for access to the api.
   * @returns {WcRestApi} created instance.
   */
  getWcRestApi(
    wcTargetUrl: string,
    wcClient: string,
    wcSecret: string
  ): WcRestApi {
    return new WcRestApi(wcTargetUrl, wcClient, wcSecret);
  }
}
