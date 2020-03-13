import {FeatureToggle, Util} from "@miqro/core";
import * as bodyParser from "body-parser";
import * as morgan from "morgan";
import {v4} from "uuid";
import {ICallback, INextHandlerCallback} from "../route/common";

// noinspection JSUnusedLocalSymbols
morgan.token("uuid", ((req, res) => {
  return req.uuid;
}) as ICallback);

export const setupMiddleware = async (app, logger?) => {
  if (!logger) {
    logger = Util.getLogger("setupMiddleware");
  }
  app.disable("x-powered-by");
  app.use(((req, res, next) => {
    req.uuid = v4();
    next();
  }) as INextHandlerCallback);
  if (!process.env.MORGAN_FORMAT) {
    process.env.MORGAN_FORMAT = "request[:uuid] [:method] [:url] [:status] [:response-time]ms";
  }
  app.use(morgan(process.env.MORGAN_FORMAT, {stream: logger.stream}));
  if (FeatureToggle.isFeatureEnabled("bodyparser")) {
    Util.checkEnvVariables(["BODYPARSER_INFLATE", "BODYPARSER_LIMIT", "BODYPARSER_STRICT", "BODYPARSER_TYPE"]);
    app.use(bodyParser.json({
      inflate: process.env.BODYPARSER_INFLATE === "true",
      limit: process.env.BODYPARSER_LIMIT,
      // reviver: undefined,
      strict: process.env.BODYPARSER_STRICT === "true",
      type: process.env.BODYPARSER_TYPE
      // verify: undefined
    }));
  }
  return app;
};
