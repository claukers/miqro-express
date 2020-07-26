import {Response} from "express";

export class APIResponse {
  public status = 200;

  /* eslint-disable  @typescript-eslint/explicit-module-boundary-types */
  constructor(public body?: any) {
  }

  public send(res: Response) {
    res.status(this.status);
    res.json(this.body);
  }
}
