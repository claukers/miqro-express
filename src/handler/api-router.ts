import {basename, join, parse, resolve} from "path";
import {lstatSync, readdirSync} from "fs";
import {Router, RouterOptions} from "express";
import {Logger, Util, VerifyTokenService} from "@miqro/core";
import {FeatureHandler, FeatureRouter, FeatureRouterOptions} from "./feature-router";

export interface APIRoute {
  path?: string;
  handler: FeatureHandler;
}

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
      let route: APIRoute = require(join(dirname, name));
      if ((route as any).default && (route as any).__esModule === true) {
        route = (route as any).default;
      }
      if (typeof route.path !== "string" && typeof route.path !== undefined) {
        throw new Error(`${resolve(dirname, name)} doesnt export path as a string`);
      }
      if (typeof route.handler !== "function" || typeof route.handler === undefined) {
        throw new Error(`${resolve(dirname, name)} doesnt export handler as a function`);
      }
      features.features[newFeature] = {
        path: `${basePath}${route.path && route.path != "/" ? `${route.path}` : ""}`,
        methods: [name],
        implementation: route.handler,
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
