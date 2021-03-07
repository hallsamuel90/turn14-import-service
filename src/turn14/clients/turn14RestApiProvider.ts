/* eslint-disable @typescript-eslint/camelcase */
import axios, { AxiosInstance } from 'axios';
import rateLimit, { RateLimitedAxiosInstance } from 'axios-rate-limit';
import { Turn14Error } from '../errors/Turn14Error';
import { Turn14RestApi } from './turn14RestApi';

/**
 * Turn14RestApiProvider.
 */
export class Turn14RestApiProvider {
  private static readonly REQUEST_RATE = 3;
  private static readonly BASE_URL = 'https://apitest.turn14.com/v1';
  private static readonly API_INIT_DELAY_MS = 500;
  /**
   * Creates and returns a pre-configured instance of Turn14RestApi with the provided
   * parameters.
   *
   * @param {string} client the client key for access to the api.
   * @param {string} secret the secret key for access to the api.
   * @returns {Turn14RestApi} created instance.
   */
  public async getTurn14RestApi(
    client: string,
    secret: string
  ): Promise<Turn14RestApi> {
    // avoid 429 from consecutive operations
    await this.sleep(Turn14RestApiProvider.API_INIT_DELAY_MS);

    const axiosClient = await this.initializeAuthorizedRateLimitedClient(
      client,
      secret
    );

    return new Turn14RestApi(axiosClient);
  }

  private async initializeAuthorizedRateLimitedClient(
    turn14Client: string,
    turn14Secret: string
  ): Promise<RateLimitedAxiosInstance> {
    const axiosClient = axios.create({
      baseURL: Turn14RestApiProvider.BASE_URL,
    });

    const token = await this.getAuthToken(
      axiosClient,
      turn14Client,
      turn14Secret
    );

    axiosClient.defaults.headers.common = {
      Authorization: `Bearer ${token}`,
    };

    return rateLimit(axiosClient, {
      maxRPS: Turn14RestApiProvider.REQUEST_RATE,
    });
  }

  private async getAuthToken(
    axiosClient: AxiosInstance,
    turn14Client: string,
    turn14Secret: string
  ): Promise<string> {
    const TOKEN_RESOURCE = '/token';
    try {
      const response = await axiosClient.post(TOKEN_RESOURCE, {
        grant_type: 'client_credentials',
        client_id: turn14Client,
        client_secret: turn14Secret,
      });

      return response.data.access_token;
    } catch (e) {
      throw new Turn14Error(`Failed to authenticate with the API. ${e}`);
    }
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
