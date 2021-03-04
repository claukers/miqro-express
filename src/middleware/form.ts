import { checkEnvVariables } from "@miqro/core";
import { Context, Handler } from "../handler";
import { parse as queryParse } from "querystring";
import { BAD_REQUEST } from "../handler/common/response";

export const URLEncodedParser = (options?: {
  limit: number;
  type: string;
}): Handler => {
  let limit = 1000;
  let type = "application/x-www-form-urlencoded";
  if (options) {
    limit = options.limit;
    type = options.type;
  } else {
    const [limitS, typeS] =
      checkEnvVariables(["BODY_PARSER_URL_ENCODED_LIMIT", "BODY_PARSER_URL_ENCODED_TYPE"], [String(1024*8), "application/x-www-form-urlencoded"]);
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
      }
      return true;
    } catch (e) {
      ctx.logger.error(e);
      await ctx.end(BAD_REQUEST(`cannot parse body: ${e.message}`));
    }
  };
};
