import {FeatureToggle, Logger, Util} from "@miqro/core";
import {v4} from "uuid";
import {json as bodyParserJSON} from "body-parser";
import {Express} from "express";
import * as morgan from "morgan";
import {token as morganToken} from "morgan";
import {NextCallback} from "../handler/common";

export const UUIDHandler = (): NextCallback => {
  return (req, res, next) => {
    req.uuid = v4();
    next();
  };
}

export const LoggerHandler = (logger?: Logger): NextCallback => {
  if (!logger) {
    logger = Util.getLogger("LoggerHandler");
  }
  if (FeatureToggle.isFeatureEnabled("REQUEST_UUID")) {
    morganToken("uuid", (req) => {
      return (req as any).uuid;
    });
    if (!process.env.MORGAN_FORMAT) {
      process.env.MORGAN_FORMAT = "request[:uuid] [:method] [:url] [:status] [:response-time]ms";
    }
  } else {
    if (!process.env.MORGAN_FORMAT) {
      process.env.MORGAN_FORMAT = "request [:method] [:url] [:status] [:response-time]ms";
    }
  }
  return morgan(process.env.MORGAN_FORMAT, {
    stream: {
      write: (line: string) => {
        logger.info(line[line.length - 1] === "\n" ? line.substring(0, line.length - 1) : line);
      }
    }
  });
}

export const BodyParserConfiguratorHandler = (logger?: Logger): NextCallback => {
  if (!logger) {
    logger = Util.getLogger("BodyParserConfiguratorHandler");
  }
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

/* eslint-disable  @typescript-eslint/explicit-module-boundary-types */
export const setupMiddleware = async (app: Express, logger?: Logger): Promise<Express> => {
  if (!logger) {
    logger = Util.getLogger("setupMiddleware");
  }
  if (FeatureToggle.isFeatureEnabled("DISABLE_POWERED")) {
    app.disable("x-powered-by");
  }
  if (FeatureToggle.isFeatureEnabled("REQUEST_UUID")) {
    app.use(UUIDHandler());
  }
  if (FeatureToggle.isFeatureEnabled("MORGAN")) {
    app.use(LoggerHandler(logger));
  }
  if (FeatureToggle.isFeatureEnabled("BODY_PARSER")) {
    app.use(BodyParserConfiguratorHandler(logger));
  }
  return app;
};
