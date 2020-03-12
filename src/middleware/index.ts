import {FeatureToggle, Util} from "@miqro/core";
import * as bodyParser from "body-parser";
import {NextFunction, Request, Response} from "express";
import * as morgan from "morgan";
import {v4} from "uuid";

// noinspection JSUnusedLocalSymbols
morgan.token("uuid", (req, res) => (req as any).uuid);

export const setupMiddleware = async (app, logger?) => {
  if (!logger) {
    logger = Util.getLogger("setupMiddleware");
  }
  app.disable("x-powered-by");
  app.use((req: Request, res: Response, next: NextFunction) => {
    (req as any).uuid = v4();
    next();
  });
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
