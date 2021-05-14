import { Context, Handler, checkEnvVariables, BadRequestError } from "@miqro/core";
import { parse as queryParse } from "querystring";
import { DEFAULT_READ_BUFFER_LIMIT } from "./buffer";

export const URLEncodedParser = (options?: {
  limit: number;
  type: string;
}): Handler => {
  let limit = DEFAULT_READ_BUFFER_LIMIT;
  let type = "application/x-www-form-urlencoded";
  if (options) {
    limit = options.limit !== undefined ? options.limit : limit;
    type = options.type !== undefined ? options.type : type;
  } else {
    const [limitS, typeS] =
      checkEnvVariables(["BODY_PARSER_URL_ENCODED_LIMIT", "BODY_PARSER_URL_ENCODED_TYPE"], [String(DEFAULT_READ_BUFFER_LIMIT), "application/x-www-form-urlencoded"]);
    limit = parseInt(limitS, 10);
    type = typeS;
  }
  return async (ctx: Context) => {
    try {
      const isType = ctx.body === undefined && ctx.headers["content-type"] ? ctx.headers["content-type"].toLocaleLowerCase().indexOf(type.toLocaleLowerCase()) !== -1 : false;
      if (isType && ctx.buffer && ctx.buffer.length <= limit) {
        const string = ctx.buffer.toString();
        if (string) {
          ctx.body = {
            ...queryParse(string, undefined, undefined, {
              maxKeys: 20
            })
          };
        }
      } else if (isType && ctx.buffer && ctx.buffer.length > limit) {
        ctx.logger.error(`ctx.buffer.length ${ctx.buffer.length} > ${limit}. To accept this body set BODY_PARSER_URL_ENCODED_LIMIT to a higher value.`);
        throw new BadRequestError();
      }
      return true;
    } catch (e) {
      ctx.logger.error(e);
      throw new BadRequestError();
    }
  };
};
