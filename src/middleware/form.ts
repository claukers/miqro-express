import { checkEnvVariables } from "@miqro/core";
import { Context, Handler } from "../handler";
import { parse as queryParse } from "querystring";
import { BAD_REQUEST } from "../handler/common/response";
import { DEFAULT_READ_BUFFER_LIMIT } from "./buffer";

export const URLEncodedParser = (options?: {
  limit: number;
  type: string;
}): Handler => {
  let limit = DEFAULT_READ_BUFFER_LIMIT;
  let type = "application/x-www-form-urlencoded";
  if (options) {
    limit = options.limit;
    type = options.type;
  } else {
    const [limitS, typeS] =
      checkEnvVariables(["BODY_PARSER_URL_ENCODED_LIMIT", "BODY_PARSER_URL_ENCODED_TYPE"], [String(DEFAULT_READ_BUFFER_LIMIT), "application/x-www-form-urlencoded"]);
    limit = parseInt(limitS, 10);
    type = typeS;
  }
  return async (ctx: Context) => {
    try {
      const isType = ctx.headers["content-type"] ? ctx.headers["content-type"].toLocaleLowerCase().indexOf(type.toLocaleLowerCase()) !== -1 : false;
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
        ctx.logger.warn(`ctx.buffer.length ${ctx.buffer.length} > ${limit}. To accept this body set BODY_PARSER_URL_ENCODED_LIMIT to a higher value.`);
      }
      return true;
    } catch (e) {
      ctx.logger.error(e);
      await ctx.end(BAD_REQUEST(`cannot parse body: ${e.message}`));
    }
  };
};
