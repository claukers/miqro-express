import {APIResponse} from "./api";
import {Response} from "express";
import {RequestOptions} from "@miqro/core";

export interface ProxyResponseOptions {
  data: any;
  status: number;
  statusText: string;
  headers: any;
  config: RequestOptions;
  request?: any;
}

export class ProxyResponse extends APIResponse {
  constructor(public response: ProxyResponseOptions) {
    super();
  }

  public send(res: Response): void {
    res.status(this.response.status);
    const keys = Object.keys(this.response.headers);
    for (const key of keys) {
      res.set(key, this.response.headers[key]);
    }
    res.send(this.response.data);
  }
}
