import {FeatureToggle, Logger, Util} from "@miqro/core";
import {ICallback} from "../route/common";

const uuidV4Module = "uuid";

export const UUIDHandler = () => {
  Util.checkModules([uuidV4Module]);
  const {v4} = require(uuidV4Module);
  return (req, res, next) => {
    req.uuid = v4();
    next();
  };
}


export const LoggerHandler = (logger?: Logger) => {
  if (!logger) {
    logger = Util.getLogger("LoggerHandler");
  }
  let morgan = null;
  try {
    morgan = require("morgan");
  } catch (e) {
    logger.error(`install "morgan" package manually.`);
    throw e;
  }
  morgan.token("uuid", ((req) => {
    return req.uuid;
  }) as ICallback);
  if (!process.env.MORGAN_FORMAT) {
    process.env.MORGAN_FORMAT = "request[:uuid] [:method] [:url] [:status] [:response-time]ms";
  }
  return morgan(process.env.MORGAN_FORMAT, {
    stream: {
      write: (line: string) => {
        logger.info(line);
      }
    }
  });
}

export const BodyParserConfiguratorHandler = (logger?: Logger) => {
  if (!logger) {
    logger = Util.getLogger("BodyParserConfiguratorHandler");
  }
  Util.checkEnvVariables(["BODY_PARSER_INFLATE", "BODY_PARSER_LIMIT", "BODY_PARSER_STRICT", "BODY_PARSER_TYPE"]);
  let bodyParser = null;
  try {
    bodyParser = require("body-parser");
  } catch (e) {
    logger.error(`install "body-parser" package manually.`);
    throw e;
  }
  return bodyParser.json({
    inflate: process.env.BODYPARSER_INFLATE === "true",
    limit: process.env.BODYPARSER_LIMIT,
    // reviver: undefined,
    strict: process.env.BODYPARSER_STRICT === "true",
    type: process.env.BODYPARSER_TYPE
    // verify: undefined
  });
};

/* eslint-disable  @typescript-eslint/explicit-module-boundary-types */
export const setupMiddleware = async (app, logger?: Logger): Promise<void> => {
  if (!logger) {
    logger = Util.getLogger("setupMiddleware");
  }
  app.disable("x-powered-by");

  app.use(UUIDHandler() as any);
  app.use(LoggerHandler(logger) as any);

  if (FeatureToggle.isFeatureEnabled("BODY_PARSER")) {
    app.use(BodyParserConfiguratorHandler(logger));
  }
  return app;
};
