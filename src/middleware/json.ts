import { checkEnvVariables } from "@miqro/core";
import { Handler, Context } from "../handler";
import { BadRequestError } from "../responses";

export const JSONParser = (options?: {
  inflate: boolean;
  limit: number;
  strict: boolean;
  type: string;
}): Handler => {
  let inflate = false;
  let strict = false;
  let limit = 1000;
  let type = "application/json";
  if (options) {
    inflate = options.inflate;
    strict = options.strict;
    limit = options.limit;
    type = options.type;
  } else {
    const [inflateS, limitS, strictS, typeS] =
      checkEnvVariables(["BODY_PARSER_INFLATE", "BODY_PARSER_LIMIT", "BODY_PARSER_STRICT", "BODY_PARSER_TYPE"], ["true", "1000", "true", "application/json"])
    inflate = inflateS === "true";
    strict = strictS === "true";
    limit = parseInt(limitS, 10);
    type = typeS;
  }
  return async (ctx: Context) => {
    try {
      const isType = ctx.headers["content-type"] ? ctx.headers["content-type"].toLocaleLowerCase().indexOf(type.toLocaleLowerCase()) !== -1 : false;
      if (isType && ctx.buffer) {
        const string = ctx.buffer.toString();
        if (string) {
          ctx.body = JSON.parse(string);
        }

      }
      return true;
    } catch (e) {
      throw new BadRequestError(`cannot parse body: ${e.message}`);
    }
  };
};
