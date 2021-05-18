/**
 *
 */
export class ActiveBrandDTO {
  userId: string;
  brandId: string;
  active: boolean;

  constructor(userId: string, brandId: string, active: boolean) {
    this.userId = userId;
    this.brandId = brandId;
    this.active = active;
  }

  public getUserId(): string {
    return this.userId;
  }

  public getBrandId(): string {
    return this.brandId;
  }

  public isActive(): boolean {
    return this.active;
  }
}
