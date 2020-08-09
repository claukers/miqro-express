import {basename, join, parse} from "path";
import {readdirSync} from "fs";
import {Router} from "express";
import {Logger, Util, VerifyTokenService} from "@miqro/core";
import {FeatureHandler, FeatureRouter, FeatureRouterOptions} from "./feature-router";

export interface APIRoute {
  path: string;
  methods: string[];
  handler: FeatureHandler;
}

export interface APIRouterOptions {
  dirname: string;
  apiName?: string;
  auth?: {
    service: VerifyTokenService;
    identifier: string;
  };
  only?: string[];
}

export const APIRouter = (options: APIRouterOptions, logger?: Logger): Router => {
  const {dirname} = options;
  const apiName = options.apiName ? options.apiName : basename(dirname);
  if (!logger) {
    logger = Util.getComponentLogger(`api.${apiName}.router`);
  }
  logger.info(`loading api features from [${dirname}]`);
  const features: FeatureRouterOptions = {
    auth: options.auth,
    only: options.only,
    features: {}
  };
  const files = readdirSync(dirname);
  for (const f of files) {
    const fParsed = parse(f);
    if ((fParsed.name !== "index" && (fParsed.ext === ".ts" && fParsed.name.slice(-2) !== ".d") || fParsed.ext === ".js")) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const feature: APIRoute = require(join(dirname, fParsed.name));
      feature.path = `/api/${apiName}${feature.path}`;
      features.features[`API_${apiName}_${fParsed.name}`.toUpperCase()] = {
        path: feature.path,
        methods: feature.methods,
        implementation: feature.handler as any,
        identifier: `api.${apiName}.${fParsed.name}`
      };
    }
  }
  return FeatureRouter(features, logger);
};
