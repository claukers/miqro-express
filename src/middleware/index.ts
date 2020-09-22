import {FeatureToggle, Logger, Util} from "@miqro/core";
import {v4} from "uuid";
import {json as bodyParserJSON, urlencoded as bodyParserURLEncoded} from "body-parser";
import {Express} from "express";
import morgan, {token as morganToken} from "morgan";
import cors from "cors";
import {NextCallback} from "../handler/common";

export const UUIDHandler = (): NextCallback => {
  return (req, res, next) => {
    req.uuid = v4();
    next();
  };
}

export const MorganHandler = (logger?: Logger): NextCallback => {
  if (!logger) {
    logger = Util.getLogger("MorganHandler");
  }
  if (FeatureToggle.isFeatureEnabled("REQUEST_UUID")) {
    morganToken("uuid", (req) => {
      return (req as any).uuid;
    });
    if (!process.env.MORGAN_FORMAT) {
      process.env.MORGAN_FORMAT = "request[:uuid] [:method] [:url] [:status] content-length[:res[content-length]] [:response-time]ms";
    }
  } else {
    if (!process.env.MORGAN_FORMAT) {
      process.env.MORGAN_FORMAT = "request [:method] [:url] [:status] content-length[:res[content-length]] [:response-time]ms";
    }
  }
  return morgan(process.env.MORGAN_FORMAT, {
    stream: {
      write: (line: string) => {
        if (logger) {
          logger.info(line.substring(0, line.length - 1));
        }
      }
    }
  });
}

export const JSONBodyParserHandler = (): NextCallback => {
  const [inflate, limit, strict, type] =
    Util.checkEnvVariables(["BODY_PARSER_INFLATE", "BODY_PARSER_LIMIT", "BODY_PARSER_STRICT", "BODY_PARSER_TYPE"], ["true", "100kb", "true", "application/json"])
  return bodyParserJSON({
    inflate: inflate === "true",
    limit,
    // reviver: undefined,
    strict: strict === "true",
    type
    // verify: undefined
  });
};

export const URLEncodedBodyParserHandler = (): NextCallback => {
  const [extended, inflate, limit, type] =
    Util.checkEnvVariables(["BODY_PARSER_URL_ENCODED_EXTENDED", "BODY_PARSER_URL_ENCODED_INFLATE", "BODY_PARSER_URL_ENCODED_LIMIT", "BODY_PARSER_URL_ENCODED_TYPE"], ["true", "true", "100kb", "application/x-www-form-urlencoded"])
  return bodyParserURLEncoded({
    inflate: inflate === "true",
    limit,
    // reviver: undefined,
    extended: extended === "true",
    type
    // verify: undefined
  });
};

export const CorsHandler = (): NextCallback => {
  const [origin] = Util.checkEnvVariables(["CORS_ORIGIN"], ["*"])
  return cors({
    origin
  });
}

/* eslint-disable  @typescript-eslint/explicit-module-boundary-types */
export const setupMiddleware = (app: Express, logger?: Logger): void => {
  if (FeatureToggle.isFeatureEnabled("DISABLE_POWERED"), true) {
    app.disable("x-powered-by");
  }
  if (FeatureToggle.isFeatureEnabled("REQUEST_UUID"), true) {
    app.use(UUIDHandler());
  }
  if (FeatureToggle.isFeatureEnabled("MORGAN"), true) {
    app.use(MorganHandler(logger));
  }
  if (FeatureToggle.isFeatureEnabled("BODY_PARSER"), true) {
    app.use(JSONBodyParserHandler());
  }
  if (FeatureToggle.isFeatureEnabled("BODY_PARSER_URL_ENCODED"), true) {
    app.use(URLEncodedBodyParserHandler());
  }
  if (FeatureToggle.isFeatureEnabled("CORS"), true) {
    app.use(CorsHandler());
  }
};
