import { ProductSyncJobType } from './proudctSyncJobType';

export class ProductSyncJob {
  private jobId: string;
  private timeQueued: Date;
  private timeStarted: Date;
  private timeCompleted: Date;
  private jobType: ProductSyncJobType;
  private args: object[];

  constructor(jobType: ProductSyncJobType, ...args: object[]) {
    this.jobId = '1';
    this.timeQueued = new Date();
    this.jobType = jobType;
    this.args = args;
  }

  public getJobId(): string {
    return this.jobId;
  }

  public getTimeQueued(): Date {
    return this.timeQueued;
  }

  public getTimeStarted(): Date {
    return this.timeStarted;
  }

  public getTimeCompleted(): Date {
    return this.timeCompleted;
  }

  public getJobType(): ProductSyncJobType {
    return this.jobType;
  }

  public getArgs(): object[] {
    return this.args;
  }
}
