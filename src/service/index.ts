import { inspect } from "util";
import { parse as cookieParse } from "cookie";
import { decode as jwtDecode } from "jsonwebtoken";
import { RequestOptions, Session, NoTokenSession, UnAuthorizedError, VerifyTokenService, RequestResponse, request, parseOptions, checkEnvVariables } from "@miqro/core";
import { Context } from "../handler";

const DEFAULT_TOKEN_LOCATION = "header";
const DEFAULT_TOKEN_HEADER = "Authorization";
const DEFAULT_TOKEN_QUERY = "token";
const DEFAULT_TOKEN_COOKIE = "Authorization";

export interface ExtendedVerifyTokenServiceArgs { token: string, ctx: Context }

export interface ExtendedVerifyTokenService extends VerifyTokenService {
  verify(args: ExtendedVerifyTokenServiceArgs): Promise<Session | null>;
}

export interface VerifyEndpointServiceOptions {
  url: string;
  method: string;
  tokenLocation: "header" | "query" | "cookie";
  tokenLocationName: string;
}

export class VerifyEndpointService implements ExtendedVerifyTokenService {

  constructor(protected options?: VerifyEndpointServiceOptions) {
    if (!options) {
      checkEnvVariables(["TOKEN_VERIFY_ENDPOINT", "TOKEN_VERIFY_ENDPOINT_METHOD"]);
      const [tokenVerifyLocation] = checkEnvVariables(["TOKEN_VERIFY_LOCATION"], [DEFAULT_TOKEN_LOCATION]);
      switch (tokenVerifyLocation) {
        case "header":
          checkEnvVariables(["TOKEN_HEADER"], [DEFAULT_TOKEN_HEADER]);
          break;
        case "query":
          checkEnvVariables(["TOKEN_QUERY"], [DEFAULT_TOKEN_QUERY]);
          break;
        case "cookie":
          checkEnvVariables(["TOKEN_COOKIE"], [DEFAULT_TOKEN_COOKIE]);
          break;
        default:
          throw new Error(`TOKEN_VERIFY_LOCATION=${tokenVerifyLocation} not supported use (header or query)`);
      }
    } else {
      parseOptions("options", options as any, [
        { name: "url", required: true, type: "string", stringMinLength: 1 },
        { name: "method", required: true, type: "string", stringMinLength: 1 },
        { name: "tokenLocation", required: true, type: "enum", enumValues: ["header", "query", "cookie"] },
        { name: "tokenLocationName", required: true, type: "string", stringMinLength: 1 }
      ], "no_extra");
    }
  }

  public async verify({ token, ctx }: ExtendedVerifyTokenServiceArgs): Promise<Session | null> {
    try {
      let response = null;
      const tokenVerifyLocation = this.options ? this.options.tokenLocation : checkEnvVariables(["TOKEN_VERIFY_LOCATION"], [DEFAULT_TOKEN_LOCATION])[0];
      const url = this.options ? this.options.url : `${process.env.TOKEN_VERIFY_ENDPOINT}`;
      const method = this.options ? this.options.method : `${process.env.TOKEN_VERIFY_ENDPOINT_METHOD}` as any;
      switch (tokenVerifyLocation) {
        case "header":
          const tokenHeaderLocation = this.options ? this.options.tokenLocationName : checkEnvVariables(["TOKEN_HEADER"], [DEFAULT_TOKEN_HEADER])[0];
          ctx.logger.debug(`verifying [${token}] on TOKEN_VERIFY_ENDPOINT=[${process.env.TOKEN_VERIFY_ENDPOINT}] TOKEN_HEADER=[${tokenHeaderLocation}]`);
          response = await this.getResponse({
            url,
            headers: {
              [tokenHeaderLocation]: token
            },
            method
          }, ctx);
          break;
        case "query":
          const tokenQueryLocation = this.options ? this.options.tokenLocationName : checkEnvVariables(["TOKEN_QUERY"], [DEFAULT_TOKEN_QUERY])[0];
          ctx.logger.debug(`verifying [${token}] on TOKEN_VERIFY_ENDPOINT=[${process.env.TOKEN_VERIFY_ENDPOINT}] TOKEN_QUERY=[${tokenQueryLocation}]`);
          response = await this.getResponse({
            url,
            query: {
              [tokenQueryLocation]: token
            },
            method
          }, ctx);
          break;
        case "cookie":
          const tokenCookieLocation = this.options ? this.options.tokenLocationName : checkEnvVariables(["TOKEN_COOKIE"], [DEFAULT_TOKEN_COOKIE])[0];
          ctx.logger.debug(`verifying [${token}] on TOKEN_VERIFY_ENDPOINT=[${process.env.TOKEN_VERIFY_ENDPOINT}] TOKEN_COOKIE=[${tokenCookieLocation}]`);
          response = await this.getResponse({
            url,
            method,
            headers: {
              Cookie: `${tokenCookieLocation}=${token}; Path=/; HttpOnly;`
            }
          }, ctx);
          break;
        default:
          throw new Error(`TOKEN_VERIFY_LOCATION=${tokenVerifyLocation} not supported use (header, query or cookie)`);
      }
      if (response) {
        /* eslint-disable  @typescript-eslint/no-var-requires */
        const session = await this.decodeSession(response, token, ctx);
        if (!this.checkSession(session, ctx)) {
          ctx.logger.warn(`unauthorized token not valid [${token}]`);
          return null;
        } else {
          ctx.logger.debug(`authorized token[${token}] with session[${inspect(session)}]`);

          if (tokenVerifyLocation === "cookie" && response.headers["set-cookie"]) {
            const tokenCookieLocation = this.options ? this.options.tokenLocationName : checkEnvVariables(["TOKEN_COOKIE"], [DEFAULT_TOKEN_COOKIE])[0];
            const cookies = response.headers["set-cookie"].map(c => cookieParse(c)).filter(c => c[tokenCookieLocation] !== undefined);
            if (cookies.length === 1) {
              session.token = cookies[0][tokenCookieLocation]; // replace token because token update via set-cookie
            }
          }
          return {
            token,
            ...session
          } as Session;
        }
      } else {
        ctx.logger.warn(`unauthorized token not valid [${token}]`);
        return null;
      }
    } catch (e) {
      ctx.logger.error(`error verifying [${token}] [${e.response ? e.response.status : ""}][${e.config ? e.config.url : ""}][${e.message}]`);
      throw new UnAuthorizedError(`Fail to authenticate token!`);
    }
  }
  /* eslint-disable  @typescript-eslint/no-unused-vars */
  protected async getResponse(config: RequestOptions, ctx?: Context): Promise<RequestResponse> {
    return request(config);
  }
  /* eslint-disable  @typescript-eslint/no-unused-vars */
  protected checkSession(session: NoTokenSession, ctx?: Context): boolean {
    parseOptions("session", session, [
      { name: "username", required: true, type: "string" },
      { name: "account", required: true, type: "string" },
      { name: "groups", required: true, type: "array", arrayType: "string" }
    ], "add_extra");
    return true;
  }
  /* eslint-disable  @typescript-eslint/no-unused-vars */
  protected async decodeSession(response: RequestResponse, token: string, ctx?: Context): Promise<NoTokenSession> {
    const session = response.data;
    return session as NoTokenSession;
  }
}

export class VerifyJWTEndpointService extends VerifyEndpointService {

  protected static instance: VerifyJWTEndpointService;

  public static getInstance(): VerifyJWTEndpointService {
    VerifyJWTEndpointService.instance =
      VerifyJWTEndpointService.instance ? VerifyJWTEndpointService.instance : new VerifyJWTEndpointService();
    return VerifyJWTEndpointService.instance;
  }

  constructor(options?: VerifyEndpointServiceOptions) {
    super(options);
  }

  protected async decodeSession(response: RequestResponse, token: string, ctx?: Context): Promise<Session> {
    const session = jwtDecode(token);
    return session as Session;
  }
}
