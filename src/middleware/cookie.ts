import { Handler, Context } from "../handler";
import { parse as cookieParse } from "cookie";

export const CookieParserHandler: Handler =
  async (ctx: Context) => {
    ctx.cookies = cookieParse(ctx.headers.cookie || '');
    return true;
  }
