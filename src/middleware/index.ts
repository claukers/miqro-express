import {FeatureToggle, Logger, Util} from "@miqro/core";
import {v4} from "uuid";
import {json as bodyParserJSON, urlencoded as bodyParserURLEncoded} from "body-parser";
import {Express} from "express";
import morgan, {token as morganToken} from "morgan";
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
  Util.checkEnvVariables(["BODY_PARSER_INFLATE", "BODY_PARSER_LIMIT", "BODY_PARSER_STRICT", "BODY_PARSER_TYPE"])
  return bodyParserJSON({
    inflate: process.env.BODYPARSER_INFLATE === "true",
    limit: process.env.BODYPARSER_LIMIT,
    // reviver: undefined,
    strict: process.env.BODYPARSER_STRICT === "true",
    type: process.env.BODYPARSER_TYPE
    // verify: undefined
  });
};

export const URLEncodedBodyParserHandler = (): NextCallback => {
  Util.checkEnvVariables(["BODY_PARSER_URL_ENCODED_EXTENDED", "BODY_PARSER_URL_ENCODED_INFLATE", "BODY_PARSER_URL_ENCODED_LIMIT", "BODY_PARSER_URL_ENCODED_TYPE"])
  return bodyParserURLEncoded({
    inflate: process.env.BODY_PARSER_URL_ENCODED_INFLATE === "true",
    limit: process.env.BODY_PARSER_URL_ENCODED_LIMIT,
    // reviver: undefined,
    extended: process.env.BODY_PARSER_URL_ENCODED_EXTENDED === "true",
    type: process.env.BODY_PARSER_URL_ENCODED_TYPE
    // verify: undefined
  });
};

/* eslint-disable  @typescript-eslint/explicit-module-boundary-types */
export const setupMiddleware = (app: Express, logger?: Logger): void => {
  if (FeatureToggle.isFeatureEnabled("DISABLE_POWERED")) {
    app.disable("x-powered-by");
  }
  if (FeatureToggle.isFeatureEnabled("REQUEST_UUID")) {
    app.use(UUIDHandler());
  }
  if (FeatureToggle.isFeatureEnabled("MORGAN")) {
    app.use(MorganHandler(logger));
  }
  if (FeatureToggle.isFeatureEnabled("BODY_PARSER")) {
    app.use(JSONBodyParserHandler());
  }
  if (FeatureToggle.isFeatureEnabled("BODY_PARSER_URL_ENCODED")) {
    app.use(URLEncodedBodyParserHandler());
  }
};
