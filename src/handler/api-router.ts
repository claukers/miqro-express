import {basename, join, parse} from "path";
import {lstatSync, readdirSync} from "fs";
import {Router, RouterOptions} from "express";
import {Logger, Util, VerifyTokenService} from "@miqro/core";
import {FeatureHandler, FeatureRouter, FeatureRouterOptions} from "./feature-router";

export interface APIRouterOptions {
  dirname: string;
  apiName?: string;
  options?: RouterOptions;
  path?: string;
  auth?: {
    service: VerifyTokenService;
    identifier: string;
  };
  only?: string[];
}

const traverseRouteDir = (logger: Logger, featureName: string, dirname: string, basePath = "/", features: FeatureRouterOptions = {features: {}}): FeatureRouterOptions => {
  logger.debug(`loading routes from [${dirname}]`);
  const files = readdirSync(dirname);
  const dirs = files.filter(f => lstatSync(join(dirname, f)).isDirectory());
  const methods = files.filter(f => !lstatSync(join(dirname, f)).isDirectory());
  for (const f of dirs) {
    const {name} = parse(f);
    features = traverseRouteDir(logger, `${featureName}_${name}`.toUpperCase(), join(dirname, f), `${basePath}/${name}`, features);
  }
  for (const f of methods) {
    const {name, ext} = parse(f);
    if (name !== "index" && ((ext === ".ts" || ext === ".js") && name.slice(-2) !== ".d")) {
      const newFeature = `${featureName}_${name}`.toUpperCase();
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const implementation: FeatureHandler = require(join(dirname, name));
      features.features[newFeature] = {
        path: basePath,
        methods: [name],
        implementation,
        identifier: newFeature
      };
    }
  }
  return features;
};

export const APIRouter = (options: APIRouterOptions, logger?: Logger): Router => {
  const {dirname} = options;
  const apiName = options.apiName ? options.apiName : basename(dirname);
  const apiPath = options.path ? options.path : `/${apiName}`;
  if (!logger) {
    logger = Util.getLogger(`${apiName}`.toUpperCase());
  }
  return FeatureRouter({
    ...traverseRouteDir(logger, apiName.toUpperCase(), dirname, apiPath),
    options: options.options,
    only: options.only,
    auth: options.auth
  }, logger);
};
