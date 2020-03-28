/**
 * Import Brands Data Transfer Object
 */
class ImportBrandsDTO {
  /**
   *
   * @param {JSON} importBrandsJSON
   */
  constructor(importBrandsJSON) {
    this.turn14Client = importBrandsJSON.turn14Client;
    this.turn14Secret = importBrandsJSON.turn14Secret;
    this.wcClient = importBrandsJSON.wcClient;
    this.wcSecret = importBrandsJSON.wcSecret;
    this.email = importBrandsJSON.email;
    this.brandIds = importBrandsJSON.brandIds;
  }

  /**
   * Getter for turn14Client
   *
   * @return {string} turn14client
   */
  getTurn14Client() {
    return this.turn14Client;
  }

  /**
   * @return {JSON}
   */
  toJSON() {
    return {
      turn14Client: this.turn14Client,
      turn14Secret: this.turn14Secret,
      wcClient: this.wcClient,
      wcSecret: this.wcSecret,
      email: this.email,
      brandIds: this.brandIds,
    };
  }
}

module.exports = ImportBrandsDTO;
