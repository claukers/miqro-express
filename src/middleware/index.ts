import * as bodyParser from "body-parser";
import { FeatureToggle, Util } from "miqro-core";
import * as morgan from "morgan";
import { v4 } from "uuid";

morgan.token('uuid', (req, res) => { return (req as any).uuid })

export const setupMiddleware = async (app, logger) => {
  app.disable("x-powered-by");
  app.use((req, res, next) => {
    req.uuid = v4();
    next();
  });
  app.use(morgan("request[:uuid] [:method] [:url] [:status] [:response-time]ms", { stream: logger.stream }));
  if (FeatureToggle.isFeatureEnabled("bodyparser")) {
    Util.checkEnvVariables(["BODYPARSER_INFLATE", "BODYPARSER_LIMIT", "BODYPARSER_STRICT", "BODYPARSER_TYPE"]);
    app.use(bodyParser.json({
      inflate: process.env.BODYPARSER_INFLATE === "true" ? true : false,
      limit: process.env.BODYPARSER_LIMIT,
      // reviver: undefined,
      strict: process.env.BODYPARSER_STRICT === "true" ? true : false,
      type: process.env.BODYPARSER_TYPE
      // verify: undefined
    }));
  }
  return app;
};
