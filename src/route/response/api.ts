import { Response } from "express";

export class APIResponse {
  public status = 200;
  constructor(public body?: any) { }
  public async send(res: Response) {
    res.status(this.status);
    res.json(this.body);
  }
}
