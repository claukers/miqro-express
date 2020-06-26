import {APIResponse} from "./api";
import {Response} from "express";
import {ProxyRequestResponse} from "../common/proxyutils";

export class ProxyResponse extends APIResponse {
  constructor(public response: ProxyRequestResponse) {
    super();
  }

  public async send(res: Response): Promise<void> {
    res.status(this.response.status);
    const keys = Object.keys(this.response.headers);
    for (const key of keys) {
      res.set(key, this.response.headers[key]);
    }
    res.send(this.response.data);
  }
}
