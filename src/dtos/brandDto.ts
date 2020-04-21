/**
 *
 */
export default class BrandDTO {
  userId: string;
  siteId: string;
  brandId: string;
  brandName: string;
  active: boolean;
  lastUpdated: Date;

  /**
   * All args constructor
   * @param {string} userId
   * @param {string} siteId
   * @param {string} brandId
   * @param {string} brandName
   * @param {boolean} active
   * @param {Date} lastUpdated
   */
  constructor(
    userId: string,
    siteId: string,
    brandId: string,
    brandName: string,
    active: boolean,
    lastUpdated: Date
  ) {
    this.userId = userId;
    this.siteId = siteId;
    this.brandId = brandId;
    this.brandName = brandName;
    this.active = active;
    this.lastUpdated = lastUpdated;
  }
}
