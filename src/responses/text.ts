import { OutgoingHttpHeaders } from "http";
import { Context, Response } from "../handler/common";

export class TextResponse implements Response {

  /* eslint-disable  @typescript-eslint/explicit-module-boundary-types */
  constructor(public body?: any, public status = 200, public headers: OutgoingHttpHeaders = {
    ['Content-Type']: 'plain/text'
  }) {
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
