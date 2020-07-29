import {inspect} from "util";
import {decode as jwtDecode} from "jsonwebtoken";
import {Logger, Session, UnAuthorizedError, Util, VerifyTokenService} from "@miqro/core";

export class VerifyJWTEndpointService implements VerifyTokenService {

  protected static instance: VerifyJWTEndpointService;

  public static getInstance(): VerifyJWTEndpointService {
    VerifyJWTEndpointService.instance =
      VerifyJWTEndpointService.instance ? VerifyJWTEndpointService.instance : new VerifyJWTEndpointService();
    return VerifyJWTEndpointService.instance;
  }

  protected logger: Logger;

  constructor() {
    Util.checkEnvVariables(["TOKEN_VERIFY_ENDPOINT", "TOKEN_VERIFY_ENDPOINT_METHOD", "TOKEN_VERIFY_LOCATION"]);
    switch (process.env.TOKEN_VERIFY_LOCATION) {
      case "header":
        Util.checkEnvVariables(["TOKEN_HEADER"]);
        break;
      case "query":
        Util.checkEnvVariables(["TOKEN_QUERY"]);
        break;
      default:
        throw new Error(`TOKEN_VERIFY_LOCATION=${process.env.TOKEN_VERIFY_LOCATION} not supported use (header or query)`);
    }
    this.logger = Util.getLogger("VerifyTokenEndpointService");
  }

  public async verify({token}: { token: string }): Promise<Session | null> {
    try {
      this.logger.debug(`verifying [${token}] on [${process.env.TOKEN_VERIFY_ENDPOINT}].header[${process.env.TOKEN_HEADER}]`);
      let response = null;
      switch (process.env.TOKEN_VERIFY_LOCATION) {
        case "header":
          response = await Util.request({
            url: `${process.env.TOKEN_VERIFY_ENDPOINT}`,
            headers: {
              [process.env.TOKEN_HEADER as string]: token
            },
            method: `${process.env.TOKEN_VERIFY_ENDPOINT_METHOD}` as any
          });
          break;
        case "query":
          response = await Util.request({
            url: `${process.env.TOKEN_VERIFY_ENDPOINT}?${process.env.TOKEN_QUERY}=${token}`,
            method: `${process.env.TOKEN_VERIFY_ENDPOINT_METHOD}` as any
          });
          break;
        default:
          throw new Error(`TOKEN_VERIFY_LOCATION=${process.env.TOKEN_VERIFY_LOCATION} not supported use (header or query)`);
      }
      if (response) {
        /* eslint-disable  @typescript-eslint/no-var-requires */
        const session = jwtDecode(token);
        if (session && typeof session !== "string") {
          Util.parseOptions("session", session, [
            {name: "username", required: true, type: "string"},
            {name: "account", required: true, type: "string"},
            {name: "groups", required: true, type: "array", arrayType: "string"}
          ], "add_extra");
          this.logger.debug(`authorized token[${token}] with session[${inspect(session)}]`);
          return {
            token,
            ...session
          } as Session;
        } else {
          this.logger.warn(`unauthorized token not valid [${token}]`);
          return null;
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
}
