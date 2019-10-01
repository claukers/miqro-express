import { IServiceArgs, ISession, ISimpleMap } from "miqro-core";
import { IAPIRequest } from "../../route";

export class ServiceArg implements IServiceArgs {
  public session: ISession;
  public params: ISimpleMap<any>;
  public method: string;
  public query: ISimpleMap<any>;
  public body: ISimpleMap<any>;
  public headers: ISimpleMap<any>;
  public constructor(req: IAPIRequest) {
    this.method = req.method;
    this.session = req.session;
    this.params = req.params;
    this.query = req.query;
    this.body = req.body;
    this.headers = req.headers;
  }
}
