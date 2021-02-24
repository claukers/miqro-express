import { RequestOptions } from "@miqro/core";
import { Context, Response } from "../handler/common";
import { OutgoingHttpHeaders } from "http";

export interface ProxyResponseOptions {
  data: any;
  status: number;
  statusText: string;
  headers: any;
  config: RequestOptions;
  request?: any;
}

export class ProxyResponse<T = any> implements Response<T> {
  public body?: T;
  public status: number;
  public headers: OutgoingHttpHeaders;
  constructor(public response: ProxyResponseOptions) {
    this.status = this.response.status;
    this.headers = this.response.headers;
    this.body = this.response.data;
  }

  public async send(ctx: Context) {
    return new Promise<void>((resolve, reject) => {
      try {
        ctx.res.statusCode = this.status;
        const keys = Object.keys(this.headers);
        for (const key of keys) {
          if (this.headers[key] !== undefined) {
            ctx.res.setHeader(key, this.headers[key] as any);
          }
        }
        ctx.res.end(String(this.body), () => {
          ctx.req.socket.end(() => {
            resolve();
          });
        });
      } catch (e) {
        reject(e);
      }
    });
  }
}
