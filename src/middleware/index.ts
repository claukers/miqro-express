import * as bodyParser from "body-parser";
import { FeatureToggle, Util } from "miqro-core";
import * as morgan from "morgan";
import { v4 } from "uuid";

// noinspection JSUnusedLocalSymbols
morgan.token("uuid", (req, res) => (req as any).uuid);

export const setupMiddleware = async (app, logger) => {
  app.disable("x-powered-by");
  app.use((req, res, next) => {
    req.uuid = v4();
    next();
  });
  if (!process.env.MORGAN_FORMAT) {
    process.env.MORGAN_FORMAT = "request[:uuid] [:method] [:url] [:status] [:response-time]ms";
  }
  app.use(morgan(process.env.MORGAN_FORMAT, { stream: logger.stream }));
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
