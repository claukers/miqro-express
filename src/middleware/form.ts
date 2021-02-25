import { checkEnvVariables } from "@miqro/core";
import { Context, Handler } from "../handler";
import { parse as queryParse } from "querystring";
import { BadRequestError } from "../responses";

export const URLEncodedParser = (options?: {
  extended: boolean;
  inflate: boolean;
  limit: number;
  type: string;
}): Handler => {
  let extended = true;
  let inflate = true;
  let limit = 1000;
  let type = "application/x-www-form-urlencoded";
  if (options) {
    extended = options.extended;
    inflate = options.inflate;
    limit = options.limit;
    type = options.type;
  } else {
    const [extendedS, inflateS, limitS, typeS] =
      checkEnvVariables(["BODY_PARSER_URL_ENCODED_EXTENDED", "BODY_PARSER_URL_ENCODED_INFLATE", "BODY_PARSER_URL_ENCODED_LIMIT", "BODY_PARSER_URL_ENCODED_TYPE"], ["true", "true", "1000", "application/x-www-form-urlencoded"]);
    inflate = inflateS === "true";
    extended = extendedS === "true";
    limit = parseInt(limitS, 10);
    type = typeS;
  }

  return async (ctx: Context) => {
    try {
      const isType = ctx.headers["content-type"] ? ctx.headers["content-type"].toLocaleLowerCase().indexOf(type.toLocaleLowerCase()) !== -1 : false;
      if (isType && ctx.buffer) {
        const string = ctx.buffer.toString();
        if (string) {
          ctx.body = queryParse(string, undefined, undefined, {
            maxKeys: 20
          });
        }
      }
      return true;
    } catch (e) {
      throw new BadRequestError(`cannot parse body: ${e.message}`);
    }
  };
};
