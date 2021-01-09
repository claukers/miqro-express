import {basename, join, parse, resolve} from "path";
import {lstatSync, readdirSync} from "fs";
import {Router, RouterOptions} from "express";
import {GroupPolicy, Logger, ParseOption, ParseOptionsMode, Util, VerifyTokenService} from "@miqro/core";
import {FeatureHandler, FeatureRouter, FeatureRouterOptions} from "./feature-router";
import {ValidateBodyHandler, ValidateBodyHandlerOptions} from "./validatebody";
import {NextCallback} from "./common";
import {SessionHandler} from "./session";
import {GroupPolicyHandler} from "./group";
import {QueryAsParamsHandler, ValidateParamsHandler, ValidateQueryHandler} from "./queryasparams";

export interface APIRoute {
  name?: string;
  methods?: string[];
  path?: string | string[];
  handler: FeatureHandler;
  query?: {
    options: ParseOption[],
    mode: ParseOptionsMode
  };
  params?: {
    options: ParseOption[],
    mode: ParseOptionsMode
  };
  queryAsParams?: ParseOption[],
  body?: ValidateBodyHandlerOptions;
  description?: string;
  verify?: VerifyTokenService;
  authLogger?: Logger;
  policy?: GroupPolicy;
}

const createBasicRoute = (route: APIRoute): APIRoute => {
  return {
    ...route,
    handler: (logger: Logger): NextCallback[] => {
      const ret: NextCallback[] = [];
      if (route.verify || route.policy) {
        const authLogger = !route.authLogger ? logger : route.authLogger;
        if (route.verify) {
          ret.push(SessionHandler(route.verify, authLogger));
        }
        if (route.policy) {
          ret.push(GroupPolicyHandler(route.policy, authLogger));
        }
      }
      if (route.params) {
        ret.push(ValidateParamsHandler(route.params, logger));
      }
      if (route.queryAsParams) {
        ret.push(QueryAsParamsHandler(route.queryAsParams, logger));
      }
      if (route.query) {
        ret.push(ValidateQueryHandler(route.query, logger));
      }
      if (route.body) {
        ret.push(ValidateBodyHandler(route.body, logger));
      }
      return ret.concat(route.handler(logger));
    }
  };
};

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

export const traverseAPIRouteDir = (logger: Logger, featureName: string, dirname: string, basePath = "/", features: FeatureRouterOptions = {features: {}}): FeatureRouterOptions => {
  logger.debug(`loading routes from [${dirname}]`);
  const files = readdirSync(dirname);
  const dirs = files.filter(f => lstatSync(join(dirname, f)).isDirectory());
  const methods = files.filter(f => !lstatSync(join(dirname, f)).isDirectory());
  for (const f of dirs) {
    const {name} = parse(f);
    features = traverseAPIRouteDir(logger, `${featureName}_${name}`.toUpperCase(), join(dirname, f), `${basePath}/${name}`, features);
  }
  for (const f of methods) {
    const {name, ext} = parse(f);
    if (name !== "index" && ((ext === ".ts" || ext === ".js") && name.slice(-2) !== ".d")) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      let route: APIRoute = require(join(dirname, name));
      if ((route as any).default && (route as any).__esModule === true) {
        route = (route as any).default;
      }
      const methods = [name];
      if (typeof route === "function") {
        route = {
          handler: route
        };
      } else {
        if (typeof route.methods !== "undefined" && !(route.methods instanceof Array)) {
          throw new Error(`${resolve(dirname, name)} doesnt export methods as a string array`);
        } else if (typeof route.methods !== "undefined") {
          methods.splice(0, methods.length);
          for (const m of route.methods) {
            methods.push(m);
          }
        }
        if (typeof route.path !== "string" && typeof route.path !== "undefined" && !(route.path instanceof Array)) {
          throw new Error(`${resolve(dirname, name)} doesnt export path as a string or a string array`);
        }
        if (typeof route.handler !== "function" || typeof route.handler === "undefined") {
          throw new Error(`${resolve(dirname, name)} doesnt export handler as a function`);
        }
        if (typeof route.name !== "string" && typeof route.name !== "undefined") {
          throw new Error(`${resolve(dirname, name)} doesnt export name as a string`);
        }
      }
      route = createBasicRoute(route);
      if (route.path instanceof Array) {
        for (let i = 0; i < route.path.length; i++) {
          const p = route.path[i];
          if (typeof p !== "string" || !p) {
            throw new Error(`${resolve(dirname, name)} doesnt export path as a string or a string array`);
          }
          const subName = p.replace(/[^a-z0-9+]+/gi, '_');
          const newFeatureSubPath = `${featureName}_${route.name ? route.name : name}_${subName}`.toUpperCase();
          features.features[newFeatureSubPath] = {
            path: `${basePath}${p && p != "/" ? `${p}` : ""}`,
            methods,
            implementation: route.handler,
            identifier: newFeatureSubPath
          };
        }
      } else {
        const newFeature = `${featureName}_${route.name ? route.name : name}`.toUpperCase();
        features.features[newFeature] = {
          path: `${basePath}${route.path && route.path != "/" ? `${route.path}` : ""}`,
          methods,
          implementation: route.handler,
          identifier: newFeature
        };
      }
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
    ...traverseAPIRouteDir(logger, apiName.toUpperCase(), dirname, apiPath),
    options: options.options,
    only: options.only,
    auth: options.auth
  }, logger);
};
