import { checkEnvVariables } from "@miqro/core";
import { gunzipSync } from "zlib";
import { Handler, Context } from "../handler";

export const DEFAULT_READ_BUFFER_LIMIT = 1024 * 8 * 100;

export const ReadBuffer = (options?: {
  limit: number;
}): Handler => {
  let limit = DEFAULT_READ_BUFFER_LIMIT;
  if (options) {
    limit = options.limit;
  } else {
    const [limitS] =
      checkEnvVariables(["READ_BUFFER_LIMIT"], [String(DEFAULT_READ_BUFFER_LIMIT)]);
    limit = parseInt(limitS, 10);
  }
  return async (ctx: Context) => {
    return new Promise<boolean>((resolve, reject) => {
      try {
        let cLength = 0;
        const buffers: Buffer[] = [];
        const endListener = () => {
          const responseBuffer: Buffer = ctx.req.headers["content-encoding"] === "gzip" ?
            gunzipSync(Buffer.concat(buffers)) : Buffer.concat(buffers);
          ctx.buffer = responseBuffer;
          resolve(true);
        };
        ctx.req.on('error', err => {
          reject(err);
        });
        ctx.req.on('data', chunk => {
          cLength += chunk.length;
          if (cLength > limit) {
            ctx.req.removeListener('end', endListener);
            ctx.logger.warn(`ctx.buffer.length ${cLength} > ${limit}. To accept this body set READ_BUFFER_LIMIT to a higher value.`);
            resolve(false);
          }
          buffers.push(chunk);
        });
        ctx.req.on('end', endListener);
      } catch (e) {
        reject(e);
      }
    });
  };
}
