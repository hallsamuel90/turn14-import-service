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
    this.wcUrl = importBrandsJSON.wcUrl;
    this.wcClient = importBrandsJSON.wcClient;
    this.wcSecret = importBrandsJSON.wcSecret;
    this.email = importBrandsJSON.email;
    this.brandIds = importBrandsJSON.brandIds;
  }

  /**
   * @return {JSON}
   */
  toJSON() {
    return {
      turn14Client: this.turn14Client,
      turn14Secret: this.turn14Secret,
      wcUrl: this.wcUrl,
      wcClient: this.wcClient,
      wcSecret: this.wcSecret,
      email: this.email,
      brandIds: this.brandIds,
    };
  }
}

module.exports = ImportBrandsDTO;
