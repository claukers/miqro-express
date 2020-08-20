import {basename, join, parse} from "path";
import {existsSync, lstatSync, readdirSync, readFileSync} from "fs";
import {Router} from "express";
import {Logger, Util, VerifyTokenService} from "@miqro/core";
import {FeatureHandler, FeatureRouter, FeatureRouterOptions} from "./feature-router";

export interface APIRoute {
  identifier?: string;
  path?: string;
  methods: string[];
  handler: FeatureHandler;
}

export interface APIRouterOptions {
  dirname: string;
  apiName?: string;
  path?: string;
  auth?: {
    service: VerifyTokenService;
    identifier: string;
  };
  only?: string[];
}

export const APIRouter = (options: APIRouterOptions, logger?: Logger): Router => {
  const {dirname} = options;
  const apiName = options.apiName ? options.apiName : basename(dirname);
  const apiPath = options.path ? options.path : apiName;
  if (!logger) {
    logger = Util.getComponentLogger(`api.${apiName}.router`);
  }
  logger.debug(`loading api features from [${dirname}]`);
  const features: FeatureRouterOptions = {
    auth: options.auth,
    only: options.only,
    features: {}
  };
  const files = readdirSync(dirname);
  for (const f of files) {
    const fParsed = parse(f);
    if (lstatSync(join(dirname, f)).isDirectory()) {
      const handlerJSONPath = join(dirname, f, "handler.json");
      // check if route path
      if (existsSync(handlerJSONPath)) {
        const handlerData = JSON.parse(readFileSync(handlerJSONPath).toString());
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const implementation: FeatureHandler = require(join(dirname, fParsed.name));
        const path = `/api/${apiPath}${handlerData.path ? handlerData.path : "/"}`;
        const featureName = handlerData.identifier ? `API_${apiName}_${handlerData.identifier.toUpperCase()}` : `API_${apiName}_${fParsed.name}`.toUpperCase();
        features.features[featureName] = {
          path,
          methods: handlerData.methods,
          implementation,
          identifier: featureName
        };
      }
    } else if (fParsed.name !== "index" && ((fParsed.ext === ".ts" || fParsed.ext === ".js") && fParsed.name.slice(-2) !== ".d")) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const feature: APIRoute = require(join(dirname, fParsed.name));
      const path = `/api/${apiPath}${feature.path ? feature.path : "/"}`;
      const featureName = feature.identifier ? `API_${apiName}_${feature.identifier.toUpperCase()}` : `API_${apiName}_${fParsed.name}`.toUpperCase();
      features.features[featureName] = {
        path,
        methods: feature.methods,
        implementation: feature.handler,
        identifier: featureName
      };
    }
  }
  return FeatureRouter(features, logger);
};
