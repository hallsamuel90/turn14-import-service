/**
 *
 * @param {*} credentials
 * @return {*} credentialsDTO
 */
class CredentialsDTO {
  /**
   *
   * @param {*} credentials
   */
  constructor(credentials) {
    this.turn14Client = credentials.turn14Client;
    this.turn14Secret = credentials.turn14Secret;
    this.wcClient = credentials.wcClient;
    this.wcSecret = credentials.wcSecret;
    this.email = credentials.email;
  }

  /**
   * @return {*}
   */
  toJSON() {
    return {
      turn14Client: this.turn14Client,
      turn14Secret: this.turn14Secret,
      wcClient: this.wcClient,
      wcSecret: this.wcSecret,
      email: this.email,
    };
  }
}

module.exports = CredentialsDTO;
