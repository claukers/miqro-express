import { inspect } from "util";
import { parse as cookieParse } from "cookie";
import { decode as jwtDecode } from "jsonwebtoken";
import { Logger, Session, NoTokenSession, UnAuthorizedError, Util, VerifyTokenService, RequestResponse } from "@miqro/core";

const DEFAULT_TOKEN_LOCATION = "header";
const DEFAULT_TOKEN_HEADER = "Authorization";
const DEFAULT_TOKEN_QUERY = "token";
const DEFAULT_TOKEN_COOKIE = "Authorization";

export interface VerifyEndpointServiceOptions {
  url: string;
  method: string;
  tokenLocation: "header" | "query" | "cookie";
  tokenLocationName: string;
}

export class VerifyEndpointService implements VerifyTokenService {
  protected logger: Logger;

  constructor(protected options?: VerifyEndpointServiceOptions) {
    if (!options) {
      Util.checkEnvVariables(["TOKEN_VERIFY_ENDPOINT", "TOKEN_VERIFY_ENDPOINT_METHOD"]);
      const [tokenVerifyLocation] = Util.checkEnvVariables(["TOKEN_VERIFY_LOCATION"], [DEFAULT_TOKEN_LOCATION]);
      switch (tokenVerifyLocation) {
        case "header":
          Util.checkEnvVariables(["TOKEN_HEADER"], [DEFAULT_TOKEN_HEADER]);
          break;
        case "query":
          Util.checkEnvVariables(["TOKEN_QUERY"], [DEFAULT_TOKEN_QUERY]);
          break;
        case "cookie":
          Util.checkEnvVariables(["TOKEN_COOKIE"], [DEFAULT_TOKEN_COOKIE]);
          break;
        default:
          throw new Error(`TOKEN_VERIFY_LOCATION=${tokenVerifyLocation} not supported use (header or query)`);
      }
    } else {
      Util.parseOptions("options", options as any, [
        { name: "url", required: true, type: "string", stringMinLength: 1 },
        { name: "method", required: true, type: "string", stringMinLength: 1 },
        { name: "tokenLocation", required: true, type: "enum", enumValues: ["header", "query", "cookie"] },
        { name: "tokenLocationName", required: true, type: "string", stringMinLength: 1 }
      ], "no_extra");
    }
    this.logger = Util.getLogger("VerifyEndpointService");
  }

  public async verify({ token }: { token: string }): Promise<Session | null> {
    try {
      let response = null;
      const tokenVerifyLocation = this.options ? this.options.tokenLocation : Util.checkEnvVariables(["TOKEN_VERIFY_LOCATION"], [DEFAULT_TOKEN_LOCATION])[0];
      const url = this.options ? this.options.url : `${process.env.TOKEN_VERIFY_ENDPOINT}`;
      const method = this.options ? this.options.method : `${process.env.TOKEN_VERIFY_ENDPOINT_METHOD}` as any;
      switch (tokenVerifyLocation) {
        case "header":
          const tokenHeaderLocation = this.options ? this.options.tokenLocationName : Util.checkEnvVariables(["TOKEN_HEADER"], [DEFAULT_TOKEN_HEADER])[0];
          this.logger.debug(`verifying [${token}] on TOKEN_VERIFY_ENDPOINT=[${process.env.TOKEN_VERIFY_ENDPOINT}] TOKEN_HEADER=[${tokenHeaderLocation}]`);
          response = await Util.request({
            url,
            headers: {
              [tokenHeaderLocation]: token
            },
            method
          });
          break;
        case "query":
          const tokenQueryLocation = this.options ? this.options.tokenLocationName : Util.checkEnvVariables(["TOKEN_QUERY"], [DEFAULT_TOKEN_QUERY])[0];
          this.logger.debug(`verifying [${token}] on TOKEN_VERIFY_ENDPOINT=[${process.env.TOKEN_VERIFY_ENDPOINT}] TOKEN_QUERY=[${tokenQueryLocation}]`);
          response = await Util.request({
            url,
            query: {
              [tokenQueryLocation]: token
            },
            method
          });
          break;
        case "cookie":
          const tokenCookieLocation = this.options ? this.options.tokenLocationName : Util.checkEnvVariables(["TOKEN_COOKIE"], [DEFAULT_TOKEN_COOKIE])[0];
          this.logger.debug(`verifying [${token}] on TOKEN_VERIFY_ENDPOINT=[${process.env.TOKEN_VERIFY_ENDPOINT}] TOKEN_COOKIE=[${tokenCookieLocation}]`);
          response = await Util.request({
            url,
            method,
            headers: {
              Cookie: `${tokenCookieLocation}=${token}; Path=/; HttpOnly;`
            }
          });
          break;
        default:
          throw new Error(`TOKEN_VERIFY_LOCATION=${tokenVerifyLocation} not supported use (header, query or cookie)`);
      }
      if (response) {
        /* eslint-disable  @typescript-eslint/no-var-requires */
        const session = await this.decodeSession(response, token);
        if (!this.checkSession(session)) {
          this.logger.warn(`unauthorized token not valid [${token}]`);
          return null;
        } else {
          this.logger.debug(`authorized token[${token}] with session[${inspect(session)}]`);

          if (tokenVerifyLocation === "cookie" && response.headers["set-cookie"]) {
            const tokenCookieLocation = this.options ? this.options.tokenLocationName : Util.checkEnvVariables(["TOKEN_COOKIE"], [DEFAULT_TOKEN_COOKIE])[0];
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
        this.logger.warn(`unauthorized token not valid [${token}]`);
        return null;
      }
    } catch (e) {
      this.logger.error(`error verifying [${token}] [${e.response ? e.response.status : ""}][${e.config ? e.config.url : ""}][${e.message}]`);
      throw new UnAuthorizedError(`Fail to authenticate token!`);
    }
  }
  protected checkSession(session: NoTokenSession): boolean {
    Util.parseOptions("session", session, [
      { name: "username", required: true, type: "string" },
      { name: "account", required: true, type: "string" },
      { name: "groups", required: true, type: "array", arrayType: "string" }
    ], "add_extra");
    return true;
  }
  protected async decodeSession(response: RequestResponse, token: string): Promise<NoTokenSession> {
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
    this.logger = Util.getLogger("VerifyTokenEndpointService");
  }

  protected async decodeSession(response: RequestResponse, token: string): Promise<Session> {
    const session = jwtDecode(token);
    return session as Session;
  }
}
