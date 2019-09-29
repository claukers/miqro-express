import * as bodyParser from "body-parser";
import { Util } from "miqro-core";
import * as morgan from "morgan";

export const setupMiddleware = async (app, logger) => {
  app.disable("x-powered-by");
  app.use(morgan("combined", { stream: logger.stream }));
  Util.checkEnvVariables(["BODYPARSER_INFLATE", "BODYPARSER_LIMIT", "BODYPARSER_STRICT", "BODYPARSER_TYPE"]);
  app.use(bodyParser.json({
    inflate: process.env.BODYPARSER_INFLATE === "true" ? true : false,
    limit: process.env.BODYPARSER_LIMIT,
    // reviver: undefined,
    strict: process.env.BODYPARSER_STRICT === "true" ? true : false,
    type: process.env.BODYPARSER_TYPE
    // verify: undefined
  }));
  return app;
};
