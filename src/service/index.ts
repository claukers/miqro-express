import {inspect} from "util";
import {parse as cookieParse} from "cookie";
import {decode as jwtDecode} from "jsonwebtoken";
import {Logger, Session, NoTokenSession, UnAuthorizedError, Util, VerifyTokenService, RequestResponse} from "@miqro/core";

const DEFAULT_TOKEN_LOCATION = "header";
const DEFAULT_TOKEN_HEADER = "Authorization";
const DEFAULT_TOKEN_QUERY = "token";
const DEFAULT_TOKEN_COOKIE = "Authorization";

export class VerifyEndpointService implements VerifyTokenService {
  protected logger: Logger;

  constructor() {
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
    this.logger = Util.getLogger("VerifyEndpointService");
  }

  public async verify({token}: { token: string }): Promise<Session | null> {
    try {

      let response = null;
      const [tokenVerifyLocation] = Util.checkEnvVariables(["TOKEN_VERIFY_LOCATION"], [DEFAULT_TOKEN_LOCATION]);
      switch (tokenVerifyLocation) {
        case "header":
          const [tokenHeaderLocation] = Util.checkEnvVariables(["TOKEN_HEADER"], [DEFAULT_TOKEN_HEADER]);
          this.logger.debug(`verifying [${token}] on TOKEN_VERIFY_ENDPOINT=[${process.env.TOKEN_VERIFY_ENDPOINT}] TOKEN_HEADER=[${tokenHeaderLocation}]`);
          response = await Util.request({
            url: `${process.env.TOKEN_VERIFY_ENDPOINT}`,
            headers: {
              [tokenHeaderLocation]: token
            },
            method: `${process.env.TOKEN_VERIFY_ENDPOINT_METHOD}` as any
          });
          break;
        case "query":
          const [tokenQueryLocation] = Util.checkEnvVariables(["TOKEN_QUERY"], [DEFAULT_TOKEN_QUERY]);
          this.logger.debug(`verifying [${token}] on TOKEN_VERIFY_ENDPOINT=[${process.env.TOKEN_VERIFY_ENDPOINT}] TOKEN_QUERY=[${tokenQueryLocation}]`);
          response = await Util.request({
            url: `${process.env.TOKEN_VERIFY_ENDPOINT}?${tokenQueryLocation}=${token}`,
            method: `${process.env.TOKEN_VERIFY_ENDPOINT_METHOD}` as any
          });
          break;
        case "cookie":
          const [tokenCookieLocation] = Util.checkEnvVariables(["TOKEN_COOKIE"], [DEFAULT_TOKEN_COOKIE]);
          this.logger.debug(`verifying [${token}] on TOKEN_VERIFY_ENDPOINT=[${process.env.TOKEN_VERIFY_ENDPOINT}] TOKEN_COOKIE=[${tokenCookieLocation}]`);
          response = await Util.request({
            url: `${process.env.TOKEN_VERIFY_ENDPOINT}`,
            method: `${process.env.TOKEN_VERIFY_ENDPOINT_METHOD}` as any,
            headers: {
              Cookie: `${tokenCookieLocation}=${token}; Path=/; HttpOnly;`
            }
          });
          break;
        default:
          throw new Error(`TOKEN_VERIFY_LOCATION=${tokenVerifyLocation} not supported use (header or query)`);
      }
      if (response) {
        /* eslint-disable  @typescript-eslint/no-var-requires */
        const session = await this.decodeSession(response, token);
        if(!this.checkSession(session)) {
          this.logger.warn(`unauthorized token not valid [${token}]`);
          return null;
        } else {
          this.logger.debug(`authorized token[${token}] with session[${inspect(session)}]`);

          if (tokenVerifyLocation === "cookie" && response.headers["set-cookie"]) {
            const [tokenCookieLocation] = Util.checkEnvVariables(["TOKEN_COOKIE"], [DEFAULT_TOKEN_COOKIE]);
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
      {name: "username", required: true, type: "string"},
      {name: "account", required: true, type: "string"},
      {name: "groups", required: true, type: "array", arrayType: "string"}
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

  constructor() {
    super();
    this.logger = Util.getLogger("VerifyTokenEndpointService");
  }

  protected async decodeSession(response: RequestResponse, token: string): Promise<Session> {
    const session = jwtDecode(token);
    return session as Session;
  }
}
