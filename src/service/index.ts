import { parse as cookieParse } from "cookie";
import { decode as jwtDecode } from "jsonwebtoken";
import { Context, RequestOptions, Session, NoTokenSession, UnAuthorizedError, VerifyTokenService, RequestResponse, request, parseOptions, checkEnvVariables } from "@miqro/core";

const DEFAULT_TOKEN_LOCATION = "header";
const DEFAULT_TOKEN_HEADER = "Authorization";
const DEFAULT_TOKEN_QUERY = "token";
const DEFAULT_TOKEN_COOKIE = "Authorization";

export interface VerifyEndpointServiceOptions {
  url: string;
  method: string;
  tokenLocation: "header" | "query" | "cookie";
  tokenLocationName: string | ((ctx: Context) => Promise<string>);
}

export class VerifyEndpointService implements VerifyTokenService {

  protected options: VerifyEndpointServiceOptions;

  constructor(options?: VerifyEndpointServiceOptions) {
    if (!options) {
      const [url, method] = checkEnvVariables(["TOKEN_VERIFY_ENDPOINT", "TOKEN_VERIFY_ENDPOINT_METHOD"]);
      const [tokenVerifyLocation] = checkEnvVariables(["TOKEN_VERIFY_LOCATION"], [DEFAULT_TOKEN_LOCATION]);
      let tokenLocationName;
      switch (tokenVerifyLocation) {
        case "header":
          tokenLocationName = checkEnvVariables(["TOKEN_HEADER"], [DEFAULT_TOKEN_HEADER])[0];
          break;
        case "query":
          tokenLocationName = checkEnvVariables(["TOKEN_QUERY"], [DEFAULT_TOKEN_QUERY])[0];
          break;
        case "cookie":
          tokenLocationName = checkEnvVariables(["TOKEN_COOKIE"], [DEFAULT_TOKEN_COOKIE])[0];
          break;
        default:
          throw new Error(`TOKEN_VERIFY_LOCATION=${tokenVerifyLocation} not supported use (header or query)`);
      }
      this.options = {
        url, method,
        tokenLocation: tokenVerifyLocation,
        tokenLocationName
      }
    } else {
      this.options = parseOptions("options", options as any, [
        { name: "url", required: true, type: "string", stringMinLength: 1 },
        { name: "method", required: true, type: "string", stringMinLength: 1 },
        { name: "tokenLocation", required: true, type: "enum", enumValues: ["header", "query", "cookie"] },
        { name: "tokenLocationName", required: true, type: "any" }
      ], "no_extra") as any;
    }
  }

  public async verify({ token, ctx }: { token: string; ctx: Context }): Promise<Session | null> {
    try {
      let response = null;
      const tokenVerifyLocation = this.options.tokenLocation;
      const url = this.options.url;
      const method = this.options.method;
      switch (tokenVerifyLocation) {
        case "header":
          const tokenHeaderLocation = typeof this.options.tokenLocationName === "string" ? this.options.tokenLocationName : await this.options.tokenLocationName(ctx);
          ctx.logger.trace(`verifying [${token}] on TOKEN_VERIFY_ENDPOINT=[${process.env.TOKEN_VERIFY_ENDPOINT}] TOKEN_HEADER=[${tokenHeaderLocation}]`);
          response = await this.getResponse({
            url,
            headers: {
              [tokenHeaderLocation]: token
            },
            method
          }, ctx);
          break;
        case "query":
          const tokenQueryLocation = typeof this.options.tokenLocationName === "string" ? this.options.tokenLocationName : await this.options.tokenLocationName(ctx);
          ctx.logger.trace(`verifying [${token}] on TOKEN_VERIFY_ENDPOINT=[${process.env.TOKEN_VERIFY_ENDPOINT}] TOKEN_QUERY=[${tokenQueryLocation}]`);
          response = await this.getResponse({
            url,
            query: {
              [tokenQueryLocation]: token
            },
            method
          }, ctx);
          break;
        case "cookie":
          const tokenCookieLocation = typeof this.options.tokenLocationName === "string" ? this.options.tokenLocationName : await this.options.tokenLocationName(ctx);
          ctx.logger.trace(`verifying [${token}] on TOKEN_VERIFY_ENDPOINT=[${process.env.TOKEN_VERIFY_ENDPOINT}] TOKEN_COOKIE=[${tokenCookieLocation}]`);
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
          ctx.logger.trace("token [%s]authorized!", token);

          if (tokenVerifyLocation === "cookie" && response.headers["set-cookie"]) {
            const tokenCookieLocation = typeof this.options.tokenLocationName === "string" ? this.options.tokenLocationName : await this.options.tokenLocationName(ctx);
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
      throw new UnAuthorizedError(`Fail to authenticate token! error verifying [${token}] [${e.status}][${e.config ? e.config.url : ""}]`);
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
