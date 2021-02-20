import axios, { AxiosInstance } from 'axios';
import rateLimit, { RateLimitedAxiosInstance } from 'axios-rate-limit';
import https from 'https';
import { WcRestApi } from './wcRestApi';

/**
 * WcRestApiProvider.
 *
 * @author Sam Hall <hallsamuel90@gmail.com>
 */
export class WcRestApiProvider {
  private static readonly REQUEST_RATE = 4;
  /**
   * Creates and returns a new instance of WcRestApi with the provided
   * parameters.
   *
   * @param {string} wcTargetUrl the target url to invoke.
   * @param {string} wcClient the client key for access to the api.
   * @param {string} wcSecret the secret key for access to the api.
   *
   * @returns {WcRestApi} created instance.
   */
  public getRateLimitedWcRestApi(
    wcTargetUrl: string,
    wcClient: string,
    wcSecret: string
  ): WcRestApi {
    const rateLimitedClient = this.initializeRateLimitedClient(
      wcTargetUrl,
      wcClient,
      wcSecret
    );

    return new WcRestApi(rateLimitedClient);
  }

  public getWcRestApi(
    wcTargetUrl: string,
    wcClient: string,
    wcSecret: string
  ): WcRestApi {
    const axiosClient = this.buildAxiosClient(wcTargetUrl, wcClient, wcSecret);

    return new WcRestApi(axiosClient);
  }

  private initializeRateLimitedClient(
    wcTargetUrl: string,
    wcClient: string,
    wcSecret: string
  ): RateLimitedAxiosInstance {
    const axiosClient = this.buildAxiosClient(wcTargetUrl, wcClient, wcSecret);

    return rateLimit(axiosClient, {
      maxRPS: WcRestApiProvider.REQUEST_RATE,
    });
  }

  private buildAxiosClient(
    wcTargetUrl: string,
    wcClient: string,
    wcSecret: string
  ): AxiosInstance {
    return axios.create({
      baseURL: wcTargetUrl,
      auth: {
        username: wcClient,
        password: wcSecret,
      },
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    });
  }
}
