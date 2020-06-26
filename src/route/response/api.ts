export class APIResponse {
  public status = 200;

  /* eslint-disable  @typescript-eslint/explicit-module-boundary-types */
  constructor(public body?: any) {
  }

  public async send(res: any): Promise<void> {
    res.status(this.status);
    res.json(this.body);
  }
}
