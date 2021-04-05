import { Handler, Context } from "@miqro/core";
import { CookieParseOptions, parse as cookieParse } from "cookie";

export const CookieParser = (options?: CookieParseOptions): Handler => {
  return async (ctx: Context) => {
    const cookies = cookieParse(ctx.headers.cookie || '', options);
    const cookieList = Object.keys(cookies);
    for (const name of cookieList) {
      ctx.cookies[name] = cookies[name];
    }
    return true;
  };
}

