import { gunzipSync } from "zlib";
import { Handler, Context } from "../handler";

export const ReadBuffer = (): Handler =>
  async (ctx: Context) => {
    return new Promise<boolean>((resolve, reject) => {
      try {
        const buffers: Buffer[] = [];
        ctx.req.on('error', err => {
          reject(err);
        });
        ctx.req.on('data', chunk => {
          buffers.push(chunk);
        });
        ctx.req.on('end', () => {
          const responseBuffer: Buffer = ctx.req.headers["content-encoding"] === "gzip" ?
            gunzipSync(Buffer.concat(buffers)) : Buffer.concat(buffers);
          ctx.buffer = responseBuffer;
          resolve(true);
        });
      } catch (e) {
        reject(e);
      }
    });
  }
