import { Handler, Context, checkEnvVariables, BadRequestError } from "@miqro/core";
import { gunzipSync } from "zlib";

export const DEFAULT_READ_BUFFER_LIMIT = 1024 * 8 * 100;

export const ReadBuffer = (options?: {
  limit: number;
}): Handler<void> => {
  let limit = DEFAULT_READ_BUFFER_LIMIT;
  if (options) {
    limit = options.limit !== undefined ? options.limit : limit;
  } else {
    const [limitS] =
      checkEnvVariables(["READ_BUFFER_LIMIT"], [String(DEFAULT_READ_BUFFER_LIMIT)]);
    limit = parseInt(limitS, 10);
  }
  return async (ctx: Context): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      try {
        let cLength = 0;
        const buffers: Buffer[] = [];
        const endListener = () => {
          const responseBuffer: Buffer = ctx.headers["content-encoding"] === "gzip" ?
            gunzipSync(Buffer.concat(buffers)) : Buffer.concat(buffers);
          ctx.buffer = responseBuffer;
          resolve();
        };
        const errorListener = (err: Error) => {
          reject(err);
        };
        const chunkListener = (chunk: Buffer) => {
          cLength += chunk.length;
          if (cLength > limit) {
            ctx.req.removeListener('error', errorListener);
            ctx.req.removeListener('data', chunkListener);
            ctx.req.removeListener('end', endListener);
            ctx.logger.error(`ctx.buffer.length ${cLength} > ${limit}. To accept this body set READ_BUFFER_LIMIT to a higher value.`);
            reject(new BadRequestError(`buffer.length ${ctx.buffer.length} > ${limit}`));
          }
          buffers.push(chunk);
        };
        ctx.req.on('error', errorListener);
        ctx.req.on('data', chunkListener);
        ctx.req.on('end', endListener);
      } catch (e) {
        reject(e);
      }
    });
  };
}
