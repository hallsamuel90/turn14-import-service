/**
 *
 */
export class ActiveBrandDTO {
  userId: string;
  brandId: string;
  active: boolean;

  /**
   * All args constructor
   *
   * @param {string} userId
   * @param {string} brandId
   * @param {boolean} active
   */
  constructor(userId: string, brandId: string, active: boolean) {
    this.userId = userId;
    this.brandId = brandId;
    this.active = active;
  }
}
