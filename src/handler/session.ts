import { checkEnvVariables, parseOptions, UnAuthorizedError } from "@miqro/core";
import { ExtendedVerifyTokenService } from "../service";
import { Handler, Context } from "./common";

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
    tokenLocationName: string;
    setCookieOptions?: {
      httpOnly: boolean;
      secure: boolean;
      path: string;
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
      { name: "tokenLocationName", required: true, type: "string", stringMinLength: 1 },
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
            { name: "path", required: true, type: "string" },
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
      let token = null;
      switch (tokenLocation) {
        case "header":
          token = ctx.headers[(tokenLocationName).toLowerCase()] as string;
          break;
        case "query":
          token = ctx.query[tokenLocationName] as string;
          break;
        case "cookie":
          token = ctx.cookies[tokenLocationName] ? ctx.cookies[tokenLocationName] : undefined;
          break;
        default:
          throw new Error(`TOKEN_LOCATION=${tokenLocation} not supported use (header, query or cookie)`);
      }
      if (!token) {
        const message = `No token provided!`;
        // (logger as Logger).error(message);
        throw new UnAuthorizedError(message);
      } else {
        const session = await config.authService.verify({ token, ctx });
        if (!session) {
          const message = `Fail to authenticate token [${token}]!`;
          ctx.logger.warn(message);
          throw new UnAuthorizedError(`Fail to authenticate token!`);
        } else {
          if (tokenLocation === "cookie" && session.token !== token) {

            const newTokenCookie = String(session.token ? session.token : token);
            if (session.expires instanceof Date) {
              ctx.setCookie(tokenLocationName, newTokenCookie, {
                httpOnly: setCookieOptions.httpOnly,
                secure: setCookieOptions.secure,
                path: setCookieOptions.path,
                sameSite: setCookieOptions.sameSite,
                expires: session.expires
              });
            } else {
              ctx.setCookie(tokenLocationName, newTokenCookie, {
                httpOnly: setCookieOptions.httpOnly,
                path: setCookieOptions.path,
                secure: setCookieOptions.secure,
                sameSite: setCookieOptions.sameSite
              });
            }
          }
          ctx.session = session;
          ctx.logger.debug(`request[${ctx.uuid}] Token [${token}] authenticated!`);
          return true;
        }
      }
    } catch (e) {
      // (logger as Logger).error(`request[${req.uuid}] message[${e.message}] stack[${e.stack}]`);
      if (e.name && e.name !== "Error") {
        throw e;
      } else {
        throw new UnAuthorizedError(`Fail to authenticate token!${e.message ? ` ${e.message}` : ""}`);
      }
    }
  };
};


