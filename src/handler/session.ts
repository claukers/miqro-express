import { Handler, Context, checkEnvVariables, parseOptions, UnAuthorizedError, ForbiddenError } from "@miqro/core";
import { ExtendedVerifyTokenService } from "../service";
import { serialize as cookieSerialize } from "cookie";

const DEFAULT_TOKEN_LOCATION = "header";
const DEFAULT_TOKEN_HEADER = "Authorization";
const DEFAULT_TOKEN_QUERY = "token";
const DEFAULT_TOKEN_COOKIE = "Authorization";
const DEFAULT_TOKEN_SET_COOKIE_HTTP_ONLY = "true";
const DEFAULT_TOKEN_SET_COOKIE_SECURE = "true";
const DEFAULT_TOKEN_SET_COOKIE_PATH = "/";
const DEFAULT_TOKEN_SET_COOKIE_SAME_SITE = "strict";

export interface SessionHandlerOptions {
  authService: ExtendedVerifyTokenService;
  options?: {
    tokenLocation: "header" | "query" | "cookie";
    tokenLocationName: string | ((ctx: Context) => Promise<string>);
    setCookieOptions?: {
      httpOnly: boolean;
      secure: boolean;
      path: string | ((ctx: Context) => Promise<string>);
      sameSite: "lax" | "strict" | "none";
    }
  }
}

export const SessionHandler = (config: SessionHandlerOptions): Handler => {
  if (!config.options) {
    const tokenLocation = checkEnvVariables(["TOKEN_LOCATION"], [DEFAULT_TOKEN_LOCATION])[0];
    config.options = {
      tokenLocation: tokenLocation as any,
      tokenLocationName: "",
      setCookieOptions: {
        httpOnly: true,
        path: "/",
        sameSite: "strict",
        secure: true
      }
    };
    switch (tokenLocation) {
      case "header":
        config.options.tokenLocationName = checkEnvVariables(["TOKEN_HEADER"], [DEFAULT_TOKEN_HEADER])[0];
        break;
      case "query":
        config.options.tokenLocationName = checkEnvVariables(["TOKEN_QUERY"], [DEFAULT_TOKEN_QUERY])[0];
        break;
      case "cookie":
        config.options.tokenLocationName = checkEnvVariables(["TOKEN_COOKIE"], [DEFAULT_TOKEN_COOKIE])[0];
        const [httpOnlyS, secureS, path, sameSite] = checkEnvVariables(
          ["TOKEN_SET_COOKIE_HTTP_ONLY", "TOKEN_SET_COOKIE_SECURE", "TOKEN_SET_COOKIE_PATH", "TOKEN_SET_COOKIE_SAME_SITE"],
          [DEFAULT_TOKEN_SET_COOKIE_HTTP_ONLY, DEFAULT_TOKEN_SET_COOKIE_SECURE, DEFAULT_TOKEN_SET_COOKIE_PATH, DEFAULT_TOKEN_SET_COOKIE_SAME_SITE]);
        config.options.setCookieOptions = {
          httpOnly: httpOnlyS === "true",
          secure: secureS === "true",
          path,
          sameSite: sameSite as any
        };
        break;
      default:
        throw new Error(`TOKEN_LOCATION=${tokenLocation} not supported use (header or query)`);
    }
  } else {
    config.options = parseOptions("options", config.options as any, [
      { name: "tokenLocation", required: true, type: "enum", enumValues: ["header", "query", "cookie"] },
      { name: "tokenLocationName", required: true, type: "any" },
      {
        name: "setCookieOptions", required: false, type: "nested", defaultValue: {
          httpOnly: DEFAULT_TOKEN_SET_COOKIE_HTTP_ONLY === "true",
          secure: DEFAULT_TOKEN_SET_COOKIE_SECURE === "true",
          path: DEFAULT_TOKEN_SET_COOKIE_PATH,
          sameSite: DEFAULT_TOKEN_SET_COOKIE_SAME_SITE,
        }, nestedOptions: {
          mode: "no_extra",
          options: [
            { name: "httpOnly", required: true, type: "boolean" },
            { name: "secure", required: true, type: "boolean" },
            { name: "path", required: true, type: "any" },
            { name: "sameSite", required: true, type: "enum", enumValues: ["lax", "strict", "none"] }
          ]
        }
      }
    ], "no_extra") as any;
  }

  if (!config.authService) {
    throw new Error("authService must be provided!");
  }
  if (!config.options || !config.options.setCookieOptions) {
    throw new Error("config.options not populated!");
  }
  const tokenLocation = config.options.tokenLocation;
  const tokenLocationName = config.options.tokenLocationName;
  const setCookieOptions = config.options.setCookieOptions;
  return async (ctx: Context) => {
    try {
      const tlN = typeof tokenLocationName === "string" ? tokenLocationName : await tokenLocationName(ctx);
      let token = null;
      switch (tokenLocation) {
        case "header":
          token = ctx.headers[(tlN).toLowerCase()] as string;
          break;
        case "query":
          token = ctx.query[tlN] as string;
          break;
        case "cookie":
          token = ctx.cookies[tlN] ? ctx.cookies[tlN] : undefined;
          break;
        default:
          throw new Error(`TOKEN_LOCATION=${tokenLocation} not supported use (header, query or cookie)`);
      }
      if (!token) {
        ctx.logger.warn("No token provided!");
        throw new ForbiddenError("NO TOKEN");
      } else {
        const session = await config.authService.verify({ token, ctx });
        if (!session) {
          ctx.logger.warn("fail to authenticate token [%s]!", token);
          throw new UnAuthorizedError();
        } else {
          if (tokenLocation === "cookie" && session.token !== token) {
            const newTokenCookie = String(session.token ? session.token : token);
            const cookiePath = typeof setCookieOptions.path === "string" ? setCookieOptions.path : await setCookieOptions.path(ctx);
            ctx.setHeader('Set-Cookie', cookieSerialize(tlN, String(newTokenCookie), session.expires instanceof Date ? {
              httpOnly: setCookieOptions.httpOnly,
              secure: setCookieOptions.secure,
              path: cookiePath,
              sameSite: setCookieOptions.sameSite,
              expires: session.expires
            } : {
              httpOnly: setCookieOptions.httpOnly,
              path: cookiePath,
              secure: setCookieOptions.secure,
              sameSite: setCookieOptions.sameSite
            }));
          }
          ctx.session = session;
          ctx.logger.debug("authenticated!");
          return true;
        }
      }
    } catch (e) {
      if (e.message === "NO TOKEN") {
        throw e;
      } else {
        throw new UnAuthorizedError();
      }
    }
  };
};


