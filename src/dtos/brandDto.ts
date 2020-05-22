/**
 *
 */
export class BrandDTO {
  userId: string;
  siteId: string;
  brandId: string;
  brandName: string;
  active: boolean;
  firstPublished: Date;
  lastUpdated: Date;

  /**
   * All args constructor
   *
   * @param {string} userId
   * @param {string} siteId
   * @param {string} brandId
   * @param {string} brandName
   * @param {boolean} active
   * @param {Date} firstPublished
   * @param {Date} lastUpdated
   */
  constructor(
    userId: string,
    siteId: string,
    brandId: string,
    brandName: string,
    active: boolean,
    firstPublished: Date,
    lastUpdated: Date
  ) {
    this.userId = userId;
    this.siteId = siteId;
    this.brandId = brandId;
    this.brandName = brandName;
    this.active = active;
    this.firstPublished = firstPublished;
    this.lastUpdated = lastUpdated;
  }
}
