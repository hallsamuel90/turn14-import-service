/**
 * Import Brands Data Transfer Object
 */
export default class ImportBrandsDTO {
  turn14Client: string;
  turn14Secret: string;
  wcUrl: string;
  wcClient: string;
  wcSecret: string;
  email: string;
  brandIds: string;
  /**
   *
   * @param {JSON} importBrandsJSON
   */
  constructor(importBrandsJSON: JSON) {
    this.turn14Client = importBrandsJSON['turn14Client'];
    this.turn14Secret = importBrandsJSON['turn14Secret'];
    this.wcUrl = importBrandsJSON['wcUrl'];
    this.wcClient = importBrandsJSON['wcClient'];
    this.wcSecret = importBrandsJSON['wcSecret'];
    this.email = importBrandsJSON['email'];
    this.brandIds = importBrandsJSON['brandIds'];
  }
}
