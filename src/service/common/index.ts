import { Request } from "express";
import { IServiceArgs, ISession, ISimpleMap } from "miqro-core";

export class ServiceArg implements IServiceArgs {
  public session: ISession;
  public params: ISimpleMap<any>;
  public method: string;
  public query: ISimpleMap<any>;
  public body: ISimpleMap<any>;
  public headers: ISimpleMap<any>;
  public results: any[];
  public constructor(req: Request) {
    this.method = req.method;
    this.session = (req as any).session;
    this.params = req.params;
    this.query = req.query;
    this.body = req.body;
    this.results = (req as any).results;
    this.headers = req.headers;
  }
}
