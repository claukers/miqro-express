import { APIResponse } from "./api";
import { RequestOptions } from "@miqro/core";
import { Context } from "../common";

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

  public async send(ctx: Context): Promise<void> {
    this.status = this.response.status;
    this.headers = this.response.headers;
    this.body = this.response.data;
    return super.send(ctx);
  }
}
