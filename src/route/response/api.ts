import { Request, Response } from "express";
import { ISimpleMap } from "miqro-core";
import { ISession } from "../../service";

export interface IAPIRequest extends Request {
  session: ISession;
  method: string;
  params: ISimpleMap<any>;
  query: ISimpleMap<any>;
  body: ISimpleMap<any>;
  headers: ISimpleMap<any>;
}

export class APIResponse {
  public status = 200;
  constructor(private body?: any) { }
  public async send(res: Response) {
    res.status(this.status);
    res.json(this.body);
  }
}
