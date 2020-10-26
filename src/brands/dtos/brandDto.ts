/**
 * BrandDTO.
 *
 * Immutable data transfer object.
 *
 * @author Sam Hall <hallsamuel90@gmail.com>
 */
export class BrandDTO {
  private userId: string;
  private siteId: string;
  private brandId: string;
  private brandName: string;
  private active: boolean;
  private firstPublished: Date;
  private lastUpdated: Date;

  /**
   * All args constructor.
   *
   * @param {string} userId the unique id of the user.
   * @param {string} siteId the unique id of the associated woocommerce site.
   * @param {string} brandId the unique id of the brand.
   * @param {string} brandName the unique name of the brand.
   * @param {boolean} active whether or not the brand is active in the store.
   * @param {Date} firstPublished the date the brand was first created.
   * @param {Date} lastUpdated the date the brand was last updated.
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

  public getUserId(): string {
    return this.userId;
  }

  public getSiteId(): string {
    return this.siteId;
  }

  public getBrandId(): string {
    return this.brandId;
  }

  public getBrandName(): string {
    return this.brandName;
  }

  public isActive(): boolean {
    return this.active;
  }

  public getFirstPublished(): Date {
    return this.firstPublished;
  }

  public getLastUpdated(): Date {
    return this.lastUpdated;
  }
}
